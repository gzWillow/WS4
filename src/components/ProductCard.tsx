import { Link } from 'react-router'
import { siteConfig } from '../config'
import { formatPrice } from '../lib/format'
import { isSoldOut } from '../lib/catalog'
import { useCart } from '../cart/useCart'
import { useColorSelection } from '../hooks/useColorSelection'
import type { Product } from '../types'
import { useOverlay } from './useOverlay'
import { useQuickView } from './QuickViewContext'
import { SafeImage } from './SafeImage'
import { useToast } from './useToast'

export function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart()
  const { openOverlay } = useOverlay()
  const { openQuickView } = useQuickView()
  const { notify } = useToast()
  const copy = siteConfig.copy.product
  const soldOut = isSoldOut(product)
  const { colors, color, setColor, image, pickVariant } = useColorSelection(product)
  const hover = product.images[1]

  const quickAdd = () => {
    const variant = pickVariant()
    dispatch({ type: 'add', productId: product.id, variantId: variant.id, qty: 1 })
    notify(`${product.name} ${siteConfig.copy.cart.addedNotice}`)
    openOverlay('cart')
  }

  return (
    <article className="product-card" data-id={product.id}>
      <div className="product-card__media">
        <Link className="product-card__link" to={`/product/${product.slug}`}>
          <span className="product-card__badges">
            {product.badges.map((b) => (
              <span
                key={b.label}
                className={`badge${b.kind === 'sale' ? ' badge--sale' : ''}${b.kind === 'soldout' ? ' badge--soldout' : ''}`}
              >
                {b.label}
              </span>
            ))}
          </span>
          <span className="product-card__img product-card__img--main">
            <SafeImage image={image} />
          </span>
          {hover ? (
            <span className="product-card__img product-card__img--hover" aria-hidden="true">
              <SafeImage image={hover} />
            </span>
          ) : null}
        </Link>
        <div className="product-card__quick">
          <button type="button" onClick={() => openQuickView(product.id)} aria-label={`${copy.quickViewLabel}: ${product.name}`}>
            {copy.quickViewLabel}
          </button>
          <button type="button" disabled={soldOut} onClick={quickAdd} aria-label={`${copy.quickAddAria}: ${product.name}`}>
            {soldOut ? copy.soldOutLabel : copy.addToCartLabel}
          </button>
        </div>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__title">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">
          {formatPrice(product.priceMinor, siteConfig.currency, siteConfig.locale)}
          {product.compareAtPriceMinor ? (
            <s>{formatPrice(product.compareAtPriceMinor, siteConfig.currency, siteConfig.locale)}</s>
          ) : null}
        </p>
        <div className="product-card__swatches" role="radiogroup" aria-label={copy.colorLabel}>
          {colors.map((v) => (
            <button
              key={v.color}
              type="button"
              className={`swatch${color === v.color ? ' is-active' : ''}`}
              style={{ background: v.colorHex }}
              title={v.color}
              role="radio"
              aria-checked={color === v.color}
              aria-label={v.color}
              onClick={() => setColor(v.color)}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
