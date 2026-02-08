import { db } from '@make-the-change/core/db'
import { subscriptions } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const updateSchema = z.object({
  plan_type: z
    .enum(['monthly_standard', 'monthly_premium', 'annual_standard', 'annual_premium'])
    .optional(),
  billing_frequency: z.enum(['monthly', 'annual']).optional(),
  monthly_points_allocation: z.coerce.number().int().nonnegative().optional(),
  monthly_price: z.coerce.number().nonnegative().optional(),
  annual_price: z.coerce.number().nonnegative().optional(),
  bonus_percentage: z.coerce.number().min(0).max(100).optional(),
  status: z
    .enum([
      'active',
      'inactive',
      'cancelled',
      'past_due',
      'unpaid',
      'trialing',
      'expired',
      'incomplete',
      'paused',
    ])
    .optional(),
  cancel_at_period_end: z.boolean().optional(),
  stripe_customer_id: z.string().min(1).optional(),
  stripe_subscription_id: z.string().optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .limit(1)

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json(subscription)
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
    updatePayload.updated_at = new Date()

    const [updated] = await db
      .update(subscriptions)
      .set(updatePayload)
      .where(eq(subscriptions.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
