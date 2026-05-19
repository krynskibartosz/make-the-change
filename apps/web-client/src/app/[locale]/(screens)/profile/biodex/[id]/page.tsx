import { getSpeciesContext } from '@/lib/api/species-context.service'
import { getProjects } from '@/app/[locale]/(tabs)/projects/_features/get-projects'
import {
  getCachedPublicProducerBySlug,
  type PublicProducer,
} from '@/app/[locale]/(screens)/producers/[slug]/producer-detail-data'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { SpeciesDetailClient } from './_components/species-detail-client'
import type { SpeciesLinkedProducerData } from './_components/species-linked-products'
import type { SpeciesLinkedPartnerData } from './_components/species-linked-partners'

export default async function SpeciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [species, allProjects] = await Promise.all([getSpeciesContext(id), getProjects()])

  const linkedProjects = allProjects.filter((p) =>
    species?.associated_projects?.some((ap) => ap.slug === p.slug),
  )

  const producerSlugs = (species?.associated_producers ?? [])
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s))
  const fetchedProducers = await Promise.all(
    producerSlugs.map((slug) => getCachedPublicProducerBySlug(slug)),
  )
  const linkedProducers: SpeciesLinkedProducerData[] = fetchedProducers
    .filter((p): p is PublicProducer => p !== null)
    .map((p) => ({
      producerSlug: p.slug ?? '',
      producerName: p.name_default,
      products: p.products.slice(0, 4).map((prod) => ({
        id: prod.id,
        slug: prod.slug,
        name_default: prod.name_default,
        image_url: prod.image_url,
      })),
    }))
    .filter((p) => p.producerSlug && p.products.length > 0)

  const linkedPartners: SpeciesLinkedPartnerData[] = fetchedProducers
    .filter((p): p is PublicProducer => p !== null)
    .map((p) => {
      const assoc = species?.associated_producers?.find((ap) => ap.slug === p.slug)
      return {
        slug: p.slug ?? '',
        name: p.name_default,
        tagline: p.tagline ?? null,
        addressCity: p.address_city,
        addressCountryCode: p.address_country_code,
        projectsCount: assoc?.projectsCount ?? p.projects.length,
        relationship: assoc?.relationship ?? null,
        imageUrl: p.visualAssets?.logo ?? p.images[0] ?? null,
      }
    })
    .filter((p) => p.slug)

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
        <SpeciesDetailClient
          species={species}
          linkedProjects={linkedProjects}
          linkedProducers={linkedProducers}
          linkedPartners={linkedPartners}
        />
      </div>
    </FullScreenSlideModal>
  )
}
