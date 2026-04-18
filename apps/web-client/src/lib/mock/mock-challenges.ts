import {
  MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
  MOCK_CHALLENGE_DAILY_HARVEST_ID,
  MOCK_CHALLENGE_ECO_FACT_ID,
} from '@/lib/mock/mock-ids'
import type { Challenge } from '@/lib/mock/types'

export type MockChallengeDetail = Challenge & {
  slug: string
  rewardBadge: string | null
  startDate: string | null
  endDate: string | null
  metadata: {
    hint: string
    nextStep: string
  }
  completedAt: string | null
  claimedAt: string | null
}

const MOCK_CHALLENGES: MockChallengeDetail[] = [
  {
    id: MOCK_CHALLENGE_ECO_FACT_ID,
    slug: 'eco-fact-du-jour',
    type: 'education',
    title: "L'Eco-Fact du jour",
    description:
      "Prends 30 secondes pour découvrir un fait marquant sur la biodiversite et enrichir ton impact.",
    progress: 1,
    max: 1,
    reward: 50,
    rewardBadge: 'Eclaireur du vivant',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    metadata: {
      hint: 'Lis le fait du jour puis valide ton apprentissage depuis le hub Defis.',
      nextStep: "Ouvre l'Eco-Fact, lis la carte du jour puis continue vers un projet relie.",
    },
    completedAt: '2026-04-17T07:30:00.000Z',
    claimedAt: '2026-04-17T07:31:00.000Z',
  },
  {
    id: MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
    slug: 'esprit-dequipe',
    type: 'social',
    title: "L'Esprit d'Equipe",
    description: 'Distribue 3 Bravos dans le Collectif pour encourager la communaute.',
    progress: 1,
    max: 3,
    reward: 100,
    href: '/collectif',
    rewardBadge: 'Catalyseur collectif',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    metadata: {
      hint: 'Cherche les actions qui t inspirent dans le Collectif et envoie tes Bravos.',
      nextStep: 'Va dans le Collectif, soutiens trois actions et fais progresser ta faction.',
    },
    completedAt: null,
    claimedAt: null,
  },
  {
    id: MOCK_CHALLENGE_DAILY_HARVEST_ID,
    slug: 'recolte-quotidienne',
    type: 'daily_harvest',
    title: 'La Recolte Quotidienne',
    description:
      'Recupere ton nectar du jour pour entretenir ta serie et faire grandir ton impact.',
    progress: 1,
    max: 1,
    reward: 50,
    rewardBadge: 'Gardien du nectar',
    startDate: '2026-04-18',
    endDate: '2026-04-18',
    metadata: {
      hint: 'Passe chaque jour dans Defis pour reclamer ton nectar avant minuit.',
      nextStep: 'Reviens demain pour prolonger ta serie et renforcer ton clan.',
    },
    completedAt: '2026-04-18T07:32:00.000Z',
    claimedAt: null,
  },
]

export const getChallenges = (): Challenge[] => {
  return MOCK_CHALLENGES.map((challenge) => ({
    id: challenge.id,
    type: challenge.type,
    title: challenge.title,
    description: challenge.description,
    progress: challenge.progress,
    max: challenge.max,
    reward: challenge.reward,
    href: challenge.href,
  }))
}

export const getChallengeById = (challengeId: string): Challenge | null => {
  return getChallenges().find((challenge) => challenge.id === challengeId) || null
}

export const getMockChallengeBySlug = (slug: string): MockChallengeDetail | null =>
  MOCK_CHALLENGES.find((challenge) => challenge.slug === slug) || null
