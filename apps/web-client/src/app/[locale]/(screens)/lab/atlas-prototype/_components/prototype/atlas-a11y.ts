import * as React from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  )
}

export function getSvgButtonProps(label: string, onActivate?: () => void) {
  const activate = () => {
    onActivate?.()
  }

  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    onClick: activate,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      activate()
    },
  }
}

export function useDialogFocus(open: boolean, onClose: () => void) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null)
  const lastFocusedRef = React.useRef<HTMLElement | null>(null)
  const onCloseRef = React.useRef(onClose)

  React.useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  React.useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    window.requestAnimationFrame(() => {
      const focusables = getFocusableElements(dialog)
      ;(focusables[0] ?? dialog)?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = getFocusableElements(dialog)
      if (focusables.length === 0) {
        event.preventDefault()
        dialog?.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusedRef.current?.focus()
      lastFocusedRef.current = null
    }
  }, [open])

  return dialogRef
}
