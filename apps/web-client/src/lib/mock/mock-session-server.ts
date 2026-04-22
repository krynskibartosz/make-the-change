import {
  applyMockProfileOverrides,
  createDefaultMockProfileOverrides,
} from '@/lib/mock/mock-profile-overrides'
import { getMockProfileOverrides } from '@/lib/mock/mock-profile-overrides-server'
import {
  mockAuthCookieOptions,
  MOCK_AUTH_COOKIE_NAME,
  parseMockViewerSessionValue,
  serializeMockViewerSession,
} from '@/lib/mock/mock-session'
import { getCurrentMockImpactPoints } from '@/lib/mock/mock-member-data-server'
import { getMockProfile } from '@/lib/mock/mock-viewer'
import type { MockViewerSession, Profile, Viewer } from '@/lib/mock/types'

export async function getMockViewerSession(): Promise<MockViewerSession | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return parseMockViewerSessionValue(cookieStore.get(MOCK_AUTH_COOKIE_NAME)?.value)
}

export async function getCurrentViewer(): Promise<Viewer | null> {
  const session = await getMockViewerSession()
  if (!session) {
    return null
  }

  const profile = await getCurrentProfile()

  return {
    viewerId: session.viewerId,
    displayName: profile?.displayName ?? session.displayName,
    email: session.email,
    faction: session.faction,
    avatarUrl: profile?.avatarUrl ?? session.avatarUrl ?? null,
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getMockViewerSession()
  if (!session) {
    return null
  }

  const baseProfile = getMockProfile(session)
  const overrides =
    (await getMockProfileOverrides(session.viewerId)) ??
    createDefaultMockProfileOverrides(session.viewerId)

  const profile = applyMockProfileOverrides({
    baseProfile,
    overrides,
    session,
  })

  return {
    ...profile,
    points: await getCurrentMockImpactPoints(session.viewerId, session.faction),
  }
}

export async function setMockViewerSession(session: MockViewerSession) {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(MOCK_AUTH_COOKIE_NAME, serializeMockViewerSession(session), mockAuthCookieOptions)
}

export async function clearMockViewerSession() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(MOCK_AUTH_COOKIE_NAME, '', {
    ...mockAuthCookieOptions,
    maxAge: 0,
  })
}
