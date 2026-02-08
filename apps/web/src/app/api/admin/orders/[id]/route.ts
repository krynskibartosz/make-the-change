import { db } from '@make-the-change/core/db'
import { orders } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const updateSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'in_transit', 'completed', 'closed']).optional(),
  shipping_address: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const body = await request.json()
    const validData = updateSchema.parse(body)

    const updatePayload: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(validData)) {
      if (value !== undefined) updatePayload[key] = value
    }

    const [updated] = await db
      .update(orders)
      .set(updatePayload)
      .where(eq(orders.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
