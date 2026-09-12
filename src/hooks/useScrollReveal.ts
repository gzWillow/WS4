import { useEffect } from 'react'
import { useLocation } from 'react-router'

const REVEAL_CLASS = 'reveal'
const INVIEW_CLASS = 'is-inview'

/**
 * Scroll-reveal: elements with a `data-reveal` attribute fade/rise into view
 * once when entering the viewport. Honors prefers-reduced-motion by showing
 * everything immediately. Observer is disconnected on route change/unmount.
 */
export function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
    if (targets.length === 0) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver !== 'function') {
      targets.forEach((el) => el.classList.add(INVIEW_CLASS))
      return undefined
    }

    targets.forEach((el) => el.classList.add(REVEAL_CLASS))
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(INVIEW_CLASS)
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
}
