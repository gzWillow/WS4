import { Link } from 'react-router'
import { siteConfig } from '../config'
import { ProductCard } from '../components/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { byIds } from '../lib/catalog'

export function VibeSection() {
  const section = siteConfig.sections.vibe
  return (
    <section className="section" data-reveal>
      <div className="container vibe">
        <div className="vibe__img">
          <SafeImage image={section.image} />
        </div>
        <div className="vibe__mid">
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
          {section.links.map((link) => (
            <Link key={link.label} to={link.href} className={link.primary ? undefined : 'is-secondary'}>
              ● {link.label}
            </Link>
          ))}
        </div>
        <div className="vibe__grid">
          {byIds(section.productIds).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
