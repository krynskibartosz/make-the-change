import type { Metadata } from 'next'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { EcosystemDetail } from '../_components/ecosystem-detail'
import { notFound } from 'next/navigation'
import { getEcosystemById } from '@/lib/ecosystem/graph'

interface EcosystemDetailPageProps {
  params: {
    id: string
    locale: string
  }
}

export async function generateMetadata({ params }: EcosystemDetailPageProps): Promise<Metadata> {
  const ecosystem = getEcosystemById(params.id)
  
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
  const ecosystem = getEcosystemById(params.id)
  
  if (!ecosystem) {
    notFound()
  }

  const species = await getSpeciesContextList()

  return (
    <EcosystemDetail
      ecosystemId={params.id}
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
