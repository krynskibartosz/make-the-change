import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { BiodexClient } from './_components/biodex-client'

export default async function BiodexPage() {
  const speciesList = await getSpeciesContextList()

  return <BiodexClient species={speciesList} />
}
