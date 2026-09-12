import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { useHeroEffects } from '../hooks/useHeroEffects'
import { useMagnetic } from '../hooks/useMagnetic'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { IconChevronLeft, IconChevronRight } from '../components/Icons'
import { SafeImage } from '../components/SafeImage'

export function HeroSection() {
  const hero = siteConfig.sections.hero
  const [idx, setIdx] = useState(0)
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctaMagnet = useMagnetic<HTMLSpanElement>(5)
  const arrowsMagnet = useMagnetic<HTMLDivElement>(4)
  const fxEnabled = hero.effects?.enabled !== false
  useHeroEffects(sectionRef, canvasRef, { enabled: fxEnabled, reduced })
  const count = hero.slides.length
  const show = (n: number) => setIdx(((n % count) + count) % count)

  useEffect(() => {
    if (reduced || hero.autoplayMs <= 0 || count < 2) return undefined
    const id = window.setInterval(() => setIdx((i) => (i + 1) % count), hero.autoplayMs)
    return () => window.clearInterval(id)
  }, [reduced, hero.autoplayMs, count])

  const slide = hero.slides[idx]

  return (
    <section className="hero" aria-label="精选" ref={sectionRef}>
      <div className="hero__track" style={{ transform: `translateX(${-idx * 100}%)` }}>
        {hero.slides.map((s, k) => (
          <div key={k} className="hero__slide" aria-hidden={k !== idx}>
            <SafeImage image={s.image} loading={k === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      {fxEnabled ? <canvas className="hero__fx" ref={canvasRef} aria-hidden="true" /> : null}
      <div className="hero__content">
        <span className="hero__look-code hero-anim" aria-hidden="true" style={{ animationDelay: '0.05s' }}>
          造型 {String(idx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <h1 className="hero__title hero-anim" key={idx} style={{ animationDelay: '0.15s' }}>
          {slide.titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < slide.titleLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <span className="magnetic hero-anim" style={{ animationDelay: '0.35s' }} ref={ctaMagnet}>
          <Link className="btn btn--light" to={slide.ctaHref}>
            {slide.ctaLabel}
          </Link>
        </span>
        <div className="hero__collections hero-anim" style={{ animationDelay: '0.55s' }}>
          {hero.chips.map((chip) => (
            <Link className="hero__chip" key={chip.label} to={chip.href}>
              <SafeImage image={chip.image} />
              <span>
                <strong>{chip.label}</strong>
                <span>● {chip.subLabel}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      {count > 1 ? (
        <>
          <div className="hero__arrows magnetic" ref={arrowsMagnet}>
            <button type="button" className="arrow-btn arrow-btn--outline" onClick={() => show(idx + 1)} aria-label="下一张">
              <IconChevronRight />
            </button>
            <button type="button" className="arrow-btn arrow-btn--outline" onClick={() => show(idx - 1)} aria-label="上一张">
              <IconChevronLeft />
            </button>
          </div>
          <div className="hero__index" aria-hidden="true">
            {String(idx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </div>
        </>
      ) : null}
    </section>
  )
}
