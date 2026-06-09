import Link from 'next/link'

import { MetricCard } from '@/components/ui'
import { InterventionCard } from '@/features/interventions/components'
import { clarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'

export default async function TodayPage() {
  const project = await clarusRepository.getProject()
  const summary = await clarusRepository.getTodaySummary('2026-06-08')
  const formattedDate = new Date(summary.date).toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <TabScreen
      action={
        <Link
          className="inline-flex min-h-12 items-center rounded-[var(--radius-control)] bg-primary px-4 text-sm font-semibold text-primary-foreground"
          href="/ajouter"
        >
          Ajouter
        </Link>
      }
      eyebrow={project.name}
      subtitle={capitalizedDate}
      title="Aujourd'hui"
    >
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Interventions" value={summary.metrics.interventionCount.toString()} />
        <MetricCard label="Heures" value={`${summary.metrics.hours}h`} />
        <MetricCard
          label="A verifier"
          tone={summary.metrics.toCheckCount > 0 ? 'warning' : 'neutral'}
          value={summary.metrics.toCheckCount.toString()}
        />
        <MetricCard label="Montant estime" value={`${summary.metrics.estimatedAmount} \u20ac`} />
      </div>

      {summary.alerts.length > 0 ? (
        <section className="mt-4">
          <h2 className="mb-3 font-semibold text-foreground">
            A verifier ({summary.alerts.length})
          </h2>
          <div className="flex flex-col gap-3">
            {summary.alerts.map((alert) => (
              <div
                className="rounded-[var(--radius-card)] border border-warning/30 bg-warning/10 p-4"
                key={alert.id}
              >
                <p className="font-medium text-warning">{alert.title}</p>
                <p className="mt-1 text-sm text-warning/80">{alert.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Dernieres interventions</h2>
          <Link className="text-sm font-medium text-primary" href="/journal">
            Tout voir
          </Link>
        </div>

        {summary.latestInterventions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune intervention aujourd'hui.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {summary.latestInterventions.map((intervention) => (
              <InterventionCard key={intervention.id} intervention={intervention} />
            ))}
          </div>
        )}
      </section>
    </TabScreen>
  )
}
