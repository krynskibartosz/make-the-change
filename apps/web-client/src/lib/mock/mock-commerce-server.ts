import {
  createEmptyMockCart,
  getUnlockedAdvantageIds,
  MOCK_CART_COOKIE_NAME,
  MOCK_COMMERCE_EVENTS_COOKIE_NAME,
  type MockCart,
  type MockCommerceEvent,
  mockCommerceCookieOptions,
  parseMockCartCookie,
  parseMockCommerceEventsCookie,
  serializeMockCart,
  serializeMockCommerceEvents,
} from '@/lib/mock/mock-commerce'

export async function getCurrentMockCart(): Promise<MockCart> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return parseMockCartCookie(cookieStore.get(MOCK_CART_COOKIE_NAME)?.value)
}

export async function setCurrentMockCart(cart: MockCart): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(MOCK_CART_COOKIE_NAME, serializeMockCart(cart), mockCommerceCookieOptions)
}

export async function clearCurrentMockCart(): Promise<void> {
  await setCurrentMockCart(createEmptyMockCart())
}

export async function getCurrentMockCommerceEvents(): Promise<MockCommerceEvent[]> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return parseMockCommerceEventsCookie(cookieStore.get(MOCK_COMMERCE_EVENTS_COOKIE_NAME)?.value)
}

export async function setCurrentMockCommerceEvents(events: MockCommerceEvent[]): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(
    MOCK_COMMERCE_EVENTS_COOKIE_NAME,
    serializeMockCommerceEvents(events),
    mockCommerceCookieOptions,
  )
}

export async function getCurrentUnlockedAdvantageIds(userId: string | null): Promise<string[]> {
  return getUnlockedAdvantageIds(await getCurrentMockCommerceEvents(), userId)
}
