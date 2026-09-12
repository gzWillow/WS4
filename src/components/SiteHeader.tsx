import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../cart/useCart'
import { siteConfig } from '../config'
import { IconBag, IconChevronDown, IconMenu, IconSearch } from './Icons'
import { useOverlay } from './useOverlay'

interface SiteHeaderProps {
  /** 'overlay' floats over a dark hero; 'solid' for inner pages. */
  variant?: 'overlay' | 'solid'
}

export function SiteHeader({ variant = 'overlay' }: SiteHeaderProps) {
  const copy = siteConfig.copy.header
  const { count } = useCart()
  const { openOverlay, setReturnFocus } = useOverlay()
  const [stuck, setStuck] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [bump, setBump] = useState(false)
  const prevCount = useRef(count)

  // badge pops when the cart count changes
  useEffect(() => {
    if (count === prevCount.current) return undefined
    prevCount.current = count
    setBump(true)
    const t = window.setTimeout(() => setBump(false), 450)
    return () => window.clearTimeout(t)
  }, [count])

  useEffect(() => {
    if (variant === 'solid') return undefined
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setStuck(y > 80)
      // hide on scroll down past the hero intro, reveal on scroll up
      if (y > lastY && y > 300) setHidden(true)
      else if (y < lastY) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [variant])

  const openWithFocus = (kind: 'cart' | 'menu' | 'search') => (e: React.MouseEvent<HTMLButtonElement>) => {
    setReturnFocus(e.currentTarget)
    openOverlay(kind)
  }

  return (
    <header className={`site-header${variant === 'solid' ? ' site-header--solid' : ''}${stuck ? ' is-stuck' : ''}${hidden ? ' is-hidden' : ''}`}>
      <div className="container site-header__inner">
        <div className="site-header__brand">
          <button type="button" className="burger" onClick={openWithFocus('menu')} aria-label={copy.menuAria}>
            <IconMenu size={18} />
          </button>
          <Link className="site-header__logo" to="/">
            {siteConfig.brandName}
          </Link>
        </div>
        <nav className="main-nav" aria-label="主导航">
          {copy.nav.map((item) =>
            item.submenu && item.submenu.length > 0 ? (
              <div
                className="main-nav__item"
                key={item.label}
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
                onFocus={() => setOpenMenu(item.label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setOpenMenu(null)
                    ;(e.currentTarget.querySelector('a') as HTMLElement | null)?.focus()
                  }
                }}
              >
                <Link to={item.href} aria-haspopup="true" aria-expanded={openMenu === item.label}>
                  {item.label}
                  <IconChevronDown />
                </Link>
                <div className={`main-nav__dropdown${openMenu === item.label ? ' is-open' : ''}`} role="menu">
                  <div className="main-nav__panel">
                    {item.submenu.map((sub) => (
                      <Link key={sub.label} to={sub.href} role="menuitem" onClick={() => setOpenMenu(null)}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.label} to={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="site-header__icons">
          <button type="button" aria-label={copy.searchAria} onClick={openWithFocus('search')}>
            <IconSearch size={20} />
          </button>

          <button type="button" onClick={openWithFocus('cart')} aria-label={copy.cartAria}>
            <IconBag size={20} />
            <span className={`cart-count${bump ? ' bump' : ''}`} aria-hidden="true">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
