import Link from 'next/link'
import { InfoRow, MetricCard } from '@/components/ui'
import { selectCostsSummary } from '@/features/costs'
import { clarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'

export default async function CostsPage() {
  const [interventions, workEntries, people, zones, phases] = await Promise.all([
    clarusRepository.getInterventions(),
    clarusRepository.getWorkEntries(),
    clarusRepository.getPeople(),
    clarusRepository.getZones(),
    clarusRepository.getPhases(),
  ])

  const summary = selectCostsSummary({
    interventions,
    workEntries,
    people,
    zones,
    phases,
  })

  return (
    <TabScreen title="Couts">
      <div className="flex flex-col gap-8">
        <section>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Heures totales" value={`${summary.totals.hours}h`} />
            <MetricCard label="Main d'oeuvre" value={`${summary.totals.laborAmount} \u20ac`} />
            <MetricCard
              label="A verifier"
              tone={summary.totals.toCheckAmount > 0 ? 'warning' : 'neutral'}
              value={`${summary.totals.toCheckAmount} \u20ac`}
            />
            <MetricCard
              label="Supplement"
              tone={summary.totals.extraAmount > 0 ? 'info' : 'neutral'}
              value={`${summary.totals.extraAmount} \u20ac`}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Link
            href="/ajouter-depense"
            className="inline-flex min-h-[var(--size-primary-button)] items-center justify-center rounded-[var(--radius-control)] bg-primary px-5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-colors"
          >
            Ajouter une dépense
          </Link>

          <Link
            href="/facturation"
            className="inline-flex min-h-[var(--size-primary-button)] items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-elevated px-5 text-base font-semibold text-foreground transition-colors"
          >
            Gérer la facturation
          </Link>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">Par personne</h2>
          <div className="flex flex-col">
            {summary.byPerson.map((person) => (
              <InfoRow
                key={person.personId}
                label={`${person.hours}h`}
                value={`${person.amount} \u20ac`}
                action={<span className="text-sm font-medium text-foreground">{person.name}</span>}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">Par zone</h2>
          <div className="flex flex-col">
            {summary.byZone.map((zone) => (
              <InfoRow
                key={zone.zoneId}
                label={`${zone.hours}h`}
                value={`${zone.amount} \u20ac`}
                action={<span className="text-sm font-medium text-foreground">{zone.name}</span>}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">Par phase</h2>
          <div className="flex flex-col">
            {summary.byPhase.map((phase) => (
              <InfoRow
                key={phase.phaseId}
                label={`${phase.hours}h`}
                value={`${phase.amount} \u20ac`}
                action={<span className="text-sm font-medium text-foreground">{phase.name}</span>}
              />
            ))}
          </div>
        </section>
      </div>
    </TabScreen>
  )
}
