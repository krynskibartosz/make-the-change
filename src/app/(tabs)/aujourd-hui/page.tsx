import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

import { mockClarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'

export default async function TodayPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const summary = await mockClarusRepository.getTodaySummary(today)

  const formattedDate = format(new Date(), 'EEEE d MMMM', { locale: fr })

  return (
    <TabScreen eyebrow={formattedDate} title="Aujourd'hui">
      {/* Métriques du jour */}
      <section className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <span className="text-xs font-medium text-muted-foreground">Interventions</span>
          <span className="text-2xl font-bold text-foreground">
            {summary.metrics.interventionCount}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <span className="text-xs font-medium text-muted-foreground">Heures</span>
          <span className="text-2xl font-bold text-foreground">
            {summary.metrics.hours.toFixed(1)}h
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <span className="text-xs font-medium text-muted-foreground">Montant estimé</span>
          <span className="text-2xl font-bold text-foreground">
            {summary.metrics.estimatedAmount.toFixed(0)} €
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <span className="text-xs font-medium text-muted-foreground">À vérifier</span>
          <span className="text-2xl font-bold text-foreground">{summary.metrics.toCheckCount}</span>
        </div>
      </section>

      {/* Alertes */}
      {summary.alerts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Alertes</h2>
          {summary.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-3 text-sm ${
                alert.severity === 'warning'
                  ? 'border-yellow-500/30 bg-yellow-500/8 text-yellow-700 dark:text-yellow-400'
                  : 'border-primary/30 bg-primary/8 text-primary'
              }`}
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="opacity-80">{alert.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Dernières interventions */}
      {summary.latestInterventions.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Dernière activité</h2>
          <div className="flex flex-col divide-y divide-border">
            {summary.latestInterventions.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={`/interventions/${item.id}`}
                className="flex items-center justify-between gap-3 py-3 active:scale-[0.98] transition-transform duration-200"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.zoneName} · {item.phaseName}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {item.hours.toFixed(1)}h
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {summary.latestInterventions.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Aucune intervention enregistrée aujourd'hui.
        </p>
      )}

      {/* Bouton flottant Ajouter */}
      <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),0.75rem)+5.5rem)] inset-x-0 z-40 flex justify-center px-5 pointer-events-none">
        <Link
          className="pointer-events-auto flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-[0.98]"
          href="/interventions/new"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Ajouter une intervention
        </Link>
      </div>
    </TabScreen>
  )
}
