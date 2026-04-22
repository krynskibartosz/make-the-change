import {
  createDefaultMockUserPreferences,
  mockPreferencesCookieOptions,
  MOCK_PREFERENCES_COOKIE_NAME,
  parseMockUserPreferencesValue,
  serializeMockUserPreferences,
} from '@/lib/mock/mock-user-preferences'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import type { MockUserPreferences } from '@/lib/mock/types'

export async function getMockUserPreferences(
  viewerId: string,
): Promise<MockUserPreferences> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const parsed = parseMockUserPreferencesValue(
    cookieStore.get(MOCK_PREFERENCES_COOKIE_NAME)?.value,
  )

  if (!parsed || parsed.viewerId !== viewerId) {
    return createDefaultMockUserPreferences(viewerId)
  }

  return parsed
}

export async function getCurrentMockUserPreferences(): Promise<MockUserPreferences | null> {
  const session = await getMockViewerSession()
  if (!session) {
    return null
  }

  return getMockUserPreferences(session.viewerId)
}

export async function setMockUserPreferences(
  preferences: MockUserPreferences,
): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(
    MOCK_PREFERENCES_COOKIE_NAME,
    serializeMockUserPreferences(preferences),
    mockPreferencesCookieOptions,
  )
}

export async function clearMockUserPreferences(): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(MOCK_PREFERENCES_COOKIE_NAME, '', {
    ...mockPreferencesCookieOptions,
    maxAge: 0,
  })
}
