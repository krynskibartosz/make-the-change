# Address Book Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow authenticated users to save multiple delivery addresses, pre-fill checkout from their default address, and offer to save a new address after a checkout.

**Architecture:** Pure data functions in `mock-addresses.ts` (cookie-serialised array of `MockUserAddress`), server helpers in `mock-addresses-server.ts` following the exact same pattern as `mock-checkout-session-server.ts`. Checkout reads the user's addresses server-side and passes them as props to the client; a bottom sheet lets the user pick or add an address; a checkbox lets them save a new one. An address book screen at `/profile/settings/addresses` mirrors the account-screen pattern.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, Vitest, existing `AddressAutocompleteInput` component, existing `CHECKOUT_COUNTRIES` list.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/lib/mock/mock-addresses.ts` | `MockUserAddress` type + all pure functions |
| Create | `src/lib/mock/mock-addresses.test.ts` | Vitest unit tests for every pure function |
| Create | `src/lib/mock/mock-addresses-server.ts` | Cookie read / write helpers (server-only) |
| Create | `src/app/[locale]/(screens)/profile/settings/addresses/page.tsx` | Server entry — loads addresses, guards auth |
| Create | `src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx` | Address book UI (list, default badge, delete, set-default) |
| Create | `src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx` | Bottom sheet to pick / add a saved address |
| Modify | `src/app/[locale]/(screens)/profile/settings/page.tsx` | Add "Mes adresses" link in MON COMPTE section |
| Modify | `src/app/[locale]/(screens)/products/checkout/infos/page.tsx` | Load saved addresses server-side and pass as prop |
| Modify | `src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx` | Pre-fill from default, sheet trigger, save checkbox |
| Modify | `src/app/[locale]/(screens)/products/checkout/_features/checkout-actions.ts` | `saveAddressAction` server action |

---

## Task 1 — Pure data layer (`mock-addresses.ts`)

**Files:**
- Create: `apps/web-client/src/lib/mock/mock-addresses.ts`

- [ ] **Step 1: Write the file**

