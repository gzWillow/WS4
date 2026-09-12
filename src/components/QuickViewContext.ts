import { createContext, useContext } from 'react'

export interface QuickViewContextValue {
  productId: string | null
  openQuickView: (productId: string) => void
}

export const QuickViewContext = createContext<QuickViewContextValue | null>(null)

export function useQuickView(): QuickViewContextValue {
  const ctx = useContext(QuickViewContext)
  if (!ctx) throw new Error('useQuickView must be used within QuickViewProvider')
  return ctx
}
