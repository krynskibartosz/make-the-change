import { Calendar, Clock, MapPin, Search } from 'lucide-react'

import { Badge, EmptyState, InfoRow, StatusChip } from '@/components/ui'
import { clarusRepository } from '@/lib/repositories'
import { Screen } from '../../_components/screen'

type InterventionDetailPageProps = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default async function InterventionDetailPage({ params }: InterventionDetailPageProps) {
  const { id } = await params

  const [intervention, allWorkEntries, zones, phases, people] = await Promise.all([
    clarusRepository.getInterventionById(id),
    clarusRepository.getWorkEntries(),
    clarusRepository.getZones(),
    clarusRepository.getPhases(),
    clarusRepository.getPeople(),
  ])

  if (!intervention) {
    return (
      <Screen title="Intervention">
        <EmptyState
          title="Introuvable"
          description="Cette intervention n'existe pas ou a ete supprimee."
        />
      </Screen>
    )
  }

  const workEntries = allWorkEntries.filter((we) => we.interventionId === intervention.id)
  const zone = zones.find((z) => z.id === intervention.zoneId)
  const phase = phases.find((p) => p.id === intervention.phaseId)

  // Calculations for hours and costs
  const totalHours = workEntries.reduce((acc, we) => acc + we.durationMinutes / 60, 0)
  const totalLaborCost = workEntries.reduce((acc, we) => acc + we.amount, 0)

  const formattedDate = new Date(intervention.date).toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Screen title="Detail">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <section>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusChip status={intervention.status} />
            {intervention.isExtra === true && <Badge tone="info">Supplement</Badge>}
            {intervention.isExtra === 'to_check' && <Badge tone="warning">A confirmer</Badge>}
            {intervention.status === 'to_check' && <Badge tone="warning">A verifier</Badge>}
          </div>
          <h1 className="text-xl font-bold text-foreground">{intervention.title}</h1>
          {intervention.description && (
            <p className="mt-2 text-sm text-muted-foreground">{intervention.description}</p>
          )}
        </section>

        {/* Apercu */}
        <section>
          <h2 className="mb-2 font-semibold text-foreground">Apercu</h2>
          <div className="flex flex-col">
            <InfoRow icon={MapPin} label="Zone" value={zone?.name ?? '-'} action={null} />
            <InfoRow icon={Search} label="Phase" value={phase?.name ?? '-'} action={null} />
            <InfoRow icon={Calendar} label="Date" value={formattedDate} action={null} />
          </div>
        </section>

        {/* Heures & Equipe */}
        <section>
          <h2 className="mb-2 font-semibold text-foreground">Equipe & Heures</h2>
          {workEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune heure encodee.</p>
          ) : (
            <div className="flex flex-col">
              {workEntries.map((we) => {
                const person = people.find((p) => p.id === we.personId)
                return (
                  <InfoRow
                    key={we.id}
                    icon={Clock}
                    label={person?.name ?? 'Inconnu'}
                    value={`${we.durationMinutes / 60}h`}
                    action={
                      <span className="text-sm text-muted-foreground">
                        {we.startTime} - {we.endTime}
                      </span>
                    }
                  />
                )
              })}
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <span className="text-sm font-medium text-foreground">Total heures</span>
                <span className="font-mono text-base font-semibold text-foreground">
                  {totalHours}h
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Couts */}
        <section>
          <h2 className="mb-2 font-semibold text-foreground">Couts</h2>
          <div className="flex flex-col">
            <InfoRow label="Main d'oeuvre" value={`${totalLaborCost} \u20ac`} action={null} />
            {/* V0: Material / Expenses simplified */}
            <InfoRow label="Materiaux & Depenses" value="Voir dashboard" action={null} />
          </div>
        </section>

        {/* Photos (Placeholder) */}
        <section>
          <h2 className="mb-2 font-semibold text-foreground">Photos</h2>
          <EmptyState
            title="Photos"
            description="L'affichage des photos sera disponible dans la prochaine version."
            className="py-6"
          />
        </section>
      </div>
    </Screen>
  )
}
