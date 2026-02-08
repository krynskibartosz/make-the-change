import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs'

export const SORT_OPTIONS = [
  'created_at_desc',
  'created_at_asc',
  'name_asc',
  'name_desc',
  'price_asc',
  'price_desc',
  'featured_first',
] as const

export const productSearchParams = {
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault('all'),
  producer: parseAsString.withDefault('all'),
  active_only: parseAsBoolean.withDefault(false),
  sort: parseAsStringLiteral(SORT_OPTIONS).withDefault('created_at_desc'),
  page: parseAsInteger.withDefault(1),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  view: parseAsStringLiteral(['grid', 'list', 'map'] as const).withDefault('grid'),
}
