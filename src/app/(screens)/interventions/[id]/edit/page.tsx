import { EmptyState } from '@/components/ui'
import { createEditInterventionState } from '@/features/interventions/add-flow'
import { EditInterventionFlow } from '@/features/interventions/edit-flow'
import { clarusRepository } from '@/lib/repositories'
import { Screen } from '../../../_components/screen'

type EditInterventionPageProps = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default async function EditInterventionPage({ params }: EditInterventionPageProps) {
  const { id } = await params

  const intervention = await clarusRepository.getInterventionById(id)
  const allWorkEntries = await clarusRepository.getWorkEntries()
  const workEntries = allWorkEntries.filter((we) => we.interventionId === id)

  if (!intervention) {
    return (
      <Screen title="Editer l'intervention">
        <EmptyState title="Introuvable" description="L'intervention a editer n'existe pas." />
      </Screen>
    )
  }

  const initialState = createEditInterventionState(intervention, workEntries)

  return (
    <Screen title="Editer">
      <EditInterventionFlow interventionId={intervention.id} initialState={initialState} />
    </Screen>
  )
}
