import type { Metadata } from 'next'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { EcosystemInteractionsLab } from '../../_components/ecosystem-interactions-lab'

export const metadata: Metadata = {
  title: 'Microscope des liens | Toile Vivante | Make the Change',
}

export default async function EcosystemInteractionsLabPage() {
  const species = await getSpeciesContextList()

  return <EcosystemInteractionsLab species={species} />
}
