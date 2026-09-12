import { useContext } from 'react'
import { OverlayContext, type OverlayContextValue } from './OverlayContext'

export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext)
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider')
  return ctx
}
