import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { BiodexEnhanced } from '@/app/[locale]/biodex/components/biodex-enhanced'
import type { Faction } from '@/lib/mock/types'

type AdventureBiodexProps = {
  initialFaction?: Faction | null
}

export async function AdventureBiodex({ initialFaction }: AdventureBiodexProps) {
  const speciesList = await getSpeciesContextList()

  return (
    <>
      <BiodexEnhanced species={speciesList} initialFaction={initialFaction ?? null} />
    </>
  )
}
