import { createContext } from 'react'

export interface ToastContextValue {
  notify: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
