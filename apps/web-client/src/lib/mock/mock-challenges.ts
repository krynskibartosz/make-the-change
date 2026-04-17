import type { Challenge } from '@/lib/mock/types'

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'eco-fact',
    type: 'education',
    title: "L'Eco-Fact du jour",
    description: "Lis l'article sur la deforestation.",
    progress: 0,
    max: 1,
    reward: 50,
  },
  {
    id: 'collective-bravo',
    type: 'social',
    title: "L'Esprit d'Equipe",
    description: 'Distribue 3 Bravos dans le Collectif.',
    progress: 1,
    max: 3,
    reward: 100,
    href: '/collectif',
  },
  {
    id: 'daily-harvest',
    type: 'daily_harvest',
    title: 'La Recolte Quotidienne',
    description: 'Recupere le nectar du jour.',
    progress: 0,
    max: 1,
    reward: 50,
  },
]

export const getChallenges = (): Challenge[] => {
  return MOCK_CHALLENGES.map((challenge) => ({ ...challenge }))
}
