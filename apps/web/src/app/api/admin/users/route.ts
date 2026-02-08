import { db } from '@make-the-change/core/db'
import { profiles } from '@make-the-change/core/schema'
import { and, desc, ilike, lt, or } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const querySchema = z.object({
  q: z.string().nullish(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().uuid().nullish(),
})

export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const searchParams = request.nextUrl.searchParams
    const params = querySchema.parse({
      q: searchParams.get('q'),
      limit: searchParams.get('limit') || '20',
      cursor: searchParams.get('cursor'),
    })

    const conditions = []

    if (params.q) {
      const searchLower = `%${params.q.toLowerCase()}%`
      conditions.push(
        or(
          ilike(profiles.email, searchLower),
          ilike(profiles.first_name, searchLower),
          ilike(profiles.last_name, searchLower),
        ),
      )
    }

    if (params.cursor) {
      conditions.push(lt(profiles.id, params.cursor))
    }

    const users = await db
      .select()
      .from(profiles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(profiles.created_at))
      .limit(params.limit)

    return NextResponse.json({
      items: users,
      nextCursor: users && users.length === params.limit ? (users.at(-1)?.id ?? null) : null,
    })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
