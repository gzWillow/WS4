import { useEffect, useRef } from 'react'

interface DrawerProps {
  id: string
  side: 'left' | 'right'
  open: boolean
  onClose: () => void
  label: string
  children: React.ReactNode
}

/**
 * Side drawer with dialog semantics: focus moves in on open,
 * Tab is contained, Escape handled by OverlayProvider.
 */
export function Drawer({ id, side, open, onClose, label, children }: DrawerProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open || !ref.current) return
    const node = ref.current
    const focusable = node.querySelector<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')
    focusable?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = node.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])')
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    node.addEventListener('keydown', onKeyDown)
    return () => node.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <aside
      id={id}
      ref={ref}
      className={`drawer drawer--${side}${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={!open}
    >
      {children}
      <span style={{ display: 'none' }}>
        <button onClick={onClose} tabIndex={-1} aria-hidden="true">
          关闭
        </button>
      </span>
    </aside>
  )
}
