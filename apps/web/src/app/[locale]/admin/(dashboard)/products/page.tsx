/**
 * Admin Products Page - React Server Component
 * Direct DB access, passes data to client for interactivity
 */

import { db } from '@make-the-change/core/db'
import { categories, producers, products } from '@make-the-change/core/schema'
import { and, arrayOverlaps, asc, count, desc, eq, ilike, or, asc as orderAsc } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import type { Product } from '@/lib/types/product'
import { PAGE_SIZE } from './constants'
import { ProductsClient } from './products-client'

type ProducerRow = Pick<typeof producers.$inferSelect, 'id' | 'name_default'>
type CategoryRow = Pick<typeof categories.$inferSelect, 'id' | 'name_default' | 'parent_id'>
type TagsRow = { tags: string[] | null }

type SearchParams = {
  q?: string
  category?: string
  producer?: string
  sort?: string
  page?: string
  tags?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.products',
  })
  const { page } = await props.searchParams
  const pageNumber = Number(page && page !== 'undefined' ? page : 1)

  return {
    title: `${t('title')} ${pageNumber > 1 ? `(Page ${pageNumber})` : ''} | Admin`,
  }
}

export default async function ProductsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await props.searchParams
  const {
    q,
    category: categoryFilter,
    producer: producerFilter,
    sort,
    page,
    tags: tagsFilter,
  } = searchParams

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build Filter Conditions
  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(products.name_default, searchLower),
        ilike(products.description_default, searchLower),
        ilike(products.slug, searchLower),
      ),
    )
  }

  if (categoryFilter && categoryFilter !== 'all') {
    conditions.push(eq(products.category_id, categoryFilter))
  }

  if (producerFilter && producerFilter !== 'all') {
    conditions.push(eq(products.producer_id, producerFilter))
  }

  if (tagsFilter) {
    const tagsArray = tagsFilter.split(',').filter(Boolean)
    if (tagsArray.length > 0) {
      conditions.push(arrayOverlaps(products.tags, tagsArray))
    }
  }

  // Handle Sort
  let orderBy = desc(products.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = orderAsc(products.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(products.created_at)
        break
      case 'name_asc':
        orderBy = orderAsc(products.name_default)
        break
      case 'name_desc':
        orderBy = desc(products.name_default)
        break
      case 'price_asc':
        orderBy = orderAsc(products.price_points)
        break
      case 'price_desc':
        orderBy = desc(products.price_points)
        break
      case 'featured_first':
        // Complex sort not fully supported in simple switch, defaulting to createdAt
        // or could rely on raw sql if needed: sql`featured DESC, created_at DESC`
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute Queries
  type ProductDbRow = typeof products.$inferSelect

  let productsList: Product[] = []
  let totalResult: { count: number }[] = []
  let producerRows: ProducerRow[] = []
  let categoryRows: CategoryRow[] = []
  let tagRows: TagsRow[] = []

  try {
    const [productsResult, countResult, producersResult, categoriesResult, tagsResult] = await Promise.all([
      // 1. Products (Paginated & Filtered with Relations)
      db.query.products.findMany({
        where: whereClause,
        orderBy: orderBy,
        limit: PAGE_SIZE,
        offset: offset,
        columns: {
          // Include all standard columns plus images
          id: true,
          slug: true,
          category_id: true,
          producer_id: true,
          price_points: true,
          price_eur_equivalent: true,
          fulfillment_method: true,
          is_hero_product: true,
          stock_quantity: true,
          stock_management: true,
          weight_grams: true,
          dimensions: true,
          tags: true,
          variants: true,
          nutrition_facts: true,
          allergens: true,
          certifications: true,
          seasonal_availability: true,
          min_tier: true,
          featured: true,
          is_active: true,
          launch_date: true,
          discontinue_date: true,
          seo_title: true,
          seo_description: true,
          metadata: true,
          created_at: true,
          updated_at: true,
          secondary_category_id: true,
          partner_source: true,
          deleted_at: true,
          name_i18n: true,
          description_i18n: true,
          short_description_i18n: true,
          name_default: true,
          description_default: true,
          search_vector: true,
          origin_country: true,
          created_by: true,
          updated_by: true,
          short_description_default: true,
          images: true,
          seo_title_i18n: true,
          seo_description_i18n: true,
        },
        with: {
          producer: {
            columns: {
              id: true,
              name_default: true,
            },
          },
          category: {
            columns: {
              id: true,
              name_default: true,
            },
          },
        },
      }),

      // 2. Count (Filtered)
      db.select({ count: count() }).from(products).where(whereClause),

      // 3. Metadata (Producers)
      db
        .select({
          id: producers.id,
          name_default: producers.name_default,
        })
        .from(producers)
        .orderBy(asc(producers.name_default)) as Promise<ProducerRow[]>,

      // 4. Metadata (Categories)
      db
        .select({
          id: categories.id,
          name_default: categories.name_default,
          parent_id: categories.parent_id,
        })
        .from(categories)
        .orderBy(asc(categories.name_default)) as Promise<CategoryRow[]>,

      // 5. Metadata (Tags)
      db.select({ tags: products.tags }).from(products),
    ])

    // Cast the result to Product[] because Drizzle types are complex and we know the structure matches
    productsList = productsResult.map((p) => ({
      ...p,
      // Ensure numeric/bigint fields are converted to numbers if needed (Drizzle normally handles this based on schema)
      // If schema defines them as 'number' mode for bigint, they come as number.
      // Drizzle 'numeric' comes as string usually, so we might need casting if schema doesn't handle it.
      // Based on schema:
      // price_points: bigint(mode: number) -> number
      // price_eur_equivalent: numeric -> string
      price_eur_equivalent: p.price_eur_equivalent ? Number(p.price_eur_equivalent) : null,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
      discontinue_date: p.discontinue_date ?? null,
      launch_date: p.launch_date ?? null,
      deleted_at: p.deleted_at?.toISOString() ?? null,
      // Handle potential type mismatches or missing fields explicitly if needed
      description_i18n: p.description_i18n as Product['description_i18n'],
       short_description_i18n: p.short_description_i18n as Product['short_description_i18n'],
       name_i18n: p.name_i18n as Product['name_i18n'],
       dimensions: p.dimensions as Product['dimensions'],
       metadata: p.metadata as Product['metadata'],
       nutrition_facts: p.nutrition_facts as Product['nutrition_facts'],
       seasonal_availability: p.seasonal_availability as Product['seasonal_availability'],
       variants: p.variants as Product['variants'],
       allergens: p.allergens as Product['allergens'],
       certifications: p.certifications as Product['certifications'],
       fulfillment_method: p.fulfillment_method as Product['fulfillment_method'],
       short_description_default: p.short_description_default ?? p.description_default ?? null,
       weight_grams: p.weight_grams ? Number(p.weight_grams) : null,
    })) as Product[]

    totalResult = countResult
    producerRows = producersResult
    categoryRows = categoriesResult
    tagRows = tagsResult

  } catch (error) {
    console.error('CRITIQUE: Erreur lors de la récupération des produits:', error)
    // Sentry.captureException(error)
  }

  const currentTotal = totalResult[0]?.count ?? 0

  // Extract unique tags
  const allTags = Array.from(
    new Set(tagRows.flatMap((row) => row.tags || []).filter((tag) => tag && tag.trim() !== '')),
  ).sort()

  const initialData = {
    items: productsList,
    total: currentTotal,
    metadata: {
      producers: producerRows.map((p) => ({
        id: p.id,
        name: p.name_default ?? 'Inconnu',
      })),
      categories: categoryRows.map((c) => ({
        id: c.id,
        name: c.name_default ?? 'Inconnu',
        parentId: c.parent_id,
      })),
      tags: allTags,
    },
  }

  return <ProductsClient initialData={initialData} />
}

