import { siteConfig } from '../config'
import { byIds } from '../lib/catalog'
import { ProductCard } from '../components/ProductCard'
import { SectionHead } from '../components/SectionHead'

export function TrendGridSection() {
  const section = siteConfig.sections.trendGrid
  return (
    <section className="section" data-reveal>
      <div className="container">
        <SectionHead title={section.heading} />
        <div className="product-grid">
          {byIds(section.productIds).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
