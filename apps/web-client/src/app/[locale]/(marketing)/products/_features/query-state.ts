import type { ReadonlyURLSearchParams } from 'next/navigation'

export const PRODUCTS_PAGE_SIZE = 24

export const PRODUCT_SORT_VALUES = [
  'featured_first',
  'name_asc',
  'name_desc',
  'price_asc',
  'price_desc',
] as const

export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number]

export const DEFAULT_PRODUCT_SORT: ProductSort = 'featured_first'

export type ProductsQueryState = {
  search: string
  category: string
  producer: string
  tag: string
  sort: ProductSort
  page: number
}

export const DEFAULT_PRODUCTS_QUERY_STATE: ProductsQueryState = {
  search: '',
  category: '',
  producer: '',
  tag: '',
  sort: DEFAULT_PRODUCT_SORT,
  page: 1,
}

type SearchParamsRecord = Record<string, string | string[] | undefined>
type SearchParamsSource = SearchParamsRecord | URLSearchParams | ReadonlyURLSearchParams

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const getRawParam = (source: SearchParamsSource, key: string): string | undefined => {
  if ('get' in source) {
    return source.get(key) ?? undefined
  }

  const value = source[key]

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

const sanitizeSearch = (value?: string): string => {
  if (!value) return ''
  return value.trim().slice(0, 120)
}

const sanitizeTag = (value?: string): string => {
  if (!value) return ''
  return value.trim().slice(0, 64)
}

const sanitizeUuid = (value?: string): string => {
  if (!value) return ''
  return UUID_REGEX.test(value) ? value : ''
}

const sanitizePage = (value?: string): number => {
  if (!value) return 1

  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

export const isProductSort = (value: string | undefined): value is ProductSort => {
  if (!value) return false
  return PRODUCT_SORT_VALUES.includes(value as ProductSort)
}

export const parseProductsQueryState = (source: SearchParamsSource): ProductsQueryState => {
  const search = sanitizeSearch(getRawParam(source, 'search'))
  const category = sanitizeUuid(getRawParam(source, 'category'))
  const producer = sanitizeUuid(getRawParam(source, 'producer'))
  const tag = sanitizeTag(getRawParam(source, 'tag'))
  const sortParam = getRawParam(source, 'sort')
  const sort = isProductSort(sortParam) ? sortParam : DEFAULT_PRODUCT_SORT
  const page = sanitizePage(getRawParam(source, 'page'))

  return {
    search,
    category,
    producer,
    tag,
    sort,
    page,
  }
}

export const buildProductsSearchParams = (state: ProductsQueryState): URLSearchParams => {
  const params = new URLSearchParams()

  const search = sanitizeSearch(state.search)
  const category = sanitizeUuid(state.category)
  const producer = sanitizeUuid(state.producer)
  const tag = sanitizeTag(state.tag)
  const sort = isProductSort(state.sort) ? state.sort : DEFAULT_PRODUCT_SORT
  const page = Number.isFinite(state.page) && state.page > 0 ? Math.floor(state.page) : 1

  if (search.length > 0) {
    params.set('search', search)
  }

  if (category) {
    params.set('category', category)
  }

  if (producer) {
    params.set('producer', producer)
  }

  if (tag) {
    params.set('tag', tag)
  }

  if (sort !== DEFAULT_PRODUCT_SORT) {
    params.set('sort', sort)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  return params
}
