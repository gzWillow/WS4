import { Link } from 'react-router'
import { siteConfig } from '../config'

export function NotFoundPage() {
  const copy = siteConfig.copy.notFound
  return (
    <main className="page-head container" id="main" style={{ textAlign: 'center', paddingBottom: 120 }}>
      <h1>{copy.heading}</h1>
      <p style={{ margin: '18px 0 28px', color: 'var(--muted)' }}>{copy.body}</p>
      <Link className="btn" to="/">
        {copy.ctaLabel}
      </Link>
    </main>
  )
}
