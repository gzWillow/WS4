/* Typed configuration surface for the template.
 * Ordinary adaptations edit src/config.ts only; these types are the schema.
 */

export interface MediaImage {
  src: string
  alt: string
  /** CSS object-position, e.g. '50% 30%'. Optional. */
  position?: string
}

/* ---------------- catalog ---------------- */

export type ProductBadgeKind = 'sale' | 'soldout' | 'plain'

export interface ProductBadge {
  label: string
  kind: ProductBadgeKind
}

export interface ProductVariant {
  /** Unique across the whole catalog (kebab-case). */
  id: string
  color: string
  colorHex: string
  size: string
  available: boolean
}

export interface ProductDetail {
  label: string
  body: string
}

export interface Product {
  /** Unique kebab-case identifier, stable for cart persistence. */
  id: string
  /** Unique kebab-case route slug. */
  slug: string
  name: string
  priceMinor: number
  compareAtPriceMinor?: number
  badges: ProductBadge[]
  /** References CollectionDef.slug; drives collection filtering. */
  collectionSlugs: string[]
  /** [primary, hover] — hover optional. */
  images: MediaImage[]
  /** Optional video file (e.g. /media/xxx.mp4) — detail page renders a player and downloads it. */
  videoSrc?: string
  /** Optional per-color gallery image; swatch selection swaps to it, falls back to images[0]. */
  colorImages?: Partial<Record<string, MediaImage>>
  variants: ProductVariant[]
  details: ProductDetail[]
}

export interface CollectionDef {
  /** Unique kebab-case slug. */
  slug: string
  name: string
  image: MediaImage
}

/* ---------------- home sections ---------------- */

export interface HeroSlide {
  image: MediaImage
  titleLines: string[]
  ctaLabel: string
  ctaHref: string
}

export interface HeroChip {
  label: string
  subLabel: string
  image: MediaImage
  href: string
}

export interface HeroEffects {
  /** Master switch for the hero canvas ambience layer (light dust, silk sheen, pointer parallax). */
  enabled: boolean
}

export interface HeroSection {
  slides: HeroSlide[]
  chips: HeroChip[]
  /** Autoplay interval in ms; 0 disables autoplay. */
  autoplayMs: number
  /** Signature ambience layer; treated as enabled when omitted. */
  effects?: HeroEffects
}

export interface ProductGridSection {
  heading: string
  productIds: string[]
}

export interface PromoBannerSection {
  marqueeWords: string[]
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
  image: MediaImage
}

export interface CuratedCategory {
  label: string
  image: MediaImage
  href: string
}

export interface CuratedLooksSection {
  heading: string
  categories: CuratedCategory[]
  productIds: string[]
}

export interface TrioSection {
  left: { image: MediaImage; href: string }
  right: { image: MediaImage; href: string }
  center: {
    image: MediaImage
    badgeLabel: string
    heading: string
    ctaLabel: string
    ctaHref: string
  }
  miniProductIds: string[]
}

export type WordScrollToken =
  | { type: 'text'; text: string }
  | { type: 'image'; image: MediaImage }

export interface WordScrollSection {
  rows: WordScrollToken[][]
}

export interface StatementSection {
  words: string[]
  body: string
  ctaLabel: string
  ctaHref: string
  image: MediaImage
  /** Rotation interval in ms; 0 disables rotation. */
  rotateMs: number
}

export interface DuoSection {
  leftImage: MediaImage
  rightImage: MediaImage
  heading: string
  paragraphs: string[]
  ctaLabel: string
  ctaHref: string
}

export interface SeasonSection {
  image: MediaImage
  heading: string
}

export interface EditorialDarkSection {
  heading: string
  paragraphs: string[]
  ctaLabel: string
  ctaHref: string
}

export interface VibeLink {
  label: string
  href: string
  primary?: boolean
}

export interface VibeSection {
  image: MediaImage
  heading: string
  body: string
  links: VibeLink[]
  productIds: string[]
}

export interface StripMarqueeSection {
  words: string[]
}

export interface TwinSection {
  items: Array<{ image: MediaImage; href: string; action: 'link' | 'quick-add'; productId?: string }>
}

export interface LookbookItem {
  image: MediaImage
  /** e.g. '03' — optional corner number. */
  num?: string
  tagSmall?: string
  tagStrong?: string
  /** Grid span: 'tall' spans 2 rows, 'wide' spans 2 columns, 'hero' spans both. */
  span?: 'tall' | 'wide' | 'hero'
}

export interface LookbookSection {
  heading: string
  body: string
  items: LookbookItem[]
}

export interface LoungeSection {
  kicker: string
  heading: string
  paragraphs: string[]
  ctaLabel: string
  ctaHref: string
  productIds: string[]
}

export interface TestimonialItem {
  heading: string
  body: string
  author: string
  role: string
  avatar: MediaImage
}

