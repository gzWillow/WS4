import { useEffect, useRef, type RefObject } from 'react'

/**
 * Subtle scroll parallax: translates the target element vertically relative
 * to its section's viewport position. Disabled for reduced motion.
 * Cleans up its rAF/scroll listener on unmount.
 */
export function useParallax<T extends HTMLElement>(
  sectionRef: RefObject<HTMLElement | null>,
  speed = 0.12,
): RefObject<T | null> {
  const layerRef = useRef<T | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const layer = layerRef.current
    if (!section || !layer) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2
      layer.style.transform = `translateY(${(-centerOffset * speed).toFixed(1)}px)`
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) window.cancelAnimationFrame(raf)
      layer.style.transform = ''
    }
  }, [sectionRef, speed])

  return layerRef
}
