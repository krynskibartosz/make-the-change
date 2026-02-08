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

const PlacePointsOrderSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1),
  shippingAddress: ShippingAddressSchema,
})

export type PlacePointsOrderInput = z.infer<typeof PlacePointsOrderSchema>

export type PlacePointsOrderResult =
  | { orderId: string }
  | {
      errorCode:
        | 'UNAUTHENTICATED'
        | 'CART_INVALID'
        | 'OUT_OF_STOCK'
        | 'INSUFFICIENT_POINTS'
        | 'UNKNOWN'
      message: string
    }

export async function placePointsOrderAction(
  input: PlacePointsOrderInput,
): Promise<PlacePointsOrderResult> {
  const parsed = PlacePointsOrderSchema.safeParse(input)
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

  const { data, error } = await supabase.rpc('place_points_order', {
    p_order_data: {
      user_id: user.id,
      items: parsed.data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shipping_address: parsed.data.shippingAddress,
    },
    p_payment_data: {},
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
    if (message.includes('Insufficient points balance')) {
      return { errorCode: 'INSUFFICIENT_POINTS', message: 'Points insuffisants.' }
    }
    console.error('[checkout] place_points_order failed', error)
    return { errorCode: 'UNKNOWN', message: 'Impossible de créer la commande.' }
  }

  const result = (data || {}) as Record<string, unknown>
  const orderId = typeof result.orderId === 'string' ? result.orderId : null
  if (!orderId) {
    console.error('[checkout] place_points_order returned invalid payload', result)
    return { errorCode: 'UNKNOWN', message: 'Impossible de créer la commande.' }
  }

  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/points')

  return { orderId }
}
