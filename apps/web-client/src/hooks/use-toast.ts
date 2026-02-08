'use client'

import { type ReactNode, useCallback, useState } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success'

export type ToastData = {
  id: string
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
}

type ToastState = {
  toasts: ToastData[]
}

let toastId = 0

/**
 * Simple toast hook for notifications
 * Uses a basic implementation - can be enhanced with @base-ui/react/toast for production
 */
export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback((input: Omit<ToastData, 'id'>) => {
    const id = String(++toastId)
    const newToast: ToastData = { ...input, id }

    setState((prev) => ({
      toasts: [...prev.toasts, newToast],
    }))

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)

    return {
      id,
      dismiss: () => {
        setState((prev) => ({
          toasts: prev.toasts.filter((t) => t.id !== id),
        }))
      },
    }
  }, [])

  const dismiss = useCallback((toastIdToDismiss?: string) => {
    setState((prev) => ({
      toasts: toastIdToDismiss ? prev.toasts.filter((t) => t.id !== toastIdToDismiss) : [],
    }))
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss,
  }
}
