import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { BiodexEnhanced } from '@/app/[locale]/(marketing)/biodex/components/biodex-enhanced'

export async function AdventureBiodex() {
  const speciesList = await getSpeciesContextList()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <BiodexEnhanced species={speciesList} />
    </div>
  )
}
