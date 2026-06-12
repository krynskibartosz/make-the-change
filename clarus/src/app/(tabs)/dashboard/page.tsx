'use client'

import { Activity, AlertTriangle, Briefcase, Clock, DollarSign, Euro, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { DashboardKPIs } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { useRole } from '@/lib/role-context'

export default function AdminDashboardPage() {
  const { role, isReady } = useRole()
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)

  useEffect(() => {
    mockClarusRepository.getDashboardKPIs().then(setKpis)
  }, [])

  if (!isReady) return null

  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-5 text-center gap-4">
        <AlertTriangle className="size-12 text-orange-500 opacity-50" />
        <h1 className="text-xl font-bold">Accès restreint</h1>
        <p className="text-muted-foreground">Cet écran est réservé à la direction.</p>
      </div>
    )
  }

  if (!kpis) {
    return (
      <div className="flex flex-col min-h-dvh items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hoursPercentage = Math.min(100, Math.round((kpis.totalHours / kpis.budgetHours) * 100))
  const costPercentage = Math.min(100, Math.round((kpis.totalCost / kpis.budgetCost) * 100))
  const isBudgetWarning = costPercentage > 85

  return (
    <div className="flex flex-col min-h-dvh pb-32 text-foreground bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble financière</p>
          </div>
          <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Activity className="size-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-5 max-w-md mx-auto w-full">
        {/* Main KPI */}
        <section className="grid grid-cols-2 gap-3">
          <Link
            href="/facturation"
            className="col-span-2 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 flex flex-col gap-2 relative overflow-hidden group active:scale-[0.98] transition-all"
          >
            <div className="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Euro className="size-4" />
                Total à facturer
              </div>
              {kpis.toInvoiceAmount > 0 && (
                <span className="flex size-2.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <div className="text-3xl font-black text-primary mt-1">
              {kpis.toInvoiceAmount.toLocaleString('fr-FR')} €
            </div>
            <p className="text-xs text-muted-foreground mt-1">Interventions et extras en attente</p>
          </Link>

          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Clock className="size-4" />
              Heures totales
            </div>
            <div className="text-xl font-bold">{kpis.totalHours}h</div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="size-4" />
              Coût global
            </div>
            <div className="text-xl font-bold">{kpis.totalCost.toLocaleString('fr-FR')} €</div>
          </div>
        </section>

        {/* Santé Budgétaire */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Santé du projet (Sparrenlaan)
          </h2>

          <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-5 shadow-sm">
            {/* Jauge Budget */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-semibold text-sm">Budget Consommé</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-md ${isBudgetWarning ? 'bg-orange-500/10 text-orange-600' : 'bg-emerald-500/10 text-emerald-600'}`}
                >
                  {costPercentage}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isBudgetWarning ? 'bg-orange-500' : 'bg-emerald-500'}`}
                  style={{ width: `${costPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis.totalCost.toLocaleString('fr-FR')} € sur{' '}
                {kpis.budgetCost.toLocaleString('fr-FR')} €
              </p>
            </div>

            {/* Jauge Heures */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-semibold text-sm">Heures planifiées</span>
                <span className="text-xs font-bold text-foreground">{hoursPercentage}%</span>
              </div>
              <div className="h-2.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${hoursPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis.totalHours}h sur {kpis.budgetHours}h
              </p>
            </div>
          </div>
        </section>

        {/* Alertes Dynamiques */}
        {kpis.blockedTasksCount > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Points de blocage
            </h2>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 flex gap-3 shadow-sm">
              <div className="mt-0.5">
                <AlertTriangle className="size-5 text-red-600 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">Interventions bloquées</span>
                <p className="text-sm text-muted-foreground">
                  Il y a {kpis.blockedTasksCount} tâche(s) avec le statut "bloqué". Veuillez
                  consulter le chef de chantier pour débloquer la situation.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Actions Rapides */}
        <section className="flex flex-col gap-3 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Administration
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/facturation"
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-5 hover:bg-surface-elevated active:scale-95 transition-all text-center group shadow-sm"
            >
              <DollarSign className="size-6 text-foreground group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Gérer facturation</span>
            </Link>

            <Link
              href="/equipe"
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-5 hover:bg-surface-elevated active:scale-95 transition-all text-center group shadow-sm"
            >
              <Users className="size-6 text-foreground group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Gérer l'équipe</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
