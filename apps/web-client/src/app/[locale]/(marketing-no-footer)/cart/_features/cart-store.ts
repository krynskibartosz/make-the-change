'use client'

import { z } from 'zod'
import type { CartItemSnapshot, PersistedCart } from './cart-types'

export const CART_STORAGE_KEY = 'mtc:cart:v1'

const SnapshotSchema = z.object({
  name: z.string().catch(''),
  slug: z.string().catch(''),
  pricePoints: z.number().int().nonnegative().catch(0),
  priceEuros: z.number().nonnegative().optional(),
  imageUrl: z.string().nullable().catch(null),
  fulfillmentMethod: z.string().nullable().optional(),
  stockQuantity: z.number().int().nonnegative().nullable().optional(),
})

const CartItemSchema = z.object({
  productId: z.string().uuid().catch(''),
  quantity: z.number().int().catch(1),
  snapshot: SnapshotSchema,
})

const PersistedCartSchema = z.object({
  version: z.literal(1),
  items: z.array(CartItemSchema).catch([]),
  updatedAt: z.string().catch(() => new Date().toISOString()),
})

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const clampQuantity = (quantity: number, stockQuantity?: number | null) => {
  const safe = clamp(Number.isFinite(quantity) ? Math.floor(quantity) : 1, 1, 20)
  if (stockQuantity === null || stockQuantity === undefined) return safe
  return clamp(safe, 1, Math.max(1, stockQuantity))
}

export const normalizeCartItems = (items: CartItemSnapshot[]): CartItemSnapshot[] => {
  const normalized: CartItemSnapshot[] = []

  for (const raw of items) {
    if (!raw?.productId) continue
    const parsed = CartItemSchema.safeParse(raw)
    if (!parsed.success) continue
    if (!parsed.data.productId) continue

    const qty = clampQuantity(parsed.data.quantity, parsed.data.snapshot.stockQuantity)
    normalized.push({
      productId: parsed.data.productId,
      quantity: qty,
      snapshot: {
        ...parsed.data.snapshot,
        pricePoints: Math.max(0, Math.round(parsed.data.snapshot.pricePoints)),
        priceEuros: parsed.data.snapshot.priceEuros ? Math.max(0, parsed.data.snapshot.priceEuros) : undefined,
      },
    })
  }

  return normalized
}

export const loadCart = (): PersistedCart => {
  if (typeof window === 'undefined') {
    return { version: 1, items: [], updatedAt: new Date().toISOString() }
  }

  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!value) return { version: 1, items: [], updatedAt: new Date().toISOString() }

    const parsed = PersistedCartSchema.safeParse(JSON.parse(value))
    if (!parsed.success) return { version: 1, items: [], updatedAt: new Date().toISOString() }

    return {
      version: 1,
      items: normalizeCartItems(parsed.data.items),
      updatedAt: parsed.data.updatedAt,
    }
  } catch {
    return { version: 1, items: [], updatedAt: new Date().toISOString() }
  }
}

export const saveCart = (items: CartItemSnapshot[]) => {
  if (typeof window === 'undefined') return

  const payload: PersistedCart = {
    version: 1,
    items: normalizeCartItems(items),
    updatedAt: new Date().toISOString(),
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // best-effort (private mode, quota, etc.)
  }
}

export const clearCartStorage = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // ignore
  }
}
