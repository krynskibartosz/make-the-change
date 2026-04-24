import type { Metadata } from 'next'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { EcosystemPathV1 } from './_components/ecosystem-path-v1'

export const metadata: Metadata = {
  title: 'Toile Vivante | Make the Change',
}

export default async function EcosystemPage() {
  const species = await getSpeciesContextList()

  return (
    <EcosystemPathV1
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
