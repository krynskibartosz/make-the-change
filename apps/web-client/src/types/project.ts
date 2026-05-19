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
