'use client'

import { useContext, useMemo } from 'react'
import { CartContext } from './cart-provider'

export function useCart() {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used within <CartProvider />')
  }
  return value
}

export function useCartTotals() {
  const { items } = useCart()

  return useMemo(() => {
    const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const totalPoints = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.snapshot.pricePoints || 0),
      0,
    )
    const totalEuros = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.snapshot.priceEuros || 0),
      0,
    )

    return {
      itemsCount,
      totalPoints: Math.max(0, Math.round(totalPoints)),
      totalEuros: Math.max(0, totalEuros),
    }
  }, [items])
}
