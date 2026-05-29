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
