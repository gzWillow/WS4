import { createContext } from 'react'

export type OverlayKind = 'cart' | 'menu' | 'quick' | 'search' | null

export interface OverlayContextValue {
  open: OverlayKind
  openOverlay: (kind: Exclude<OverlayKind, null>) => void
  closeOverlay: () => void
  /** Register the element that triggered the overlay, for focus return. */
  setReturnFocus: (el: HTMLElement | null) => void
}

export const OverlayContext = createContext<OverlayContextValue | null>(null)
