'use client'

import { Card, CardContent } from '@make-the-change/core/ui'
import {
  Activity,
  AlertTriangle,
  Package,
  ShieldCheck,
  ShoppingCart,
  Target,
  Trophy,
  Users,
} from 'lucide-react'
import { useEffect } from 'react'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminKpiCard } from '@/app/[locale]/admin/(dashboard)/dashboard/components/kpi-card'
import { AdminTaskCard } from '@/app/[locale]/admin/(dashboard)/dashboard/components/task-card'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from '@/i18n/navigation'

export type AdminDashboardStats = {
  pendingOrders: number
  lowStockProducts: number
  pendingProducers: number
  pendingKyc: number
  activeProjects: number
  activeChallenges: number
}

export type AdminDashboardClientProps = {
  stats: AdminDashboardStats
  hasError?: boolean
}

/**
 * Admin dashboard homepage (task-first).
 *
 * Prioritizes actionable items above the fold to reduce choice overload (Hick)
 * and make the next action obvious (Fitts).
 */
const AdminDashboardPage = ({ stats, hasError = false }: AdminDashboardClientProps) => {
  const { user, loading, signOut: _signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="flex items-center justify-center py-16">
          <div
            role="status"
            aria-label="Chargement du dashboard"
            aria-live="polite"
            className="animate-spin rounded-full h-10 w-10 border-2 border-muted-foreground/30 border-t-primary"
          />
        </div>
      </AdminPageContainer>
    )
  }

  if (!user) {
    return (
      <AdminPageContainer>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-muted-foreground">Redirection vers la page de connexion…</p>
        </div>
      </AdminPageContainer>
    )
  }

  return (
    <AdminPageContainer>
      <div className="space-y-6 md:space-y-8">
        {hasError && (
          <Card className="border border-destructive/30 bg-destructive/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-foreground">
                    Impossible de charger certaines métriques
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Les compteurs affichés peuvent être incomplets. Rafraîchissez la page ou
                    réessayez plus tard.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <section aria-label="À traiter maintenant" className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              À traiter maintenant
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <AdminTaskCard
              description="Traitez les commandes en attente et réduisez le délai de traitement."
              href="/admin/orders?status=pending"
              icon={ShoppingCart}
              metricLabel="Commandes en attente"
              metricValue={stats.pendingOrders}
              title="Commandes"
              tone={stats.pendingOrders > 0 ? 'accent' : 'default'}
            />
            <AdminTaskCard
              description="Validez ou qualifiez les producteurs en attente d’activation."
              href="/admin/partners?status=pending"
              icon={Users}
              metricLabel="Producteurs en attente"
              metricValue={stats.pendingProducers}
              title="Partenaires"
              tone={stats.pendingProducers > 0 ? 'accent' : 'default'}
            />
            <AdminTaskCard
              description="Vérifiez et validez les documents d'identité des utilisateurs."
              href="/admin/users?role=all"
              icon={ShieldCheck}
              metricLabel="Vérifications KYC"
              metricValue={stats.pendingKyc}
              title="Identité"
              tone={stats.pendingKyc > 0 ? 'warning' : 'default'}
            />
            <AdminTaskCard
              description="Identifiez les produits à faible stock pour éviter les ruptures."
              href="/admin/products?active_only=true"
              icon={Package}
              metricLabel="Produits stock faible"
              metricValue={stats.lowStockProducts}
              title="Stocks"
              tone={stats.lowStockProducts > 0 ? 'warning' : 'default'}
            />
          </div>
        </section>

        <section aria-label="Métriques" className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Métriques (secondaires)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            <AdminKpiCard
              icon={Target}
              title="Projets actifs"
              tone="success"
              value={stats.activeProjects}
            />
            <AdminKpiCard
              icon={Trophy}
              title="Challenges"
              tone="info"
              value={stats.activeChallenges}
            />
            <AdminKpiCard
              icon={ShoppingCart}
              title="Commandes"
              tone="accent"
              value={stats.pendingOrders}
            />
            <AdminKpiCard
              icon={ShieldCheck}
              title="KYC en attente"
              tone="warning"
              value={stats.pendingKyc}
            />
            <AdminKpiCard
              icon={Package}
              title="Stocks faibles"
              tone="warning"
              value={stats.lowStockProducts}
            />
            <AdminKpiCard
              icon={Users}
              title="Partenaires"
              tone="info"
              value={stats.pendingProducers}
            />
          </div>
        </section>
      </div>
    </AdminPageContainer>
  )
}

export default AdminDashboardPage
