import type { ChallengeIntent, MockViewerSession } from '@/lib/mock/types'

export const MOCK_AUTH_COOKIE_NAME = 'mtc_mock_auth'

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

export const mockAuthCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: THIRTY_DAYS_IN_SECONDS,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const stripWrappingQuotes = (value: string): string => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

const decodeCookiePayload = (value: string): string => {
  const normalized = stripWrappingQuotes(value.trim())

  try {
    return decodeURIComponent(normalized)
  } catch {
    return normalized
  }
}

const normalizeFactionToken = (value: string) =>
  value
    .replace(/Ãª/g, 'ê')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/&/g, ' and ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()

const normalizeFactionValue = (value: unknown): MockViewerSession['faction'] => {
  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = normalizeFactionToken(value)

  if (normalized === 'vie sauvage') {
    return 'Vie Sauvage'
  }

  if (
    normalized === 'terres forets' ||
    normalized === 'terres and forets' ||
    normalized === 'terres et forets'
  ) {
    return 'Terres & Forêts'
  }

  if (normalized === 'artisans locaux') {
    return 'Artisans Locaux'
  }

  return null
}

export const serializeMockViewerSession = (session: MockViewerSession): string => {
  return encodeURIComponent(JSON.stringify(session))
}

export const parseMockViewerSessionValue = (
  value: string | null | undefined,
): MockViewerSession | null => {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(decodeCookiePayload(value)) as unknown
    if (!isRecord(parsed)) {
      return null
    }

    const viewerId = typeof parsed.viewerId === 'string' ? parsed.viewerId : ''
    const displayName = typeof parsed.displayName === 'string' ? parsed.displayName : ''
    const email = typeof parsed.email === 'string' ? parsed.email : ''
    const avatarUrl =
      typeof parsed.avatarUrl === 'string'
        ? parsed.avatarUrl
        : parsed.avatarUrl === null
          ? null
          : null
    const faction = normalizeFactionValue(parsed.faction)

    if (!viewerId || !displayName || !email) {
      return null
    }

    return {
      viewerId,
      displayName,
      email,
      faction,
      avatarUrl,
    }
  } catch {
    return null
  }
}

const readCookieValue = (cookieString: string, key: string): string | null => {
  const entries = cookieString.split(';').map((entry) => entry.trim())
  const match = [...entries].reverse().find((entry) => entry.startsWith(`${key}=`))
  if (!match) {
    return null
  }

  return match.slice(key.length + 1)
}

export const getClientMockViewerSession = (): MockViewerSession | null => {
  if (typeof document === 'undefined') {
    return null
  }

  return parseMockViewerSessionValue(readCookieValue(document.cookie, MOCK_AUTH_COOKIE_NAME))
}

export const sanitizeReturnTo = (value: string, fallback = '/dashboard/profile'): string => {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }

  return fallback
}

export const buildReturnToWithIntent = (
  pathname: string,
  search: URLSearchParams | string,
  intent?: ChallengeIntent,
  extraParams?: Record<string, string | undefined>,
): string => {
  const params = new URLSearchParams(typeof search === 'string' ? search : search.toString())

  if (intent) {
    params.set('intent', intent)
  }

  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (!value) {
        params.delete(key)
        continue
      }

      params.set(key, value)
    }
  }

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
