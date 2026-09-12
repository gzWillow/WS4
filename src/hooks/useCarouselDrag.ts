import { useRef, useState, type RefObject } from 'react'

interface CarouselApi {
  pos: number
  /** Step one item in the given direction, clamped at both ends. */
  move: (dir: 1 | -1) => void
  /** Pointer drag handlers to spread on the track element. */
  dragHandlers: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
    onPointerCancel: (e: React.PointerEvent) => void
  }
  trackStyle: React.CSSProperties
}

/**
 * Horizontal carousel: arrow stepping + pointer drag with snap-to-step.
 * The track must be a flex row whose children share one width + gap.
 */
export function useCarousel(trackRef: RefObject<HTMLDivElement | null>): CarouselApi {
  const [pos, setPos] = useState(0)
  const drag = useRef<{ startX: number; startPos: number; moved: boolean } | null>(null)

  const max = () => {
    const track = trackRef.current
    if (!track) return 0
    return Math.max(0, track.scrollWidth - track.getBoundingClientRect().width)
  }

  const stepSize = () => {
    const track = trackRef.current
    const item = track?.children[0] as HTMLElement | undefined
    if (!track || !item) return 1
    const gap = parseFloat(getComputedStyle(track).gap) || 20
    return item.getBoundingClientRect().width + gap
  }

  const move = (dir: 1 | -1) => {
    setPos((p) => Math.min(Math.max(0, p + dir * stepSize()), max()))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current
    if (!track) return
    drag.current = { startX: e.clientX, startPos: pos, moved: false }
    track.setPointerCapture(e.pointerId)
    track.classList.add('is-dragging')
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current
    const d = drag.current
    if (!track || !d) return
    const delta = e.clientX - d.startX
    if (Math.abs(delta) > 4) d.moved = true
    const next = Math.min(Math.max(0, d.startPos - delta), max())
    track.style.transition = 'none'
    track.style.transform = `translateX(${-next}px)`
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const track = trackRef.current
    const d = drag.current
    drag.current = null
    if (!track || !d) return
    track.classList.remove('is-dragging')
    track.style.transition = ''
    const current = Math.min(Math.max(0, d.startPos - (e.clientX - d.startX)), max())
    const snapped = Math.round(current / stepSize()) * stepSize()
    setPos(Math.min(Math.max(0, snapped), max()))
    if (d.moved) {
      // swallow the click that follows a real drag
      const swallow = (ev: MouseEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
        track.removeEventListener('click', swallow, true)
      }
      track.addEventListener('click', swallow, true)
      window.setTimeout(() => track.removeEventListener('click', swallow, true), 50)
    }
  }

  return {
    pos,
    move,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    trackStyle: { transform: `translateX(${-pos}px)` },
  }
}
