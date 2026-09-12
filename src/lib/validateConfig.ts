import type { HomeSectionId, SiteConfig } from '../types'

export interface ConfigIssue {
  path: string
  message: string
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function checkUnique(values: string[], path: string, issues: ConfigIssue[]) {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) issues.push({ path, message: `Duplicate value "${value}"` })
    seen.add(value)
  }
}

const ALL_SECTIONS: HomeSectionId[] = [
  'playerProfile',
  'hero',
  'trendGrid',
  'promoBanner',
  'curatedLooks',
  'trio',
  'wordScroll',
  'statement',
  'duo',
  'season',
  'editorialDark',
  'vibe',
  'stripMarquee',
  'twin',
  'lookbook',
  'lounge',
  'testimonials',
]

/**
 * Runtime validation for constraints TypeScript cannot protect after editing.
 * Rendered visibly before the app mounts when invalid.
 */
export function validateConfig(config: SiteConfig): ConfigIssue[] {
  const issues: ConfigIssue[] = []

  if (!/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(config.locale)) {
    issues.push({ path: 'locale', message: `locale "${config.locale}" is not a BCP-47 tag` })
  }
  if (!config.siteTitle.trim()) issues.push({ path: 'siteTitle', message: 'siteTitle must not be empty' })
  if (!config.brandName.trim()) issues.push({ path: 'brandName', message: 'brandName must not be empty' })

  // collections
  const collectionSlugs = config.collections.map((c) => c.slug)
  if (config.collections.length < 1) issues.push({ path: 'collections', message: 'Provide at least 1 collection' })
  collectionSlugs.forEach((slug, i) => {
    if (!KEBAB.test(slug)) issues.push({ path: `collections[${i}].slug`, message: `"${slug}" is not kebab-case` })
  })
  checkUnique(collectionSlugs, 'collections.slug', issues)

  // products
  if (config.products.length < 1) issues.push({ path: 'products', message: 'Provide at least 1 product' })
  const productIds = config.products.map((p) => p.id)
  const productSlugs = config.products.map((p) => p.slug)
  checkUnique(productIds, 'products.id', issues)
  checkUnique(productSlugs, 'products.slug', issues)
  const variantIds: string[] = []

  config.products.forEach((p, i) => {
    const path = `products[${i}] (${p.slug || p.id || '?'})`
    if (!KEBAB.test(p.slug)) issues.push({ path: `${path}.slug`, message: `"${p.slug}" is not kebab-case` })
    if (!p.name.trim()) issues.push({ path, message: 'name must not be empty' })
    if (!Number.isFinite(p.priceMinor) || p.priceMinor < 0) {
      issues.push({ path, message: 'priceMinor must be a non-negative number (minor units)' })
    }
    if (p.compareAtPriceMinor !== undefined && p.compareAtPriceMinor <= p.priceMinor) {
      issues.push({ path, message: 'compareAtPriceMinor should be greater than priceMinor' })
    }
    if (p.images.length < 1) issues.push({ path, message: 'Provide at least 1 image' })
    p.images.forEach((img, k) => {
      if (!img.src.trim()) issues.push({ path: `${path}.images[${k}]`, message: 'image src must not be empty' })
    })
    if (p.variants.length < 1) issues.push({ path, message: 'Provide at least 1 variant' })
    p.variants.forEach((v) => variantIds.push(v.id))
    if (p.colorImages) {
      const colorNames = new Set(p.variants.map((v) => v.color))
      Object.entries(p.colorImages).forEach(([color, img]) => {
        if (!colorNames.has(color)) {
          issues.push({ path: `${path}.colorImages`, message: `maps unknown color "${color}"` })
        }
        if (!img || !img.src.trim()) {
          issues.push({ path: `${path}.colorImages.${color}`, message: 'image src must not be empty' })
        }
      })
    }
    p.collectionSlugs.forEach((slug) => {
      if (!collectionSlugs.includes(slug)) {
        issues.push({ path, message: `references unknown collection "${slug}"` })
      }
    })
    p.details.forEach((d, k) => {
      if (!d.label.trim() || !d.body.trim()) {
        issues.push({ path: `${path}.details[${k}]`, message: 'detail label/body must not be empty' })
      }
    })
  })
  checkUnique(variantIds, 'variants.id', issues)

  // section order
  checkUnique(config.homeSectionOrder, 'homeSectionOrder', issues)
  config.homeSectionOrder.forEach((id) => {
    if (!ALL_SECTIONS.includes(id)) issues.push({ path: 'homeSectionOrder', message: `Unknown section id "${id}"` })
  })

  // product references inside sections
  const s = config.sections
  const refs: Array<[string, string[]]> = [
    ['sections.trendGrid.productIds', s.trendGrid.productIds],
    ['sections.curatedLooks.productIds', s.curatedLooks.productIds],
    ['sections.trio.miniProductIds', s.trio.miniProductIds],
    ['sections.vibe.productIds', s.vibe.productIds],
    ['sections.lounge.productIds', s.lounge.productIds],
  ]
  for (const [path, ids] of refs) {
    for (const id of ids) {
      if (!productIds.includes(id)) issues.push({ path, message: `references unknown product "${id}"` })
    }
  }
  s.twin.items.forEach((item, i) => {
    if (item.action === 'quick-add' && (!item.productId || !productIds.includes(item.productId))) {
      issues.push({ path: `sections.twin.items[${i}]`, message: 'quick-add item needs a valid productId' })
    }
  })

  // hero
  if (config.homeSectionOrder.includes('hero') && s.hero.slides.length < 1) {
    issues.push({ path: 'sections.hero.slides', message: 'hero is enabled but has no slides' })
  }

  // lookbook spans sanity: at most one hero
  const heroSpans = s.lookbook.items.filter((i) => i.span === 'hero').length
  if (heroSpans > 1) issues.push({ path: 'sections.lookbook.items', message: 'At most one item may use span "hero"' })

  return issues
}
