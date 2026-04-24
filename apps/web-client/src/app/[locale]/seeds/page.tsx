import type { Metadata } from 'next'
import { getMockWalletBalance, getMockPointsTransactions, getMockSubscription } from '@/lib/mock/mock-member-data'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockCalendarDayKey } from '@/lib/mock/mock-challenges'
import { getCurrentMockDailyChallenges } from '@/lib/mock/mock-challenge-progress-server'
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

export default async function SeedsPage({ params }: SeedsPageProps) {
  const session = getClientMockViewerSession()
  const viewerId = session?.viewerId ?? null
  const balance = getMockWalletBalance(viewerId ?? '')
  const transactions = getMockPointsTransactions(viewerId ?? '')
  const subscription = getMockSubscription(viewerId ?? '')
  const currentDayKey = getMockCalendarDayKey()
  
  const dailyChallenges = await getCurrentMockDailyChallenges({
    viewerId,
    faction: null,
    dayKey: currentDayKey,
  })

  const dailyQuests = dailyChallenges.map(challenge => ({
    id: challenge.id,
    title: challenge.title,
    type: challenge.type,
    reward: challenge.reward,
    completed: challenge.status === 'completed',
  }))

  return <SeedsClient balance={balance} transactions={transactions} subscription={subscription} currentDayKey={currentDayKey} dailyQuests={dailyQuests} />
}