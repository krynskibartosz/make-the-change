/**
 * Points Calculator - Make the CHANGE (shared)
 */

export type ProducerSupport = {
  type: 'beehive' | 'olive_tree' | 'vineyard'
  amount_eur: number
  bonus_percentage: number
}

export type Subscription = {
  type: 'monthly_standard' | 'monthly_premium' | 'annual_standard' | 'annual_premium'
  billing_frequency: 'monthly' | 'annual'
  amount_eur: number
  bonus_percentage: number
}

export type PointsCalculation = {
  base_points: number
  bonus_points: number
  total_points: number
  euro_value_equivalent: number
  support_type?: string
  calculated_at: Date
}

export function calculateSupportPoints(support: ProducerSupport): PointsCalculation {
  if (support.amount_eur <= 0) throw new Error('Invalid support amount')
  if (support.bonus_percentage < 0) throw new Error('Invalid bonus percentage')
  const base_points = Math.ceil(support.amount_eur)
  const bonus_points = Math.floor(base_points * (support.bonus_percentage / 100))
  const total_points = base_points + bonus_points
  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    support_type: support.type,
    calculated_at: new Date(),
  }
}

export function calculateSubscriptionPoints(subscription: Subscription): PointsCalculation {
  const validTypes = ['monthly_standard', 'monthly_premium', 'annual_standard', 'annual_premium']
  if (!validTypes.includes(subscription.type)) throw new Error('Invalid subscription type')
  const validFrequencies = ['monthly', 'annual']
  if (!validFrequencies.includes(subscription.billing_frequency))
    throw new Error('Invalid billing frequency')
  if (subscription.amount_eur <= 0) throw new Error('Invalid subscription amount')
  if (subscription.bonus_percentage < 0) throw new Error('Invalid bonus percentage')
  const base_points = subscription.amount_eur
  const bonus_points = Math.round(base_points * (subscription.bonus_percentage / 100))
  const total_points = base_points + bonus_points
  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    calculated_at: new Date(),
  }
}

export function validateSupportRules(support: ProducerSupport): boolean {
  const rules: Record<
    ProducerSupport['type'],
    {
      min_amount: number
      max_amount: number
      expected_bonus: number
    }
  > = {
    beehive: { min_amount: 50, max_amount: 200, expected_bonus: 30 },
    olive_tree: { min_amount: 80, max_amount: 300, expected_bonus: 40 },
    vineyard: {
      min_amount: 150,
      max_amount: 500,
      expected_bonus: 50,
    },
  }
  const rule = rules[support.type]
  if (!rule) return false
  if (support.amount_eur < rule.min_amount || support.amount_eur > rule.max_amount)
    return false
  return true
}

export function calculatePointsEuroValue(points: number): number {
  return points * 1.0
}
