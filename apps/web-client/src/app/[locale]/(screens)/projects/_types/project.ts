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
  // Additional fields from original project
  hero_image_url?: string | null
  images?: string[] | null
  address_city?: string | null
  address_country_code?: string | null
  current_funding?: number | null
  target_budget?: number | null
}

export type ProjectSpecies = {
  id: string
  name: string
  scientificName: string
  icon: string | null
  rarity: number
  status: string
  role: string
}

export type ProjectChallenge = {
  id: string
  name: string
  type: string
  difficulty: string
  userParticipation: boolean
  rewards: any[]
}

export type ProducerProduct = {
  id: string
  name: string
  price: number
  price_points?: number | null
  category: string
  impactPercentage: number
  image_url?: string | null
  size?: string // ex: "250g", "140g", "500ml"
  type?: 'impact' | 'collectible' // distinction produit impact vs collectible
  format?: string // ex: "bocal", "sachet", "tirage photo"
}

export type ProjectImpact = {
  co2Absorbed: number | null
  biodiversityGain: number | null
  jobsCreated: number | null
  timeline: number | null
  // Métriques détaillées par € pour les abeilles
  beesPerEur?: number
  honeyGramsPerEur?: number
  co2GramsPerEur?: number
  flowersPerEur?: number
  propolisGramsPerEur?: number
  waxGramsPerEur?: number
  pollenGramsPerEur?: number
  nectarGramsPerEur?: number
  // Métriques détaillées pour les coraux
  fishShelterCapacity?: number
  blueCarbonPotential?: number
  // Métriques détaillées pour les oliviers
  olivesSupported?: number
  oilGeneratedLiters?: number
  co2SequesteredPerOlive?: number
}

// Donation Types
export type DonationReward = {
  seeds: number
  points?: number
  certificate: boolean
  photo: boolean
  location: boolean
  updates: boolean
}

export type DonationImpact = {
  unitsRestored: number
  unitsLabel: string
  survivalRate: string
  areaRestored: string
  habitatCreated?: number
  description?: string
}

export type DonationOption = {
  id: string
  projectId: string
  name: string
  price: number
  quantity: number
  unitLabel: string
  rewards: DonationReward
  impact: DonationImpact
}
