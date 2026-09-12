import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ToastContext } from './ToastContext'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const notify = useCallback((msg: string) => {
    setMessage(msg)
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setMessage(null), 2400)
  }, [])

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className={`toast${message ? ' is-show' : ''}`} role="status" aria-live="polite">
        {message}
      </div>
    </ToastContext.Provider>
  )
}
