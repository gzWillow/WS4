import { Link } from 'react-router'
import { siteConfig } from '../config'
import { Drawer } from './Drawer'
import { IconClose, IconMail, IconPhone, IconPlus, SocialIcon } from './Icons'
import { useOverlay } from './useOverlay'

export function MobileMenu() {
  const { open, closeOverlay } = useOverlay()
  const copy = siteConfig.copy
  const footer = copy.footer

  return (
    <Drawer id="mobile-menu" side="left" open={open === 'menu'} onClose={closeOverlay} label={copy.mobileMenu.title}>
      <div className="drawer__head">
        <h3>{copy.mobileMenu.title}</h3>
        <button type="button" className="drawer__close" onClick={closeOverlay} aria-label={copy.mobileMenu.closeAria}>
          <IconClose size={18} />
        </button>
      </div>
      <div className="drawer__body menu-drawer__nav">
        <nav aria-label="Mobile">
          {copy.header.nav.map((item) =>
            item.submenu && item.submenu.length > 0 ? (
              <details className="menu-drawer__group" key={item.label}>
                <summary>
                  <span>{item.label}</span>
                  <IconPlus size={14} />
                </summary>
                <div className="menu-drawer__sub">
                  {item.submenu.map((sub) => (
                    <Link key={sub.label} to={sub.href} onClick={closeOverlay}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link key={item.label} to={item.href} onClick={closeOverlay}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="menu-drawer__contact">
        <ul>
          <li>
            <span className="menu-drawer__contact-icon">
              <IconMail size={18} />
            </span>
            <div>
              <strong>{footer.emailLabel}</strong>
              <a href={`mailto:${footer.emailValue}`}>{footer.emailValue}</a>
            </div>
          </li>
          <li>
            <span className="menu-drawer__contact-icon">
              <IconPhone size={18} />
            </span>
            <div>
              <strong>联系客服</strong>
              <a href={`tel:${footer.phoneValue}`}>{footer.phoneValue}</a>
            </div>
          </li>
        </ul>
        <div className="menu-drawer__social">
          {footer.socials.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label}>
              <SocialIcon icon={s.icon} />
            </a>
          ))}
        </div>
      </div>
    </Drawer>
  )
}
