import { createEditInterventionState } from '@/features/interventions/add-flow'
import { EditInterventionFlow } from '@/features/interventions/edit-flow'
import { mockClarusRepository } from '@/lib/repositories'
import { Screen } from '../../../_components/screen'

type EditInterventionPageProps = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default async function EditInterventionPage({ params }: EditInterventionPageProps) {
  const { id } = await params

  const intervention = await mockClarusRepository.getInterventionById(id)
  const allWorkEntries = await mockClarusRepository.getWorkEntries()
  const workEntries = allWorkEntries.filter((we: any) => we.interventionId === id)

  if (!intervention) {
    return (
      <Screen title="Editer l'intervention">
        <div>Introuvable - L'intervention a editer n'existe pas.</div>
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
