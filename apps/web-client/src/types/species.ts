// Species Context Types
export interface SpeciesContext {
  id: string
  name_default: string
  scientific_name: string
  description_default: string
  description_scientific?: string | null
  conservation_status: string
  image_url: string | null
  associated_projects: AssociatedProject[] | null
  associated_producers: AssociatedProducer[] | null
  associated_challenges: AssociatedChallenge[] | null
  user_status: UserSpeciesStatus | null
  // Additional fields
  habitat?: string[] | null
  threats?: string[] | null
  weight?: string | null
  size?: string | null
  origin_country?: string | null
  diet?: string | null
}

export interface AssociatedProject {
  id: string
  slug?: string | null
  name: string
  type: string
  role: string
  impact: string | null
  userParticipation: boolean
}

export interface AssociatedProducer {
  id: string
  name: string
  location: string | null
  relationship: string
  projectsCount: number
}

export interface AssociatedChallenge {
  id: string
  name: string
  type: string
  difficulty: string
  rewards: any[]
  userProgress: number | null
}

export interface UserSpeciesStatus {
  isUnlocked: boolean
  unlockedDate: string | null
  unlockSource: string | null
  progressionLevel: number
}

export interface SpeciesFilters {
  category?: string
  status?: string
  biome?: string
  search?: string
}
