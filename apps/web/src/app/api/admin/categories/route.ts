import { db } from '@make-the-change/core/db'
import { categories } from '@make-the-change/core/schema'
import { and, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const querySchema = z.object({
  activeOnly: z.enum(['true', 'false']).nullish(),
  parentId: z.string().uuid().nullish(),
})

export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const searchParams = request.nextUrl.searchParams
    const params = querySchema.parse({
      activeOnly: searchParams.get('activeOnly'),
      parentId: searchParams.get('parentId'),
    })

    const conditions = []
    if (params.activeOnly === 'true') {
      conditions.push(eq(categories.is_active, true))
    }
    if (params.parentId) {
      conditions.push(eq(categories.parent_id, params.parentId))
    }

    const rows = await db
      .select({
        id: categories.id,
        name: categories.name_default,
        slug: categories.slug,
        is_active: categories.is_active,
        parent_id: categories.parent_id,
        sort_order: categories.sort_order,
      })
      .from(categories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(categories.sort_order)

    return NextResponse.json({
      data: rows,
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
