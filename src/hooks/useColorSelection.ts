import { useMemo, useState } from 'react'
import type { Product, ProductVariant } from '../types'
import { firstAvailableVariant } from '../lib/catalog'

/**
 * Shared color-swatch selection: active color, mapped gallery image
 * (`colorImages[color]` with primary-image fallback), variants of the
 * active color, and the variant an add-to-cart should pick.
 */
export function useColorSelection(product: Product) {
  const colors = useMemo(
    () => [...new Map(product.variants.map((v) => [v.color, v])).values()],
    [product],
  )
  const [color, setColor] = useState<string | undefined>(colors[0]?.color)
  const activeColor = color ?? colors[0]?.color
  const image = product.colorImages?.[activeColor ?? ''] ?? product.images[0]
  const variantsForColor = useMemo(
    () => product.variants.filter((v) => v.color === activeColor),
    [product, activeColor],
  )
  const pickVariant = (): ProductVariant =>
    variantsForColor.find((v) => v.available) ?? firstAvailableVariant(product)

  return { colors, color: activeColor, setColor, image, variantsForColor, pickVariant }
}
