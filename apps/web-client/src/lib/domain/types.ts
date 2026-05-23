export type Faction = 'Vie Sauvage' | 'Terres & Forêts' | 'Gardiens des mers'

export type Profile = {
  id: string
  displayName: string
  firstName?: string | null
  lastName?: string | null
  username: string
  email: string
  avatarUrl: string | null
  coverUrl?: string | null
  faction: Faction | null
  memberSince: string
  streakDays: number
  impactCreditsBalance: number
  totalSeedsContributed?: number
  beesSaved: number
  honeyGeneratedKg: number
  co2CapturedKg: number
  phone?: string | null
  bio?: string | null
  city: string
  country: string
  addressStreet: string
  addressPostalCode: string
  tribeIds: string[]
}

export type CollectivePost = {
  id: string
  profileId?: string
  name: string
  avatar?: string
  time: string
  action: string
  iconName:
    | 'sprout'
    | 'trophy'
    | 'paw'
    | 'handshake'
    | 'globe'
    | 'droplets'
    | 'leaf'
    | 'star'
    | 'bird'
  iconColor: string
  actionHighlight?: string
  likes: number
  bravos: number
  avatarColor: string
  isTribe?: boolean
  tribeName?: string
  tribeSlug?: string
}

export type ProjectCard = {
  id: string
  slug: string
  name: string
}

export type ProjectDetail = ProjectCard

export type ProductCard = {
  id: string
  slug: string | null
  name: string
}

export type ProductDetail = ProductCard

export type SeasonStatus = 'active' | 'completed' | 'upcoming'

export type SeasonDuration = '30_days' | '2_months' | '3_months'

export type Season = {
  id: string
  name: string
  startDate: string
  endDate: string
  status: SeasonStatus
  duration: SeasonDuration
  winnerFaction: Faction | null
}

export type SeasonStats = {
  seasonId: string
  faction: Faction
  totalSeeds: number
  contributions: number
  goalsReached: number
  engagementScore: number
}

export type PrestigeReward = {
  id: string
  name: string
  description: string
  icon: string
  faction: Faction
  seasonId: string
  isPermanent: true
}
