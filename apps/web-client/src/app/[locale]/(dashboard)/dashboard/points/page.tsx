import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowDown, ArrowUp, ShoppingBag, Wallet } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, isRecord } from '@/lib/type-guards'
import { formatDate, formatPoints } from '@/lib/utils'

type LedgerTransaction = {
  id: string
  label: string
  delta: number
  createdAt: string
}

const getLedgerReasonLabel = (reason: string) => {
  switch (reason) {
    case 'purchase':
      return 'Commande'
    case 'refund':
      return 'Remboursement'
    case 'investment':
      return 'Investissement'
    case 'investment_returns':
      return 'Retour sur investissement'
    case 'welcome_bonus':
      return 'Bonus de bienvenue'
    case 'referral':
      return 'Parrainage'
    case 'admin_adjustment':
      return 'Ajustement manuel'
    default:
      return 'Transaction'
  }
}

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
    .select('points_balance')
    .eq('id', user.id)
    .single()

  const walletBalance = asNumber(profile?.points_balance, 0)

  const { data: ledgerRows, error: ledgerError } = await supabase
    .schema('commerce')
    .from('points_ledger')
    .select('id, delta, reason, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fallback legacy history derived from orders if ledger is not available yet.
  const { data: userOrders } = await supabase
    .from('orders')
    .select('id, user_id, points_earned, points_used, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const transactionsFromLedger: LedgerTransaction[] =
    !ledgerError && Array.isArray(ledgerRows)
      ? ledgerRows
          .map((row) => {
            if (!isRecord(row)) {
              return null
            }

            const id = asString(row.id)
            const createdAt = asString(row.created_at)

            if (!id || !createdAt) {
              return null
            }

            return {
              id,
              label: getLedgerReasonLabel(asString(row.reason)),
              delta: asNumber(row.delta, 0),
              createdAt,
            }
          })
          .filter((row): row is LedgerTransaction => row !== null)
      : []

  const transactionsFromOrders: LedgerTransaction[] = Array.isArray(userOrders)
    ? userOrders.flatMap((order) => {
        const orderId = asString(order.id)
        const createdAt = asString(order.created_at)
        if (!orderId || !createdAt) {
          return []
        }

        const earned = asNumber(order.points_earned, 0)
        const spent = asNumber(order.points_used, 0)

        return [
          ...(earned > 0
            ? [
                {
                  id: `${orderId}-earned`,
                  label: `Commande #${orderId.slice(0, 8)} (gain)`,
                  delta: earned,
                  createdAt,
                },
              ]
            : []),
          ...(spent > 0
            ? [
                {
                  id: `${orderId}-spent`,
                  label: `Commande #${orderId.slice(0, 8)} (utilisation)`,
                  delta: -spent,
                  createdAt,
                },
              ]
            : []),
        ]
      })
    : []

  const transactions =
    transactionsFromLedger.length > 0 ? transactionsFromLedger : transactionsFromOrders

  const totalEarned = transactions.reduce((sum, transaction) => {
    return transaction.delta > 0 ? sum + transaction.delta : sum
  }, 0)
  const totalSpent = transactions.reduce((sum, transaction) => {
    return transaction.delta < 0 ? sum + Math.abs(transaction.delta) : sum
  }, 0)
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
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const isPositive = transaction.delta >= 0

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isPositive
                            ? 'bg-client-emerald-100 dark:bg-client-emerald-900/30'
                            : 'bg-client-orange-100 dark:bg-client-orange-900/30'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp className="h-5 w-5 text-client-emerald-600 dark:text-client-emerald-400" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-client-orange-600 dark:text-client-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={isPositive ? 'success' : 'destructive'}
                      className="text-sm font-bold"
                    >
                      {isPositive ? '+' : '-'}
                      {formatPoints(Math.abs(transaction.delta))} pts
                    </Badge>
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
