import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { siteConfig } from '../config'
import { formatPrice } from '../lib/format'
import { isSoldOut } from '../lib/catalog'
import { useCart } from '../cart/useCart'
import { useColorSelection } from '../hooks/useColorSelection'
import { useCountdown } from '../hooks/useCountdown'
import type { Product } from '../types'
import { IconPlus } from '../components/Icons'
import { useOverlay } from '../components/useOverlay'
import { ProductCard } from '../components/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { useToast } from '../components/useToast'

function Accordion({ items, firstOpen = false }: { items: Array<{ label: string; body: string }>; firstOpen?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(firstOpen ? 0 : null)
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const open = openIdx === i
        return (
          <div className={`accordion__item${open ? ' is-open' : ''}`} key={item.label}>
            <button
              type="button"
              className="accordion__head"
              aria-expanded={open}
              aria-controls={`acc-${i}`}
              onClick={() => setOpenIdx(open ? null : i)}
            >
              {item.label}
              <IconPlus />
            </button>
            <div className="accordion__body" id={`acc-${i}`} role="region" hidden={!open}>
              <p>{item.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = siteConfig.products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <main className="page-head container" id="main">
        <p className="breadcrumb">
          <Link to="/">{siteConfig.copy.collection.breadcrumbHome}</Link> / <span>—</span>
        </p>
        <h1>{siteConfig.copy.errors.missingProduct}</h1>
        <p style={{ marginTop: 16 }}>
          <Link className="btn" to="/collection">
            {siteConfig.copy.notFound.ctaLabel}
          </Link>
        </p>
      </main>
    )
  }
  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const copy = siteConfig.copy.product
  const { dispatch } = useCart()
  const { openOverlay } = useOverlay()
  const { notify } = useToast()
  const timer = useCountdown(siteConfig.countdownDurationMs)

  const { colors, color, setColor, image, variantsForColor } = useColorSelection(product)
  const [sizeId, setSizeId] = useState<string | null>(null)
  const activeVariant =
    variantsForColor.find((v) => v.id === sizeId) ?? variantsForColor.find((v) => v.available) ?? variantsForColor[0]
  const [qty, setQty] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)

  const soldOut = isSoldOut(product)
  const related = siteConfig.products.filter((p) => p.id !== product.id).slice(0, 4)
  const gallery = product.images

  const addToCart = () => {
    if (!activeVariant || !activeVariant.available) return
    dispatch({ type: 'add', productId: product.id, variantId: activeVariant.id, qty })
    notify(`${product.name} ${siteConfig.copy.cart.addedNotice}`)
    openOverlay('cart')
  }

  /** 立即下载：优先下载视频，否则下载当前展示的图片 */
  const downloadNow = async () => {
    const src = product.videoSrc ?? gallery[Math.min(imgIdx, gallery.length - 1)]?.src ?? product.images[0]?.src
    if (!src) return
    notify(copy.buyNowDemoNotice)
    const filename = `${product.slug}${src.slice(src.lastIndexOf('.'))}`
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // 跨源或网络失败时退化为新窗口打开
      window.open(src, '_blank')
    }
  }

  return (
    <main className="product-page container" id="main">
      <p className="breadcrumb">
        <Link to="/">{siteConfig.copy.collection.breadcrumbHome}</Link> /{' '}
        <Link to="/collection">{siteConfig.copy.collection.title}</Link> / <span>{product.name}</span>
      </p>

      <div className="product-layout">
        <div className="product-thumbs" role="tablist" aria-label={product.name}>
          {gallery.map((img, i) => (
            <button type="button" key={i} onClick={() => setImgIdx(i)} aria-label={`View ${i + 1}`} aria-selected={imgIdx === i} role="tab">
              <SafeImage image={img} className={imgIdx === i ? 'is-active' : undefined} />
            </button>
          ))}
        </div>
        <div className="product-main-img">
          {product.videoSrc ? (
            <video
              src={product.videoSrc}
              poster={product.images[0]?.src}
              controls
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <SafeImage image={imgIdx === 0 ? image : gallery[Math.min(imgIdx, gallery.length - 1)]} loading="eager" />
          )}
        </div>

        <div className="product-info">
          <p className="vendor">{copy.vendorLabel}</p>
          <h1>{product.name}</h1>
          <p className="price">
            {formatPrice(product.priceMinor, siteConfig.currency, siteConfig.locale)}
            {product.compareAtPriceMinor ? (
              <>
                <s>{formatPrice(product.compareAtPriceMinor, siteConfig.currency, siteConfig.locale)}</s>
                <span className="badge badge--sale">折扣</span>
              </>
            ) : null}
          </p>
          <p className="tax">{copy.taxNote}</p>

          <p className="opt-label">
            {copy.colorLabel}: <span>{color}</span>
          </p>
          <div className="color-dots" role="radiogroup" aria-label={copy.colorLabel}>
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
                  setImgIdx(0)
                }}
              />
            ))}
          </div>

          <p className="opt-label">{copy.sizeLabel}</p>
          <div className="size-row" role="radiogroup" aria-label={copy.sizeLabel}>
            {variantsForColor.map((v) => (
              <button
                type="button"
                key={v.id}
                className={`${activeVariant?.id === v.id ? 'is-active' : ''}${v.available ? '' : ' is-disabled'}`}
                disabled={!v.available}
                role="radio"
                aria-checked={activeVariant?.id === v.id}
                onClick={() => setSizeId(v.id)}
              >
                {v.size}
              </button>
            ))}
          </div>

          <div className="buy-row">
            <span className="qty-box" aria-label={copy.quantityLabel}>
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="−">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="+">
                +
              </button>
            </span>
            <button type="button" className="btn" disabled={soldOut || !activeVariant?.available} onClick={addToCart}>
              {soldOut ? copy.soldOutLabel : copy.addToCartLabel}
            </button>
          </div>
          <button type="button" className="btn btn--accent buy-now" disabled={soldOut} onClick={downloadNow}>
            {copy.buyNowLabel}
          </button>

          <div className="product-meta">
            <p>
              <b>{copy.metaLabels.vendor}</b> {copy.vendorLabel}
            </p>
            <p>
              <b>{copy.metaLabels.type}</b>{' '}
              {product.collectionSlugs
                .map((s) => siteConfig.collections.find((c) => c.slug === s)?.name ?? s)
                .join('、')}
            </p>
            <p>
              <b>{copy.metaLabels.sku}</b> {product.id.toUpperCase()}
            </p>
            <p>
              <b>{copy.metaLabels.availability}</b> {soldOut ? copy.soldOutLabel : copy.availabilityInStock}
            </p>
          </div>

          <Accordion items={product.details} firstOpen />
        </div>
      </div>

      <section className="section hurry">
        <div className="section__head">
          <h2 className="section__title">{copy.hurryHeading}</h2>
          <div className="hurry__timer" role="timer">
            <div>
              <b>{timer.days}</b>
              <small>{copy.timerUnits.days}</small>
            </div>
            <div>
              <b>{String(timer.hours).padStart(2, '0')}</b>
              <small>{copy.timerUnits.hours}</small>
            </div>
            <div>
              <b>{String(timer.mins).padStart(2, '0')}</b>
              <small>{copy.timerUnits.mins}</small>
            </div>
            <div>
              <b>{String(timer.secs).padStart(2, '0')}</b>
              <small>{copy.timerUnits.secs}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="section__head">
          <h2 className="section__title">{siteConfig.copy.stories.heading}</h2>
        </div>
        <div className="stories__grid">
          {siteConfig.copy.stories.items.map((story) => (
            <Link className="stories__item" key={story.title} to={story.href}>
              <SafeImage image={story.image} />
              <div>
                <small>{story.kicker}</small>
                <h3>{story.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="faq">
          <div className="section__head">
            <h2 className="section__title">{siteConfig.copy.faq.heading}</h2>
          </div>
          <Accordion items={siteConfig.copy.faq.items} />
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="section__head">
          <h2 className="section__title">{copy.relatedHeading}</h2>
        </div>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
