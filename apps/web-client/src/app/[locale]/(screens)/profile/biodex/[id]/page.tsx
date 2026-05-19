import { getSpeciesContext } from '@/lib/api/species-context.service'
import { getProjects } from '@/app/[locale]/(tabs)/projects/_features/get-projects'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { SpeciesDetailClient } from './_components/species-detail-client'

export default async function SpeciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [species, allProjects] = await Promise.all([getSpeciesContext(id), getProjects()])
  const linkedProjects = allProjects.filter((p) =>
    species?.associated_projects?.some((ap) => ap.slug === p.slug),
  )

  if (!species) {
    return (
      <FullScreenSlideModal fallbackHref='/profile/biodex' headerMode='back'>
        <div className='flex h-full items-center justify-center'>
          <p className='text-white/50'>Espèce non trouvée</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal
      title={species.name_default}
      fallbackHref='/profile/biodex'
      headerMode='dynamic'
      contentClassName='overflow-y-auto'
    >
      <div className='mx-auto w-full max-w-2xl'>
        <SpeciesDetailClient species={species} linkedProjects={linkedProjects} />
      </div>
    </FullScreenSlideModal>
  )
}
