import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { BiodexEnhanced } from '@/app/[locale]/(marketing)/biodex/components/biodex-enhanced'

export async function AdventureBiodex() {
  const speciesList = await getSpeciesContextList()

  return (
    <>
      <BiodexEnhanced species={speciesList} />
    </>
  )
}
