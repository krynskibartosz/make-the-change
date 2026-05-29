// apps/web-client/src/lib/mock/mock-addresses-server.ts
import {
  MOCK_ADDRESSES_COOKIE_NAME,
  mockAddressesCookieOptions,
  parseMockAddressesCookie,
  serializeMockAddresses,
  type MockUserAddress,
} from '@/lib/mock/mock-addresses'

export async function getCurrentMockAddresses(): Promise<MockUserAddress[]> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return parseMockAddressesCookie(
    cookieStore.get(MOCK_ADDRESSES_COOKIE_NAME)?.value,
  )
}

export async function setCurrentMockAddresses(addresses: MockUserAddress[]): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(
    MOCK_ADDRESSES_COOKIE_NAME,
    serializeMockAddresses(addresses),
    mockAddressesCookieOptions,
  )
}
