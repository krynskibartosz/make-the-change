import { db } from '@make-the-change/core/db'
import { subscriptions } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'
import type { Subscription } from '@/lib/types/subscription'
import { SubscriptionEditClient } from './subscription-edit-client'

export default async function AdminSubscriptionEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  await requireAdminPage(locale)
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, id))
    .limit(1)

  if (!subscription) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-red-600">Erreur</h3>
        <p className="text-muted-foreground">Abonnement introuvable</p>
      </div>
    )
  }

  const normalized: Subscription = {
    ...subscription,
    billing_frequency: subscription.billing_frequency || 'monthly',
    monthly_points_allocation: Number(subscription.monthly_points_allocation || 0),
    monthly_price: subscription.monthly_price ? Number(subscription.monthly_price) : null,
    annual_price: subscription.annual_price ? Number(subscription.annual_price) : null,
    monthly_points: Number(subscription.monthly_points || 0),
    annual_points: Number(subscription.annual_points || 0),
    bonus_percentage: Number(subscription.bonus_percentage || 0),
    created_at: subscription.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: subscription.updated_at?.toISOString() ?? new Date().toISOString(),
    current_period_start: subscription.current_period_start?.toISOString() ?? null,
    current_period_end: subscription.current_period_end?.toISOString() ?? null,
    next_billing_date: subscription.next_billing_date?.toISOString() ?? null,
    cancelled_at: subscription.cancelled_at?.toISOString() ?? null,
    ended_at: subscription.ended_at?.toISOString() ?? null,
    trial_end: subscription.trial_end?.toISOString() ?? null,
    conversion_date: subscription.conversion_date?.toISOString() ?? null,
  }

  return <SubscriptionEditClient initialSubscription={normalized} />
}
