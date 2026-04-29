import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { getEcosystemById } from '@/lib/ecosystem/graph'
import { EcosystemDetail } from '../_components/ecosystem-detail'

interface EcosystemDetailPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export async function generateMetadata({ params }: EcosystemDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const ecosystem = getEcosystemById(id)

  if (!ecosystem) {
    return {
      title: 'Écosystème non trouvé | Make the Change',
    }
  }

  return {
    title: `${ecosystem.name} | Toile Vivante | Make the Change`,
  }
}

export default async function EcosystemDetailPage({ params }: EcosystemDetailPageProps) {
  const { id } = await params
  const ecosystem = getEcosystemById(id)

  if (!ecosystem) {
    notFound()
  }

  const species = await getSpeciesContextList()

  return (
    <EcosystemDetail
      ecosystemId={id}
      species={species.map((entry) => ({
        id: entry.id,
        name: entry.name_default,
        scientificName: entry.scientific_name,
        conservationStatus: entry.conservation_status,
        imageUrl: entry.image_url,
        isUnlocked: Boolean(entry.user_status?.isUnlocked),
      }))}
    />
  )
}
