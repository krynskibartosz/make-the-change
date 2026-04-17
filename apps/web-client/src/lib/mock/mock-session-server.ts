import 'server-only'

import { cookies } from 'next/headers'
import { mockAuthCookieOptions, MOCK_AUTH_COOKIE_NAME, parseMockViewerSessionValue, serializeMockViewerSession } from '@/lib/mock/mock-session'
import { getMockProfile, getMockViewer } from '@/lib/mock/mock-viewer'
import type { MockViewerSession, Profile, Viewer } from '@/lib/mock/types'

export async function getMockViewerSession(): Promise<MockViewerSession | null> {
  const cookieStore = await cookies()
  return parseMockViewerSessionValue(cookieStore.get(MOCK_AUTH_COOKIE_NAME)?.value)
}

export async function getCurrentViewer(): Promise<Viewer | null> {
  const session = await getMockViewerSession()
  return session ? getMockViewer(session) : null
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getMockViewerSession()
  return session ? getMockProfile(session) : null
}

export async function setMockViewerSession(session: MockViewerSession) {
  const cookieStore = await cookies()
  cookieStore.set(MOCK_AUTH_COOKIE_NAME, serializeMockViewerSession(session), mockAuthCookieOptions)
}

export async function clearMockViewerSession() {
  const cookieStore = await cookies()
  cookieStore.set(MOCK_AUTH_COOKIE_NAME, '', {
    ...mockAuthCookieOptions,
    maxAge: 0,
  })
}
