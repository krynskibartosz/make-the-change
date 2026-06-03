import { describe, expect, it } from 'vitest'
import type { SupportRewardTier } from '@/types/project'
import {
  getSupportCheckoutSummary,
  getSupportTierById,
  requiresShippingAddress,
} from './support-reward-selection'

const tiers: SupportRewardTier[] = [
  {
    id: 'free',
    amount: 25,
    title: 'Soutien libre',
    description: 'Suivi terrain et trace de soutien.',
    rewardType: 'none',
    requiresShipping: false,
    impactSummary: 'Finance le suivi terrain.',
    unlockedAdvantageLabel: 'Avantage partenaire niveau 1 debloque',
  },
  {
    id: 'box-miel',
    amount: 60,
    title: 'Box miel',
    description: 'Une box de miel partenaire.',
    rewardType: 'physical',
    rewardLabel: 'Box miel',
    requiresShipping: true,
    impactSummary: 'Finance une ruche accompagnee.',
    unlockedAdvantageLabel: 'Avantage partenaire -10 % debloque',
  },
]

describe('support reward selection', () => {
  it('finds a support tier by id', () => {
    expect(getSupportTierById(tiers, 'box-miel')?.title).toBe('Box miel')
  })

  it('summarizes a free amount without a product reward', () => {
    expect(
      getSupportCheckoutSummary({
        amount: 42,
        selectedTier: null,
        renounceReward: false,
      }),
    ).toEqual({
      amount: 42,
      rewardLabel: null,
      rewardStatusLabel: 'Aucune contrepartie produit',
      unlockedAdvantageLabel: 'Avantages partenaires selon le montant',
      requiresShippingAddress: false,
    })
  })

  it('includes a physical reward by default when a physical tier is selected', () => {
    expect(
      getSupportCheckoutSummary({
        amount: 60,
        selectedTier: tiers[1]!,
        renounceReward: false,
      }),
    ).toEqual({
      amount: 60,
      rewardLabel: 'Box miel',
      rewardStatusLabel: 'Contrepartie incluse',
      unlockedAdvantageLabel: 'Avantage partenaire -10 % debloque',
      requiresShippingAddress: true,
    })
  })

  it('removes shipping when the user renounces a physical reward', () => {
    const selectedTier = tiers[1]!

    expect(requiresShippingAddress(selectedTier, true)).toBe(false)
    expect(
      getSupportCheckoutSummary({
        amount: selectedTier.amount,
        selectedTier,
        renounceReward: true,
      }).rewardStatusLabel,
    ).toBe('Contrepartie refusee')
  })
})
