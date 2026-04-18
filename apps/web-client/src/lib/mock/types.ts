import type { ThemeConfig } from '@make-the-change/core'
import type { Locale } from '@make-the-change/core/i18n'

export type Faction = 'Vie Sauvage' | 'Terres & Forêts' | 'Artisans Locaux'

export type MockViewerSession = {
  viewerId: string
  displayName: string
  email: string
  faction: Faction | null
  avatarUrl?: string | null
}

export type Viewer = MockViewerSession & {
  avatarUrl: string | null
}

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
  points: number
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

export type MockNotificationPreferences = {
  project_updates: boolean
  product_updates: boolean
  leaderboard: boolean
  marketing: boolean
  email: boolean
  push: boolean
  monthly_report: boolean
}

export type MockSocialLinks = {
  linkedin: string
  instagram: string
  twitter: string
}

export type MockUserPreferences = {
  viewerId: string
  languageCode: Locale
  timezone: string
  publicProfile: boolean
  marketingConsent: boolean
  socialLinks: MockSocialLinks
  notificationPreferences: MockNotificationPreferences
  themeConfig: ThemeConfig
}

export type ChallengeIntent = 'eco-fact' | 'daily-harvest' | 'give-bravo'

export type Challenge = {
  id: string
  type: 'education' | 'social' | 'daily_harvest'
  title: string
  description: string
  progress: number
  max: number
  reward: number
  href?: string
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
