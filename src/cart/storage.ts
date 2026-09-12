import type { CartLine } from './cartReducer'

const STORAGE_KEY = 'fashion-storefront-cart-v1'

/** Parse persisted cart; any malformed payload recovers to an empty cart. */
export function loadCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === 'object' &&
        l !== null &&
        typeof (l as CartLine).variantId === 'string' &&
        typeof (l as CartLine).productId === 'string' &&
        typeof (l as CartLine).qty === 'number' &&
        (l as CartLine).qty > 0,
    )
  } catch {
    return []
  }
}

export function saveCart(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // storage unavailable (private mode / quota) — cart stays in memory
  }
}

export function clearStoredCart() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
