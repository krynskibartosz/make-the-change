'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronRight, Euro, HardHat, Receipt, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FloatingCTA, MetricCard } from '@/components/ui'
import { selectCostsDashboard } from '@/features/costs/selectors'
import type { Expense, Intervention, WorkEntry } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { Screen } from '../_components/screen'

export default function CostsPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{
    interventions: Intervention[]
    workEntries: WorkEntry[]
    expenses: Expense[]
  } | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [interventions, workEntries, expenses] = await Promise.all([
        mockClarusRepository.getInterventions(),
        mockClarusRepository.getWorkEntries(),
        mockClarusRepository.getExpenses(),
      ])
      setData({ interventions, workEntries, expenses })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading || !data) {
    return (
      <Screen title="Coûts du chantier" backHref="/menu">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
        </div>
      </Screen>
    )
  }

  const dashboard = selectCostsDashboard(data)

  const laborPercentage =
    dashboard.totalCost > 0 ? Math.round((dashboard.laborAmount / dashboard.totalCost) * 100) : 0

  return (
    <Screen title="Coûts du chantier" backHref="/menu">
      <div className="flex flex-col gap-6">
        {/* Bannière rôle admin */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-muted-foreground">
          <span className="text-base">🔒</span>
          Vue réservée à l'équipe de gestion du chantier.
        </div>

        {/* Résumé Global */}
        <section>
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-1">
              Coût total du chantier
            </h2>
            <div className="text-3xl font-bold text-foreground">
              {dashboard.totalCost.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              €
            </div>

            {/* Barre de répartition */}
            <div className="mt-4 flex h-3 w-full rounded-full overflow-hidden bg-surface-elevated border border-border/50">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${laborPercentage}%` }}
              />
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${100 - laborPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Main d'œuvre ({laborPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-purple-500" />
                <span className="text-muted-foreground">
                  Achats & Matériaux ({100 - laborPercentage}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Main d'œuvre"
              value={`${dashboard.laborAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
              icon={HardHat}
              helper="Coût estimé des heures prestées"
            />
            <MetricCard
              label="Dépenses directes"
              value={`${dashboard.expensesAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
              icon={ShoppingCart}
              helper="Achats et matériaux"
            />
          </div>
        </section>

        {/* Facturation Action Card */}
        <section>
          <Link
            href="/facturation"
            className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl active:bg-emerald-500/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <Receipt className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Suppléments / Travaux à facturer</h3>
                <p className="text-sm font-medium text-emerald-500 mt-0.5">
                  {dashboard.pendingBillableAmount > 0
                    ? `${dashboard.pendingBillableAmount.toLocaleString('fr-FR')} € à facturer`
                    : 'Rien à facturer'}
                </p>
              </div>
            </div>
            <ChevronRight className="size-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
          </Link>
        </section>

        {/* Dernières Dépenses */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Dernières dépenses</h2>
          </div>

          {dashboard.recentExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 bg-surface rounded-xl border border-border">
              Aucune dépense enregistrée.
            </p>
          ) : (
            <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
              {dashboard.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border-b border-border last:border-0"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium truncate pr-4">{expense.description}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(expense.date), 'dd MMM', { locale: fr })}
                      </span>
                      {expense.supplier && (
                        <>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {expense.supplier}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-semibold">{expense.amount} €</span>
                    {expense.isRebillable && expense.status !== 'invoiced' && (
                      <span className="text-[10px] font-bold uppercase text-amber-500 mt-1">
                        À facturer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <FloatingCTA>
        <button
          onClick={() => router.push('/ajouter-depense')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <Euro className="size-5" />
          Ajouter une dépense
        </button>
      </FloatingCTA>
    </Screen>
  )
}
