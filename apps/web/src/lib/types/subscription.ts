import type { Database } from '@make-the-change/core/database-types'

export type Subscription = Database['commerce']['Tables']['subscriptions']['Row'] & {
  // Relations (can be optional if not always fetched)
  users?: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    phone: string | null
  } | null
}

export type SubscriptionFilters = {
  page?: number
  limit?: number
  search?: string
  status?: Subscription['status']
  planType?: Subscription['plan_type']
  billingFrequency?: Subscription['billing_frequency']
}

export type SubscriptionFormData = {
  plan_type: Subscription['plan_type']
  billing_frequency: Subscription['billing_frequency']
  status: Subscription['status']
  monthly_points_allocation: number
  stripe_customer_id: string
}
