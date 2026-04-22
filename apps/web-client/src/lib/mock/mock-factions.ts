import { resolveFactionThemeKey } from '@/lib/faction-theme'
import type { FactionThemeKey } from '@/lib/faction-theme'
import type { Faction } from '@/lib/mock/types'

type LiveFactionThemeKey = Exclude<FactionThemeKey, 'neutral'>

export type CollectiveGoal = {
  title: string
  summary: string
  projectName: string
  currentSeeds: number
  targetSeeds: number
  progress: number
  commonRewardTitle: string
  commonRewardSummary: string
  prestigeRewardTitle: string
  prestigeRewardSummary: string
}

export type FactionContribution = {
  themeKey: LiveFactionThemeKey
  label: string
  shortLabel: string
  tagline: string
  members: number
  contributionSeeds: number
  contributionShare: number
  impactValue: string
  impactLabel: string
  rallyLabel: string
  prestigeTitle: string
  prestigeSummary: string
}

export type RankedFactionContribution = FactionContribution & {
  rank: number
  isLeader: boolean
}

const COLLECTIVE_GOAL: CollectiveGoal = {
  title: 'La Grande Récolte de Printemps',
  summary: "Ce mois-ci, les 3 factions réunissent leurs graines pour financer un nouveau rucher Ilanga Nature à Madagascar.",
  projectName: 'Rucher de Manakara',
  currentSeeds: 38240,
  targetSeeds: 50000,
  progress: 76,
  commonRewardTitle: 'Badge Batisseur de Rucher',
  commonRewardSummary: "500 graines et un badge commun pour tous les membres actifs si l'objectif est atteint.",
  prestigeRewardTitle: 'Glow de faction',
  prestigeRewardSummary: 'La faction en tête obtient un halo cosmétique exclusif pour le mois suivant.',
}

const FACTION_CONTRIBUTIONS: Record<LiveFactionThemeKey, FactionContribution> = {
  pollinisateurs: {
    themeKey: 'pollinisateurs',
    label: 'Vie Sauvage',
    shortLabel: 'Sauvage',
    tagline: 'Les protecteurs des pollinisateurs et de la faune locale.',
    members: 482,
    contributionSeeds: 17210,
    contributionShare: 45,
    impactValue: '1.2M',
    impactLabel: 'abeilles protégées',
    rallyLabel: "Chaque défi renforce l'Essaim et fait avancer le rucher commun.",
    prestigeTitle: 'Halo nectar',
    prestigeSummary: "Un halo doré autour de Melli si la faction reste devant jusqu'à la fin du mois.",
  },
  forets: {
    themeKey: 'forets',
    label: 'Terres & Forêts',
    shortLabel: 'Forêts',
    tagline: 'Les régénérateurs de sols, haies et forêts nourricières.',
    members: 436,
    contributionSeeds: 13380,
    contributionShare: 35,
    impactValue: '5 400',
    impactLabel: 'arbres plantés',
    rallyLabel: 'Chaque mission terrain aide la canéopée et rapproche tout le collectif du but.',
    prestigeTitle: 'Couronne canéopée',
    prestigeSummary: "Un glow végétal autour de Sylva pour souligner la faction meneuse.",
  },
  artisans: {
    themeKey: 'artisans',
    label: 'Artisans Locaux',
    shortLabel: 'Artisans',
    tagline: "Les créateurs qui transforment l'impact en gestes concrets.",
    members: 391,
    contributionSeeds: 7650,
    contributionShare: 20,
    impactValue: '80',
    impactLabel: 'artisans soutenus',
    rallyLabel: "Chaque achat utile renforce le tissu local et nourrit l'objectif commun.",
    prestigeTitle: 'Halo atelier',
    prestigeSummary: "Un accessoire prestige discret autour de Aura pour célébrer la première place.",
  },
}

const FACTION_ORDER: LiveFactionThemeKey[] = ['pollinisateurs', 'forets', 'artisans']

export const getCollectiveGoal = (): CollectiveGoal => ({
  ...COLLECTIVE_GOAL,
})

export const getFactionContributions = (): RankedFactionContribution[] => {
  return FACTION_ORDER.map((themeKey) => FACTION_CONTRIBUTIONS[themeKey])
    .sort((first, second) => second.contributionSeeds - first.contributionSeeds)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isLeader: index === 0,
    }))
}

export const getFactionContribution = (
  faction: Faction | null | undefined,
): RankedFactionContribution | null => {
  const themeKey = resolveFactionThemeKey(faction)
  if (themeKey === 'neutral') {
    return null
  }

  return getFactionContributions().find((entry) => entry.themeKey === themeKey) || null
}

export const getFactionContributionByKey = (
  themeKey: LiveFactionThemeKey,
): RankedFactionContribution => {
  const entry = getFactionContributions().find((campaign) => campaign.themeKey === themeKey)
  if (!entry) {
    throw new Error(`Unknown faction contribution: ${themeKey}`)
  }

  return entry
}
