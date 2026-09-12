import { Link } from 'react-router'
import { siteConfig } from '../config'
import { useCart } from '../cart/useCart'
import { IconBag } from '../components/Icons'
import { useOverlay } from '../components/useOverlay'
import { firstAvailableVariant } from '../lib/catalog'
import { SafeImage } from '../components/SafeImage'
import { useToast } from '../components/useToast'

export function TwinSection() {
  const section = siteConfig.sections.twin
  const { dispatch } = useCart()
  const { openOverlay } = useOverlay()
  const { notify } = useToast()

  const quickAdd = (productId: string) => {
    const product = siteConfig.products.find((p) => p.id === productId)
    if (!product) return
    const variant = firstAvailableVariant(product)
    dispatch({ type: 'add', productId: product.id, variantId: variant.id, qty: 1 })
    notify(`${product.name} ${siteConfig.copy.cart.addedNotice}`)
    openOverlay('cart')
  }

  return (
    <section className="twin">
      <div className="container twin__grid">
        {section.items.map((item, i) =>
          item.action === 'quick-add' && item.productId ? (
            <button type="button" className="twin__item" key={i} onClick={() => quickAdd(item.productId!)}>
              <SafeImage image={item.image} />
              <span className="round-icon">
                <IconBag size={18} />
              </span>
            </button>
          ) : (
            <Link className="twin__item" key={i} to={item.href}>
              <SafeImage image={item.image} />
              <span className="round-icon">
                <IconBag size={18} />
              </span>
            </Link>
          ),
        )}
      </div>
    </section>
  )
}

export function LookbookSection() {
  const section = siteConfig.sections.lookbook
  return (
    <section className="essentials" id="lookbook" data-reveal>
      <div className="container">
        <div className="essentials__head">
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      </div>
      <div className="lookbook">
        {section.items.map((item, i) => (
          <div
            key={i}
            className={`lookbook__item${item.span === 'hero' ? ' lookbook__item--hero' : ''}${item.span === 'tall' ? ' lookbook__item--tall' : ''}${item.span === 'wide' ? ' lookbook__item--wide' : ''}`}
          >
            <SafeImage image={item.image} />
            {item.tagSmall || item.tagStrong ? (
              <div className="lookbook__tag">
                {item.tagSmall ? <small>{item.tagSmall}</small> : null}
                {item.tagStrong ? <strong>{item.tagStrong}</strong> : null}
              </div>
            ) : null}
            {item.num ? <span className="lookbook__num">{item.num}</span> : null}
          </div>
        ))}
      </div>
    </section>
  )
}
