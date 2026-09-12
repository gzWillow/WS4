import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Magnetic hover: the element is pulled toward the cursor by up to `strength` px
 * and springs back on leave. No-op under reduced motion or coarse pointers.
 */
export function useMagnetic<T extends HTMLElement>(strength = 5) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return undefined
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(pointer: fine)').matches) {
      return undefined
    }
    const clamp = (v: number) => Math.max(-1, Math.min(1, v))
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2))
      const dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2))
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, strength])

  return ref
}
