# Fashion Storefront

A conversion-led, config-driven fashion storefront built with React and Vite.

Standard customization requires editing only the typed configuration in `src/config.ts`; the engine components do not need to change.

## Run Locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build      # tsc -b && vite build
npm run preview
```

Quality gates:

```bash
npm run lint       # eslint
npm run check      # tsc -b (typecheck)
npm test           # vitest run: config validation and cart reducer unit tests
npm run test:e2e   # browser acceptance matrix; skips automatically when Chromium is unavailable
```

`test:e2e` runs against the development server or preview server. It uses `http://localhost:3000` by default; override it with `BASE_URL`.
The 26 assertions cover desktop and mobile viewports, keyboard operation, reduced motion, broken-image fallbacks, cart persistence and corruption recovery, category filtering and sorting, product variants, sold-out states, missing products, unknown routes, countdown behavior, and the hero effects layer.

## Features

- Sixteen sortable and optional home-page sections, including a hero carousel, marquee, featured carousel, three-column layout, oversized scrolling text, parallax editorial area, lookbook, lounge, and testimonials
- Signature hero effects layer with 2D canvas light particles, satin light, and pointer parallax; disable it with `sections.hero.effects.enabled`, while reduced-motion mode renders a static frame
- Product catalog with category-chip filtering, sorting, incremental loading, and promotion filtering through `?sale=1`
- Product detail page with thumbnail gallery, color-specific images through `colorImages`, swatches, sizes, quantities, sold-out states, accordions, countdown, and recommendations
- End-to-end swatch interaction across cards, product pages, and quick view, including variant-aware add-to-cart behavior through `useColorSelection`
- Quick-view drawer and full-screen search overlay backed by real local catalog filtering
- Cart persistence and corruption recovery through `localStorage`; checkout remains a demo boundary
- Masthead navigation with a left-aligned brand, centered index navigation, desktop hover/focus panels, Escape handling, and a mobile accordion drawer with contact details
- Hero entrance, scroll reveals, season and promotion parallax, and drag-snapping carousels, all with reduced-motion fallbacks and cleanup
- Countdown target created on first visit and persisted through `localStorage` across page reloads

## Structure

```text
src/
├── config.ts             # Primary file for standard customization; typed configuration
├── types.ts              # TypeScript configuration schema
├── lib/validateConfig.ts # Runtime validation with visible pre-render errors
├── cart/                 # Demo cart persisted through localStorage
├── components/           # Header, footer, drawers, quick view, search, toast, safe image, and more
├── sections/             # Sixteen sortable home-page sections
├── pages/                # Home, Collection, Product, and NotFound
├── hooks/                # Countdown, reduced motion, parallax, hero effects, carousel, color selection, and scroll reveal
└── styles/               # Base, header, products, sections, footer, and responsive styles
public/
└── fonts/                # SIL OFL license files for the site's font families
tests/
├── validateConfig.test.ts / cartReducer.test.ts
└── e2e/matrix.mjs        # Browser acceptance matrix with 26 assertions
```

## Demo Boundaries

- The cart persists only in browser `localStorage`. Checkout, buy-it-now, account, and newsletter actions display demo feedback and do not use a server or leave the site.
- Search filters the local `products` catalog on the client. It does not use or imitate a server-side index.
