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
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'

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

    return {
      products,
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
