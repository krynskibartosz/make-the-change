import { notFound } from 'next/navigation'
import { FullScreenSlideModal } from '@/app/@modal/_components/full-screen-slide-modal'
import { InterventionQuickView } from '@/features/interventions/components/intervention-quick-view'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

type InterventionDetailPageProps = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default async function InterventionDetailPage({ params }: InterventionDetailPageProps) {
  const { id } = await params

  const intervention = await mockClarusRepository.getInterventionById(id)

  if (!intervention) {
    notFound()
  }

  // En V0 mock-first, on filtre manuellement les données liées
  const [allWorkEntries, allExpenses, allTasks, allPhotos, phases, zones, allMaterialMovements] =
    await Promise.all([
      mockClarusRepository.getWorkEntries(),
      mockClarusRepository.getExpenses(),
      mockClarusRepository.getTasks(),
      mockClarusRepository.getPhotos(),
      mockClarusRepository.getPhases(),
      mockClarusRepository.getZones(),
      mockClarusRepository.getMaterialMovements(),
    ])

  const workEntries = allWorkEntries.filter((e) => e.interventionId === intervention.id)
  const expenses = allExpenses.filter((e) => e.interventionId === intervention.id)
  const tasks = allTasks.filter((t) => t.interventionId === intervention.id)
  const photos = allPhotos.filter((p) => p.interventionId === intervention.id)
  const materialMovements = allMaterialMovements.filter((m) => m.interventionId === intervention.id)

  return (
    <FullScreenSlideModal
      title="Détails de l'intervention"
      fallbackHref="/journal"
      headerMode="back"
      asPage
      contentClassName="bg-background"
    >
      <InterventionQuickView
        intervention={intervention}
        workEntries={workEntries}
        expenses={expenses}
        tasks={tasks}
        photos={photos}
        phases={phases}
        zones={zones}
        materialMovements={materialMovements}
      />
    </FullScreenSlideModal>
  )
}
