import { db } from '@make-the-change/core/db'
import { profiles, subscriptions } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import type { Subscription } from '@/lib/types/subscription'
import { PAGE_SIZE } from './constants'
import { SubscriptionsClient } from './subscriptions-client'

type SearchParams = {
  q?: string
  status?: string
  plan?: string
  page?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.subscriptions' })

  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function AdminSubscriptionsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await props.searchParams
  const { q, status: statusFilter, plan: planFilter, page } = searchParams

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build Filter Conditions
  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(profiles.email, searchLower),
        ilike(profiles.first_name, searchLower),
        ilike(profiles.last_name, searchLower),
      ),
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    conditions.push(eq(subscriptions.status, statusFilter as NonNullable<Subscription['status']>))
  }

  if (planFilter && planFilter !== 'all') {
    conditions.push(
      eq(subscriptions.plan_type, planFilter as NonNullable<Subscription['plan_type']>),
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute Queries
  const [subscriptionRows, totalResult] = await Promise.all([
    // 1. Subscriptions (Paginated & Filtered)
    db
      .select({
        id: subscriptions.id,
        user_id: subscriptions.user_id,
        plan_type: subscriptions.plan_type,
        billing_frequency: subscriptions.billing_frequency,
        monthly_points_allocation: subscriptions.monthly_points_allocation,
        monthly_price: subscriptions.monthly_price,
        annual_price: subscriptions.annual_price,
        monthly_points: subscriptions.monthly_points,
        annual_points: subscriptions.annual_points,
        bonus_percentage: subscriptions.bonus_percentage,
        status: subscriptions.status,
        current_period_start: subscriptions.current_period_start,
        current_period_end: subscriptions.current_period_end,
        next_billing_date: subscriptions.next_billing_date,
        cancel_at_period_end: subscriptions.cancel_at_period_end,
        stripe_subscription_id: subscriptions.stripe_subscription_id,
        stripe_customer_id: subscriptions.stripe_customer_id,
        cancelled_at: subscriptions.cancelled_at,
        ended_at: subscriptions.ended_at,
        trial_end: subscriptions.trial_end,
        conversion_date: subscriptions.conversion_date,
        cancellation_reason: subscriptions.cancellation_reason,
        created_at: subscriptions.created_at,
        updated_at: subscriptions.updated_at,
        updated_by: subscriptions.updated_by,
        profile_email: profiles.email,
        profile_first_name: profiles.first_name,
        profile_last_name: profiles.last_name,
      })
      .from(subscriptions)
      .leftJoin(profiles, eq(profiles.id, subscriptions.user_id))
      .where(whereClause)
      .orderBy(desc(subscriptions.created_at))
      .limit(PAGE_SIZE)
      .offset(offset),

    // 2. Count (Filtered)
    db
      .select({ count: count() })
      .from(subscriptions)
      .leftJoin(profiles, eq(profiles.id, subscriptions.user_id))
      .where(whereClause),
  ])

  const currentTotal = totalResult[0]?.count ?? 0

  const items = subscriptionRows.map((row) => ({
    ...row,
    user_id: row.user_id!,
    plan_type: row.plan_type,
    billing_frequency: row.billing_frequency ?? 'monthly',
    monthly_points_allocation: Number(row.monthly_points_allocation || 0),
    monthly_price: row.monthly_price ? Number(row.monthly_price) : null,
    annual_price: row.annual_price ? Number(row.annual_price) : null,
    monthly_points: Number(row.monthly_points || 0),
    annual_points: Number(row.annual_points || 0),
    bonus_percentage: Number(row.bonus_percentage || 0),
    status: row.status ?? 'active',
    cancel_at_period_end: row.cancel_at_period_end ?? false,
    created_at: row.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: row.updated_at?.toISOString() ?? new Date().toISOString(),
    current_period_start: row.current_period_start?.toISOString() ?? null,
    current_period_end: row.current_period_end?.toISOString() ?? null,
    next_billing_date: row.next_billing_date?.toISOString() ?? null,
    cancelled_at: row.cancelled_at?.toISOString() ?? null,
    ended_at: row.ended_at?.toISOString() ?? null,
    trial_end: row.trial_end?.toISOString() ?? null,
    conversion_date: row.conversion_date?.toISOString() ?? null,
    updated_by: row.updated_by ?? null,
    users: {
      id: row.user_id!,
      email: row.profile_email ?? '',
      first_name: row.profile_first_name ?? '',
      last_name: row.profile_last_name ?? '',
      avatar_url: null,
      phone: null,
    },
  }))

  const initialData = {
    items,
    total: currentTotal,
  }

  return <SubscriptionsClient initialData={initialData} />
}
