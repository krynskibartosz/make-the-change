import { resolveFactionThemeKey } from '@/lib/faction-theme'
import type { FactionThemeKey } from '@/lib/faction-theme'
import type { Faction } from '@/lib/mock/types'

export type FactionCampaign = {
  themeKey: Exclude<FactionThemeKey, 'neutral'>
  label: string
  shortLabel: string
  tagline: string
  members: number
  score: number
  monthlyQuestTitle: string
  monthlyQuestSummary: string
  monthlyQuestProgress: number
  rewardTitle: string
  rewardSummary: string
  rewardSeeds: number
}

const FACTION_CAMPAIGNS: Record<Exclude<FactionThemeKey, 'neutral'>, FactionCampaign> = {
  pollinisateurs: {
    themeKey: 'pollinisateurs',
    label: 'Vie Sauvage',
    shortLabel: 'Sauvage',
    tagline: 'Les protecteurs des pollinisateurs et de la faune locale.',
    members: 482,
    score: 12480,
    monthlyQuestTitle: 'Corridors pour pollinisateurs',
    monthlyQuestSummary: 'Faire fleurir 180 refuges nectar sur le mois.',
    monthlyQuestProgress: 78,
    rewardTitle: 'Pack Nectar',
    rewardSummary: 'Badge exclusif + 450 graines pour la faction.',
    rewardSeeds: 450,
  },
  forets: {
    themeKey: 'forets',
    label: 'Terres & Forêts',
    shortLabel: 'Forêts',
    tagline: 'Les regenerateurs de sols, haies et forets nourricieres.',
    members: 436,
    score: 11940,
    monthlyQuestTitle: 'Ceinture de regeneration',
    monthlyQuestSummary: 'Restaurer 24 zones vivantes avant la fin du mois.',
    monthlyQuestProgress: 64,
    rewardTitle: 'Coffre Canopee',
    rewardSummary: 'Acces prioritaire a une recompense terrain + 420 graines.',
    rewardSeeds: 420,
  },
  artisans: {
    themeKey: 'artisans',
    label: 'Artisans Locaux',
    shortLabel: 'Artisans',
    tagline: 'Les createurs qui transforment l impact en gestes concrets.',
    members: 391,
    score: 11120,
    monthlyQuestTitle: 'Circuit local vivant',
    monthlyQuestSummary: 'Completer 320 achats ou actions utiles au tissu local.',
    monthlyQuestProgress: 52,
    rewardTitle: 'Reserve Atelier',
    rewardSummary: 'Serie collector + 400 graines pour debloquer un bonus.',
    rewardSeeds: 400,
  },
}

const CAMPAIGN_ORDER: Array<Exclude<FactionThemeKey, 'neutral'>> = ['pollinisateurs', 'forets', 'artisans']

export type RankedFactionCampaign = FactionCampaign & {
  rank: number
}

export const getFactionCampaigns = (): RankedFactionCampaign[] => {
  return CAMPAIGN_ORDER.map((themeKey) => FACTION_CAMPAIGNS[themeKey])
    .sort((first, second) => second.score - first.score)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

export const getFactionCampaign = (faction: Faction | null | undefined): RankedFactionCampaign | null => {
  const themeKey = resolveFactionThemeKey(faction)
  if (themeKey === 'neutral') {
    return null
  }

  return getFactionCampaigns().find((entry) => entry.themeKey === themeKey) || null
}

export const getFactionCampaignByKey = (
  themeKey: Exclude<FactionThemeKey, 'neutral'>,
): RankedFactionCampaign => {
  const entry = getFactionCampaigns().find((campaign) => campaign.themeKey === themeKey)
  if (!entry) {
    throw new Error(`Unknown faction campaign: ${themeKey}`)
  }

  return entry
}
