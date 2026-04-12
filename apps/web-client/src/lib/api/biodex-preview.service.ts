import { getSpeciesContextList } from '@/lib/api/species-context.service'

type BiodexPreviewSpecies = {
  id: string
  name: string
  image: string
  rarity: 'Commun' | 'Rare' | 'Légendaire'
  isUnlocked: boolean
}

type BiodexPreviewData = {
  unlockedSpecies: BiodexPreviewSpecies[]
  lockedSpecies: BiodexPreviewSpecies[]
  unlockedCount: number
  totalCount: number
}

type BiodexPreviewOptions = {
  unlockedLimit?: number
  lockedLimit?: number
}

type FallbackSpecies = {
  id: string
  name_default: string
  conservation_status: string
  isUnlocked: boolean
}

const DEFAULT_SPECIES_IMAGE = '/images/diorama-chouette.png'

const FALLBACK_SPECIES: FallbackSpecies[] = [
  {
    id: 'species-chouette-effraie',
    name_default: 'Chouette Effraie',
    conservation_status: 'LC',
    isUnlocked: true,
  },
  {
    id: 'species-abeille-mellifere',
    name_default: 'Abeille mellifère',
    conservation_status: 'NT',
    isUnlocked: false,
  },
  {
    id: 'species-abeille-noire',
    name_default: 'Abeille Noire',
    conservation_status: 'VU',
    isUnlocked: false,
  },
  {
    id: 'species-coccinelle-7-points',
    name_default: 'Coccinelle à 7 points',
    conservation_status: 'LC',
    isUnlocked: false,
  },
  {
    id: 'species-grenouille-rousse',
    name_default: 'Grenouille Rousse',
    conservation_status: 'NT',
    isUnlocked: false,
  },
  {
    id: 'species-heron-cendre',
    name_default: 'Héron Cendré',
    conservation_status: 'LC',
    isUnlocked: false,
  },
  {
    id: 'species-lavande-vraie',
    name_default: 'Lavande vraie',
    conservation_status: 'LC',
    isUnlocked: false,
  },
  {
    id: 'species-lynx-boreal',
    name_default: 'Lynx Boréal',
    conservation_status: 'EN',
    isUnlocked: false,
  },
]

const getRarityLabel = (status: string | null | undefined): BiodexPreviewSpecies['rarity'] => {
  const normalized = status?.toUpperCase()
  if (normalized === 'EN' || normalized === 'CR' || normalized === 'EW' || normalized === 'EX') {
    return 'Légendaire'
  }
  if (normalized === 'VU' || normalized === 'NT') {
    return 'Rare'
  }
  return 'Commun'
}

const sortByUnlockAndName = <
  T extends { name_default: string; isUnlocked: boolean },
>(
  list: T[],
): T[] => {
  return [...list].sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1
    if (!a.isUnlocked && b.isUnlocked) return 1
    return a.name_default.localeCompare(b.name_default, 'fr')
  })
}

export async function getBiodexPreviewData(
  options: BiodexPreviewOptions = {},
): Promise<BiodexPreviewData> {
  const { unlockedLimit = 2, lockedLimit = 2 } = options

  const speciesFromApi = await getSpeciesContextList()

  const normalizedSpecies =
    speciesFromApi.length > 0
      ? speciesFromApi.map((species) => ({
          id: species.id,
          name_default: species.name_default,
          conservation_status: species.conservation_status,
          image_url: species.image_url,
          isUnlocked: Boolean(species.user_status?.isUnlocked),
        }))
      : FALLBACK_SPECIES.map((species) => ({
          ...species,
          image_url: null,
        }))

  const sorted = sortByUnlockAndName(normalizedSpecies)

  const mapped: BiodexPreviewSpecies[] = sorted.map((species) => ({
    id: species.id,
    name: species.name_default,
    image: species.image_url || DEFAULT_SPECIES_IMAGE,
    rarity: getRarityLabel(species.conservation_status),
    isUnlocked: species.isUnlocked,
  }))

  const unlockedSpecies = mapped.filter((species) => species.isUnlocked)
  const lockedSpecies = mapped.filter((species) => !species.isUnlocked)

  return {
    unlockedSpecies: unlockedSpecies.slice(0, unlockedLimit),
    lockedSpecies: lockedSpecies.slice(0, lockedLimit),
    unlockedCount: unlockedSpecies.length,
    totalCount: mapped.length,
  }
}

