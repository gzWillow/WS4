import { useEffect, type RefObject } from 'react'

interface HeroEffectsOptions {
  enabled: boolean
  reduced: boolean
}

interface Mote {
  x: number
  y: number
  r: number
  depth: number
  phase: number
  speed: number
  drift: number
}

/** Deterministic PRNG so the dust field is stable between reloads. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Signature hero ambience layer: drifting light dust plus a slow silk sheen,
 * with pointer parallax on the canvas and the hero content (via CSS vars).
 * Canvas 2D only. Under prefers-reduced-motion it paints one static frame
 * and stays inert. All listeners and the rAF loop clean up on unmount.
 */
export function useHeroEffects(
  sectionRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { enabled, reduced }: HeroEffectsOptions,
) {
  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas || !enabled) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rand = mulberry32(20260802)
    const motes: Mote[] = Array.from({ length: 72 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.6 + rand() * 2.1,
      depth: 0.3 + rand() * 0.7,
      phase: rand() * Math.PI * 2,
      speed: 0.0004 + rand() * 0.0008,
      drift: 0.000008 + rand() * 0.00003,
    }))

    let width = 0
    let height = 0
    let raf = 0
    let inView = true
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const frame = (t: number, px: number, py: number) => {
      ctx.clearRect(0, 0, width, height)

      // silk sheen — a warm glow roaming slowly across the slide
      const sx = width * (0.62 + 0.16 * Math.sin(t * 0.00007)) + px * width * 0.08
      const sy = height * (0.3 + 0.1 * Math.cos(t * 0.00005)) + py * height * 0.08
      const sheen = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(width, height) * 0.55)
      sheen.addColorStop(0, 'rgba(255, 236, 200, 0.16)')
      sheen.addColorStop(0.45, 'rgba(255, 222, 184, 0.05)')
      sheen.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, width, height)

      // silk band — a diagonal light ribbon sweeping gently
      const bandX = width * (0.5 + 0.35 * Math.sin(t * 0.000045 + 1.3)) + px * width * 0.05
      ctx.save()
      ctx.translate(bandX, height / 2)
      ctx.rotate(-0.42)
      const band = ctx.createLinearGradient(-width * 0.09, 0, width * 0.09, 0)
      band.addColorStop(0, 'rgba(255, 255, 255, 0)')
      band.addColorStop(0.5, 'rgba(255, 240, 214, 0.1)')
      band.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = band
      ctx.fillRect(-width, -height * 1.5, width * 2, height * 3)
      ctx.restore()

      // light dust — soft motes drifting upward with a slow twinkle
      for (const m of motes) {
        const yy = (((m.y - t * m.drift) % 1) + 1) % 1
        const xx = m.x + 0.012 * Math.sin(t * 0.0002 + m.phase)
        const tw = 0.5 + 0.5 * Math.sin(t * m.speed + m.phase)
        const alpha = (0.06 + 0.26 * tw) * m.depth
        const ox = px * 46 * m.depth
        const oy = py * 30 * m.depth
        const cx = xx * width + ox
        const cy = yy * height + oy
        ctx.beginPath()
        ctx.arc(cx, cy, m.r * 2.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 244, 224, ${(alpha * 0.35).toFixed(3)})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(cx, cy, m.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 244, 224, ${alpha.toFixed(3)})`
        ctx.fill()
      }
    }

    const resize = () => {
      const rect = section.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) frame(0, 0, 0)
    }

    if (reduced) {
      // static frame only — no loop, no pointer tracking
      canvas.dataset.static = 'true'
      resize()
      window.addEventListener('resize', resize)
      return () => {
        window.removeEventListener('resize', resize)
        delete canvas.dataset.static
      }
    }

    const tick = (t: number) => {
      raf = 0
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06
      section.style.setProperty('--hero-px', current.x.toFixed(4))
      section.style.setProperty('--hero-py', current.y.toFixed(4))
      frame(t, current.x, current.y)
      if (inView) raf = window.requestAnimationFrame(tick)
    }
    const schedule = () => {
      if (!raf && inView) raf = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      target.x = (e.clientX - rect.left) / rect.width - 0.5
      target.y = (e.clientY - rect.top) / rect.height - 0.5
    }
    const onPointerLeave = () => {
      target.x = 0
      target.y = 0
    }
    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true
      if (inView) schedule()
    })

    resize()
    schedule()
    io.observe(section)
    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', resize)
    return () => {
      io.disconnect()
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', resize)
      if (raf) window.cancelAnimationFrame(raf)
      section.style.removeProperty('--hero-px')
      section.style.removeProperty('--hero-py')
    }
  }, [sectionRef, canvasRef, enabled, reduced])
}
