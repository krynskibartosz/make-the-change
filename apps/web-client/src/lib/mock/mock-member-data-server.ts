import { getImpactCreditsDebit } from '@/lib/mock/mock-commerce'
import { getCurrentMockCommerceEvents } from '@/lib/mock/mock-commerce-server'
import {
  getMockPointsTransactions,
  type MockPointsTransactionRecord,
} from '@/lib/mock/mock-member-data'
import type { Faction } from '@/lib/mock/types'

export { getMockPointsTransactions }

export async function getCurrentMockPointsTransactions(
  viewerId: string,
  _faction: Faction | null = null,
): Promise<MockPointsTransactionRecord[]> {
  const baseTransactions = getMockPointsTransactions(viewerId)

  return [...baseTransactions].sort((first, second) =>
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

export async function getCurrentMockImpactCreditsBalance(
  viewerId: string,
  faction: Faction | null = null,
): Promise<number> {
  const transactions = await getCurrentMockPointsTransactions(viewerId, faction)
  const available = transactions.reduce((sum, transaction) => sum + transaction.impactDelta, 0)
  return available - getImpactCreditsDebit(await getCurrentMockCommerceEvents(), viewerId)
}
