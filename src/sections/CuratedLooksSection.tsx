import { useRef } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { useCarousel } from '../hooks/useCarouselDrag'
import { ProductCard } from '../components/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { SectionHead } from '../components/SectionHead'
import { byIds } from '../lib/catalog'

/** Horizontal product carousel with arrow stepping and pointer drag. */
export function CuratedLooksSection() {
  const section = siteConfig.sections.curatedLooks
  const trackRef = useRef<HTMLDivElement>(null)
  const { move, dragHandlers, trackStyle } = useCarousel(trackRef)

  return (
    <section className="section" data-reveal>
      <div className="container">
        <SectionHead title={section.heading} onPrev={() => move(-1)} onNext={() => move(1)} />
        <div className="curated">
          <div className="curated__cats">
            {section.categories.map((cat) => (
              <Link key={cat.label} to={cat.href}>
                <SafeImage image={cat.image} />
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
          <div className="carousel">
            <div className="carousel__track" ref={trackRef} style={trackStyle} {...dragHandlers}>
              {byIds(section.productIds).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
