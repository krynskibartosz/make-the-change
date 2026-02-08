import {
  createBoolean,
  createLoader,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server'

export const biodexSearchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault('created_at_desc'),
  status: parseAsString.withDefault('all'), // e.g., conservation status
  is_featured: createBoolean(null),
}

export const loadBiodexSearchParams = createLoader(biodexSearchParams)
