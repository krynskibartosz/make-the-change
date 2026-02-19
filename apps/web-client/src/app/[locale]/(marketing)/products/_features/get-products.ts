import { unstable_cache } from 'next/cache'
import {
  applyProductsFilters,
  applyProductsSort,
  clampPage,
  getPaginationRange,
  toProductsPagination,
} from '@/app/[locale]/(marketing)/products/_features/products-query'
import {
  PRODUCTS_PAGE_SIZE,
  type ProductsQueryState,
} from '@/app/[locale]/(marketing)/products/_features/query-state'
import { createStaticClient } from '@/lib/supabase/static'

type PublicProduct = {
  id: string
  name_default: string
  short_description_default?: string | null
  description_default?: string | null
  price?: number | null
  price_points?: number | null
  stock_quantity?: number | null
  featured?: boolean | null
  category_id?: string | null
  producer_id?: string | null
  image_url?: string | null
  tags?: string[] | null
  created_at: string
}

type ProductTagsRow = {
  tags?: string[] | null
}

export const getProducts = unstable_cache(
  async (queryState: ProductsQueryState) => {
    const supabase = createStaticClient()

    // 1. Fetch Count
    let countQuery = supabase.from('public_products').select('id', { count: 'exact', head: true })
    countQuery = applyProductsFilters(countQuery, queryState)
    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('[products] fetch count failed', countError)
      throw countError
    }

    const totalItems = count ?? 0
    const pagination = toProductsPagination(totalItems, queryState.page, PRODUCTS_PAGE_SIZE)
    const currentPage = clampPage(queryState.page, pagination.totalPages)
    const { from, to } = getPaginationRange(currentPage, PRODUCTS_PAGE_SIZE)

    // 2. Fetch Products
    let productsQuery = supabase.from('public_products').select('*')
    productsQuery = applyProductsFilters(productsQuery, queryState)
    productsQuery = applyProductsSort(productsQuery, queryState.sort)
    productsQuery = productsQuery.range(from, to)

    const { data: productsList, error: productsError } = await productsQuery

    if (productsError) {
      console.error('[products] fetch products failed', productsError)
      throw productsError
    }

    const products = Array.isArray(productsList) ? (productsList as PublicProduct[]) : []

    return {
      products,
      pagination: {
        ...pagination,
        currentPage,
      },
      totalItems,
    }
  },
  ['products-list'],
  {
    revalidate: 3600,
    tags: ['products-list'],
  },
)

// Helper to fetch static lists (Categories, Producers, Tags)
export const getProductStaticResources = unstable_cache(
  async () => {
    const supabase = createStaticClient()

    const [categoriesResult, producersResult, tagsResult] = await Promise.all([
      supabase.from('categories').select('*').order('name_default', { ascending: true }),
      supabase
        .from('producers')
        .select('id, name_default')
        .order('name_default', { ascending: true }),
      supabase.from('public_products').select('tags'),
    ])

    const tagsRows = Array.isArray(tagsResult.data) ? (tagsResult.data as ProductTagsRow[]) : []
    const availableTags = Array.from(
      new Set<string>(tagsRows.flatMap((row) => row.tags || [])),
    ).sort((a, b) => a.localeCompare(b))

    return {
      categories: categoriesResult.data || [],
      producers: producersResult.data || [],
      availableTags,
    }
  },
  ['products-static-resources'],
  {
    revalidate: 86400, // 24 hours
    tags: ['products-static'],
  },
)
