import { toInterventionListItem } from '@/features/dashboard'
import { clarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'
import { JournalClient } from './journal-client'

export default async function JournalPage() {
  const [interventions, workEntries, zones, phases] = await Promise.all([
    clarusRepository.getInterventions(),
    clarusRepository.getWorkEntries(),
    clarusRepository.getZones(),
    clarusRepository.getPhases(),
  ])

  const mappedInterventions = interventions.map((intervention) =>
    toInterventionListItem(intervention, workEntries, zones, phases),
  )

  return (
    <TabScreen title="Journal">
      <JournalClient interventions={mappedInterventions} todayDate="2026-06-08" />
    </TabScreen>
  )
}
