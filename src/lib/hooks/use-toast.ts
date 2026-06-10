'use client'

import { useCallback, useState } from 'react'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastInput = Omit<Toast, 'id'>

// Singleton event emitter — fonctionne en dehors du contexte React
type Listener = (toast: Toast) => void
type DismissListener = (id: string) => void

const listeners: Listener[] = []
const dismissListeners: DismissListener[] = []

let counter = 0

export function toast(input: ToastInput) {
  const id = String(++counter)
  const newToast: Toast = { id, variant: 'info', ...input }
  for (const listener of listeners) listener(newToast)
  return id
}

export function dismissToast(id: string) {
  for (const listener of dismissListeners) listener(id)
}

export function useToastStore() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addListener = useCallback((listener: Listener) => {
    listeners.push(listener)
    return () => {
      const i = listeners.indexOf(listener)
      if (i !== -1) listeners.splice(i, 1)
    }
  }, [])

  const addDismissListener = useCallback((listener: DismissListener) => {
    dismissListeners.push(listener)
    return () => {
      const i = dismissListeners.indexOf(listener)
      if (i !== -1) dismissListeners.splice(i, 1)
    }
  }, [])

  return { toasts, setToasts, addListener, addDismissListener }
}
