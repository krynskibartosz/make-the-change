import {
  createLoader,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server'

export const pointsSearchParams = {
  q: parseAsString.withDefault(''), // Search by user email or description
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault('created_at_desc'),
  type: parseAsString.withDefault('all'), // credit, debit
}

export const loadPointsSearchParams = createLoader(pointsSearchParams)