```ts
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
): MockUserAddress[] {
  const userAddresses = addresses.filter((a) => a.userId === address.userId)
  const isFirst = userAddresses.length === 0
  const newAddress: MockUserAddress = {
    ...address,
    id: `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    isDefault: isFirst,
    createdAt: new Date().toISOString(),
  }
  // If first address for this user, no need to update others
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
  // If we removed the default and others remain, promote the most recent one
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
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-client/src/lib/mock/mock-addresses.ts
git commit -m "feat: add MockUserAddress type and pure address helpers"
```

---

## Task 2 — Unit tests for pure functions

**Files:**
- Create: `apps/web-client/src/lib/mock/mock-addresses.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
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
  it('marks the first address as default', () => {
    const result = addAddress([], {
      userId: 'user-b',
      street: 'Rue Test 1',
      postalCode: '1000',
      city: 'Bruxelles',
      country: 'BE',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.isDefault).toBe(true)
  })

  it('does not mark subsequent addresses as default', () => {
    const result = addAddress([BASE], {
      userId: 'user-a',
      street: 'Rue Test 2',
      postalCode: '1050',
      city: 'Bruxelles',
      country: 'BE',
    })
    expect(result).toHaveLength(2)
    expect(result[1]?.isDefault).toBe(false)
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
    const other: MockUserAddress = { ...BASE, id: 'addr-1', userId: 'user-b' }
    const result = removeAddress([other], 'addr-1', 'user-a')
    expect(result).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run tests — expect them to pass** (pure functions were already written in Task 1)

```bash
cd apps/web-client && pnpm vitest run src/lib/mock/mock-addresses.test.ts
```

Expected: all tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web-client/src/lib/mock/mock-addresses.test.ts
git commit -m "test: add unit tests for mock address helpers"
```

---

## Task 3 — Server cookie helpers (`mock-addresses-server.ts`)

**Files:**
- Create: `apps/web-client/src/lib/mock/mock-addresses-server.ts`

- [ ] **Step 1: Write the file**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-client/src/lib/mock/mock-addresses-server.ts
git commit -m "feat: add mock addresses cookie server helpers"
```

---

## Task 4 — Save address server action

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/_features/checkout-actions.ts`

- [ ] **Step 1: Add `saveAddressAction` to the existing file**

Add these imports at the top of `checkout-actions.ts` (after the existing imports):

```ts
import { addAddress } from '@/lib/mock/mock-addresses'
import {
  getCurrentMockAddresses,
  setCurrentMockAddresses,
} from '@/lib/mock/mock-addresses-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
```

Then add this action at the bottom of the file:

```ts
export async function saveAddressAction(address: {
  street: string
  postalCode: string
  city: string
  country: string
}): Promise<{ ok: boolean }> {
  const viewerSession = await getMockViewerSession()
  if (!viewerSession) return { ok: false }

  const addresses = await getCurrentMockAddresses()
  const updated = addAddress(addresses, {
    userId: viewerSession.viewerId,
    ...address,
  })
  await setCurrentMockAddresses(updated)
  return { ok: true }
}

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web-client && npx tsc --noEmit 2>&1 | grep -v species
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add apps/web-client/src/app/[locale]/\(screens\)/products/checkout/_features/checkout-actions.ts
git commit -m "feat: add saveAddressAction server action"
```

---

## Task 5 — Checkout infos page: load addresses server-side

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/page.tsx`

- [ ] **Step 1: Update the page to load addresses and pass them as props**

Replace the current `page.tsx` content:

```tsx
// apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/page.tsx
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getCurrentMockCart } from '@/lib/mock/mock-commerce-server'
import { getCurrentCheckoutSession } from '@/lib/mock/mock-checkout-session-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import {
  getCurrentMockAddresses,
} from '@/lib/mock/mock-addresses-server'
import { getUserAddresses, getDefaultAddress } from '@/lib/mock/mock-addresses'
import { InfosClient } from './infos-client'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CheckoutInfosPage({ params }: Props) {
  const { locale } = await params
  const [cart, session, viewerSession, allAddresses] = await Promise.all([
    getCurrentMockCart(),
    getCurrentCheckoutSession(),
    getMockViewerSession(),
    getCurrentMockAddresses(),
  ])

  if (cart.lines.length === 0) {
    redirect(`/${locale}/products/cart`)
  }

  const userId = viewerSession?.viewerId ?? null
  const savedAddresses = userId ? getUserAddresses(allAddresses, userId) : []
  const defaultAddress = userId ? getDefaultAddress(allAddresses, userId) : undefined

  // Pre-fill checkout customer from default address if the session customer is empty
  const customer = session.customer
  const hasFilledCustomer = Boolean(customer.street)
  const initialCustomer =
    !hasFilledCustomer && defaultAddress
      ? {
          ...customer,
          street: defaultAddress.street,
          postalCode: defaultAddress.postalCode,
          city: defaultAddress.city,
          country: defaultAddress.country,
        }
      : customer

  return (
    <Screen
      header={
        <div className="flex w-full items-center gap-3">
          <Link
            href="/products/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="Retour au panier"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase text-white/35">Checkout</p>
            <p className="text-sm font-black text-white">Informations</p>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
      headerClassName="bg-[#0B0F15]/90"
    >
      <InfosClient
        initialCustomer={initialCustomer}
        isConnected={Boolean(viewerSession)}
        savedAddresses={savedAddresses}
        locale={locale}
      />
    </Screen>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web-client && npx tsc --noEmit 2>&1 | grep -v species
```

Expected: errors about `savedAddresses` prop not existing yet on `InfosClient` — that's expected, Task 6 fixes it.

- [ ] **Step 3: Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/page.tsx"
git commit -m "feat: load saved addresses server-side in checkout infos page"
```

---

## Task 6 — Saved addresses bottom sheet

**Files:**
- Create: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx`

- [ ] **Step 1: Write the component**

```tsx
// apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx
'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { getCountryLabel } from '@/lib/checkout-countries'

type Props = {
  addresses: MockUserAddress[]
  onSelect: (address: MockUserAddress) => void
  onClose: () => void
}

export function SavedAddressesSheet({ addresses, onSelect, onClose }: Props) {
  // Lock scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choisir une adresse"
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-white/10 bg-[#0B0F15] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-black text-white">Mes adresses</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
            aria-label="Fermer"
          >
            <X className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-72 overflow-y-auto px-4 space-y-2">
          {addresses.map((address) => (
            <li key={address.id}>
              <button
                type="button"
                onClick={() => { onSelect(address); onClose() }}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-colors active:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{address.street}</span>
                  {address.isDefault && (
                    <span className="rounded-full bg-lime-300/10 px-2 py-0.5 text-[10px] font-bold text-lime-300">
                      Par défaut
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/50">
                  {address.postalCode} {address.city} · {getCountryLabel(address.country)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx"
git commit -m "feat: add saved addresses bottom sheet component"
```

---

## Task 7 — Update InfosClient: pre-fill, sheet, save checkbox

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`

- [ ] **Step 1: Rewrite the component**

```tsx
// apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx
'use client'

import { Loader2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveCheckoutCustomerAction, saveAddressAction } from '@/app/[locale]/(screens)/products/checkout/_features/checkout-actions'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import { AddressAutocompleteInput } from './address-autocomplete-input'
import { SavedAddressesSheet } from './saved-addresses-sheet'
import { CheckoutSteps } from '../_components/checkout-steps'

type Props = {
  initialCustomer: MockCheckoutCustomer
  isConnected: boolean
  savedAddresses: MockUserAddress[]
  locale: string
}

function isValidEmail(email: string): boolean {
  const parts = email.split('@')
  return parts.length === 2 && (parts[1]?.includes('.') ?? false)
}

const INPUT_BASE =
  'h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`

export function InfosClient({ initialCustomer, isConnected, savedAddresses, locale }: Props) {
  const router = useRouter()
  const [customer, setCustomer] = useState<MockCheckoutCustomer>(initialCustomer)
  const [isPending, startTransition] = useTransition()
  const [showSheet, setShowSheet] = useState(false)
  const [saveAddress, setSaveAddress] = useState(false)

  const hasSavedAddresses = savedAddresses.length > 0

  const canContinue =
    isValidEmail(customer.email) &&
    customer.name.trim().length > 1 &&
    customer.street.trim().length > 3 &&
    customer.postalCode.trim().length >= 4 &&
    customer.city.trim().length > 1

  function handleCountryChange(country: string) {
    setCustomer((v) => ({ ...v, country, street: '', postalCode: '', city: '' }))
  }

  function handleAddressSelect(address: MockUserAddress) {
    setCustomer((v) => ({
      ...v,
      street: address.street,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    }))
  }

  function handleContinue() {
    if (!canContinue) return
    startTransition(async () => {
      await saveCheckoutCustomerAction(customer)
      if (saveAddress && isConnected) {
        await saveAddressAction({
          street: customer.street,
          postalCode: customer.postalCode,
          city: customer.city,
          country: customer.country,
        })
      }
      router.push(`/${locale}/products/checkout/paiement`)
    })
  }

  return (
    <div className="px-4 pb-28 pt-5">
      <CheckoutSteps currentStep="infos" />

      <h1 className="mt-1 text-2xl font-black text-white">Informations</h1>
      <p className="mt-1 text-sm font-medium text-white/50">
        {isConnected ? 'Commande liée à ton espace MTC' : 'Achat invité'}
      </p>

      {/* Saved address selector — only for connected users with saved addresses */}
      {isConnected && hasSavedAddresses && (
        <button
          type="button"
          onClick={() => setShowSheet(true)}
          className="mt-4 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70 transition-colors active:bg-white/[0.08]"
        >
          <MapPin className="h-4 w-4 shrink-0 text-lime-300" aria-hidden="true" />
          <span className="flex-1 text-left">Changer d'adresse</span>
        </button>
      )}

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="checkout-email" className="block text-xs font-bold text-white/55">
            E-mail
          </label>
          <input
            id="checkout-email"
            required
            value={customer.email}
            onChange={(e) => setCustomer((v) => ({ ...v, email: e.target.value }))}
            placeholder="votre@email.com"
            type="email"
            autoComplete="email"
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-name" className="block text-xs font-bold text-white/55">
            Nom complet
          </label>
          <input
            id="checkout-name"
            required
            value={customer.name}
            onChange={(e) => setCustomer((v) => ({ ...v, name: e.target.value }))}
            placeholder="Prénom Nom"
            autoComplete="name"
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-country" className="block text-xs font-bold text-white/55">
            Pays
          </label>
          <select
            id="checkout-country"
            value={customer.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            autoComplete="country"
            className={`${INPUT_CLASS} appearance-none`}
          >
            {CHECKOUT_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0B0F15] text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-street" className="block text-xs font-bold text-white/55">
            Rue et numéro
          </label>
          <AddressAutocompleteInput
            id="checkout-street"
            value={customer.street}
            country={customer.country}
            placeholder="Rue de la Paix 10"
            className={INPUT_CLASS}
            onChange={(street) => setCustomer((v) => ({ ...v, street }))}
            onSelect={({ street, postalCode, city }) =>
              setCustomer((v) => ({ ...v, street, postalCode, city }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-white/55">Code postal et ville</label>
          <div className="flex gap-3">
            <input
              id="checkout-postal"
              required
              value={customer.postalCode}
              onChange={(e) => setCustomer((v) => ({ ...v, postalCode: e.target.value }))}
              placeholder="1000"
              inputMode="numeric"
              autoComplete="postal-code"
              className={`${INPUT_BASE} w-[38%]`}
            />
            <input
              id="checkout-city"
              required
              value={customer.city}
              onChange={(e) => setCustomer((v) => ({ ...v, city: e.target.value }))}
              placeholder="Bruxelles"
              autoComplete="address-level2"
              className={`${INPUT_BASE} flex-1`}
            />
          </div>
        </div>

        {/* Save address checkbox — only for connected users */}
        {isConnected && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="h-4 w-4 accent-lime-300"
            />
            <span className="text-sm font-medium text-white/70">
              Sauvegarder cette adresse dans mon profil
            </span>
          </label>
        )}
      </div>

      {/* Address picker bottom sheet */}
      {showSheet && (
        <SavedAddressesSheet
          addresses={savedAddresses}
          onSelect={handleAddressSelect}
          onClose={() => setShowSheet(false)}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-white/5 bg-[#0B0F15]/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-lg">
        <button
          type="button"
          disabled={isPending || !canContinue}
          onClick={handleContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isPending ? 'Enregistrement...' : 'Continuer vers le paiement'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web-client && npx tsc --noEmit 2>&1 | grep -v species
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx"
git commit -m "feat: pre-fill checkout from saved address, add sheet and save checkbox"
```

---

## Task 8 — Address book screen

**Files:**
- Create: `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/page.tsx`
- Create: `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx`
- Create: `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/address-actions.ts`

- [ ] **Step 1: Write the server actions**

```ts
// apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/address-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import {
  addAddress,
  removeAddress,
  setDefaultAddress,
} from '@/lib/mock/mock-addresses'
import {
  getCurrentMockAddresses,
  setCurrentMockAddresses,
} from '@/lib/mock/mock-addresses-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'

export async function removeAddressAction(id: string): Promise<void> {
  const session = await getMockViewerSession()
  if (!session) return
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(removeAddress(addresses, id, session.viewerId))
  revalidatePath('/profile/settings/addresses')
}

export async function setDefaultAddressAction(id: string): Promise<void> {
  const session = await getMockViewerSession()
  if (!session) return
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(setDefaultAddress(addresses, id, session.viewerId))
  revalidatePath('/profile/settings/addresses')
}

export async function addAddressAction(address: {
  street: string
  postalCode: string
  city: string
  country: string
}): Promise<void> {
  const session = await getMockViewerSession()
  if (!session) return
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(addAddress(addresses, { userId: session.viewerId, ...address }))
  revalidatePath('/profile/settings/addresses')
}
```

- [ ] **Step 2: Write the page server component**

```tsx
// apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/page.tsx
import { redirect } from 'next/navigation'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { getCurrentMockAddresses } from '@/lib/mock/mock-addresses-server'
import { getUserAddresses } from '@/lib/mock/mock-addresses'
import { AddressesClient } from './addresses-client'

type Props = { params: Promise<{ locale: string }> }

export default async function AddressesPage({ params }: Props) {
  const { locale } = await params
  const [viewerSession, allAddresses] = await Promise.all([
    getMockViewerSession(),
    getCurrentMockAddresses(),
  ])

  if (!viewerSession) redirect(`/${locale}/login`)

  const addresses = getUserAddresses(allAddresses, viewerSession.viewerId)

  return <AddressesClient addresses={addresses} />
}
```

- [ ] **Step 3: Write the client component**

```tsx
// apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx
'use client'

import { ChevronLeft, MapPin, Plus, Star, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { getCountryLabel } from '@/lib/checkout-countries'
import { AddressAutocompleteInput } from '@/app/[locale]/(screens)/products/checkout/infos/address-autocomplete-input'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import {
  addAddressAction,
  removeAddressAction,
  setDefaultAddressAction,
} from './address-actions'

type Props = { addresses: MockUserAddress[] }

const INPUT_BASE =
  'h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`

export function AddressesClient({ addresses }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({ street: '', postalCode: '', city: '', country: 'BE' })

  function handleRemove(id: string) {
    startTransition(async () => { await removeAddressAction(id) })
  }

  function handleSetDefault(id: string) {
    startTransition(async () => { await setDefaultAddressAction(id) })
  }

  function handleAdd() {
    if (!form.street || !form.postalCode || !form.city) return
    startTransition(async () => {
      await addAddressAction(form)
      setForm({ street: '', postalCode: '', city: '', country: 'BE' })
      setShowAddForm(false)
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-y-contain bg-[#0B0F15] pb-10 text-white">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white">
            Mes adresses
          </span>
        </div>
      </header>

      <main className="mt-[calc(env(safe-area-inset-top)+4rem)] flex-1 px-4">
        {addresses.length === 0 && !showAddForm && (
          <p className="mt-8 text-center text-sm text-white/40">
            Aucune adresse sauvegardée.
          </p>
        )}

        <ul className="mt-4 space-y-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">{address.street}</p>
                    <p className="mt-0.5 text-xs text-white/50">
                      {address.postalCode} {address.city} · {getCountryLabel(address.country)}
                    </p>
                    {address.isDefault && (
                      <span className="mt-1.5 inline-block rounded-full bg-lime-300/10 px-2 py-0.5 text-[10px] font-bold text-lime-300">
                        Par défaut
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-white/10"
                      aria-label="Définir par défaut"
                    >
                      <Star className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(address.id)}
                    disabled={isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-red-500/20"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400/70" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {showAddForm && (
          <div className="mt-4 space-y-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Nouvelle adresse</p>

            <select
              value={form.country}
              onChange={(e) => setForm((v) => ({ ...v, country: e.target.value, street: '', postalCode: '', city: '' }))}
              className={`${INPUT_CLASS} appearance-none`}
            >
              {CHECKOUT_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0B0F15]">{c.label}</option>
              ))}
            </select>

            <AddressAutocompleteInput
              id="new-address-street"
              value={form.street}
              country={form.country}
              placeholder="Rue et numéro"
              className={INPUT_CLASS}
              onChange={(street) => setForm((v) => ({ ...v, street }))}
              onSelect={({ street, postalCode, city }) =>
                setForm((v) => ({ ...v, street, postalCode, city }))
              }
            />

            <div className="flex gap-2">
              <input
                value={form.postalCode}
                onChange={(e) => setForm((v) => ({ ...v, postalCode: e.target.value }))}
                placeholder="Code postal"
                className={`${INPUT_BASE} w-[38%]`}
              />
              <input
                value={form.city}
                onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))}
                placeholder="Ville"
                className={`${INPUT_BASE} flex-1`}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={isPending || !form.street || !form.postalCode || !form.city}
                className="flex-1 rounded-xl bg-lime-300 py-3 text-sm font-black text-[#0B0F15] disabled:opacity-50"
              >
                {isPending ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-4 text-sm font-semibold text-white/50 transition-colors active:bg-white/5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter une adresse
          </button>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd apps/web-client && npx tsc --noEmit 2>&1 | grep -v species
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/"
git commit -m "feat: add address book screen with list, add, delete, set-default"
```

---

## Task 9 — Link from Settings page

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/settings/page.tsx`

- [ ] **Step 1: Add the "Mes adresses" entry to accountItems in both mock and Supabase branches**

In the mock branch (around line 184) and the Supabase branch (around line 435), add to `accountItems`:

```ts
{
  label: 'Mes adresses',
  icon: MapPin,
  href: '/profile/settings/addresses',
  iconWrapperClassName: 'bg-blue-500',
  iconClassName: 'text-white',
},
```

Also add `MapPin` to the lucide-react import at line 1:

```ts
import {
  Bell,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Info,
  Leaf,
  Mail,
  MapPin,      // ← add this
  ReceiptText,
  Shield,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web-client && npx tsc --noEmit 2>&1 | grep -v species
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/profile/settings/page.tsx"
git commit -m "feat: add Mes adresses link in settings"
```

---

## Task 10 — Final check and push

- [ ] **Step 1: Run all tests**

```bash
cd apps/web-client && pnpm vitest run
```

Expected: all tests pass, including the new `mock-addresses.test.ts`.

- [ ] **Step 2: Full type-check**

```bash
cd apps/web-client && npx tsc --noEmit 2>&1 | grep -v species
```

Expected: no output.

- [ ] **Step 3: Push to main**

```bash
git push origin main
```
