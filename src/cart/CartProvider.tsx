import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { siteConfig } from '../config'
import { CartContext, type CartContextValue } from './CartContext'
import { cartReducer } from './cartReducer'
import { clearStoredCart, loadCart, saveCart } from './storage'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, [], () => loadCart())

  useEffect(() => {
    saveCart(lines)
  }, [lines])

  const value = useMemo<CartContextValue>(() => {
    let count = 0
    let subtotalMinor = 0
    for (const line of lines) {
      const product = siteConfig.products.find((p) => p.id === line.productId)
      if (!product) continue
      count += line.qty
      subtotalMinor += product.priceMinor * line.qty
    }
    return {
      lines,
      dispatch,
      count,
      subtotalMinor,
      resetDemo: () => {
        clearStoredCart()
        dispatch({ type: 'clear' })
      },
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
