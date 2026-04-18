import { createClient } from '@/lib/supabase/server'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { getMockSpeciesContext, getMockSpeciesContextList } from '@/lib/mock/mock-biodex'
import { isRecord, asString, asNumber, asStringArray } from '@/lib/type-guards'
import type { 
  SpeciesContext, 
  AssociatedProject, 
  AssociatedProducer, 
  AssociatedChallenge, 
  UserSpeciesStatus,
  SpeciesFilters
} from '@/types/context'

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }
  const parsed = asNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

const toNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  const str = asString(value)
  return str === '' ? null : str
}

const PROTOTYPE_UNLOCK_SOURCE = 'prototype_checkout_unlock'

function ensurePrototypeUnlockedSpecies(speciesList: SpeciesContext[]): SpeciesContext[] {
  if (speciesList.length === 0) return speciesList

  const alreadyUnlocked = speciesList.some((species) => species.user_status?.isUnlocked)
  if (alreadyUnlocked) return speciesList

  const preferredIndex = speciesList.findIndex((species) =>
    species.name_default.toLowerCase().includes('chouette'),
  )
  const targetIndex = preferredIndex >= 0 ? preferredIndex : 0

  return speciesList.map((species, index) => {
    if (index !== targetIndex) return species

    return {
      ...species,
      user_status: {
        isUnlocked: true,
        unlockedDate: new Date().toISOString(),
        unlockSource: PROTOTYPE_UNLOCK_SOURCE,
        progressionLevel: species.user_status?.progressionLevel ?? 1,
      },
    }
  })
}

export async function getSpeciesContext(id: string): Promise<SpeciesContext | null> {
  if (isMockDataSource) {
    const session = await getMockViewerSession()
    return getMockSpeciesContext(id, session?.viewerId)
  }

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_species_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching species context:', error)
    return null
  }
  
  return mapSpeciesContext(data)
}

export async function getSpeciesContextList(filters?: SpeciesFilters): Promise<SpeciesContext[]> {
  if (isMockDataSource) {
    const session = await getMockViewerSession()
    let speciesList = getMockSpeciesContextList(session?.viewerId)

    if (filters?.status) {
      speciesList = speciesList.filter((species) => species.conservation_status === filters.status)
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase().trim()
      speciesList = speciesList.filter((species) =>
        species.name_default.toLowerCase().includes(query) ||
        species.description_default.toLowerCase().includes(query),
      )
    }

    return ensurePrototypeUnlockedSpecies(speciesList)
  }

  const supabase = await createClient()
  
  let query = supabase.from('v_species_context').select('*')
  
  if (filters?.category) {
    // Assuming category is a field or related table filter
    // query = query.eq('category', filters.category)
  }
  
  if (filters?.status) {
    query = query.eq('conservation_status', filters.status)
  }
  
  if (filters?.search) {
    query = query.ilike('name_default', `%${filters.search}%`)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching species list:', error)
    return []
  }
  
  const mappedSpecies = mapArray(data, mapSpeciesContext)
  return ensurePrototypeUnlockedSpecies(mappedSpecies)
}

function mapSpeciesContext(data: unknown): SpeciesContext | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name_default)
  
  if (!id || !name) return null
  
  return {
    id,
    name_default: name,
    scientific_name: asString(data.scientific_name),
    description_default: asString(data.description_default),
    conservation_status: asString(data.conservation_status),
    image_url: toNullableString(data.image_url),
    associated_projects: mapArray(data.associated_projects, mapAssociatedProject),
    associated_producers: mapArray(data.associated_producers, mapAssociatedProducer),
    associated_challenges: mapArray(data.associated_challenges, mapAssociatedChallenge),
    user_status: mapUserSpeciesStatus(data.user_status),
    habitat: asStringArray(data.habitat),
    threats: asStringArray(data.threats)
  }
}

function mapArray<T>(data: unknown, mapper: (item: unknown) => T | null): T[] {
  if (!Array.isArray(data)) return []
  return data.map(mapper).filter((item): item is T => item !== null)
}

function mapAssociatedProject(data: unknown): AssociatedProject | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    slug: asString(data.slug) || asString(data.project_slug) || null,
    name,
    type: asString(data.type),
    role: asString(data.role),
    impact: toNullableString(data.impact),
    userParticipation: Boolean(data.userParticipation)
  }
}

function mapAssociatedProducer(data: unknown): AssociatedProducer | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    location: toNullableString(data.location),
    relationship: asString(data.relationship),
    projectsCount: asNumber(data.projectsCount)
  }
}

function mapAssociatedChallenge(data: unknown): AssociatedChallenge | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    type: asString(data.type),
    difficulty: asString(data.difficulty),
    rewards: Array.isArray(data.rewards) ? data.rewards : [],
    userProgress: toNullableNumber(data.userProgress)
  }
}

function mapUserSpeciesStatus(data: unknown): UserSpeciesStatus | null {
  if (!isRecord(data)) return null
  
  return {
    isUnlocked: Boolean(data.isUnlocked),
    unlockedDate: toNullableString(data.unlockedDate),
    unlockSource: toNullableString(data.unlockSource),
    progressionLevel: asNumber(data.progressionLevel)
  }
}
