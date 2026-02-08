import { inArray } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const quoteSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(999),
      }),
    )
    .min(1),
})

/**
 * POST /api/pricing/quote
 * Get price quote for cart items
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = quoteSchema.parse(body)

    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { products } = await import('@make-the-change/core/schema')

    // Get product prices
    const productIds = input.items.map((i) => i.productId)
    const productsData = await db
      .select({
        id: products.id,
        price_points: products.price_points,
      })
      .from(products)
      .where(inArray(products.id, productIds))

    const priceMap = new Map(productsData?.map((p) => [p.id, p.price_points]) || [])
    let subtotal = 0
    const lineItems = input.items.map((i) => {
      const unit = Number(priceMap.get(i.productId) ?? 0)
      const total = unit * i.quantity
      subtotal += total
      return {
        productId: i.productId,
        quantity: i.quantity,
        unitPricePoints: unit,
        totalPricePoints: total,
      }
    })

    const shipping = 0
    const taxes = 0
    const total = subtotal + shipping + taxes

    return NextResponse.json({
      lineItems,
      subtotalPoints: subtotal,
      shippingPoints: shipping,
      taxPoints: taxes,
      totalPoints: total,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
