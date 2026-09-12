import { siteConfig } from '../config'
import { formatMoney } from '../lib/format'
import { useCart } from '../cart/useCart'
import { Drawer } from './Drawer'
import { IconClose } from './Icons'
import { useOverlay } from './useOverlay'
import { SafeImage } from './SafeImage'
import { useToast } from './useToast'

export function CartDrawer() {
  const { open, closeOverlay } = useOverlay()
  const { lines, dispatch, subtotalMinor } = useCart()
  const { notify } = useToast()
  const copy = siteConfig.copy.cart

  return (
    <Drawer id="cart-drawer" side="right" open={open === 'cart'} onClose={closeOverlay} label={copy.title}>
      <div className="drawer__head">
        <h3>{copy.title}</h3>
        <button type="button" className="drawer__close" onClick={closeOverlay} aria-label={copy.closeAria}>
          <IconClose size={18} />
        </button>
      </div>
      <div className="drawer__body">
        {lines.length === 0 ? (
          <p className="cart-empty">
            {copy.emptyTitle}
            <br />
            {copy.emptyBody}
          </p>
        ) : (
          <>
            {lines.map((line) => {
              const product = siteConfig.products.find((p) => p.id === line.productId)
              const variant = product?.variants.find((v) => v.id === line.variantId)
              if (!product || !variant) return null
              return (
                <div className="cart-item" key={line.variantId}>
                  <SafeImage image={product.images[0]} />
                  <div>
                    <h4>{product.name}</h4>
                    <p className="price">
                      {formatMoney(product.priceMinor, siteConfig.currency, siteConfig.locale)} · {copy.sizePrefix}{' '}
                      {variant.size} / {variant.color}
                    </p>
                    <span className="qty">
                      <button
                        type="button"
                        aria-label={copy.decreaseAria}
                        onClick={() => dispatch({ type: 'setQty', variantId: line.variantId, qty: line.qty - 1 })}
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        aria-label={copy.increaseAria}
                        onClick={() => dispatch({ type: 'setQty', variantId: line.variantId, qty: line.qty + 1 })}
                      >
                        +
                      </button>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove"
                    onClick={() => dispatch({ type: 'remove', variantId: line.variantId })}
                  >
                    {copy.removeLabel}
                  </button>
                </div>
              )
            })}
          </>
        )}
      </div>
      <div className="drawer__foot">
        <div className="totals">
          <span>{copy.subtotalLabel}</span>
          <span>{formatMoney(subtotalMinor, siteConfig.currency, siteConfig.locale)}</span>
        </div>
        <button type="button" className="btn" onClick={() => notify(copy.checkoutDemoNotice)}>
          {copy.checkoutLabel}
        </button>
      </div>
    </Drawer>
  )
}
