// Project Context Types
export interface ProjectContext {
  id: string
  name_default: string
  slug: string
  description_default: string
  status: string
  type: string
  producer_name: string
  producer_website: string | null
  producer_city: string | null
  producer_country: string | null
  species: ProjectSpecies[] | null
  challenges: ProjectChallenge[] | null
  producer_products: ProducerProduct[] | null
  expected_impact: ProjectImpact | null
  // Additional fields from original project
  hero_image_url?: string | null
  images?: string[] | null
  address_city?: string | null
  address_country_code?: string | null
  current_funding?: number | null
  target_budget?: number | null
}

export interface ProjectSpecies {
  id: string
  name: string
  scientificName: string
  icon: string | null
  rarity: number
  status: string
  role: string
}

export interface ProjectChallenge {
  id: string
  name: string
  type: string
  difficulty: string
  userParticipation: boolean
  rewards: any[]
}

export interface ProducerProduct {
  id: string
  name: string
  price: number
  category: string
  impactPercentage: number
  image_url?: string | null
}

export interface ProjectImpact {
  co2Absorbed: number | null
  biodiversityGain: number | null
  jobsCreated: number | null
  timeline: number | null
}

// Product Context Types
export interface ProductContext {
  id: string
  name_default: string
  slug: string
  description_default: string
  price_points: number | null
  category: string | null
  image_url: string | null
  producer_name: string
  producer_description: string | null
  producer_website: string | null
  supported_projects: SupportedProject[] | null
  linked_species: LinkedSpecies[] | null
  impact: ProductImpact | null
  // Additional fields
  stock_quantity?: number | null
  fulfillment_method?: string | null
  impact_story?: string | null
  biodex_compatibility?: boolean
  user_actions?: any
}

export interface SupportedProject {
  id: string
  name: string
  impactPercentage: number
  ecosystem: string | null
  status: string
}

export interface LinkedSpecies {
  id: string
  name: string
  icon: string | null
  relationship: string
  impact: string | null
}

export interface ProductImpact {
  environmental: {
    co2Footprint: number | null
    waterUsage: number | null
    biodiversityImpact: string | null
    recyclability: number | null
  }
  social: {
    localJobs: number | null
    fairTrade: boolean
    communitySupport: string | null
  }
  economic: {
    localRevenue: number | null
    profitSharing: number | null
    pricePremium: number | null
  }
}

// Species Context Types
export interface SpeciesContext {
  id: string
  name_default: string
  scientific_name: string
  description_default: string
  conservation_status: string
  image_url: string | null
  associated_projects: AssociatedProject[] | null
  associated_producers: AssociatedProducer[] | null
  associated_challenges: AssociatedChallenge[] | null
  user_status: UserSpeciesStatus | null
  // Additional fields
  habitat?: string[] | null
  threats?: string[] | null
}

export interface AssociatedProject {
  id: string
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

// Post Context Types
export interface PostContext {
  id: string
  content: string
  type: string
  visibility: string
  created_at: string
  author_name: string
  author_avatar: string | null
  source_badge: SourceBadge | null
  linked_entity: LinkedEntity | null
  engagement: PostEngagement
  user_state: UserPostState
}

export interface SourceBadge {
  type: string
  id: string
  name: string
  icon: string | null
  color: string | null
  link: string
}

export interface LinkedEntity {
  type: string
  id: string
  name: string
  description: string | null
  image: string | null
  link: string
}

export interface PostEngagement {
  likes: number
  comments: number
  shares: number
  bookmarks: number
  views: number
}

export interface UserPostState {
  hasLiked: boolean
  hasBookmarked: boolean
  hasShared: boolean
  canComment: boolean
  canEdit: boolean
}

export interface PostFilters {
  sourceType?: string
  sourceId?: string
  authorId?: string
}
