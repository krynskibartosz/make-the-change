import { and, eq, gte, ilike, isNull, lt, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  categoryId: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
  minTier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
  search: z.string().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  cursor: z.string().uuid().optional(),
})

/**
 * GET /api/products
 * Public products list (only active products)
 */
export async function GET(request: NextRequest) {
  try {
    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { products } = await import('@make-the-change/core/schema')

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const input = querySchema.parse({
      categoryId: searchParams.get('categoryId') || undefined,
      featured: searchParams.get('featured') || undefined,
      minTier: searchParams.get('minTier') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || '24',
      cursor: searchParams.get('cursor') || undefined,
    })

    // Build conditions
    const conditions = [eq(products.is_active, true), isNull(products.deleted_at)]

    if (input.categoryId) {
      conditions.push(eq(products.category_id, input.categoryId))
    }
    if (input.featured !== undefined) {
      conditions.push(eq(products.featured, input.featured))
    }
    if (input.minTier) {
      conditions.push(gte(products.min_tier, input.minTier))
    }
    if (input.search) {
      const searchPattern = `%${input.search}%`
      // Recherche simple sur le nom uniquement pour éviter les problèmes de type
      conditions.push(ilike(products.name_default, searchPattern))
    }
    if (input.cursor) {
      conditions.push(lt(products.id, input.cursor))
    }

    // Execute query
    const data = await db
      .select({
        id: products.id,
        slug: products.slug,
        category_id: products.category_id,
        producer_id: products.producer_id,
        price_points: products.price_points,
        price_eur_equivalent: products.price_eur_equivalent,
        fulfillment_method: products.fulfillment_method,
        is_hero_product: products.is_hero_product,
        stock_quantity: products.stock_quantity,
        stock_management: products.stock_management,
        weight_grams: products.weight_grams,
        dimensions: products.dimensions,
        tags: products.tags,
        variants: products.variants,
        nutrition_facts: products.nutrition_facts,
        allergens: products.allergens,
        certifications: products.certifications,
        seasonal_availability: products.seasonal_availability,
        min_tier: products.min_tier,
        featured: products.featured,
        launch_date: products.launch_date,
        discontinue_date: products.discontinue_date,
        seo_title: products.seo_title,
        seo_description: products.seo_description,
        name_i18n: products.name_i18n,
        description_i18n: products.description_i18n,
        short_description_i18n: products.short_description_i18n,
        name_default: products.name_default,
        description_default: products.description_default,
        short_description_default: products.short_description_default,
        origin_country: products.origin_country,
        created_at: products.created_at,
        updated_at: products.updated_at,
      })
      .from(products)
      .where(and(...conditions))
      .orderBy(sql`${products.created_at} DESC`)
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
