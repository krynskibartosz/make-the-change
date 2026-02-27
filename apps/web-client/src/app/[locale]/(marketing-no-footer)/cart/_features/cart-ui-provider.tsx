'use client'

import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

type CartSnackbar = {
  id: string
  message: string
  actionLabel?: string
  onAction?: () => void
  durationMs?: number
}

type CartUIContextValue = {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  snackbar: CartSnackbar | null
  showSnackbar: (snackbar: Omit<CartSnackbar, 'id'>) => void
  dismissSnackbar: () => void
}

const CartUIContext = createContext<CartUIContextValue | null>(null)

let snackbarId = 0

export function CartUIProvider({ children }: PropsWithChildren) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<CartSnackbar | null>(null)
  const dismissTimerRef = useRef<number | null>(null)

  const dismissSnackbar = useCallback(() => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
    setSnackbar(null)
  }, [])

  const showSnackbar = useCallback((input: Omit<CartSnackbar, 'id'>) => {
    const id = String(++snackbarId)
    const next: CartSnackbar = {
      id,
      durationMs: input.durationMs ?? 5000,
      ...input,
    }

    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }

    setSnackbar(next)

    dismissTimerRef.current = window.setTimeout(() => {
      setSnackbar((prev) => (prev?.id === id ? null : prev))
      dismissTimerRef.current = null
    }, next.durationMs)
  }, [])

  const openCart = useCallback(() => {
    dismissSnackbar()
    setIsCartOpen(true)
  }, [dismissSnackbar])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const value = useMemo<CartUIContextValue>(
    () => ({
      isCartOpen,
      openCart,
      closeCart,
      snackbar,
      showSnackbar,
      dismissSnackbar,
    }),
    [isCartOpen, openCart, closeCart, snackbar, showSnackbar, dismissSnackbar],
  )

  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
}

export function useCartUI() {
  const value = useContext(CartUIContext)
  if (!value) throw new Error('useCartUI must be used within <CartUIProvider />')
  return value
}
