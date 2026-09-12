import { useEffect, useState } from 'react'

export interface CountdownParts {
  days: number
  hours: number
  mins: number
  secs: number
  done: boolean
}

function toParts(ms: number): CountdownParts {
  let diff = Math.max(0, ms)
  const days = Math.floor(diff / 864e5)
  diff -= days * 864e5
  const hours = Math.floor(diff / 36e5)
  diff -= hours * 36e5
  const mins = Math.floor(diff / 6e4)
  diff -= mins * 6e4
  const secs = Math.floor(diff / 1e3)
  return { days, hours, mins, secs, done: ms <= 0 }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

const STORAGE_KEY = 'fashion-storefront-countdown-v1'

function readTarget(durationMs: number): number {
  const now = Date.now()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = Number(raw)
      if (Number.isFinite(saved) && saved > 0) return saved
    }
    const target = now + Math.max(0, durationMs)
    window.localStorage.setItem(STORAGE_KEY, String(target))
    return target
  } catch {
    return now + Math.max(0, durationMs)
  }
}

/**
 * Countdown of `durationMs` starting at first visit; the target persists
 * in localStorage so reloads continue the same countdown (never negative).
 */
export function useCountdown(durationMs: number): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => toParts(durationMs))

  useEffect(() => {
    const target = readTarget(durationMs)
    const tick = () => setParts(toParts(target - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [durationMs])

  return parts
}
