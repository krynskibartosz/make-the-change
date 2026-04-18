import 'server-only'

import { cookies } from 'next/headers'
import {
  createDefaultMockProfileOverrides,
  mockProfileCookieOptions,
  MOCK_PROFILE_COOKIE_NAME,
  parseMockProfileOverridesValue,
  serializeMockProfileOverrides,
  type MockProfileOverrides,
} from '@/lib/mock/mock-profile-overrides'
import {
  MOCK_AUTH_COOKIE_NAME,
  parseMockViewerSessionValue,
} from '@/lib/mock/mock-session'

export async function getMockProfileOverrides(
  viewerId: string,
): Promise<MockProfileOverrides> {
  const cookieStore = await cookies()
  const parsed = parseMockProfileOverridesValue(
    cookieStore.get(MOCK_PROFILE_COOKIE_NAME)?.value,
  )

  if (!parsed || parsed.viewerId !== viewerId) {
    return createDefaultMockProfileOverrides(viewerId)
  }

  return parsed
}

export async function getCurrentMockProfileOverrides(): Promise<MockProfileOverrides | null> {
  const cookieStore = await cookies()
  const session = parseMockViewerSessionValue(
    cookieStore.get(MOCK_AUTH_COOKIE_NAME)?.value,
  )

  if (!session) {
    return null
  }

  return getMockProfileOverrides(session.viewerId)
}

export async function setMockProfileOverrides(
  overrides: MockProfileOverrides,
): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(
    MOCK_PROFILE_COOKIE_NAME,
    serializeMockProfileOverrides(overrides),
    mockProfileCookieOptions,
  )
}

export async function clearMockProfileOverrides(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(MOCK_PROFILE_COOKIE_NAME, '', {
    ...mockProfileCookieOptions,
    maxAge: 0,
  })
}
