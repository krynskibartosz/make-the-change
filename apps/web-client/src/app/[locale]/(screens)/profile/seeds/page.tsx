import type { Metadata } from 'next'
import { getMockWalletBalance, getMockPointsTransactions } from '@/lib/mock/mock-member-data'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockCalendarDayKey } from '@/lib/mock/mock-challenges'
import { MOCK_SPECIES } from '@/lib/mock/mock-biodex'
import SeedsClient from './seeds-client'

interface SeedsPageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mes Graines | Make the Change',
  }
}

export default async function ProfileSeedsPage({ params }: SeedsPageProps) {
  const session = getClientMockViewerSession()
  const viewerId = session?.viewerId ?? null
  const balance = getMockWalletBalance(viewerId ?? '')
  const transactions = getMockPointsTransactions(viewerId ?? '')
  const currentDayKey = getMockCalendarDayKey()

  // Espèces du vrai catalogue BioDex avec une progression existante
  const speciesWithProgress = MOCK_SPECIES.filter(
    (s) =>
      (s.user_status?.progressionLevel ?? 0) > 0 || s.user_status?.isUnlocked
  ).slice(0, 6)

  // Fallback : si aucune espèce avec progression, prendre les 4 premières du catalogue
  const featuredSpecies =
    speciesWithProgress.length > 0 ? speciesWithProgress : MOCK_SPECIES.slice(0, 4)

  return (
    <SeedsClient
      balance={balance}
      transactions={transactions}
      currentDayKey={currentDayKey}
      featuredSpecies={featuredSpecies}
    />
  )
}