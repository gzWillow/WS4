import { describe, expect, it } from 'vitest'
import { siteConfig } from '../src/config'
import { validateConfig } from '../src/lib/validateConfig'
import type { SiteConfig } from '../src/types'

const clone = (): SiteConfig => JSON.parse(JSON.stringify(siteConfig)) as SiteConfig

describe('validateConfig', () => {
  it('accepts the shipped sample config', () => {
    expect(validateConfig(siteConfig)).toEqual([])
  })

  it('flags duplicate product slugs', () => {
    const config = clone()
    config.products[1].slug = config.products[0].slug
    const issues = validateConfig(config)
    expect(issues.some((i) => i.path === 'products.slug')).toBe(true)
  })

  it('flags duplicate variant ids', () => {
    const config = clone()
    config.products[1].variants[0].id = config.products[0].variants[0].id
    const issues = validateConfig(config)
    expect(issues.some((i) => i.path === 'variants.id')).toBe(true)
  })

  it('flags unknown collection references', () => {
    const config = clone()
    config.products[0].collectionSlugs = ['ghost-collection']
    const issues = validateConfig(config)
    expect(issues.some((i) => i.message.includes('ghost-collection'))).toBe(true)
  })

  it('flags unknown product references in sections', () => {
    const config = clone()
    config.sections.trendGrid.productIds = ['p-ghost']
    const issues = validateConfig(config)
    expect(issues.some((i) => i.path.includes('trendGrid'))).toBe(true)
  })

  it('flags duplicate section ids in home order', () => {
    const config = clone()
    config.homeSectionOrder = ['hero', 'hero']
    const issues = validateConfig(config)
    expect(issues.some((i) => i.path === 'homeSectionOrder')).toBe(true)
  })

  it('flags empty catalog', () => {
    const config = clone()
    config.products = []
    const issues = validateConfig(config)
    expect(issues.some((i) => i.path === 'products')).toBe(true)
  })

  it('flags bad compare-at pricing', () => {
    const config = clone()
    config.products[0].compareAtPriceMinor = 1
    const issues = validateConfig(config)
    expect(issues.some((i) => i.message.includes('compareAtPriceMinor'))).toBe(true)
  })

  it('flags colorImages keys that do not match variant colors', () => {
    const config = clone()
    config.products[0].colorImages = { Ghost: { src: '/media/x.jpg', alt: 'x' } }
    const issues = validateConfig(config)
    expect(issues.some((i) => i.path.includes('colorImages') && i.message.includes('Ghost'))).toBe(true)
  })
})
