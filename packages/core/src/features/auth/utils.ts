/**
 * Auth Module Utilities
 * Validation, formatting, points calculation
 */

import { z } from 'zod'
import type { KycStatus, SubscriptionPointsInput, UserLevel } from './types'

// Validate email
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success
}

// Validate French phone number
export const isValidFrenchPhone = (phone: string): boolean => {
  const frenchPhoneRegex = /^(?:(?:\+33|0)[1-9])(?:[0-9]{8})$/
  return frenchPhoneRegex.test(phone.replace(/\s/g, ''))
}

// Validate IBAN (for SEPA)
export const isValidIBAN = (iban: string): boolean => {
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/
  return ibanRegex.test(iban.replace(/\s/g, ''))
}

// Validate minimum age (18 for KYC)
export const isValidAge = (dateOfBirth: Date, minAge = 18): boolean => {
  const today = new Date()
  const age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= minAge
  }

  return age >= minAge
}

// Validate French postal code
export const isValidFrenchPostalCode = (postalCode: string): boolean => {
  const frenchPostalCodeRegex = /^[0-9]{5}$/
  return frenchPostalCodeRegex.test(postalCode)
}

// Check if user has enough points
export const hasEnoughPoints = (availablePoints: number, requiredPoints: number): boolean => {
  return availablePoints >= requiredPoints
}

// Check if user can perform action based on level
export const canUserPerformAction = (userLevel: UserLevel, requiredLevel: UserLevel): boolean => {
  const levels: Record<UserLevel, number> = {
    explorateur: 1,
    protecteur: 2,
    ambassadeur: 3,
  }

  return levels[userLevel] >= levels[requiredLevel]
}

// Get user level label (French)
export const getUserLevelLabel = (level: UserLevel): string => {
  const labels: Record<UserLevel, string> = {
    explorateur: 'Explorateur',
    protecteur: 'Protecteur',
    ambassadeur: 'Ambassadeur',
  }
  return labels[level]
}

// Get KYC status label (French)
export const getKycStatusLabel = (status: KycStatus): string => {
  const labels: Record<KycStatus, string> = {
    pending: 'En attente',
    light: 'Vérification légère',
    complete: 'Vérifié',
    rejected: 'Rejeté',
  }
  return labels[status]
}

// Format full name
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim()
}

// Calculate subscription points
export function calculateSubscriptionPoints(subscription: SubscriptionPointsInput) {
  const validPlans = ['monthly_standard', 'monthly_premium', 'annual_standard', 'annual_premium']
  if (!validPlans.includes(subscription.plan_type)) throw new Error('Invalid subscription plan')

  const validFrequencies = ['monthly', 'annual']
  if (!validFrequencies.includes(subscription.billing_frequency))
    throw new Error('Invalid billing frequency')

  if (subscription.monthly_points_allocation <= 0)
    throw new Error('Invalid subscription points allocation')
  if (subscription.bonus_percentage < 0) throw new Error('Invalid bonus percentage')

  const base_points = subscription.monthly_points_allocation
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

// Calculate points needed for next level
export const getPointsToNextLevel = (
  currentLevel: UserLevel,
  totalPoints: number,
): number | null => {
  const levelThresholds: Record<UserLevel, number> = {
    explorateur: 0,
    protecteur: 1000,
    ambassadeur: 5000,
  }

  if (currentLevel === 'ambassadeur') return null

  const nextLevel = currentLevel === 'explorateur' ? 'protecteur' : 'ambassadeur'
  return Math.max(0, levelThresholds[nextLevel] - totalPoints)
}
