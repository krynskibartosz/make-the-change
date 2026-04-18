import type { Faction } from '@/lib/mock/types'

export const MOCK_EXISTING_VIEWER_ID = 'mock-viewer-bartosz'

export const MOCK_PRODUCER_ILANGA_ID = 'mock-producer-ilanga-nature'
export const MOCK_PRODUCER_ILANGA_SLUG = 'ilanga-nature'

export const MOCK_PROJECT_ANTSIRABE_ID = 'mock-project-ruchers-antsirabe'
export const MOCK_PROJECT_ANTSIRABE_SLUG = 'ruchers-apiculteurs-independants-antsirabe'
export const MOCK_PROJECT_MANAKARA_ID = 'mock-project-miellerie-manakara'
export const MOCK_PROJECT_MANAKARA_SLUG = 'miellerie-manakara-ilanga-nature'

export const MOCK_PRODUCT_EUCALYPTUS_ID = 'mock-product-miel-eucalyptus-ilanga'
export const MOCK_PRODUCT_EUCALYPTUS_SLUG = 'miel-eucalyptus-ilanga'
export const MOCK_PRODUCT_MANAKARA_ID = 'mock-product-miel-manakara-ilanga'
export const MOCK_PRODUCT_MANAKARA_SLUG = 'miel-manakara-ilanga'

export const MOCK_SPECIES_OWL_ID = 'species-chouette-effraie'
export const MOCK_SPECIES_HONEY_BEE_ID = 'species-abeille-mellifere'
export const MOCK_SPECIES_BLACK_BEE_ID = 'species-abeille-noire'
export const MOCK_SPECIES_LADYBUG_ID = 'species-coccinelle-7-points'

export const MOCK_CHALLENGE_ECO_FACT_ID = 'eco-fact'
export const MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID = 'collective-bravo'
export const MOCK_CHALLENGE_DAILY_HARVEST_ID = 'daily-harvest'

export const FACTION_TO_TRIBE_ID: Record<Faction, string> = {
  'Vie Sauvage': 'campus-biodiversity-lab',
  'Terres & Forêts': 'agroforest-pioneers',
  'Artisans Locaux': 'zero-dechet',
}

export type MockTribeMeta = {
  slug: string
  name: string
  membersCount: number
  coverImage: string
}

export const MOCK_TRIBE_DIRECTORY: Record<string, MockTribeMeta> = {
  'campus-biodiversity-lab': {
    slug: 'campus-biodiversity-lab',
    name: 'Campus Biodiversity Lab',
    membersCount: 64,
    coverImage:
      'https://images.unsplash.com/photo-1516571748831-5d81767b788d?auto=format&fit=crop&q=80&w=400',
  },
  'agroforest-pioneers': {
    slug: 'agroforest-pioneers',
    name: 'Agroforest Pioneers',
    membersCount: 42,
    coverImage:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
  },
  'ocean-mangrove-circle': {
    slug: 'ocean-mangrove-circle',
    name: 'Ocean Mangrove Circle',
    membersCount: 128,
    coverImage:
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=400',
  },
  'zero-dechet': {
    slug: 'zero-dechet',
    name: 'Zero Dechet Makers',
    membersCount: 57,
    coverImage:
      'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&q=80&w=400',
  },
}
