import { and, eq, isNull } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ slug: string }> }

/**
 * GET /api/products/[slug]
 * Public product detail by slug
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    // Dynamic imports to avoid circular dependency
    const { db } = await import('@/lib/db')
    const { products } = await import('@make-the-change/core/schema')

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
      .where(
        and(eq(products.slug, slug), eq(products.is_active, true), isNull(products.deleted_at)),
      )
      .limit(1)

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ data: data[0] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
