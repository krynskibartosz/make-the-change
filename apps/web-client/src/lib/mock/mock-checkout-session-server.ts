import {
  createEmptyCheckoutSession,
  MOCK_CHECKOUT_SESSION_COOKIE_NAME,
  mockCheckoutSessionCookieOptions,
  type MockCheckoutSession,
  parseMockCheckoutSessionCookie,
  serializeMockCheckoutSession,
} from '@/lib/mock/mock-checkout-session'

export async function getCurrentCheckoutSession(): Promise<MockCheckoutSession> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return parseMockCheckoutSessionCookie(
    cookieStore.get(MOCK_CHECKOUT_SESSION_COOKIE_NAME)?.value,
  )
}

export async function setCurrentCheckoutSession(session: MockCheckoutSession): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(
    MOCK_CHECKOUT_SESSION_COOKIE_NAME,
    serializeMockCheckoutSession(session),
    mockCheckoutSessionCookieOptions,
  )
}

export async function clearCurrentCheckoutSession(): Promise<void> {
  await setCurrentCheckoutSession(createEmptyCheckoutSession())
}
