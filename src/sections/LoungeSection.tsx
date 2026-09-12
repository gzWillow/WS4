import { Link } from 'react-router'
import { siteConfig } from '../config'
import { ProductCard } from '../components/ProductCard'
import { byIds } from '../lib/catalog'

export function LoungeSection() {
  const section = siteConfig.sections.lounge
  return (
    <section className="lounge" data-reveal>
      <div className="container">
        <div className="lounge__grid">
          <div>
            <p className="lounge__kicker">{section.kicker}</p>
            <h2>{section.heading}</h2>
          </div>
          <div className="lounge__text">
            {section.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <Link className="btn btn--light" to={section.ctaHref}>
              {section.ctaLabel}
            </Link>
          </div>
        </div>
        <div className="lounge__products">
          {byIds(section.productIds).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
