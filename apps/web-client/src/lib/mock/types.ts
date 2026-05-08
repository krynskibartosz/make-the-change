import type { ThemeConfig } from '@make-the-change/core'
import type { Locale } from '@make-the-change/core/i18n'
import type { Faction } from '@/lib/domain/types'

export type { Faction } from '@/lib/domain/types'
export type {
  Challenge,
  ChallengeArchetypeId,
  ChallengeIntent,
  CollectivePost,
  PrestigeReward,
  ProductCard,
  ProductDetail,
  Profile,
  ProjectCard,
  ProjectDetail,
  Season,
  SeasonDuration,
  SeasonStats,
  SeasonStatus,
} from '@/lib/domain/types'

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

export type MockNotificationPreferences = {
  project_updates: boolean
  product_updates: boolean
  leaderboard: boolean
  marketing: boolean
  academy: boolean
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
