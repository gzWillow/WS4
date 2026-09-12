import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { siteConfig } from '../config'

const ROUTE_TITLES: Array<[RegExp, string]> = [
  [/^\/$/, ''],
  [/^\/collection/, ` — ${siteConfig.copy.collection.title}`],
  [/^\/product\//, ' — Product'],
]

/** Keeps runtime metadata (lang, title, description) in sync with config + route. */
export function MetadataSync() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.lang = siteConfig.locale
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = siteConfig.siteDescription
  }, [])

  useEffect(() => {
    const suffix = ROUTE_TITLES.find(([re]) => re.test(pathname))?.[1] ?? ''
    document.title = `${siteConfig.siteTitle}${suffix}`
  }, [pathname])

  return null
}
