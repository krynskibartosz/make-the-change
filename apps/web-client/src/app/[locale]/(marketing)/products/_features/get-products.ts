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
import { isMockDataSource } from '@/lib/mock/data-source'
import { createStaticClient } from '@/lib/supabase/static'
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'
import { getMockProducts } from './mock-products'

type PublicProduct = {
  id: string
  name_default: string
  name_i18n?: Record<string, string> | null
  short_description_default?: string | null
  short_description_i18n?: Record<string, string> | null
  description_default?: string | null
  description_i18n?: Record<string, string> | null
  price?: number | null
  price_points?: number | null
  stock_quantity?: number | null
  featured?: boolean | null
  category_id?: string | null
  producer_id?: string | null
  image_url?: string | null
  images?: string[] | null
  tags?: string[] | null
  created_at: string
}

type ProductTagsRow = {
  tags?: string[] | null
}

type StaticCategory = {
  id: string
  name_default: string
  name_i18n?: Record<string, string> | null
}

type StaticProducer = {
  id: string
  name_default: string
  name_i18n?: Record<string, string> | null
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const toCategoryToken = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

const toNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = asString(value)
  return parsed || null
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = asNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

const toNullableBoolean = (value: unknown): boolean | null => {
  if (value === null || value === undefined) {
    return null
  }

  return typeof value === 'boolean' ? value : null
}

const toPublicProduct = (value: unknown): PublicProduct | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const createdAt = asString(value.created_at)

  if (!id || !createdAt) {
    return null
  }

  return {
    id,
    created_at: createdAt,
    name_default: asString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
    short_description_i18n: toLocalizedRecord(value.short_description_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    price: toNullableNumber(value.price),
    price_points: toNullableNumber(value.price_points),
    stock_quantity: toNullableNumber(value.stock_quantity),
    featured: toNullableBoolean(value.featured),
    category_id: toNullableString(value.category_id),
    producer_id: toNullableString(value.producer_id),
    image_url: toNullableString(value.image_url),
    images: asStringArray(value.images),
    tags: asStringArray(value.tags),
  }
}

const toStaticCategory = (value: unknown): StaticCategory | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  return {
    id,
    name_default: asString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
  }
}

const toStaticProducer = (value: unknown): StaticProducer | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  return {
    id,
    name_default: asString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
  }
}

const toProductTagsRow = (value: unknown): ProductTagsRow | null => {
  if (!isRecord(value)) {
    return null
  }

  return {
    tags: asStringArray(value.tags),
  }
}

const toMockPublicProduct = (
  product: ReturnType<typeof getMockProducts>[number],
): PublicProduct => ({
  id: product.id,
  created_at: product.created_at,
  name_default: product.name_default,
  name_i18n: product.name_i18n || null,
  short_description_default: product.short_description_default || null,
  short_description_i18n: product.short_description_i18n || null,
  description_default: product.description_default,
  description_i18n: product.description_i18n || null,
  price: product.price_eur_equivalent,
  price_points: product.price_points,
  stock_quantity: product.stock_quantity,
  featured: product.featured,
  category_id: product.category_id,
  producer_id: product.producer_id,
  image_url: product.image_url,
  images: product.images,
  tags: product.tags,
})

const matchesMockFilters = (product: PublicProduct, filters: ProductsQueryState) => {
  if (filters.category && product.category_id !== filters.category) {
    return false
  }

  if (filters.producer && product.producer_id !== filters.producer) {
    return false
  }

  if (filters.tag) {
    const tags = product.tags || []
    if (!tags.includes(filters.tag)) {
      return false
    }
  }

  if (filters.search.length >= 2) {
    const haystack = [
      product.name_default || '',
      product.short_description_default || '',
      product.description_default || '',
      ...(product.tags || []),
    ]
      .join(' ')
      .toLowerCase()

    if (!haystack.includes(filters.search.toLowerCase())) {
      return false
    }
  }

  return true
}

const resolveCategoryId = async (
  supabase: ReturnType<typeof createStaticClient>,
  categoryFilter: string,
): Promise<string> => {
  if (!categoryFilter) {
    return ''
  }

  if (UUID_REGEX.test(categoryFilter)) {
    return categoryFilter
  }

  const normalizedFilter = toCategoryToken(categoryFilter)
  if (!normalizedFilter) {
    return ''
  }

  const { data, error } = await supabase.from('categories').select('id, name_default, name_i18n')

  if (error) {
    console.error('[products] resolve category from slug failed', error)
    return ''
  }

  if (!Array.isArray(data)) {
    return ''
  }

  for (const row of data) {
    const parsed = toStaticCategory(row)
    if (!parsed) continue

    if (toCategoryToken(parsed.name_default) === normalizedFilter) {
      return parsed.id
    }

    const localizedNames = parsed.name_i18n ? Object.values(parsed.name_i18n) : []
    if (localizedNames.some((name) => toCategoryToken(name) === normalizedFilter)) {
      return parsed.id
    }
  }

  return ''
}

