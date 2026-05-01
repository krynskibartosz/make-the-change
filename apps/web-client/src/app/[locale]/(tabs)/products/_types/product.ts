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
