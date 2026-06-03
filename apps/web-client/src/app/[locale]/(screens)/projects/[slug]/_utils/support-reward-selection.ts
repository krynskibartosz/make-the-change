import type { SupportRewardTier } from '@/types/project'

export type SupportCheckoutSummary = {
  amount: number
  rewardLabel: string | null
  rewardStatusLabel: string
  unlockedAdvantageLabel: string
  requiresShippingAddress: boolean
}

export function getSupportTierById(
  tiers: SupportRewardTier[] | null | undefined,
  tierId: string | null | undefined,
): SupportRewardTier | null {
  if (!tierId || !tiers?.length) return null
  return tiers.find((tier) => tier.id === tierId) ?? null
}

export function requiresShippingAddress(
  selectedTier: SupportRewardTier | null | undefined,
  renounceReward: boolean,
): boolean {
  return Boolean(selectedTier?.requiresShipping && !renounceReward)
}

export function getSupportCheckoutSummary({
  amount,
  selectedTier,
  renounceReward,
}: {
  amount: number
  selectedTier: SupportRewardTier | null
  renounceReward: boolean
}): SupportCheckoutSummary {
  const rewardLabel = selectedTier?.rewardLabel ?? null
  const isRewardIncluded = Boolean(rewardLabel && !renounceReward)

  return {
    amount,
    rewardLabel: isRewardIncluded ? rewardLabel : null,
    rewardStatusLabel: rewardLabel
      ? renounceReward
        ? 'Contrepartie refusee'
        : 'Contrepartie incluse'
      : 'Aucune contrepartie produit',
    unlockedAdvantageLabel:
      selectedTier?.unlockedAdvantageLabel ?? 'Avantages partenaires selon le montant',
    requiresShippingAddress: requiresShippingAddress(selectedTier, renounceReward),
  }
}
