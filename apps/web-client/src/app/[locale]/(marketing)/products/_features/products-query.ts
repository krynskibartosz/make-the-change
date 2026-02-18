import { PRODUCTS_PAGE_SIZE, type ProductSort } from './query-state'

export type ProductsServerFilters = {
  search: string
  category: string
  producer: string
  tag: string
}

export type ProductsPaginationData = {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export const getTotalPages = (totalItems: number, pageSize = PRODUCTS_PAGE_SIZE): number => {
  if (totalItems <= 0) return 1
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export const clampPage = (page: number, totalPages: number): number => {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1))
}

export const getPaginationRange = (
  page: number,
  pageSize = PRODUCTS_PAGE_SIZE,
): { from: number; to: number } => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { from, to }
}

export const toProductsPagination = (
  totalItems: number,
  currentPage: number,
  pageSize = PRODUCTS_PAGE_SIZE,
): ProductsPaginationData => {
  const totalPages = getTotalPages(totalItems, pageSize)

  return {
    currentPage: clampPage(currentPage, totalPages),
    pageSize,
    totalItems,
    totalPages,
  }
}

export const applyProductsFilters = <TQuery>(
  query: TQuery,
  filters: ProductsServerFilters,
): TQuery => {
  let nextQuery: any = query

  if (filters.category) {
    nextQuery = nextQuery.eq('category_id', filters.category)
  }

  if (filters.producer) {
    nextQuery = nextQuery.eq('producer_id', filters.producer)
  }

  if (filters.tag) {
    nextQuery = nextQuery.contains('tags', [filters.tag])
  }

  if (filters.search.length >= 2) {
    nextQuery = nextQuery.ilike('name_default', `%${filters.search}%`)
  }

  return nextQuery
}

export const applyProductsSort = <TQuery>(query: TQuery, sort: ProductSort): TQuery => {
  const q = query as any
  switch (sort) {
    case 'name_asc':
      return q.order('name_default', { ascending: true })
    case 'name_desc':
      return q.order('name_default', { ascending: false })
    case 'price_asc':
      return q
        .order('price_points', { ascending: true })
        .order('name_default', { ascending: true })
    case 'price_desc':
      return q
        .order('price_points', { ascending: false })
        .order('name_default', { ascending: true })
    default:
      return q.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }
}
