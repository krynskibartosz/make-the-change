'use server'

import { revalidatePath } from 'next/cache'
import {
  addAddress,
  removeAddress,
  setDefaultAddress,
  updateAddress,
} from '@/lib/mock/mock-addresses'
import {
  getCurrentMockAddresses,
  setCurrentMockAddresses,
} from '@/lib/mock/mock-addresses-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'

export async function removeAddressAction(id: string): Promise<{ ok: boolean }> {
  const session = await getMockViewerSession()
  if (!session) return { ok: false }
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(removeAddress(addresses, id, session.viewerId))
  revalidatePath('/profile/settings/addresses')
  return { ok: true }
}

export async function setDefaultAddressAction(id: string): Promise<{ ok: boolean }> {
  const session = await getMockViewerSession()
  if (!session) return { ok: false }
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(setDefaultAddress(addresses, id, session.viewerId))
  revalidatePath('/profile/settings/addresses')
  return { ok: true }
}

export async function addAddressAction(address: {
  street: string
  postalCode: string
  city: string
  country: string
}): Promise<{ ok: boolean }> {
  const session = await getMockViewerSession()
  if (!session) return { ok: false }
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(addAddress(addresses, { userId: session.viewerId, ...address }))
  revalidatePath('/profile/settings/addresses')
  return { ok: true }
}

export async function updateAddressAction(
  id: string,
  address: { street: string; postalCode: string; city: string; country: string },
): Promise<{ ok: boolean }> {
  const session = await getMockViewerSession()
  if (!session) return { ok: false }
  const addresses = await getCurrentMockAddresses()
  await setCurrentMockAddresses(updateAddress(addresses, id, session.viewerId, address))
  revalidatePath('/profile/settings/addresses')
  return { ok: true }
}
