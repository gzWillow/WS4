import { createContext } from 'react'
import type { CartAction, CartLine } from './cartReducer'

export interface CartContextValue {
  lines: CartLine[]
  dispatch: React.Dispatch<CartAction>
  count: number
  subtotalMinor: number
  resetDemo: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
