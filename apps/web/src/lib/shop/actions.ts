'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string }

// Schemas
const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
})

const createInvestmentSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(['beehive', 'olive_tree', 'family_plot']),
  eurAmount: z.number().positive(),
  partner: z.enum(['habeebee', 'ilanga', 'promiel', 'multi']).default('habeebee'),
  bonusPercentage: z.number().min(0).max(100).default(30),
})

/**
 * Create a new order (protected)
 */
export async function createOrder(
  input: z.infer<typeof createOrderSchema>,
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const validated = createOrderSchema.parse(input)
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase.rpc('place_points_order', {
      p_order_data: {
        user_id: user.id,
        items: validated.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shipping_address: validated.shippingAddress,
      },
      p_payment_data: {},
    } as any)

    if (error) {
      const message = error.message || ''
      if (message.includes('UNAUTHENTICATED')) return { success: false, error: 'Unauthorized' }
      if (message.includes('CART_INVALID')) return { success: false, error: 'Invalid cart' }
      if (message.includes('OUT_OF_STOCK')) return { success: false, error: 'Out of stock' }
      if (message.includes('Insufficient points balance')) {
        return { success: false, error: 'Insufficient points' }
      }
      return { success: false, error: error.message }
    }

    const result = (data || {}) as Record<string, unknown>
    const orderId = typeof result.orderId === 'string' ? result.orderId : null
    if (!orderId) return { success: false, error: 'Invalid checkout response' }

    revalidatePath('/shop')
    revalidatePath('/profile/orders')
    return { success: true, data: { orderId } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error' }
    }
    const message = error instanceof Error ? error.message : 'Failed to create order'
    return { success: false, error: message }
  }
}

/**
 * Create an investment/adoption (protected)
 */
export async function createInvestment(
  input: z.infer<typeof createInvestmentSchema>,
): Promise<ActionResult<{ investmentId: string; pointsEarned: number; balanceAfter: number }>> {
  try {
    createInvestmentSchema.parse(input)
    return {
      success: false,
      error:
        "Investissement désactivé dans apps/web: le flux sécurisé exige un paiement Stripe et l'activation via webhook.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error' }
    }
    const message = error instanceof Error ? error.message : 'Failed to create investment'
    return { success: false, error: message }
  }
}
