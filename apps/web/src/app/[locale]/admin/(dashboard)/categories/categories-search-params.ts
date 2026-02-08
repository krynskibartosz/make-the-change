import {
  createBoolean,
  createLoader,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server'

export const categorySearchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault('created_at_desc'),
  view: parseAsString.withDefault('list'),
  parent: parseAsString.withDefault('all'),
  is_active: createBoolean(false), // Optional boolean filter
}

export const loadCategorySearchParams = createLoader(categorySearchParams)
