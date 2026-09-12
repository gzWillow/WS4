import { describe, expect, it } from 'vitest'
import { cartReducer, type CartLine } from '../src/cart/cartReducer'

const line = (variantId: string, qty = 1): CartLine => ({ key: variantId, productId: 'p1', variantId, qty })

describe('cartReducer', () => {
  it('adds a new line', () => {
    const next = cartReducer([], { type: 'add', productId: 'p1', variantId: 'v1', qty: 2 })
    expect(next).toEqual([{ key: 'v1', productId: 'p1', variantId: 'v1', qty: 2 }])
  })

  it('merges repeated adds of the same variant', () => {
    const start = [line('v1', 1)]
    const next = cartReducer(start, { type: 'add', productId: 'p1', variantId: 'v1', qty: 2 })
    expect(next[0].qty).toBe(3)
  })

  it('removes the line when qty drops to zero', () => {
    const start = [line('v1', 1)]
    const next = cartReducer(start, { type: 'setQty', variantId: 'v1', qty: 0 })
    expect(next).toEqual([])
  })

  it('caps quantity at 99', () => {
    const start = [line('v1', 98)]
    const next = cartReducer(start, { type: 'add', productId: 'p1', variantId: 'v1', qty: 5 })
    expect(next[0].qty).toBe(99)
  })

  it('clears the cart', () => {
    expect(cartReducer([line('v1'), line('v2')], { type: 'clear' })).toEqual([])
  })
})
