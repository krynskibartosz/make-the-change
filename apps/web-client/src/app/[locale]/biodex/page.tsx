import { getSpeciesContextList } from '@/lib/api/species-context.service'
import type { SpeciesContext } from '@/types/context'
import { BiodexClient } from './biodex-client'

export default async function BiodexPage({ params }: { params: { locale: string } }) {
  const speciesList = await getSpeciesContextList()

  return <BiodexClient species={speciesList} />
}
