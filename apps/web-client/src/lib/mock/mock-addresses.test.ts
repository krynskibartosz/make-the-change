// apps/web-client/src/lib/mock/mock-addresses.test.ts
import { describe, expect, it } from 'vitest'
import {
  addAddress,
  getDefaultAddress,
  getUserAddresses,
  parseMockAddressesCookie,
  removeAddress,
  serializeMockAddresses,
  setDefaultAddress,
  type MockUserAddress,
} from './mock-addresses'

const BASE: MockUserAddress = {
  id: 'addr-1',
  userId: 'user-a',
  street: 'Rue de la Paix 10',
  postalCode: '1000',
  city: 'Bruxelles',
  country: 'BE',
  isDefault: true,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const SECOND: MockUserAddress = {
  id: 'addr-2',
  userId: 'user-a',
  street: 'Avenue Louise 100',
  postalCode: '1050',
  city: 'Bruxelles',
  country: 'BE',
  isDefault: false,
  createdAt: '2026-02-01T00:00:00.000Z',
}

describe('parseMockAddressesCookie', () => {
  it('returns empty array for null input', () => {
    expect(parseMockAddressesCookie(null)).toEqual([])
  })

  it('returns empty array for invalid JSON', () => {
    expect(parseMockAddressesCookie('not-json')).toEqual([])
  })

  it('round-trips through serialize/parse', () => {
    const addresses = [BASE, SECOND]
    const serialized = serializeMockAddresses(addresses)
    expect(parseMockAddressesCookie(serialized)).toEqual(addresses)
  })

  it('drops entries with missing fields', () => {
    const bad = encodeURIComponent(JSON.stringify([{ id: 'x' }]))
    expect(parseMockAddressesCookie(bad)).toEqual([])
  })
})

describe('getDefaultAddress', () => {
  it('returns the default address for a user', () => {
    expect(getDefaultAddress([BASE, SECOND], 'user-a')).toEqual(BASE)
  })

  it('returns undefined when user has no addresses', () => {
    expect(getDefaultAddress([BASE], 'user-b')).toBeUndefined()
  })
})

describe('getUserAddresses', () => {
  const other: MockUserAddress = { ...BASE, id: 'addr-3', userId: 'user-b' }

  it('returns only addresses for the given user', () => {
    expect(getUserAddresses([BASE, SECOND, other], 'user-a')).toEqual([BASE, SECOND])
  })
})

describe('addAddress', () => {
  const fixedNow = new Date('2026-05-01T00:00:00.000Z')

  it('marks the first address as default', () => {
    const result = addAddress(
      [],
      { userId: 'user-b', street: 'Rue Test 1', postalCode: '1000', city: 'Bruxelles', country: 'BE' },
      fixedNow,
      'addr-test-1',
    )
    expect(result).toHaveLength(1)
    expect(result[0]?.isDefault).toBe(true)
    expect(result[0]?.id).toBe('addr-test-1')
    expect(result[0]?.createdAt).toBe('2026-05-01T00:00:00.000Z')
  })

  it('does not mark subsequent addresses as default', () => {
    const result = addAddress(
      [BASE],
      { userId: 'user-a', street: 'Rue Test 2', postalCode: '1050', city: 'Bruxelles', country: 'BE' },
      fixedNow,
      'addr-test-2',
    )
    expect(result).toHaveLength(2)
    expect(result.find((a) => a.id === 'addr-test-2')?.isDefault).toBe(false)
  })
})

describe('setDefaultAddress', () => {
  it('sets the selected address as default and clears all others', () => {
    const result = setDefaultAddress([BASE, SECOND], 'addr-2', 'user-a')
    expect(result.find((a) => a.id === 'addr-2')?.isDefault).toBe(true)
    expect(result.find((a) => a.id === 'addr-1')?.isDefault).toBe(false)
  })

  it('does not affect addresses of other users', () => {
    const other: MockUserAddress = { ...BASE, id: 'addr-3', userId: 'user-b', isDefault: true }
    const result = setDefaultAddress([BASE, SECOND, other], 'addr-2', 'user-a')
    expect(result.find((a) => a.id === 'addr-3')?.isDefault).toBe(true)
  })
})

describe('removeAddress', () => {
  it('removes the address with the given id', () => {
    const result = removeAddress([BASE, SECOND], 'addr-1', 'user-a')
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('addr-2')
  })

  it('promotes the most recent remaining address to default when the default is removed', () => {
    const result = removeAddress([BASE, SECOND], 'addr-1', 'user-a')
    expect(result[0]?.isDefault).toBe(true)
  })

  it('does not remove addresses of other users', () => {
    const ownAddr: MockUserAddress = { ...BASE, id: 'addr-1', userId: 'user-a' }
    const otherAddr: MockUserAddress = { ...BASE, id: 'addr-1', userId: 'user-b' }
    const result = removeAddress([ownAddr, otherAddr], 'addr-1', 'user-a')
    expect(result).toHaveLength(1)
    expect(result[0]?.userId).toBe('user-b')
  })
})
