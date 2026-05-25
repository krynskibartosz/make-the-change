import { unstable_cache } from 'next/cache'
import {
  clampPage,
  getPaginationRange,
  toProductsPagination,
} from '@/app/[locale]/(screens)/products/_features/products-query'
import {
  PRODUCTS_PAGE_SIZE,
  type ProductsQueryState,
} from '@/app/[locale]/(screens)/products/_features/query-state'
import { getMockProducts } from './mock-products'

export type PublicProduct = {
  id: string
  slug: string
  name_default: string
  name_i18n?: Record<string, string> | null
  short_description_default?: string | null
  short_description_i18n?: Record<string, string> | null
  description_default?: string | null
  description_i18n?: Record<string, string> | null
  price: number
  stock_quantity: number
  featured: boolean
  category_id: string
  producer_id: string
  producer_name: string
  image_url: string
  images: string[]
  tags: string[]
  isTemporaryVisual: boolean
  created_at: string
}

const toProduct = (product: ReturnType<typeof getMockProducts>[number]): PublicProduct => ({
  id: product.id,
  slug: product.slug,
  name_default: product.name_default,
  name_i18n: product.name_i18n ?? null,
  short_description_default: product.short_description_default ?? null,
  short_description_i18n: product.short_description_i18n ?? null,
  description_default: product.description_default,
  description_i18n: product.description_i18n ?? null,
  price: product.price_eur_equivalent,
  stock_quantity: product.stock_quantity,
  featured: product.featured,
  category_id: product.category_id,
  producer_id: product.producer_id,
  producer_name: product.producer.name_default,
  image_url: product.image_url,
  images: product.images,
  tags: product.tags,
  isTemporaryVisual: product.isTemporaryVisual,
  created_at: product.created_at,
})

const matchesFilters = (product: PublicProduct, filters: ProductsQueryState): boolean => {
  if (filters.category && product.category_id !== filters.category) return false
  if (filters.producer && product.producer_id !== filters.producer) return false
  if (filters.tag && !product.tags.includes(filters.tag)) return false
  if (filters.search.length < 2) return true

  const haystack = [
    product.name_default,
    product.short_description_default ?? '',
    product.producer_name,
    ...product.tags,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(filters.search.toLowerCase())
}

const sortProducts = (
  products: PublicProduct[],
  sort: ProductsQueryState['sort'],
): PublicProduct[] =>
  [...products].sort((first, second) => {
    if (sort === 'name_asc') return first.name_default.localeCompare(second.name_default)
    if (sort === 'name_desc') return second.name_default.localeCompare(first.name_default)
    if (sort === 'price_asc') return first.price - second.price
    if (sort === 'price_desc') return second.price - first.price
    return Number(second.featured) - Number(first.featured)
  })

const _getProducts = async (queryState: ProductsQueryState) => {
  const products = sortProducts(
    getMockProducts()
      .map(toProduct)
      .filter((product) => matchesFilters(product, queryState)),
    queryState.sort,
  )
  const pagination = toProductsPagination(products.length, queryState.page, PRODUCTS_PAGE_SIZE)
  const currentPage = clampPage(queryState.page, pagination.totalPages)
  const { from, to } = getPaginationRange(currentPage, PRODUCTS_PAGE_SIZE)

  return {
    products: products.slice(from, to + 1),
    pagination: { ...pagination, currentPage },
    totalItems: products.length,
    resolvedCategory: queryState.category,
  }
}

export const getProducts = unstable_cache(_getProducts, ['v1-mock-products-list'], {
  revalidate: 3600,
  tags: ['products-list'],
})

const _getProductStaticResources = async () => {
  const products = getMockProducts()
  return {
    categories: Array.from(
      new Map(products.map((product) => [product.category.id, product.category])).values(),
    ),
    producers: Array.from(
      new Map(products.map((product) => [product.producer.id, product.producer])).values(),
    ),
    availableTags: Array.from(new Set(products.flatMap((product) => product.tags))).sort((a, b) =>
      a.localeCompare(b),
    ),
  }
}

export const getProductStaticResources = unstable_cache(
  _getProductStaticResources,
  ['v1-mock-products-static'],
  { revalidate: 86400, tags: ['products-static'] },
)
