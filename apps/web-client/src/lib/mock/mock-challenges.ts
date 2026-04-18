import {
  MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
  MOCK_CHALLENGE_DAILY_HARVEST_ID,
  MOCK_CHALLENGE_ECO_FACT_ID,
} from '@/lib/mock/mock-ids'
import type { Challenge } from '@/lib/mock/types'

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: MOCK_CHALLENGE_ECO_FACT_ID,
    type: 'education',
    title: "L'Eco-Fact du jour",
    description: "Lis l'article sur la deforestation.",
    progress: 1,
    max: 1,
    reward: 50,
  },
  {
    id: MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
    type: 'social',
    title: "L'Esprit d'Equipe",
    description: 'Distribue 3 Bravos dans le Collectif.',
    progress: 1,
    max: 3,
    reward: 100,
    href: '/collectif',
  },
  {
    id: MOCK_CHALLENGE_DAILY_HARVEST_ID,
    type: 'daily_harvest',
    title: 'La Recolte Quotidienne',
    description: 'Recupere le nectar du jour.',
    progress: 1,
    max: 1,
    reward: 50,
  },
]

export const getChallenges = (): Challenge[] => {
  return MOCK_CHALLENGES.map((challenge) => ({ ...challenge }))
}

export const getChallengeById = (challengeId: string): Challenge | null => {
  return getChallenges().find((challenge) => challenge.id === challengeId) || null
}
