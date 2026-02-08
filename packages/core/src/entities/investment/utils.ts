/**
 * Investment Module Utilities
 * Points calculation, validation, formatting
 */

import type {
  Investment,
  InvestmentType,
  PointsCalculation,
  ProjectStatus,
  RiskLevel,
} from './types'

// Investment rules by type
const INVESTMENT_RULES: Record<
  InvestmentType,
  {
    min_amount: number
    max_amount: number
    expected_bonus: number
  }
> = {
  beehive: { min_amount: 50, max_amount: 200, expected_bonus: 30 },
  olive_tree: { min_amount: 80, max_amount: 300, expected_bonus: 40 },
  vineyard: { min_amount: 150, max_amount: 500, expected_bonus: 50 },
}

// Calculate points from investment
export function calculateInvestmentPoints(investment: Investment): PointsCalculation {
  if (investment.amount_eur <= 0) throw new Error('Invalid investment amount')
  if (investment.bonus_percentage < 0) throw new Error('Invalid bonus percentage')

  const base_points = Math.ceil(investment.amount_eur)
  const bonus_points = Math.floor(base_points * (investment.bonus_percentage / 100))
  const total_points = base_points + bonus_points

  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    investment_type: investment.type,
    calculated_at: new Date(),
  }
}

// Validate investment against rules
export function validateInvestmentRules(investment: Investment): boolean {
  const rule = INVESTMENT_RULES[investment.type]
  if (!rule) return false
  if (investment.amount_eur < rule.min_amount || investment.amount_eur > rule.max_amount)
    return false
  return true
}

// Get investment rules for a type
export function getInvestmentRules(type: InvestmentType) {
  return INVESTMENT_RULES[type]
}

// Calculate euro value from points
export function calculatePointsEuroValue(points: number): number {
  return points * 1.0
}

// Validate investment amount
export const isValidInvestmentAmount = (
  amount: number,
  minInvestment: number,
  maxInvestment?: number,
): boolean => {
  if (amount < minInvestment) return false
  if (maxInvestment && amount > maxInvestment) return false
  return true
}

// Format percentage
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`
}

// Format points
export const formatPoints = (points: number): string => {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M pts`
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k pts`
  }
  return `${points} pts`
}

// Get project status label (French)
export const getProjectStatusLabel = (status: ProjectStatus): string => {
  const labels: Record<ProjectStatus, string> = {
    draft: 'Brouillon',
    active: 'Actif',
    funded: 'Financé',
    completed: 'Terminé',
    archived: 'Archivé',
  }
  return labels[status]
}

// Get risk level label (French)
export const getRiskLevelLabel = (level: RiskLevel): string => {
  const labels: Record<RiskLevel, string> = {
    LOW: 'Faible',
    MEDIUM: 'Moyen',
    HIGH: 'Élevé',
  }
  return labels[level]
}

// Calculate funding progress
export const calculateFundingProgress = (current: number, target: number): number => {
  if (target <= 0) return 0
  return Math.min(100, (current / target) * 100)
}
