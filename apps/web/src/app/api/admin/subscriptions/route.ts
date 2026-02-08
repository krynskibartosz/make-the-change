import { db } from '@make-the-change/core/db'
import { subscriptions } from '@make-the-change/core/schema'
import { and, desc, eq, lt } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const querySchema = z.object({
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
    .nullish(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().uuid().nullish(),
})

export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const searchParams = request.nextUrl.searchParams
    const params = querySchema.parse({
      status: searchParams.get('status'),
      limit: searchParams.get('limit') || '20',
      cursor: searchParams.get('cursor'),
    })

    const conditions = []
    if (params.status) {
      conditions.push(eq(subscriptions.status, params.status))
    }
    if (params.cursor) {
      conditions.push(lt(subscriptions.id, params.cursor))
    }

    const items = await db
      .select()
      .from(subscriptions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(subscriptions.created_at))
      .limit(params.limit)

    return NextResponse.json({
      items,
      nextCursor: items && items.length === params.limit ? (items.at(-1)?.id ?? null) : null,
    })
  } catch (error) {
    console.error('Subscriptions API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
