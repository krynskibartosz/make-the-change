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
  isGoalReached: boolean
  degradedRewardTitle?: string
  degradedRewardSummary?: string
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
  summary:
    "Ce mois-ci, la communauté soutient un nouveau rucher Ilanga Nature à Madagascar.",
  projectName: 'Rucher de Manakara',
  currentSeeds: 38240,
  targetSeeds: 50000,
  progress: 76,
  commonRewardTitle: 'Badge Bâtisseur de Rucher',
  commonRewardSummary:
    "Un badge commun pour tous les membres actifs si l'objectif est atteint.",
  prestigeRewardTitle: '',
  prestigeRewardSummary: '',
  isGoalReached: false,
}

export const getCollectiveGoal = (): CollectiveGoal => {
  const goalReached = COLLECTIVE_GOAL.progress >= 100

  return {
    ...COLLECTIVE_GOAL,
    isGoalReached: goalReached,
  }
}

// Les fonctions ci-dessous existent pour compatibilité avec le code consommateur
// mais ne retournent plus de données compétitives entre factions. La compétition
// entre Melli / Sylva / Ondine a été retirée — les mascottes sont désormais des
// guides visuels, pas des équipes en concurrence.

export const getFactionContributions = (): RankedFactionContribution[] => {
  return []
}

export const getFactionContribution = (
  _faction: Faction | null | undefined,
): RankedFactionContribution | null => {
  return null
}

export const getFactionContributionByKey = (
  _themeKey: LiveFactionThemeKey,
): RankedFactionContribution | null => {
  return null
}
