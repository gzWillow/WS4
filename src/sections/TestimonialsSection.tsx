import { useRef } from 'react'
import { siteConfig } from '../config'
import { useCarousel } from '../hooks/useCarouselDrag'
import { SafeImage } from '../components/SafeImage'
import { SectionHead } from '../components/SectionHead'

export function TestimonialsSection() {
  const section = siteConfig.sections.testimonials
  const trackRef = useRef<HTMLDivElement>(null)
  const { move, dragHandlers, trackStyle } = useCarousel(trackRef)

  return (
    <section className="section testimonials" data-reveal>
      <div className="container">
        <SectionHead title={section.heading} onPrev={() => move(-1)} onNext={() => move(1)} />
        <div className="carousel">
          <div className="testimonial__track" ref={trackRef} style={trackStyle} {...dragHandlers}>
            <div className="testimonial-card testimonial-card--img">
              <SafeImage image={section.featureImage} />
            </div>
            {section.items.map((t) => (
              <figure className="testimonial-card testimonial-card--text" key={t.author}>
                <h3>{t.heading}</h3>
                <blockquote>
                  <p>{t.body}</p>
                </blockquote>
                <figcaption className="testimonial-card__author">
                  <SafeImage image={t.avatar} />
                  <div>
                    <strong>{t.author}</strong>
                    <span>{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
