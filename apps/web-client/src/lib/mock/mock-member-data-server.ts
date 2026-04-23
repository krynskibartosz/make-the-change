import {
  getMockPointsTransactions,
  type MockPointsTransactionRecord,
} from '@/lib/mock/mock-member-data'

export { getMockPointsTransactions }
import { getCurrentMockChallengeTransactions } from '@/lib/mock/mock-challenge-progress-server'
import type { Faction } from '@/lib/mock/types'

const LEGACY_CHALLENGE_TRANSACTION_IDS = new Set([
  'mock-points-eco-fact',
  'mock-points-daily-harvest',
])

export async function getCurrentMockPointsTransactions(
  viewerId: string,
  faction: Faction | null = null,
): Promise<MockPointsTransactionRecord[]> {
  const baseTransactions = getMockPointsTransactions(viewerId).filter(
    (transaction) => !LEGACY_CHALLENGE_TRANSACTION_IDS.has(transaction.id),
  )
  const challengeTransactions = await getCurrentMockChallengeTransactions(viewerId, faction)

  const combinedTransactions: MockPointsTransactionRecord[] = [
    ...challengeTransactions.map((transaction) => ({
      id: transaction.id,
      label: transaction.label,
      delta: transaction.delta,
      impactDelta: transaction.impactDelta,
      createdAt: transaction.createdAt,
    })),
    ...baseTransactions,
  ]

  return combinedTransactions.sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  )
}

export async function getCurrentMockWalletBalance(
  viewerId: string,
  faction: Faction | null = null,
): Promise<number> {
  const transactions = await getCurrentMockPointsTransactions(viewerId, faction)
  return transactions.reduce((sum, transaction) => sum + transaction.delta, 0)
}

export async function getCurrentMockImpactPoints(
  viewerId: string,
  faction: Faction | null = null,
): Promise<number> {
  const transactions = await getCurrentMockPointsTransactions(viewerId, faction)
  return transactions.reduce((sum, transaction) => sum + transaction.impactDelta, 0)
}
