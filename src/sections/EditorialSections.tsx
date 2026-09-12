import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { useParallax } from '../hooks/useParallax'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SafeImage } from '../components/SafeImage'

export function StatementSection() {
  const section = siteConfig.sections.statement
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || section.rotateMs <= 0 || section.words.length < 2) return undefined
    const id = window.setInterval(() => setActive((i) => (i + 1) % section.words.length), section.rotateMs)
    return () => window.clearInterval(id)
  }, [reduced, section.rotateMs, section.words.length])

  return (
    <section className="statement">
      <div className="statement__bg">
        <SafeImage image={section.image} />
      </div>
      <div className="statement__words">
        {section.words.map((word, i) => (
          <span key={word} className={i === active ? 'is-active' : undefined}>
            {word}
          </span>
        ))}
      </div>
      <div className="statement__side">
        <p>{section.body}</p>
        <Link className="btn btn--light" to={section.ctaHref}>
          {section.ctaLabel}
        </Link>
      </div>
    </section>
  )
}

export function DuoSection() {
  const section = siteConfig.sections.duo
  return (
    <section className="section" data-reveal>
      <div className="container duo">
        <div className="duo__img">
          <SafeImage image={section.leftImage} />
        </div>
        <div className="duo__text">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <Link className="btn" to={section.ctaHref}>
            {section.ctaLabel}
          </Link>
        </div>
        <div className="duo__img duo__img--right">
          <SafeImage image={section.rightImage} />
        </div>
      </div>
    </section>
  )
}

export function SeasonSection() {
  const section = siteConfig.sections.season
  const sectionRef = useRef<HTMLElement>(null)
  const layerRef = useParallax<HTMLDivElement>(sectionRef, 0.12)
  return (
    <section className="season" ref={sectionRef}>
      <div className="parallax-layer" ref={layerRef}>
        <SafeImage image={section.image} />
      </div>
      <h2>{section.heading}</h2>
    </section>
  )
}

export function EditorialDarkSection() {
  const section = siteConfig.sections.editorialDark
  return (
    <section className="editorial-dark" data-reveal>
      <div className="container">
        <h2>{section.heading}</h2>
        {section.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <Link className="btn btn--light" to={section.ctaHref}>
          {section.ctaLabel}
        </Link>
      </div>
    </section>
  )
}
