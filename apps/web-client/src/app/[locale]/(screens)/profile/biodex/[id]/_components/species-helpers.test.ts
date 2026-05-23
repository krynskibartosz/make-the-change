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
  it('returns generated BioDex covers for species that have one', () => {
    const cases = [
      ['Aglais io', '/images/biodex/hero-aglais-io.png'],
      ['Acropora muricata', '/images/biodex/hero-acropora-muricata.png'],
      ['Amphiprion ocellaris', '/images/biodex/hero-amphiprion-ocellaris.png'],
      ['Apis mellifera ligustica', '/images/biodex/hero-apis-mellifera-ligustica.png'],
      ['Athene superciliaris', '/images/biodex/hero-athene-superciliaris.png'],
      ['Bombus terrestris', '/images/biodex/hero-bombus-terrestris.png'],
      ['Coccinella septempunctata', '/images/biodex/hero-coccinella-septempunctata.png'],
      ['Gonepteryx rhamni', '/images/biodex/hero-gonepteryx-rhamni.png'],
      ['Liotrigona bitika', '/images/biodex/hero-liotrigona-bitika.png'],
      ['Megachile centuncularis', '/images/biodex/hero-megachile-centuncularis.png'],
      ['Trachelophorus giraffa', '/images/biodex/hero-trachelophorus-giraffa.png'],
    ] as const

    for (const [scientificName, expectedHero] of cases) {
      expect(getSpeciesHeroImage(createSpecies(scientificName))).toBe(expectedHero)
    }
  })

  it('keeps the existing black bee cover as the default fallback', () => {
    expect(getSpeciesHeroImage(createSpecies('Unknown species'))).toBe(
      '/images/biodex/hero-apis-mellifera-unicolor.png'
    )
  })
})
