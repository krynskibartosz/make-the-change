'use client'

import { useRole } from '@/lib/role-context'
import { AlertTriangle, TrendingUp, Clock, Euro, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { role, isReady } = useRole()

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

  return (
    <div className="flex flex-col min-h-dvh pb-32 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Bonjour Grégory</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble de l'entreprise</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-8 p-5 max-w-md mx-auto w-full">
        
        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl bg-primary/10 border border-primary/20 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <TrendingUp className="size-4" />
              Marge Brute (Mois)
            </div>
            <div className="text-3xl font-black text-primary">24.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Objectif: 22% (+2.5%)</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Clock className="size-4" />
              Heures (Sem)
            </div>
            <div className="text-xl font-bold">142h</div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Euro className="size-4" />
              À facturer
            </div>
            <div className="text-xl font-bold text-orange-500">2 450 €</div>
          </div>
        </section>

        {/* Alertes Budgétaires */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Alertes Rentabilité
          </h2>
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 flex gap-3">
            <div className="mt-0.5">
              <AlertTriangle className="size-5 text-orange-600" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-foreground">Chantier Sparrenlaan</span>
              <p className="text-sm text-muted-foreground">
                Le budget heures a dépassé les 85% (120h sur 140h) alors que l'avancement estimé n'est qu'à 60%.
              </p>
            </div>
          </div>
        </section>

        {/* Chantiers en cours */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Chantiers en cours
          </h2>
          
          <div className="flex flex-col gap-3">
            {/* Chantier 1 */}
            <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold">Sparrenlaan (Rénovation)</span>
                <span className="text-xs font-bold bg-orange-500/10 text-orange-600 px-2 py-1 rounded-md">Dérive</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget consommé</span>
                  <span className="font-semibold text-orange-600">8 500 € / 10 000 €</span>
                </div>
                <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[85%]" />
                </div>
              </div>
            </div>

            {/* Chantier 2 */}
            <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold">Louise (Extension)</span>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md">Dans les clous</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget consommé</span>
                  <span className="font-semibold">12 000 € / 25 000 €</span>
                </div>
                <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[48%]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions Rapides */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Administration
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/facturation" className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-4 hover:bg-surface-elevated transition-colors text-center group">
              <Euro className="size-6 text-foreground group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Facturation</span>
            </Link>
            
            <Link href="/equipe" className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-4 hover:bg-surface-elevated transition-colors text-center group">
              <Users className="size-6 text-foreground group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Équipe & Taux</span>
            </Link>
          </div>
        </section>
        
      </main>
    </div>
  )
}
