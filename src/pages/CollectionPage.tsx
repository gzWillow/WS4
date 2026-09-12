import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { siteConfig } from '../config'
import { ProductCard } from '../components/ProductCard'
import { SafeImage } from '../components/SafeImage'

const PAGE_SIZE = 12

type SortValue = 'featured' | 'title' | 'price-asc' | 'price-desc'

export function CollectionPage() {
  const copy = siteConfig.copy.collection
  const [params, setParams] = useSearchParams()
  const activeSlug = params.get('c') ?? 'all'
  const saleOnly = params.get('sale') === '1'
  const [sort, setSort] = useState<SortValue>('featured')
  const [shown, setShown] = useState(PAGE_SIZE)

  const list = useMemo(() => {
    let items = siteConfig.products.filter((p) => {
      const inCollection = activeSlug === 'all' || p.collectionSlugs.includes(activeSlug)
      const inSale = !saleOnly || p.compareAtPriceMinor !== undefined
      return inCollection && inSale
    })
    if (sort === 'title') items = [...items].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price-asc') items = [...items].sort((a, b) => a.priceMinor - b.priceMinor)
    if (sort === 'price-desc') items = [...items].sort((a, b) => b.priceMinor - a.priceMinor)
    return items
  }, [activeSlug, saleOnly, sort])

  const pick = (slug: string) => {
    setShown(PAGE_SIZE)
    if (slug === 'all') setParams({})
    else setParams({ c: slug })
  }

  return (
    <main className="page-head container" id="main">
      <p className="breadcrumb">
        <Link to="/">{copy.breadcrumbHome}</Link> / <span>{copy.title}</span>
      </p>
      <h1>{copy.title}</h1>

      <div className="collection-toolbar">
        <div className="collection-chips" role="tablist" aria-label={copy.title}>
          <button
            type="button"
            className={`chip${activeSlug === 'all' ? ' is-active' : ''}`}
            onClick={() => pick('all')}
            role="tab"
            aria-selected={activeSlug === 'all'}
          >
            {copy.allLabel}
          </button>
          {siteConfig.collections.map((c) => (
            <button
              type="button"
              key={c.slug}
              className={`chip${activeSlug === c.slug ? ' is-active' : ''}`}
              onClick={() => pick(c.slug)}
              role="tab"
              aria-selected={activeSlug === c.slug}
            >
              <SafeImage image={c.image} />
              {c.name}
            </button>
          ))}
        </div>
        <div className="sort-box">
          <label htmlFor="sort-select">{copy.sortLabel}</label>
          <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortValue)}>
            {copy.sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="collection-empty">{copy.emptyLabel}</p>
      ) : (
        <div className="product-grid">
          {list.slice(0, shown).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {shown < list.length ? (
        <div className="load-more">
          <button type="button" className="btn" onClick={() => setShown((n) => n + 8)}>
            {copy.loadMoreLabel}
          </button>
        </div>
      ) : null}
    </main>
  )
}
