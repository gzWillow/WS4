import { useState } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { IconChevronDown, IconChevronRight, IconGlobe, IconMail, IconPhone, SocialIcon } from './Icons'
import { useToast } from './useToast'

export function SiteFooter() {
  const copy = siteConfig.copy
  const { notify } = useToast()
  const [email, setEmail] = useState('')

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    notify(valid ? copy.newsletter.successNotice : copy.newsletter.invalidNotice)
    if (valid) setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="newsletter">
          <h2>{copy.newsletter.heading}</h2>
          <form onSubmit={subscribe} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              {copy.newsletter.submitAria}
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.newsletter.placeholder}
              required
            />
            <button type="submit" aria-label={copy.newsletter.submitAria}>
              <IconChevronRight size={18} />
            </button>
          </form>
        </div>

        <div className="footer__cols">
          <div className="footer__brand">
            <Link className="site-header__logo" to="/">
              {siteConfig.brandName}
            </Link>
            <div className="footer__contact">
              <div>
                <span className="round">
                  <IconMail />
                </span>
                <div>
                  <small>{copy.footer.emailLabel}</small>
                  <span>{copy.footer.emailValue}</span>
                </div>
              </div>
              <div>
                <span className="round">
                  <IconPhone />
                </span>
                <div>
                  <small>{copy.footer.phoneLabel}</small>
                  <span>{copy.footer.phoneValue}</span>
                </div>
              </div>
            </div>
            <div className="footer__social">
              <h4>{copy.footer.socialHeading}</h4>
              <div>
                {copy.footer.socials.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label}>
                    <SocialIcon icon={s.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {copy.footer.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h4>{col.heading}</h4>
              {col.links.map((l) => (
                <Link key={l.label} to={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="footer__bottom">
          <div>
            <div className="footer__locale">
              <IconGlobe />
              {copy.footer.localeLabel} <IconChevronDown />
            </div>
            {copy.footer.copyright}
          </div>
          <div className="footer__pay" aria-hidden="true">
            {copy.footer.paymentLabels.map((p) => (
              <span key={p} data-brand={p.toLowerCase().replace(/[^a-z]/g, '')}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
