import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { CartProvider } from './cart/CartProvider'
import { AnnouncementBar } from './components/AnnouncementBar'
import { CartDrawer } from './components/CartDrawer'
import { MetadataSync } from './components/MetadataSync'
import { MobileMenu } from './components/MobileMenu'
import { OverlayProvider } from './components/OverlayProvider'
import { QuickViewProvider } from './components/QuickView'
import { SearchOverlay } from './components/SearchOverlay'
import { useOverlay } from './components/useOverlay'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { ToastProvider } from './components/Toast'
import { siteConfig } from './config'
import { useScrollReveal } from './hooks/useScrollReveal'
import { validateConfig } from './lib/validateConfig'
import { CollectionPage } from './pages/CollectionPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { UploadPage } from './pages/UploadPage'
import { UploadFab } from './components/UploadFab'

function NavigationEffects() {
  const { pathname, hash } = useLocation()
  const { closeOverlay } = useOverlay()

  useEffect(() => {
    const root = document.documentElement
    const themeEntries: Array<[string, string]> = [
      ['--canvas', siteConfig.theme.canvas],
      ['--ink', siteConfig.theme.ink],
      ['--muted', siteConfig.theme.muted],
      ['--line', siteConfig.theme.line],
      ['--accent', siteConfig.theme.accent],
      ['--dark', siteConfig.theme.dark],
      ['--sale', siteConfig.theme.sale],
    ]
    const previous = themeEntries.map(([name]) => [name, root.style.getPropertyValue(name)] as const)
    themeEntries.forEach(([name, value]) => root.style.setProperty(name, value))
    return () =>
      previous.forEach(([name, value]) =>
        value ? root.style.setProperty(name, value) : root.style.removeProperty(name),
      )
  }, [])

  useEffect(() => {
    closeOverlay()
    if (hash) {
      const frame = window.requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      )
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, pathname])

  return null
}

function ConfigError() {
  const issues = validateConfig(siteConfig)
  if (issues.length === 0) return null
  return (
    <main className="config-error" role="alert">
      <h1>{siteConfig.copy.errors.configTitle}</h1>
      <ul>
        {issues.map((issue, i) => (
          <li key={i}>
            <code>{issue.path}</code> — {issue.message}
          </li>
        ))}
      </ul>
    </main>
  )
}

function Shell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  useScrollReveal()
  return (
    <>
      <NavigationEffects />
      <MetadataSync />
      <a className="skip-link" href="#main">
        {siteConfig.copy.skipLink}
      </a>
      <AnnouncementBar />
      <SiteHeader variant={isHome ? 'overlay' : 'solid'} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
      <UploadFab />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <div
        className="overlay-backdrop"
        aria-hidden="true"
        onClick={useOverlay().closeOverlay}
        data-open={useOverlay().open !== null || undefined}
      />
    </>
  )
}

export default function App() {
  const hasErrors = validateConfig(siteConfig).length > 0
  if (hasErrors) return <ConfigError />
  return (
    <ToastProvider>
      <CartProvider>
        <OverlayProvider>
          <QuickViewProvider>
            <Shell />
          </QuickViewProvider>
        </OverlayProvider>
      </CartProvider>
    </ToastProvider>
  )
}
