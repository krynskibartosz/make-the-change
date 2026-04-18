import type { MockViewerSession, Profile } from '@/lib/mock/types'

export const MOCK_PROFILE_COOKIE_NAME = 'mtc_mock_profile'

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

export const mockProfileCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: THIRTY_DAYS_IN_SECONDS,
}

export type MockProfileOverrides = {
  viewerId: string
  firstName: string
  lastName: string
  phone: string
  bio: string
  addressStreet: string
  addressCity: string
  addressPostalCode: string
  addressCountry: string
  avatarUrl: string
  coverUrl: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getString = (value: unknown) => (typeof value === 'string' ? value : '')

export const createDefaultMockProfileOverrides = (
  viewerId: string,
): MockProfileOverrides => ({
  viewerId,
  firstName: '',
  lastName: '',
  phone: '',
  bio: '',
  addressStreet: '',
  addressCity: '',
  addressPostalCode: '',
  addressCountry: '',
  avatarUrl: '',
  coverUrl: '',
})

export const serializeMockProfileOverrides = (
  overrides: MockProfileOverrides,
): string => encodeURIComponent(JSON.stringify(overrides))

export const parseMockProfileOverridesValue = (
  value: string | null | undefined,
): MockProfileOverrides | null => {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!isRecord(parsed)) {
      return null
    }

    const viewerId = getString(parsed.viewerId)
    if (!viewerId) {
      return null
    }

    return {
      viewerId,
      firstName: getString(parsed.firstName),
      lastName: getString(parsed.lastName),
      phone: getString(parsed.phone),
      bio: getString(parsed.bio),
      addressStreet: getString(parsed.addressStreet),
      addressCity: getString(parsed.addressCity),
      addressPostalCode: getString(parsed.addressPostalCode),
      addressCountry: getString(parsed.addressCountry),
      avatarUrl: getString(parsed.avatarUrl),
      coverUrl: getString(parsed.coverUrl),
    }
  } catch {
    return null
  }
}

const buildDisplayName = (
  overrides: MockProfileOverrides,
  session: MockViewerSession,
  baseProfile: Profile,
) => {
  const nextDisplayName = [overrides.firstName, overrides.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()

  return nextDisplayName || session.displayName || baseProfile.displayName
}

export const applyMockProfileOverrides = ({
  baseProfile,
  overrides,
  session,
}: {
  baseProfile: Profile
  overrides: MockProfileOverrides
  session: MockViewerSession
}): Profile => {
  const displayName = buildDisplayName(overrides, session, baseProfile)

  return {
    ...baseProfile,
    displayName,
    firstName:
      overrides.firstName || baseProfile.firstName || displayName.split(' ')[0] || displayName,
    lastName:
      overrides.lastName ||
      baseProfile.lastName ||
      displayName.split(' ').slice(1).join(' ') ||
      null,
    avatarUrl: overrides.avatarUrl || session.avatarUrl || baseProfile.avatarUrl,
    coverUrl: overrides.coverUrl || baseProfile.coverUrl || null,
    phone: overrides.phone || baseProfile.phone || '',
    bio: overrides.bio || baseProfile.bio || '',
    city: overrides.addressCity || baseProfile.city,
    country: overrides.addressCountry || baseProfile.country,
    addressStreet: overrides.addressStreet || baseProfile.addressStreet,
    addressPostalCode: overrides.addressPostalCode || baseProfile.addressPostalCode,
  }
}
