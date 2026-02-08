import { and, desc, eq, lt } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const querySchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'in_transit', 'completed', 'closed']).nullish(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().uuid().nullish(),
})

export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { orders, profiles, orderItems } = await import('@make-the-change/core/schema')

    const searchParams = request.nextUrl.searchParams
    const params = querySchema.parse({
      status: searchParams.get('status'),
      limit: searchParams.get('limit') || '20',
      cursor: searchParams.get('cursor'),
    })

    // Build conditions
    const conditions = []
    if (params.status) {
      conditions.push(eq(orders.status, params.status))
    }
    if (params.cursor) {
      conditions.push(lt(orders.id, params.cursor))
    }

    // Get orders
    const ordersData = await db
      .select()
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.created_at))
      .limit(params.limit)

    // Get customer profiles and order items for each order
    const transformed = await Promise.all(
      ordersData.map(async (order) => {
        // Get customer profile
        const customerProfile = order.user_id
          ? await db.select().from(profiles).where(eq(profiles.id, order.user_id)).limit(1)
          : []

        // Get order items
        const items = await db.select().from(orderItems).where(eq(orderItems.order_id, order.id))

        const customer = customerProfile[0]

        return {
          id: order.id,
          status: order.status,
          createdAt: order.created_at,
          total: order.total_points,
          customerName: customer
            ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email
            : 'Unknown',
          items,
          user: customer,
        }
      }),
    )

    return NextResponse.json({
      items: transformed,
      nextCursor: transformed.length === params.limit ? transformed.at(-1)?.id : null,
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
