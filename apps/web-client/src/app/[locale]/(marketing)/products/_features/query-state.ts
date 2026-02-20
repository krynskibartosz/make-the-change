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

type SearchTextField = Extract<keyof ProductsQueryState, 'search' | 'tag'>
type UuidQueryField = Extract<keyof ProductsQueryState, 'producer'>
type PersistedProductsQueryField = Exclude<keyof ProductsQueryState, 'page'>

const SEARCH_TEXT_FIELDS = ['search', 'tag'] as const satisfies readonly SearchTextField[]
const UUID_QUERY_FIELDS = ['producer'] as const satisfies readonly UuidQueryField[]

export const DEFAULT_PRODUCTS_QUERY_STATE = {
  search: '',
  category: '',
  producer: '',
  tag: '',
  sort: DEFAULT_PRODUCT_SORT,
  page: 1,
} satisfies ProductsQueryState

type SearchParamsRecord = Record<string, string | string[] | undefined>
type SearchParamsSource = SearchParamsRecord | URLSearchParams | ReadonlyURLSearchParams
type SearchParamsWithGet = URLSearchParams | ReadonlyURLSearchParams

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const hasGetMethod = (source: SearchParamsSource): source is SearchParamsWithGet =>
  source instanceof URLSearchParams ||
  (typeof source === 'object' &&
    source !== null &&
    'get' in source &&
    typeof source.get === 'function')

const getRawParam = (source: SearchParamsSource, key: string): string | undefined => {
  if (hasGetMethod(source)) {
    const result = source.get(key)
    return typeof result === 'string' ? result : undefined
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

const CATEGORY_TOKEN_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

const sanitizeCategory = (value?: string): string => {
  if (!value) return ''

  const trimmed = value.trim().slice(0, 80)
  if (!trimmed) return ''

  if (UUID_REGEX.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  return CATEGORY_TOKEN_REGEX.test(trimmed) ? trimmed.toLowerCase() : ''
}

const sanitizePage = (value?: string): number => {
  if (!value) return 1

  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

const sanitizeTextField = (field: SearchTextField, value?: string): string =>
  field === 'search' ? sanitizeSearch(value) : sanitizeTag(value)

const withFallback = <T>(value: T | undefined, fallback: NoInfer<T>): T => value ?? fallback

export const toPersistedProductsQueryState = (
  state: ProductsQueryState,
): Pick<ProductsQueryState, PersistedProductsQueryField> => ({
  search: state.search,
  category: state.category,
  producer: state.producer,
  tag: state.tag,
  sort: state.sort,
})

export const isProductSort = (value: string | null | undefined): value is ProductSort => {
  if (!value) return false
  return PRODUCT_SORT_VALUES.some((sort) => sort === value)
}

export const parseProductsQueryState = (source: SearchParamsSource): ProductsQueryState => {
  const textFilters: Record<SearchTextField, string> = {
    search: '',
    tag: '',
  }
  for (const field of SEARCH_TEXT_FIELDS) {
    textFilters[field] = sanitizeTextField(field, getRawParam(source, field))
  }

  const identityFilters: Record<UuidQueryField, string> = {
    producer: '',
  }
  for (const field of UUID_QUERY_FIELDS) {
    identityFilters[field] = sanitizeUuid(getRawParam(source, field))
  }

  const sortParam = getRawParam(source, 'sort')
  const sort = withFallback(isProductSort(sortParam) ? sortParam : undefined, DEFAULT_PRODUCT_SORT)
  const page = sanitizePage(getRawParam(source, 'page'))

  return {
    search: textFilters.search,
    category: sanitizeCategory(getRawParam(source, 'category')),
    producer: identityFilters.producer,
    tag: textFilters.tag,
    sort,
    page,
  }
}

export const buildProductsSearchParams = (state: ProductsQueryState): URLSearchParams => {
  const params = new URLSearchParams()

  for (const field of SEARCH_TEXT_FIELDS) {
    const value = sanitizeTextField(field, state[field])
    if (value.length > 0) {
      params.set(field, value)
    }
  }

  const category = sanitizeCategory(state.category)
  if (category.length > 0) {
    params.set('category', category)
  }

  for (const field of UUID_QUERY_FIELDS) {
    const value = sanitizeUuid(state[field])
    if (value.length > 0) {
      params.set(field, value)
    }
  }

  const sort = withFallback(
    isProductSort(state.sort) ? state.sort : undefined,
    DEFAULT_PRODUCT_SORT,
  )
  const page = Number.isFinite(state.page) && state.page > 0 ? Math.floor(state.page) : 1

  if (sort !== DEFAULT_PRODUCT_SORT) {
    params.set('sort', sort)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  return params
}