export const getProducts = unstable_cache(
  async (queryState: ProductsQueryState) => {
    const mockProducts = getMockProducts()
    const mockCategoryId =
      mockProducts.find(
        (product) =>
          product.category.id === queryState.category ||
          toCategoryToken(product.category.name_default || '') === toCategoryToken(queryState.category),
      )?.category.id || ''
    const mockResolvedCategory = queryState.category ? mockCategoryId : ''
    const mockFilters = {
      ...queryState,
      category: mockResolvedCategory,
    } satisfies ProductsQueryState
    const filteredMockProducts = mockProducts
      .map((product) => toMockPublicProduct(product))
      .filter((product) => matchesMockFilters(product, mockFilters))

    if (isMockDataSource) {
      const totalItems = filteredMockProducts.length
      const pagination = toProductsPagination(totalItems, queryState.page, PRODUCTS_PAGE_SIZE)
      const currentPage = clampPage(queryState.page, pagination.totalPages)
      const { from, to } = getPaginationRange(currentPage, PRODUCTS_PAGE_SIZE)

      return {
        products: filteredMockProducts.slice(from, to + 1),
        pagination: {
          ...pagination,
          currentPage,
        },
        totalItems,
        resolvedCategory: mockResolvedCategory,
      }
    }

    const supabase = createStaticClient()
    const resolvedCategory = await resolveCategoryId(supabase, queryState.category)
    const filters = {
      ...queryState,
      category: resolvedCategory,
    } satisfies ProductsQueryState

    // 1. Fetch Count
    let countQuery = supabase.from('public_products').select('id', { count: 'exact', head: true })
    countQuery = applyProductsFilters(countQuery, filters)
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
    productsQuery = applyProductsFilters(productsQuery, filters)
    productsQuery = applyProductsSort(productsQuery, filters.sort)
    productsQuery = productsQuery.range(from, to)

    const { data: productsList, error: productsError } = await productsQuery

    if (productsError) {
      console.error('[products] fetch products failed', productsError)
      throw productsError
    }

    const products = Array.isArray(productsList)
      ? productsList
          .map((product) => toPublicProduct(product))
          .filter((product): product is PublicProduct => product !== null)
      : []

    const mockIds = new Set(filteredMockProducts.map((product) => product.id))
    const dedupedDatabaseProducts = products.filter((product) => !mockIds.has(product.id))
    const mergedProducts =
      queryState.page === 1
        ? [...filteredMockProducts, ...dedupedDatabaseProducts]
        : dedupedDatabaseProducts

    return {
      products: mergedProducts,
      pagination: {
        ...pagination,
        currentPage,
      },
      totalItems,
      resolvedCategory,
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
    if (isMockDataSource) {
      const mockProducts = getMockProducts()
      const categories = Array.from(
        new Map(
          mockProducts.map((product) => [
            product.category.id,
            {
              id: product.category.id,
              name_default: product.category.name_default || '',
              name_i18n: product.category.name_i18n || null,
            },
          ]),
        ).values(),
      )
      const producers = Array.from(
        new Map(
          mockProducts.map((product) => [
            product.producer.id,
            {
              id: product.producer.id,
              name_default: product.producer.name_default || '',
              name_i18n: product.producer.name_i18n || null,
            },
          ]),
        ).values(),
      )
      const availableTags = Array.from(new Set(mockProducts.flatMap((product) => product.tags))).sort(
        (a, b) => a.localeCompare(b),
      )

      return {
        categories,
        producers,
        availableTags,
      }
    }

    const supabase = createStaticClient()

    const [categoriesResult, producersResult, tagsResult] = await Promise.all([
      supabase.from('categories').select('*').order('name_default', { ascending: true }),
      supabase
        .from('producers')
        .select('id, name_default, name_i18n')
        .order('name_default', { ascending: true }),
      supabase.from('public_products').select('tags'),
    ])

    const categories = Array.isArray(categoriesResult.data)
      ? categoriesResult.data
          .map((category) => toStaticCategory(category))
          .filter((category): category is StaticCategory => category !== null)
      : []
    const producers = Array.isArray(producersResult.data)
      ? producersResult.data
          .map((producer) => toStaticProducer(producer))
          .filter((producer): producer is StaticProducer => producer !== null)
      : []
    const tagsRows = Array.isArray(tagsResult.data)
      ? tagsResult.data
          .map((row) => toProductTagsRow(row))
          .filter((row): row is ProductTagsRow => row !== null)
      : []
    const availableTags = Array.from(
      new Set<string>(tagsRows.flatMap((row) => row.tags || [])),
    ).sort((a, b) => a.localeCompare(b))

    return {
      categories,
      producers,
      availableTags,
    }
  },
  ['products-static-resources-v2'],
  {
    revalidate: 86400, // 24 hours
    tags: ['products-static'],
  },
)