export interface TestimonialsSection {
  heading: string
  featureImage: MediaImage
  items: TestimonialItem[]
}

export interface PlayerFact {
  label: string
  value: string
}

/** 首页「球员资料」板块 */
export interface PlayerProfileSection {
  kicker: string
  heading: string
  paragraphs: string[]
  facts: PlayerFact[]
  image: MediaImage
  ctaLabel: string
  ctaHref: string
}

export interface HomeSections {
  hero: HeroSection
  playerProfile: PlayerProfileSection
  trendGrid: ProductGridSection
  promoBanner: PromoBannerSection
  curatedLooks: CuratedLooksSection
  trio: TrioSection
  wordScroll: WordScrollSection
  statement: StatementSection
  duo: DuoSection
  season: SeasonSection
  editorialDark: EditorialDarkSection
  vibe: VibeSection
  stripMarquee: StripMarqueeSection
  twin: TwinSection
  lookbook: LookbookSection
  lounge: LoungeSection
  testimonials: TestimonialsSection
}

export type HomeSectionId = keyof HomeSections

/* ---------------- interface copy ---------------- */

export interface NavItem {
  label: string
  href: string
  /** Optional dropdown panel links (desktop hover/focus, mobile accordion). */
  submenu?: Array<{ label: string; href: string }>
}

export interface FooterColumn {
  heading: string
  links: Array<{ label: string; href: string }>
}

export interface InterfaceCopy {
  skipLink: string
  announcement: {
    messages: string[]
    countdownAria: string
    localeLabel: string
    prevMessageAria: string
    nextMessageAria: string
    daysUnit: string
    hoursUnit: string
    minsUnit: string
    secsUnit: string
  }
  header: {
    menuAria: string
    searchAria: string
    accountAria: string
    cartAria: string
    nav: NavItem[]
  }
  search: {
    title: string
    placeholder: string
    popularHeading: string
    popularTerms: string[]
    resultsHeading: string
    emptyText: string
    closeAria: string
  }
  quickView: {
    title: string
    viewDetailsLabel: string
    closeAria: string
  }
  mobileMenu: {
    title: string
    closeAria: string
  }
  cart: {
    title: string
    closeAria: string
    emptyTitle: string
    emptyBody: string
    subtotalLabel: string
    checkoutLabel: string
    checkoutDemoNotice: string
    removeLabel: string
    decreaseAria: string
    increaseAria: string
    sizePrefix: string
    addedNotice: string
    resetDemoLabel: string
  }
  product: {
    addToCartLabel: string
    soldOutLabel: string
    quickAddAria: string
    quickViewLabel: string
    vendorLabel: string
    colorLabel: string
    sizeLabel: string
    quantityLabel: string
    buyNowLabel: string
    buyNowDemoNotice: string
    taxNote: string
    metaLabels: { vendor: string; type: string; sku: string; availability: string }
    availabilityInStock: string
    relatedHeading: string
    hurryHeading: string
    timerUnits: { days: string; hours: string; mins: string; secs: string }
  }
  collection: {
    title: string
    breadcrumbHome: string
    allLabel: string
    sortLabel: string
    sortOptions: Array<{ value: 'featured' | 'title' | 'price-asc' | 'price-desc'; label: string }>
    loadMoreLabel: string
    emptyLabel: string
  }
  newsletter: {
    heading: string
    placeholder: string
    submitAria: string
    successNotice: string
    invalidNotice: string
  }
  footer: {
    emailLabel: string
    emailValue: string
    phoneLabel: string
    phoneValue: string
    socialHeading: string
    socials: Array<{ label: string; href: string; icon: 'facebook' | 'youtube' | 'x' | 'instagram' | 'tiktok' }>
    columns: FooterColumn[]
    localeLabel: string
    copyright: string
    paymentLabels: string[]
  }
  notFound: {
    heading: string
    body: string
    ctaLabel: string
  }
  errors: {
    configTitle: string
    missingProduct: string
  }
  stories: {
    heading: string
    items: Array<{ image: MediaImage; kicker: string; title: string; href: string }>
  }
  faq: {
    heading: string
    items: Array<{ label: string; body: string }>
  }
}

/* ---------------- root config ---------------- */

export interface SiteTheme {
  canvas: string
  ink: string
  muted: string
  line: string
  accent: string
  dark: string
  sale: string
}

export interface SiteConfig {
  /** BCP-47 locale, e.g. 'en-US'. Source of truth for all visible copy. */
  locale: string
  currency: string
  siteTitle: string
  siteDescription: string
  brandName: string
  theme: SiteTheme
  /** Countdown target: duration in ms from first visit. */
  countdownDurationMs: number
  collections: CollectionDef[]
  products: Product[]
  /** Section presence + order for the home page. */
  homeSectionOrder: HomeSectionId[]
  sections: HomeSections
  copy: InterfaceCopy
}
