import { useRef } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { useParallax } from '../hooks/useParallax'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SafeImage } from '../components/SafeImage'

/** Infinite horizontal marquee; pauses for reduced motion. */
export function Marquee({ words, className = '' }: { words: string[]; className?: string }) {
  const reduced = useReducedMotion()
  const items = Array.from({ length: 6 }, () => words).flat()
  return (
    <div className={`marquee${className ? ` ${className}` : ''}`} aria-hidden="true">
      <div className="marquee__track" style={reduced ? { animation: 'none' } : undefined}>
        {[...items, ...items].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}

export function PromoBannerSection() {
  const section = siteConfig.sections.promoBanner
  const sectionRef = useRef<HTMLElement>(null)
  const layerRef = useParallax<HTMLDivElement>(sectionRef, 0.12)
  return (
    <section className="promo-banner" ref={sectionRef}>
      <div className="promo-banner__bg parallax-layer" ref={layerRef}>
        <SafeImage image={section.image} />
      </div>
      <div className="promo-banner__marquee">
        <Marquee words={section.marqueeWords} />
      </div>
      <div className="promo-banner__body">
        <div>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
        <Link className="btn btn--light" to={section.ctaHref}>
          {section.ctaLabel}
        </Link>
      </div>
    </section>
  )
}

export function StripMarqueeSection() {
  return (
    <div className="strip-marquee">
      <Marquee words={siteConfig.sections.stripMarquee.words} />
    </div>
  )
}
