import {
  createLoader,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server'

export const investmentSearchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault('created_at_desc'),
  status: parseAsString.withDefault('all'),
}

export const loadInvestmentSearchParams = createLoader(investmentSearchParams)
