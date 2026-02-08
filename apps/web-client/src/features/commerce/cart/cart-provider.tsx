'use client'

import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  CART_STORAGE_KEY,
  clampQuantity,
  clearCartStorage,
  loadCart,
  normalizeCartItems,
  saveCart,
} from './cart-store'
import type { CartItemSnapshot, CartProductSnapshot } from './cart-types'

type AddToCartInput = {
  productId: string
  quantity?: number
  snapshot: CartProductSnapshot
}

export type CartContextValue = {
  items: CartItemSnapshot[]
  hydrated: boolean
  addItem: (input: AddToCartInput) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  replaceItems: (nextItems: CartItemSnapshot[]) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: PropsWithChildren) {
  // Start "empty" on the server and during the initial client render to avoid
  // flashing an incorrect cart state (Doherty / perception of performance).
  const [items, setItems] = useState<CartItemSnapshot[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loaded = loadCart().items
    setItems((prev) => {
      // If the user interacted before hydration completed (very fast taps),
      // keep their changes and merge the persisted cart in.
      if (prev.length === 0) return loaded

      const next = [...prev]
      for (const loadedItem of loaded) {
        const index = next.findIndex((i) => i.productId === loadedItem.productId)
        if (index >= 0) {
          const existing = next[index]
          next[index] = {
            productId: existing.productId,
            quantity: clampQuantity(
              (existing.quantity || 0) + (loadedItem.quantity || 0),
              existing.snapshot.stockQuantity ?? loadedItem.snapshot.stockQuantity,
            ),
            snapshot: { ...loadedItem.snapshot, ...existing.snapshot },
          }
          continue
        }

        next.push(loadedItem)
      }

      return normalizeCartItems(next)
    })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveCart(items)
  }, [hydrated, items])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return
      setItems(loadCart().items)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback(({ productId, quantity = 1, snapshot }: AddToCartInput) => {
    setItems((prev) => {
      const next = [...prev]
      const existingIndex = next.findIndex((i) => i.productId === productId)
      if (existingIndex >= 0) {
        const existing = next[existingIndex]
        const mergedQty = clampQuantity(
          (existing.quantity || 0) + quantity,
          snapshot.stockQuantity ?? existing.snapshot.stockQuantity,
        )
        next[existingIndex] = {
          productId,
          quantity: mergedQty,
          snapshot: { ...existing.snapshot, ...snapshot },
        }
        return next
      }

      next.unshift({
        productId,
        quantity: clampQuantity(quantity, snapshot.stockQuantity),
        snapshot,
      })
      return next
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const next = [...prev]
      const index = next.findIndex((i) => i.productId === productId)
      if (index < 0) return prev

      const item = next[index]
      const qty = clampQuantity(quantity, item.snapshot.stockQuantity)
      next[index] = { ...item, quantity: qty }
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const replaceItems = useCallback((nextItems: CartItemSnapshot[]) => {
    setItems(normalizeCartItems(nextItems))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    clearCartStorage()
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      replaceItems,
      clear,
    }),
    [items, hydrated, addItem, setQuantity, removeItem, replaceItems, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
