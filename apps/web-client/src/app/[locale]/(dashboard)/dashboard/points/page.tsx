import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowDown, ArrowUp, ShoppingBag, Wallet } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { asNumber, isRecord } from '@/lib/type-guards'
import { formatDate, formatPoints } from '@/lib/utils'

export default async function PointsPage() {
  const t = await getTranslations('points')
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('metadata')
    .eq('id', user.id)
    .single()

  const metadata = isRecord(profile?.metadata) ? profile.metadata : {}
  const walletBalance = asNumber(metadata.points_balance, 0)

  // Fetch orders to deduce points history using RLS
  const { data: userOrders } = await supabase
    .from('orders')
    .select('id, points_earned, points_used, created_at')
    .order('created_at', { ascending: false })

  // Calculate totals from orders
  const totalEarned = (userOrders || []).reduce((sum, o) => sum + (o.points_earned || 0), 0)
  const totalSpent = (userOrders || []).reduce((sum, o) => sum + (o.points_used || 0), 0)
  const currentBalance = walletBalance

  return (
    <DashboardPageContainer className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
          <p className="hidden text-muted-foreground sm:block">{t('history')}</p>
        </div>
        <Link href="/products">
          <Button className="w-full sm:w-auto">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Utiliser mes points
          </Button>
        </Link>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 sm:p-8 sm:pb-2">
          <CardTitle className="text-sm font-medium">{t('balance')}</CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:px-8 sm:pb-8 sm:pt-4">
          <div className="text-3xl font-bold text-primary sm:text-4xl">
            {formatPoints(currentBalance)} pts
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible">
        <Card className="min-w-[220px] sm:min-w-0">
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 sm:p-8 sm:pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('earned')}
            </CardTitle>
            <ArrowUp className="h-4 w-4 text-client-emerald-500" />
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:px-8 sm:pb-8 sm:pt-4">
            <div className="text-2xl font-bold text-client-emerald-600 dark:text-client-emerald-400">
              +{formatPoints(totalEarned)} pts
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-[220px] sm:min-w-0">
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 sm:p-8 sm:pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('spent')}
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-client-orange-500" />
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:px-8 sm:pb-8 sm:pt-4">
            <div className="text-2xl font-bold text-client-orange-600 dark:text-client-orange-400">
              -{formatPoints(totalSpent)} pts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List (Derived from Orders) */}
      <Card>
        <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">{t('history')}</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
          {userOrders && userOrders.length > 0 ? (
            <div className="space-y-3">
              {userOrders.map((order) => {
                // Show separate entries for Earned vs Spent if both happened?
                // For simplicity, row per order.
                const earned = order.points_earned || 0
                const spent = order.points_used || 0

                return (
                  <div key={order.id} className="space-y-2">
                    {earned > 0 && (
                      <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-client-emerald-100 dark:bg-client-emerald-900/30">
                            <ArrowUp className="h-5 w-5 text-client-emerald-600 dark:text-client-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium">Commande #{order.id.slice(0, 8)} (Gain)</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at || new Date())}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success" className="text-sm font-bold">
                          +{formatPoints(earned)} pts
                        </Badge>
                      </div>
                    )}
                    {spent > 0 && (
                      <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-client-orange-100 dark:bg-client-orange-900/30">
                            <ArrowDown className="h-5 w-5 text-client-orange-600 dark:text-client-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Commande #{order.id.slice(0, 8)} (Utilisation)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at || new Date())}
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive" className="text-sm font-bold">
                          -{formatPoints(spent)} pts
                        </Badge>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Wallet className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">{t('empty')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageContainer>
  )
}
