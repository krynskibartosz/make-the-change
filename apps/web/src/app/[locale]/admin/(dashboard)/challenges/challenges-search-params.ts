import { parseAsInteger, parseAsString, createSerializer } from 'nuqs/server'

export const challengesSearchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault('created_at_desc'),
}

export const serializeChallengesSearchParams = createSerializer(challengesSearchParams)

export async function loadChallengesSearchParams(searchParams: Promise<any>) {
  return {
    q: (await searchParams).q || '',
    page: Number((await searchParams).page || 1),
    sort: (await searchParams).sort || 'created_at_desc',
  }
}
