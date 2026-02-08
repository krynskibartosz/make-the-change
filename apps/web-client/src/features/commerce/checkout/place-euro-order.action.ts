'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const OrderItemInputSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
})

const ShippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
})

const PlaceEuroOrderSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1),
  shippingAddress: ShippingAddressSchema,
})

export type PlaceEuroOrderInput = z.infer<typeof PlaceEuroOrderSchema>

export type PlaceEuroOrderResult =
  | { orderId: string }
  | {
      errorCode:
        | 'UNAUTHENTICATED'
        | 'CART_INVALID'
        | 'OUT_OF_STOCK'
        | 'UNKNOWN'
      message: string
    }

export async function placeEuroOrderAction(
  input: PlaceEuroOrderInput,
): Promise<PlaceEuroOrderResult> {
  const parsed = PlaceEuroOrderSchema.safeParse(input)
  if (!parsed.success) {
    return { errorCode: 'CART_INVALID', message: 'Panier invalide.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errorCode: 'UNAUTHENTICATED', message: 'Vous devez être connecté.' }
  }

  const { data, error } = await supabase.rpc('place_euro_order', {
    p_order_data: {
      user_id: user.id,
      items: parsed.data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shipping_address: parsed.data.shippingAddress,
    },
  })

  if (error) {
    const message = error.message || ''
    if (message.includes('UNAUTHENTICATED')) {
      return { errorCode: 'UNAUTHENTICATED', message: 'Vous devez être connecté.' }
    }
    if (message.includes('CART_INVALID')) {
      return { errorCode: 'CART_INVALID', message: 'Panier invalide.' }
    }
    if (message.includes('OUT_OF_STOCK')) {
      return { errorCode: 'OUT_OF_STOCK', message: 'Stock insuffisant pour un produit.' }
    }
    console.error('[checkout] place_euro_order failed', error)
    return { errorCode: 'UNKNOWN', message: message || 'Impossible de créer la commande.' }
  }

  const result = (data || {}) as Record<string, unknown>
  const orderId = typeof result.order_id === 'string' ? result.order_id : null
  if (!orderId) {
    console.error('[checkout] place_euro_order returned invalid payload', result)
    return { errorCode: 'UNKNOWN', message: 'Impossible de créer la commande.' }
  }

  revalidatePath('/dashboard/orders')

  return { orderId }
}
