// apps/web-client/src/lib/mock/mock-addresses.ts
import { mockCookieOptions } from '@/lib/mock/cookie-defaults'
import { isRecord } from '@/lib/type-guards'

export const MOCK_ADDRESSES_COOKIE_NAME = 'mtc_mock_addresses'

export const mockAddressesCookieOptions = {
  ...mockCookieOptions,
  maxAge: 60 * 60 * 24 * 365, // 1 year
}

export type MockUserAddress = {
  id: string
  userId: string
  street: string
  postalCode: string
  city: string
  country: string
  isDefault: boolean
  createdAt: string
}

export function parseMockAddressesCookie(
  value: string | null | undefined,
): MockUserAddress[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item: unknown): MockUserAddress[] => {
      if (!isRecord(item)) return []
      if (
        typeof item.id !== 'string' ||
        typeof item.userId !== 'string' ||
        typeof item.street !== 'string' ||
        typeof item.postalCode !== 'string' ||
        typeof item.city !== 'string' ||
        typeof item.country !== 'string' ||
        typeof item.isDefault !== 'boolean' ||
        typeof item.createdAt !== 'string'
      )
        return []
      return [
        {
          id: item.id,
          userId: item.userId,
          street: item.street,
          postalCode: item.postalCode,
          city: item.city,
          country: item.country,
          isDefault: item.isDefault,
          createdAt: item.createdAt,
        },
      ]
    })
  } catch {
    return []
  }
}

export const serializeMockAddresses = (addresses: MockUserAddress[]): string =>
  encodeURIComponent(JSON.stringify(addresses))

export function getDefaultAddress(
  addresses: MockUserAddress[],
  userId: string,
): MockUserAddress | undefined {
  return addresses.find((a) => a.userId === userId && a.isDefault)
}

export function getUserAddresses(
  addresses: MockUserAddress[],
  userId: string,
): MockUserAddress[] {
  return addresses.filter((a) => a.userId === userId)
}

export function addAddress(
  addresses: MockUserAddress[],
  address: Omit<MockUserAddress, 'id' | 'createdAt' | 'isDefault'>,
  now = new Date(),
  id = `addr-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
): MockUserAddress[] {
  const userAddresses = addresses.filter((a) => a.userId === address.userId)
  const isFirst = userAddresses.length === 0
  const newAddress: MockUserAddress = {
    ...address,
    id,
    isDefault: isFirst,
    createdAt: now.toISOString(),
  }
  return [...addresses, newAddress]
}

export function setDefaultAddress(
  addresses: MockUserAddress[],
  id: string,
  userId: string,
): MockUserAddress[] {
  return addresses.map((a) =>
    a.userId === userId ? { ...a, isDefault: a.id === id } : a,
  )
}

export function removeAddress(
  addresses: MockUserAddress[],
  id: string,
  userId: string,
): MockUserAddress[] {
  const filtered = addresses.filter((a) => !(a.id === id && a.userId === userId))
  const userAddresses = filtered.filter((a) => a.userId === userId)
  const hasDefault = userAddresses.some((a) => a.isDefault)
  if (!hasDefault && userAddresses.length > 0) {
    const mostRecent = userAddresses.reduce((latest, a) =>
      a.createdAt > latest.createdAt ? a : latest,
    )
    return filtered.map((a) =>
      a.id === mostRecent.id ? { ...a, isDefault: true } : a,
    )
  }
  return filtered
}
