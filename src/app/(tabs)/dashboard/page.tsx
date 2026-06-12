'use client'

import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Euro,
  FileClock,
  PhoneCall,
} from 'lucide-react'
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
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center">
        <AlertTriangle className="size-12 text-warning opacity-60" />
        <h1 className="text-xl font-bold">Accès restreint</h1>
        <p className="text-muted-foreground">Cet écran est réservé à la direction.</p>
      </div>
    )
  }

  if (!kpis) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-b-primary" />
      </div>
    )
  }

  const hoursProgress =
    kpis.budgetHours > 0
      ? Math.min(100, Math.max(0, Math.round((kpis.totalHours / kpis.budgetHours) * 100)))
      : 0
  const costProgress =
    kpis.budgetCost > 0
      ? Math.min(100, Math.max(0, Math.round((kpis.totalCost / kpis.budgetCost) * 100)))
      : 0
  const blockedTasksCount = Math.max(1, kpis.blockedTasksCount)

  const decisionItems = [
    {
      href: '/projet-info',
      label: 'Chantier bloqué',
      value: `${blockedTasksCount} blocage${blockedTasksCount > 1 ? 's' : ''}`,
      detail: 'Décision technique P1.7 à prendre',
      action: 'Débloquer',
      icon: AlertTriangle,
      tone: 'border-blocked/30 bg-blocked/10 text-blocked',
    },
    {
      href: '/facturation',
      label: 'Montant à préparer',
      value: `${kpis.toInvoiceAmount.toLocaleString('fr-FR')} €`,
      detail: 'Interventions et frais prêts à facturer',
      action: 'Préparer',
      icon: FileClock,
      tone: 'border-billable/30 bg-billable/10 text-billable',
    },
    {
      href: '/client/client-dupont',
      label: 'Client à relancer',
      value: 'Jean Dupont',
      detail: 'Accord attendu aujourd’hui avant 16 h',
      action: 'Relancer',
      icon: PhoneCall,
      tone: 'border-info/30 bg-info/10 text-info',
    },
    {
      href: '/validations',
      label: 'Validation attendue',
      value: 'Option terrasse',
      detail: 'Impact annoncé : +1 jour et +540 €',
      action: 'Suivre',
      icon: CheckCircle2,
      tone: 'border-warning/30 bg-warning/10 text-warning',
    },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-32 text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/90 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-xl">
        <h1 className="text-2xl font-bold leading-tight">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Les décisions qui font avancer le chantier</p>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-7 p-4">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Priorité direction</p>
              <h2 className="text-xl font-bold">À traiter maintenant</h2>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
              {decisionItems.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            {decisionItems.map((item, index) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex min-h-24 items-center gap-3 p-4 transition-colors active:bg-surface-elevated ${
                    index > 0 ? 'border-t border-border' : ''
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${item.tone}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="block truncate text-base font-bold">{item.value}</span>
                    <span className="block text-xs leading-5 text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
                    {item.action}
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase text-muted-foreground">
            Indicateurs chantier
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              icon={Clock3}
              label="Avancement heures"
              value={`${hoursProgress}%`}
              detail={`${kpis.totalHours} h sur ${kpis.budgetHours} h`}
            />
            <KpiCard
              icon={BriefcaseBusiness}
              label="Budget engagé"
              value={`${costProgress}%`}
              detail={`${kpis.totalCost.toLocaleString('fr-FR')} € sur ${kpis.budgetCost.toLocaleString('fr-FR')} €`}
            />
            <KpiCard
              icon={Euro}
              label="À facturer"
              value={`${kpis.toInvoiceAmount.toLocaleString('fr-FR')} €`}
              detail="Montant non encore facturé"
            />
            <KpiCard
              icon={AlertTriangle}
              label="Tâches bloquées"
              value={String(blockedTasksCount)}
              detail="À résoudre sur Sparrenlaan"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

type KpiCardProps = {
  icon: typeof Clock3
  label: string
  value: string
  detail: string
}

function KpiCard({ icon: Icon, label, value, detail }: KpiCardProps) {
  return (
    <div className="flex min-h-32 flex-col justify-between rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="mt-1 text-xs leading-4 text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}
