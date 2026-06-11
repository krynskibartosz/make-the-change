import type { InterventionListItem } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { HistoriqueView } from './historique-view'

export default async function HistoriquePage() {
  const [interventions, people, zones, phases] = await Promise.all([
    mockClarusRepository.getInterventions(),
    mockClarusRepository.getPeople(),
    mockClarusRepository.getZones(),
    mockClarusRepository.getPhases(),
  ])

  const todayDate = new Date().toISOString().split('T')[0] as string

  // Build InterventionListItem from Intervention
  const interventionListItems: InterventionListItem[] = interventions.map((i) => ({
    id: i.id,
    title: i.title,
    date: i.date,
    type: i.type,
    status: i.status,
    isExtra: i.isExtra,
    updatedAt: i.updatedAt ?? '',
    zoneName: zones.find((z) => z.id === i.zoneId)?.name ?? '',
    phaseName: phases.find((p) => p.id === i.phaseId)?.name ?? '',
    verificationStatus: 'to_check',
    hours: 0,
    amount: 0,
  }))

  return (
    <HistoriqueView
      interventions={interventionListItems}
      todayDate={todayDate}
      people={people}
      zones={zones}
      phases={phases}
    />
  )
}
