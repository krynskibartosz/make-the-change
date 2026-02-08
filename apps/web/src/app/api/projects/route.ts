import { and, eq, ilike, isNull, lt, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  search: z.string().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  cursor: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
  minTier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
})

/**
 * GET /api/projects
 * Public projects list (only active projects)
 */
export async function GET(request: NextRequest) {
  try {
    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { projects } = await import('@make-the-change/core/schema')

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const input = querySchema.parse({
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || '24',
      cursor: searchParams.get('cursor') || undefined,
      featured: searchParams.get('featured') || undefined,
      minTier: searchParams.get('minTier') || undefined,
    })

    // Build conditions
    const conditions = [isNull(projects.deleted_at)]

    if (input.featured !== undefined) {
      conditions.push(eq(projects.featured, input.featured))
    }
    if (input.search) {
      const searchPattern = `%${input.search}%`
      conditions.push(ilike(projects.name_default, searchPattern))
    }
    if (input.cursor) {
      conditions.push(lt(projects.id, input.cursor))
    }

    // Execute query
    const data = await db
      .select({
        id: projects.id,
        type: projects.type,
        slug: projects.slug,
        location: projects.location,
        producer_id: projects.producer_id,
        target_budget: projects.target_budget,
        current_funding: projects.current_funding,
        launch_date: projects.launch_date,
        maturity_date: projects.maturity_date,
        certification_labels: projects.certification_labels,
        impact_metrics: projects.impact_metrics,
        metadata: projects.metadata,
        seo_title: projects.seo_title,
        seo_description: projects.seo_description,
        featured: projects.featured,
        species_id: projects.species_id,
        status: projects.status,
        name_i18n: projects.name_i18n,
        description_i18n: projects.description_i18n,
        long_description_i18n: projects.long_description_i18n,
        name_default: projects.name_default,
        description_default: projects.description_default,
        funding_progress: projects.funding_progress,
        address_street: projects.address_street,
        address_city: projects.address_city,
        address_postal_code: projects.address_postal_code,
        address_country_code: projects.address_country_code,
        address_region: projects.address_region,
        address_coordinates: projects.address_coordinates,
        hero_image_url: projects.hero_image_url,
        avatar_image_url: projects.avatar_image_url,
        gallery_image_urls: projects.gallery_image_urls,
        long_description_default: projects.long_description_default,
        created_at: projects.created_at,
        updated_at: projects.updated_at,
      })
      .from(projects)
      .where(and(...conditions))
      .orderBy(sql`${projects.created_at} DESC`)
      .limit(input.limit)

    return NextResponse.json({
      items: data,
      nextCursor: data?.at(-1)?.id ?? null,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
