export type {
  ProjectSpecies,
  ProjectChallenge,
  ProjectType,
  ProducerProduct,
  ProjectImpact,
  DonationReward,
  DonationImpact,
  DonationOption,
  SupportRewardTier,
} from '@/types/project'

import type { ProjectSpecies, ProjectChallenge, ProducerProduct, ProjectImpact } from '@/types/project'

// Project Context Types
export type ProjectContext = {
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
  hero_image_url?: string | null
  images?: string[] | null
  address_city?: string | null
  address_country_code?: string | null
  current_funding?: number | null
  target_budget?: number | null
}
