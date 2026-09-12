import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../config'
import { formatMoney } from '../lib/format'
import { IconClose, IconSearch } from './Icons'
import { useOverlay } from './useOverlay'
import { SafeImage } from './SafeImage'

/** Full-screen search overlay; filters the local catalog client-side. */
export function SearchOverlay() {
  const { open, closeOverlay } = useOverlay()
  const copy = siteConfig.copy.search
  const isOpen = open === 'search'

  if (!isOpen) return null
  // remount per open so query state resets without setState-in-effect
  return <SearchOverlayInner key={copy.title} copy={copy} onClose={closeOverlay} />
}

function SearchOverlayInner({
  copy,
  onClose,
}: {
  copy: (typeof siteConfig)['copy']['search']
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return siteConfig.products
      .filter((p) => p.name.toLowerCase().includes(q) || p.collectionSlugs.some((c) => c.includes(q)))
      .slice(0, 8)
  }, [query])

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={copy.title}>
      <div className="search-overlay__inner container">
        <div className="search-overlay__head">
          <h3>{copy.title}</h3>
          <button type="button" className="drawer__close" onClick={onClose} aria-label={copy.closeAria}>
            <IconClose size={18} />
          </button>
        </div>
        <div className="search-overlay__field">
          <IconSearch size={18} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.title}
          />
        </div>
        {!query.trim() ? (
          <div className="search-overlay__popular">
            <h4>{copy.popularHeading}</h4>
            <div>
              {copy.popularTerms.map((term) => (
                <button key={term} type="button" className="chip" onClick={() => setQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="search-overlay__results">
            <h4>{copy.resultsHeading}</h4>
            {results.length === 0 ? (
              <p className="search-overlay__empty">{copy.emptyText}</p>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} onClick={onClose}>
                      <SafeImage image={p.images[0]} />
                      <span className="search-overlay__name">{p.name}</span>
                      <span className="search-overlay__price">
                        {formatMoney(p.priceMinor, siteConfig.currency, siteConfig.locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
