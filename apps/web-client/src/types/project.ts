export type ProjectSpecies = {
  id: string
  name: string
  scientificName: string
  icon: string | null
  rarity: number
  status: string
  role: string
  contextSentence?: string
}

export type ProjectType =
  | 'beehive'
  | 'equipment'
  | 'orchard'
  | 'reef'
  | 'coral'
  | 'olive_tree'
  | 'vineyard'

export type ProjectChallenge = {
  id: string
  name: string
  type: string
  difficulty: string
  userParticipation: boolean
  rewards: unknown[]
}

export type ProducerProduct = {
  id: string
  name: string
  price: number
  price_points?: number | null
  category: string
  impactPercentage: number
  image_url?: string | null
  size?: string
  type?: 'impact' | 'collectible'
  format?: string
}

export type ProjectImpact = {
  co2Absorbed: number | null
  biodiversityGain: number | null
  jobsCreated: number | null
  timeline: number | null
  beesPerEur?: number
  honeyGramsPerEur?: number
  co2GramsPerEur?: number
  flowersPerEur?: number
  hivesPerEur?: number
  propolisGramsPerEur?: number
  waxGramsPerEur?: number
  pollenGramsPerEur?: number
  nectarGramsPerEur?: number
  fishShelterCapacity?: number
  blueCarbonPotential?: number
  olivesSupported?: number
  oilGeneratedLiters?: number
  co2SequesteredPerOlive?: number
}

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

/**
 * Flux terrain — nouvelles d'un projet, postées par le producteur/partenaire.
 * C'est le mécanisme principal de rétention : "votre rucher a produit X kg ce mois"
 * avec photo et contexte. Apparaît sur la page projet et en teaser sur l'Accueil.
 */
export type ProjectUpdate = {
  id: string
  projectSlug: string
  postedAt: string // ISO date
  title: string
  body: string
  imageUrl?: string
  authorName?: string // ex: "Hary, apiculteur à Antsirabe"
  milestone?: 'funding' | 'production' | 'delivery' | 'reporting'
}
