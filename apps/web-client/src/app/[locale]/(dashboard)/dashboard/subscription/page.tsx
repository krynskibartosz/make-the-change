import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPoints } from '@/lib/utils'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(
      'id, plan_type, status, monthly_points_allocation, current_period_end, next_billing_date, monthly_price, annual_price',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Abonnement</h1>
          <p className="hidden text-muted-foreground sm:block">Points mensuels et avantages</p>
        </div>
        <Link href="/products">
          <Button className="w-full sm:w-auto">
            Utiliser mes points
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {subscription ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-4 sm:p-8 sm:pb-6">
            <div>
              <CardTitle className="text-base sm:text-lg">Plan {subscription.plan_type}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Statut: {subscription.status}</p>
            </div>
            <Badge
              variant={subscription.status === 'active' ? 'success' : 'secondary'}
              className="rounded-full"
            >
              {subscription.status}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 pt-3 sm:grid-cols-3 sm:p-8 sm:pt-4">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Allocation</p>
              <p className="mt-2 text-2xl font-semibold text-primary tabular-nums">
                {formatPoints(Number(subscription.monthly_points_allocation || 0))} pts
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Renouvellement
              </p>
              <p className="mt-2 text-sm font-semibold">
                {subscription.next_billing_date ? formatDate(subscription.next_billing_date) : '—'}
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Fin de période
              </p>
              <p className="mt-2 text-sm font-semibold">
                {subscription.current_period_end
                  ? formatDate(subscription.current_period_end)
                  : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Aucun abonnement</p>
              <p className="text-sm text-muted-foreground">
                Les abonnements arriveront bientôt. En attendant, investissez pour gagner des
                points.
              </p>
            </div>
            <Link href="/projects">
              <Button>Découvrir les projets</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
