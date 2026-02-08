import { and, asc, eq, gt, or, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'
import { partnerFormSchema } from '@/lib/validators/partner'

const querySchema = z.object({
  q: z.string().nullish(),
  status: z.string().nullish(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().uuid().nullish(),
})

/**
 * GET /api/admin/partners — uses Drizzle (same source of truth as core schema).
 * @see docs/03-technical/drizzle-supabase-alignment.md
 */
export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { producers } = await import('@make-the-change/core/schema')

    const searchParams = request.nextUrl.searchParams
    const params = querySchema.parse({
      q: searchParams.get('q'),
      status: searchParams.get('status'),
      limit: searchParams.get('limit') || '20',
      cursor: searchParams.get('cursor'),
    })

    const conditions = []
    if (params.q) {
      const pattern = `%${params.q}%`
      conditions.push(
        or(
          sql`${producers.name_default} ILIKE ${pattern}`,
          sql`${producers.contact_email} ILIKE ${pattern}`,
        ),
      )
    }
    if (params.status) {
      conditions.push(eq(producers.status, params.status as any))
    }
    if (params.cursor) {
      conditions.push(gt(producers.id, params.cursor))
    }

    const rows = await db
      .select()
      .from(producers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(producers.name_default))
      .limit(params.limit)

    const partners = rows.map((p) => ({
      id: p.id,
      name: p.name_default,
      slug: p.slug,
      email: p.contact_email,
      contact_email: p.contact_email,
      contact_website: p.contact_website,
      status: p.status || 'pending',
      created_at: p.created_at,
    }))

    return NextResponse.json({
      items: partners,
      total: partners.length,
    })
  } catch (error) {
    console.error('Partners API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const body = await request.json()
    const parsed = partnerFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { producers } = await import('@make-the-change/core/schema')

    const payload = parsed.data

    try {
      const [partner] = await db
        .insert(producers)
        .values({
          name_default: payload.name,
          slug: payload.slug,
          description_default: payload.description || null,
          contact_website: payload.contact_website || null,
          contact_email: payload.contact_email || null,
          status: payload.status,
        } as any)
        .returning()

      if (!partner) {
        return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 })
      }

      const response = {
        id: partner.id,
        name: partner.name_default,
        description: partner.description_default || '',
        slug: partner.slug,
        contact_website: partner.contact_website || '',
        contact_email: partner.contact_email || '',
        status: partner.status || 'pending',
        created_at: partner.created_at,
      }

      return NextResponse.json(response)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Database error' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Partner create error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
