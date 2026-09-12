import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { formatPrice } from '../lib/format'
import { firstAvailableVariant, isSoldOut } from '../lib/catalog'
import { useCart } from '../cart/useCart'
import { useColorSelection } from '../hooks/useColorSelection'
import { Drawer } from './Drawer'
import { IconClose } from './Icons'
import { useOverlay } from './useOverlay'
import { QuickViewContext } from './QuickViewContext'
import { SafeImage } from './SafeImage'
import { useToast } from './useToast'

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<string | null>(null)
  const { open, openOverlay, closeOverlay } = useOverlay()
  const { dispatch } = useCart()
  const { notify } = useToast()

  const product = useMemo(
    () => siteConfig.products.find((p) => p.id === productId) ?? null,
    [productId],
  )

  const openQuickView = (id: string) => {
    setProductId(id)
    openOverlay('quick')
  }

  return (
    <QuickViewContext.Provider value={{ productId, openQuickView }}>
      {children}
      <Drawer
        id="quick-view"
        side="right"
        open={open === 'quick' && product !== null}
        onClose={closeOverlay}
        label={siteConfig.copy.quickView.title}
      >
        {product ? (
          <QuickViewBody
            productId={product.id}
            onAdd={() => {
              const variant = firstAvailableVariant(product)
              dispatch({ type: 'add', productId: product.id, variantId: variant.id, qty: 1 })
              notify(`${product.name} ${siteConfig.copy.cart.addedNotice}`)
              openOverlay('cart')
            }}
          />
        ) : null}
      </Drawer>
    </QuickViewContext.Provider>
  )
}

function QuickViewBody({ productId, onAdd }: { productId: string; onAdd: () => void }) {
  const product = siteConfig.products.find((p) => p.id === productId)!
  const { closeOverlay } = useOverlay()
  const copy = siteConfig.copy
  const soldOut = isSoldOut(product)
  const { colors, color, setColor, image, variantsForColor } = useColorSelection(product)
  const [sizeId, setSizeId] = useState<string | null>(null)
  const active =
    variantsForColor.find((v) => v.id === sizeId) ?? variantsForColor.find((v) => v.available) ?? variantsForColor[0]

  return (
    <>
      <div className="drawer__head">
        <h3>{copy.quickView.title}</h3>
        <button type="button" className="drawer__close" onClick={closeOverlay} aria-label={copy.quickView.closeAria}>
          <IconClose size={18} />
        </button>
      </div>
      <div className="drawer__body quick-view__body">
        <div className="quick-view__media">
          <SafeImage image={image} />
          <span className="product-card__badges">
            {product.badges.map((b) => (
              <span key={b.label} className={`badge${b.kind === 'sale' ? ' badge--sale' : ''}${b.kind === 'soldout' ? ' badge--soldout' : ''}`}>
                {b.label}
              </span>
            ))}
          </span>
        </div>
        <h4 className="quick-view__title">{product.name}</h4>
        <p className="quick-view__price">
          {formatPrice(product.priceMinor, siteConfig.currency, siteConfig.locale)}
          {product.compareAtPriceMinor ? (
            <s>{formatPrice(product.compareAtPriceMinor, siteConfig.currency, siteConfig.locale)}</s>
          ) : null}
        </p>
        <p className="opt-label">
          {copy.product.colorLabel}: <span>{color}</span>
        </p>
        <div className="color-dots" role="radiogroup" aria-label={copy.product.colorLabel}>
          {colors.map((v) => (
            <button
              type="button"
              key={v.color}
              className={`swatch${color === v.color ? ' is-active' : ''}`}
              style={{ background: v.colorHex }}
              title={v.color}
              role="radio"
              aria-checked={color === v.color}
              aria-label={v.color}
              onClick={() => {
                setColor(v.color)
                setSizeId(null)
              }}
            />
          ))}
        </div>
        <p className="opt-label">{copy.product.sizeLabel}</p>
        <div className="size-row" role="radiogroup" aria-label={copy.product.sizeLabel}>
          {variantsForColor.map((v) => (
            <button
              type="button"
              key={v.id}
              className={`${active?.id === v.id ? 'is-active' : ''}${v.available ? '' : ' is-disabled'}`}
              disabled={!v.available}
              role="radio"
              aria-checked={active?.id === v.id}
              onClick={() => setSizeId(v.id)}
            >
              {v.size}
            </button>
          ))}
        </div>
        <button type="button" className="btn quick-view__add" disabled={soldOut || !active?.available} onClick={onAdd}>
          {soldOut ? copy.product.soldOutLabel : copy.product.addToCartLabel}
        </button>
        <Link className="quick-view__details" to={`/product/${product.slug}`} onClick={closeOverlay}>
          {copy.quickView.viewDetailsLabel} →
        </Link>
      </div>
    </>
  )
}
