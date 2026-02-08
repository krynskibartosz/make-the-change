import { db } from '@make-the-change/core/db'
import { categories, products } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireProducer, requireProducerOrAdminPage } from '@/lib/auth-guards'
import { PAGE_SIZE } from './constants'
import { PartnerProductsClient } from './partner-products-client'

type SearchParams = {
  q?: string
  category?: string
  page?: string
}

type ProductRow = {
  id: string
  name_default: string | null
  slug: string
  category_id: string
  price_points: number
  stock_quantity: number | null
  is_active: boolean
  short_description_default: string | null
}

type CategoryRow = { id: string; name: string | null; parent_id: string | null }

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'partner.products' })
  return { title: `${t('title')} | Partner` }
}

export default async function PartnerProductsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireProducerOrAdminPage(locale)
  const { producer } = await requireProducer()
  const searchParams = await props.searchParams
  const { q, category: categoryFilter, page } = searchParams

  if (!producer) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Profil producteur non configuré</h1>
        <p className="text-muted-foreground">
          Votre compte n'est pas encore associé à un profil producteur.
        </p>
      </div>
    )
  }

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build conditions - TOUJOURS filtrer par producer_id
  const conditions = [eq(products.producer_id, producer.id)]

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(products.name_default, searchLower),
        ilike(products.description_default, searchLower),
      )!,
    )
  }

  if (categoryFilter && categoryFilter !== 'all') {
    conditions.push(eq(products.category_id, categoryFilter))
  }

  const whereClause = and(...conditions)

  let productRows: ProductRow[] = []
  let totalResult: Array<{ count: number }> = [{ count: 0 }]
  let categoryRows: CategoryRow[] = []

  try {
    const results = await Promise.all([
      db
        .select({
          id: products.id,
          name_default: products.name_default,
          slug: products.slug,
          category_id: products.category_id,
          price_points: products.price_points,
          stock_quantity: products.stock_quantity,
          is_active: products.is_active,
          short_description_default: products.short_description_default,
        })
        .from(products)
        .where(whereClause)
        .orderBy(desc(products.created_at))
        .limit(PAGE_SIZE)
        .offset(offset),

      db.select({ count: count() }).from(products).where(whereClause),

      db
        .select({
          id: categories.id,
          name: categories.name_default,
          parent_id: categories.parent_id,
        })
        .from(categories)
        .orderBy(categories.name_default),
    ])

    productRows = results[0]
    totalResult = results[1]
    categoryRows = results[2]
  } catch (error) {
    console.error('CRITIQUE: Erreur produits partner:', error)
  }

  const currentTotal = totalResult[0]?.count ?? 0

  return (
    <PartnerProductsClient
      initialProducts={{
        items: productRows,
        total: currentTotal,
      }}
      initialCategories={{ data: categoryRows.map((row) => ({ ...row, name: row.name || '' })) }}
    />
  )
}
