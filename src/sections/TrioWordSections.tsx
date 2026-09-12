import { Link } from 'react-router'
import { siteConfig } from '../config'
import { formatMoney } from '../lib/format'
import { SafeImage } from '../components/SafeImage'
import { byIds } from '../lib/catalog'

export function TrioSection() {
  const section = siteConfig.sections.trio
  return (
    <section className="section section--flush-top trio-section" data-reveal>
      <div className="trio">
        <Link className="trio__img" to={section.left.href} aria-label="系列">
          <SafeImage image={section.left.image} />
        </Link>
        <div className="trio__center">
          <SafeImage image={section.center.image} />
          <div className="trio__offer">
            <span className="badge badge--sale">{section.center.badgeLabel}</span>
            <h3>{section.center.heading}</h3>
            <Link to={section.center.ctaHref}>● {section.center.ctaLabel}</Link>
          </div>
          <div className="trio__minis">
            {byIds(section.miniProductIds).map((p) => (
              <Link className="trio__mini" key={p.id} to={`/product/${p.slug}`}>
                {p.badges.length > 0 ? (
                  <span className={`badge${p.badges[0].kind === 'sale' ? ' badge--sale' : ''}${p.badges[0].kind === 'soldout' ? ' badge--soldout' : ''}`}>
                    {p.badges[0].label}
                  </span>
                ) : null}
                <SafeImage image={p.images[0]} />
                <h4>{p.name}</h4>
                <p>
                  {formatMoney(p.priceMinor, siteConfig.currency, siteConfig.locale)}
                  {p.compareAtPriceMinor ? (
                    <>
                      {' '}
                      <s>{formatMoney(p.compareAtPriceMinor, siteConfig.currency, siteConfig.locale)}</s>
                    </>
                  ) : null}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <Link className="trio__img" to={section.right.href} aria-label="系列">
          <SafeImage image={section.right.image} />
        </Link>
      </div>
    </section>
  )
}

export function WordScrollSection() {
  const { rows } = siteConfig.sections.wordScroll
  return (
    <section className="word-scroll" aria-hidden="true">
      {rows.map((row, i) => (
        <div className="word-scroll__row" key={i}>
          {row.map((token, k) =>
            token.type === 'text' ? (
              <span key={k}>{token.text}</span>
            ) : (
              <SafeImage key={k} image={token.image} />
            ),
          )}
        </div>
      ))}
    </section>
  )
}
