import { db } from '@make-the-change/core/db'
import { projects } from '@make-the-change/core/schema'
import { and, desc, eq, ilike, lt, or } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const querySchema = z.object({
  search: z.string().nullish(),
  status: z.enum(['draft', 'active', 'funded', 'completed', 'archived']).nullish(),
  type: z.enum(['beehive', 'olive_tree', 'vineyard']).nullish(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().uuid().nullish(),
})

export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const searchParams = request.nextUrl.searchParams
    const params = querySchema.parse({
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      type: searchParams.get('type'),
      limit: searchParams.get('limit') || '20',
      cursor: searchParams.get('cursor'),
    })

    const conditions = []
    if (params.search) {
      const searchLower = `%${params.search.toLowerCase()}%`
      conditions.push(
        or(
          ilike(projects.name_default, searchLower),
          ilike(projects.description_default, searchLower),
        ),
      )
    }
    if (params.status) {
      conditions.push(eq(projects.status, params.status))
    }
    if (params.type) {
      conditions.push(eq(projects.type, params.type))
    }
    if (params.cursor) {
      conditions.push(lt(projects.id, params.cursor))
    }

    const items = await db
      .select()
      .from(projects)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(projects.created_at))
      .limit(params.limit)

    return NextResponse.json({
      items,
      nextCursor: items && items.length === params.limit ? (items.at(-1)?.id ?? null) : null,
    })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
