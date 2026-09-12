const cache = new Map<string, Intl.NumberFormat>()

export function formatMoney(minor: number, currency: string, locale: string): string {
  const key = `${currency}__${locale}`
  let fmt = cache.get(key)
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: 'currency', currency })
    cache.set(key, fmt)
  }
  return fmt.format(minor / 100)
}

/** 应援站内容全部免费：priceMinor 为 0 时显示「免费」 */
export function formatPrice(minor: number, currency: string, locale: string): string {
  return minor === 0 ? '免费' : formatMoney(minor, currency, locale)
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const isKebab = (v: string) => KEBAB.test(v)
