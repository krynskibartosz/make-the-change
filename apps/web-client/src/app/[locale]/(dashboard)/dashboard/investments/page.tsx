import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowRight, Leaf, TrendingUp } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { Link } from '@/i18n/navigation'
import { requireAuth } from '@/app/[locale]/(auth)/_features/auth-guards'
import { getInvestmentStatusColor } from '@/app/[locale]/(dashboard)/_features/lib/status-colors'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function InvestmentsPage() {
  const t = await getTranslations('investments')
  const _user = await requireAuth()
  const supabase = await createClient()

  // Fetch user investments with project details using RLS
  const { data: userInvestments } = await supabase
    .from('investments')
    .select(`
      id,
      amount_eur_equivalent,
      amount_points,
      returns_received_points,
      status,
      created_at,
      project:public_projects!project_id(
        name_default,
        slug,
        status
      )
    `)
    .order('created_at', { ascending: false })

  // Calculate total invested
  const totalInvested = (userInvestments || []).reduce(
    (sum, inv) => sum + Number(inv.amount_eur_equivalent || 0),
    0,
  )

  return (
    <DashboardPageContainer className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
          <p className="hidden text-muted-foreground sm:block">{t('history')}</p>
        </div>
        <Link href="/projects">
          <Button className="w-full sm:w-auto">
            <Leaf className="mr-2 h-4 w-4" />
            Investir
          </Button>
        </Link>
      </div>

      {/* Total Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 sm:p-8 sm:pb-2">
          <CardTitle className="text-sm font-medium">{t('total')}</CardTitle>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:px-8 sm:pb-8 sm:pt-4">
          <div className="text-2xl font-bold text-primary sm:text-3xl">
            {formatCurrency(totalInvested)}
          </div>
        </CardContent>
      </Card>

      {/* Investments List */}
      {userInvestments && userInvestments.length > 0 ? (
        <div className="space-y-4">
          {userInvestments.map((investment) => {
            // Supabase returns joined fields as arrays, extract first element
            const project = Array.isArray(investment.project)
              ? investment.project[0]
              : investment.project
            const href = project?.slug ? `/projects/${project.slug}` : null

            return href ? (
              <Link key={investment.id} href={href} className="block">
                <Card className="transition hover:bg-muted/30">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{project?.name_default || 'Projet'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(investment.created_at || new Date())}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="text-right">
                        <p className="font-bold">
                          {formatCurrency(Number(investment.amount_eur_equivalent || 0))}
                        </p>
                        {investment.amount_points && (
                          <p className="text-xs text-primary">+{investment.amount_points} pts</p>
                        )}
                      </div>
                      <Badge variant={getInvestmentStatusColor(investment.status || 'pending')}>
                        {t(`status.${investment.status}`)}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card key={investment.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project?.name_default || 'Projet'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(investment.created_at || new Date())}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="text-right">
                      <p className="font-bold">
                        {formatCurrency(Number(investment.amount_eur_equivalent || 0))}
                      </p>
                      {investment.amount_points && (
                        <p className="text-xs text-primary">+{investment.amount_points} pts</p>
                      )}
                    </div>
                    <Badge variant={getInvestmentStatusColor(investment.status || 'pending')}>
                      {t(`status.${investment.status}`)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Leaf className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-4 text-lg text-muted-foreground">{t('empty')}</p>
            <Link href="/projects">
              <Button>
                {t('start_investing')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </DashboardPageContainer>
  )
}
