import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { OverlayContext, type OverlayKind } from './OverlayContext'

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<OverlayKind>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const setReturnFocus = useCallback((el: HTMLElement | null) => {
    returnFocusRef.current = el
  }, [])

  const openOverlay = useCallback((kind: Exclude<OverlayKind, null>) => setOpen(kind), [])
  const closeOverlay = useCallback(() => {
    setOpen(null)
    const el = returnFocusRef.current
    if (el && document.contains(el)) el.focus()
    returnFocusRef.current = null
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, closeOverlay])

  return (
    <OverlayContext.Provider value={{ open, openOverlay, closeOverlay, setReturnFocus }}>
      {children}
    </OverlayContext.Provider>
  )
}
