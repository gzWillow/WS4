import { siteConfig } from '../config'
import type { Product } from '../types'

/** Resolve product ids from config sections to products (order preserved). */
export function byIds(ids: string[]): Product[] {
  return ids
    .map((id) => siteConfig.products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
}

export function firstAvailableVariant(product: Product) {
  return product.variants.find((v) => v.available) ?? product.variants[0]
}

export function isSoldOut(product: Product) {
  return product.variants.every((v) => !v.available)
}
