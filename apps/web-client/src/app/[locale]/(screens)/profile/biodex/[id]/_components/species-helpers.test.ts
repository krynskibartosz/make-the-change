import { describe, expect, it } from 'vitest'
import type { SpeciesContext } from '@/types/species'
import { getSpeciesHeroImage } from './species-helpers'

function createSpecies(scientificName: string): SpeciesContext {
  return {
    id: `species-${scientificName.toLowerCase().replaceAll(' ', '-')}`,
    name_default: scientificName,
    scientific_name: scientificName,
    description_default: '',
    conservation_status: 'LC',
    image_url: null,
    associated_projects: null,
    associated_producers: null,
    associated_challenges: null,
    user_status: null,
  }
}

describe('getSpeciesHeroImage', () => {
  it('returns the generated BioDex cover for a species that has one', () => {
    expect(getSpeciesHeroImage(createSpecies('Coccinella septempunctata'))).toBe(
      '/images/biodex/hero-coccinella-septempunctata.png'
    )
  })

  it('keeps the existing black bee cover as the default fallback', () => {
    expect(getSpeciesHeroImage(createSpecies('Unknown species'))).toBe(
      '/images/biodex/hero-apis-mellifera-unicolor.png'
    )
  })
})
