import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { type ThemeConfig } from '@make-the-change/core'
import { parseThemeConfig } from '@/lib/theme-config'
import type {
  MockNotificationPreferences,
  MockSocialLinks,
  MockUserPreferences,
} from '@/lib/mock/types'

export const MOCK_PREFERENCES_COOKIE_NAME = 'mtc_mock_preferences'

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

export const mockPreferencesCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: THIRTY_DAYS_IN_SECONDS,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseSocialLinks = (value: unknown): MockSocialLinks => {
  if (!isRecord(value)) {
    return { linkedin: '', instagram: '', twitter: '' }
  }

  return {
    linkedin: typeof value.linkedin === 'string' ? value.linkedin : '',
    instagram: typeof value.instagram === 'string' ? value.instagram : '',
    twitter: typeof value.twitter === 'string' ? value.twitter : '',
  }
}

const parseNotificationPreferences = (value: unknown): MockNotificationPreferences => {
  if (!isRecord(value)) {
    return {
      project_updates: true,
      product_updates: true,
      leaderboard: true,
      marketing: false,
      email: true,
      push: false,
      monthly_report: true,
    }
  }

  return {
    project_updates: value.project_updates === true,
    product_updates: value.product_updates === true,
    leaderboard: value.leaderboard === true,
    marketing: value.marketing === true,
    email: value.email !== false,
    push: value.push === true,
    monthly_report: value.monthly_report !== false,
  }
}

const createDefaultThemeConfig = (): ThemeConfig => ({
  activeThemeId: 'default',
  customThemes: [],
})

export const createDefaultMockUserPreferences = (viewerId: string): MockUserPreferences => ({
  viewerId,
  languageCode: defaultLocale,
  timezone: 'Europe/Brussels',
  publicProfile: true,
  marketingConsent: false,
  socialLinks: {
    linkedin: '',
    instagram: '',
    twitter: '',
  },
  notificationPreferences: {
    project_updates: true,
    product_updates: true,
    leaderboard: true,
    marketing: false,
    email: true,
    push: false,
    monthly_report: true,
  },
  themeConfig: createDefaultThemeConfig(),
})

export const serializeMockUserPreferences = (preferences: MockUserPreferences): string =>
  encodeURIComponent(JSON.stringify(preferences))

export const parseMockUserPreferencesValue = (
  value: string | null | undefined,
): MockUserPreferences | null => {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown

    if (!isRecord(parsed)) {
      return null
    }

    const viewerId = typeof parsed.viewerId === 'string' ? parsed.viewerId : ''
    if (!viewerId) {
      return null
    }

    const languageCode =
      typeof parsed.languageCode === 'string' && isLocale(parsed.languageCode)
        ? parsed.languageCode
        : defaultLocale

    return {
      viewerId,
      languageCode,
      timezone: typeof parsed.timezone === 'string' ? parsed.timezone : 'Europe/Brussels',
      publicProfile: parsed.publicProfile !== false,
      marketingConsent: parsed.marketingConsent === true,
      socialLinks: parseSocialLinks(parsed.socialLinks),
      notificationPreferences: parseNotificationPreferences(parsed.notificationPreferences),
      themeConfig: parseThemeConfig(parsed.themeConfig) || createDefaultThemeConfig(),
    }
  } catch {
    return null
  }
}
