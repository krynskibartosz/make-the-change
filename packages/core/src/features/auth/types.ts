/**
 * Auth Module Types
 * Users, Authentication, KYC
 */

import { z } from 'zod'

// User Levels (DB truth)
export const UserLevelEnum = z.enum(['explorateur', 'protecteur', 'ambassadeur'])
export type UserLevel = z.infer<typeof UserLevelEnum>

// KYC Status (DB truth)
export const KycStatusEnum = z.enum(['pending', 'light', 'complete', 'rejected'])
export type KycStatus = z.infer<typeof KycStatusEnum>

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  email_verified_at: z.date().optional(),
  last_login_at: z.date().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  date_of_birth: z.date().optional(),
  phone: z.string().optional(),
  user_level: UserLevelEnum.default('explorateur'),
  kyc_status: KycStatusEnum.default('pending'),
  kyc_level: z.number().int().default(0),
  created_at: z.date(),
  updated_at: z.date(),
})

export type User = z.infer<typeof UserSchema>

// Create User Schema
export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type CreateUser = z.infer<typeof CreateUserSchema>

// Subscription Plan (DB truth)
export const SubscriptionPlanEnum = z.enum([
  'monthly_standard',
  'monthly_premium',
  'annual_standard',
  'annual_premium',
])
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanEnum>

// Billing Frequency
export const BillingFrequencyEnum = z.enum(['monthly', 'annual'])
export type BillingFrequency = z.infer<typeof BillingFrequencyEnum>

// Subscription Status (DB truth)
export const SubscriptionStatusEnum = z.enum([
  'active',
  'inactive',
  'cancelled',
  'past_due',
  'unpaid',
  'trialing',
  'expired',
  'incomplete',
  'paused',
])
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusEnum>

// Subscription Schema
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  stripe_subscription_id: z.string().optional(),
  stripe_customer_id: z.string().min(1),
  plan_type: SubscriptionPlanEnum,
  status: SubscriptionStatusEnum.default('active'),
  monthly_points_allocation: z.number().int().nonnegative(),
  current_period_start: z.date().optional(),
  current_period_end: z.date().optional(),
  next_billing_date: z.date().optional(),
  cancel_at_period_end: z.boolean().default(false),
  billing_frequency: BillingFrequencyEnum.default('monthly'),
  monthly_price: z.number().nonnegative().optional(),
  annual_price: z.number().nonnegative().optional(),
  monthly_points: z.number().int().nonnegative().default(0),
  annual_points: z.number().int().nonnegative().default(0),
  bonus_percentage: z.number().min(0).default(0),
  trial_end: z.date().optional(),
  conversion_date: z.date().optional(),
  cancellation_reason: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

// Points calculation subscription type (for shared logic)
export type SubscriptionPointsInput = {
  plan_type: SubscriptionPlan
  billing_frequency: BillingFrequency
  monthly_points_allocation: number
  bonus_percentage: number
}
