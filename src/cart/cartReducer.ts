export interface CartLine {
  /** variantId */
  key: string
  productId: string
  variantId: string
  qty: number
}

export type CartAction =
  | { type: 'add'; productId: string; variantId: string; qty: number }
  | { type: 'setQty'; variantId: string; qty: number }
  | { type: 'remove'; variantId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; lines: CartLine[] }

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const found = lines.find((l) => l.variantId === action.variantId)
      if (found) {
        return lines.map((l) =>
          l.variantId === action.variantId ? { ...l, qty: Math.min(99, l.qty + action.qty) } : l,
        )
      }
      return [...lines, { key: action.variantId, productId: action.productId, variantId: action.variantId, qty: action.qty }]
    }
    case 'setQty': {
      if (action.qty <= 0) return lines.filter((l) => l.variantId !== action.variantId)
      return lines.map((l) => (l.variantId === action.variantId ? { ...l, qty: Math.min(99, action.qty) } : l))
    }
    case 'remove':
      return lines.filter((l) => l.variantId !== action.variantId)
    case 'clear':
      return []
    case 'hydrate':
      return action.lines
    default:
      return lines
  }
}
