import type { Faction, Season, SeasonDuration, SeasonStats, SeasonStatus, PrestigeReward } from './types'

// Mock data for seasons
const MOCK_SEASONS: Season[] = [
  {
    id: 'season-1',
    name: 'Saison de Printemps',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    status: 'active',
    duration: '3_months',
    winnerFaction: null,
  },
  {
    id: 'season-0',
    name: 'Saison de Démarrage',
    startDate: '2026-01-01',
    endDate: '2026-02-28',
    status: 'completed',
    duration: '2_months',
    winnerFaction: 'Vie Sauvage',
  },
]

// Mock data for season stats
const MOCK_SEASON_STATS: SeasonStats[] = [
  {
    seasonId: 'season-1',
    faction: 'Vie Sauvage',
    totalSeeds: 45000,
    contributions: 320,
    goalsReached: 8,
    engagementScore: 92,
  },
  {
    seasonId: 'season-1',
    faction: 'Terres & Forêts',
    totalSeeds: 38000,
    contributions: 280,
    goalsReached: 7,
    engagementScore: 85,
  },
  {
    seasonId: 'season-1',
    faction: 'Artisans Locaux',
    totalSeeds: 29000,
    contributions: 240,
    goalsReached: 6,
    engagementScore: 78,
  },
  {
    seasonId: 'season-0',
    faction: 'Vie Sauvage',
    totalSeeds: 52000,
    contributions: 410,
    goalsReached: 10,
    engagementScore: 95,
  },
  {
    seasonId: 'season-0',
    faction: 'Terres & Forêts',
    totalSeeds: 41000,
    contributions: 350,
    goalsReached: 9,
    engagementScore: 88,
  },
  {
    seasonId: 'season-0',
    faction: 'Artisans Locaux',
    totalSeeds: 33000,
    contributions: 290,
    goalsReached: 7,
    engagementScore: 80,
  },
]

// Mock data for prestige rewards
const MOCK_PRESTIGE_REWARDS: PrestigeReward[] = [
  {
    id: 'prestige-1',
    name: 'Couronne des Protecteurs',
    description: 'Badge permanent pour les membres de la faction gagnante de la Saison de Démarrage',
    icon: '👑',
    faction: 'Vie Sauvage',
    seasonId: 'season-0',
    isPermanent: true,
  },
  {
    id: 'prestige-2',
    name: 'Halo de Printemps',
    description: 'Cosmétique permanent pour le profil des membres de la faction gagnante de la Saison de Printemps',
    icon: '✨',
    faction: 'Terres & Forêts',
    seasonId: 'season-0',
    isPermanent: true,
  },
  {
    id: 'prestige-3',
    name: 'Médaille des Artisans',
    description: 'Badge permanent pour les membres de la faction gagnante de la Saison de Printemps',
    icon: '🏅',
    faction: 'Artisans Locaux',
    seasonId: 'season-0',
    isPermanent: true,
  },
]

// Get current season
export const getCurrentSeason = (): Season | null => {
  return MOCK_SEASONS.find((season) => season.status === 'active') || null
}

// Get season by ID
export const getSeasonById = (id: string): Season | null => {
  return MOCK_SEASONS.find((season) => season.id === id) || null
}

// Get all seasons
export const getAllSeasons = (): Season[] => {
  return MOCK_SEASONS
}

// Get season stats for a specific season
export const getSeasonStats = (seasonId: string): SeasonStats[] => {
  return MOCK_SEASON_STATS.filter((stat) => stat.seasonId === seasonId)
}

// Calculate season winner based on stats
export const calculateSeasonWinner = (seasonId: string): Faction | null => {
  const stats = getSeasonStats(seasonId)
  if (stats.length === 0) return null

  // Calculate score based on total seeds, contributions, goals reached, and engagement
  const scoredStats = stats.map((stat) => ({
    ...stat,
    score: stat.totalSeeds * 0.4 + stat.contributions * 0.3 + stat.goalsReached * 100 * 0.2 + stat.engagementScore * 0.1,
  }))

  // Sort by score descending
  scoredStats.sort((a, b) => b.score - a.score)

  return scoredStats[0]?.faction || null
}

// Get prestige rewards for a faction
export const getPrestigeRewards = (faction: Faction): PrestigeReward[] => {
  return MOCK_PRESTIGE_REWARDS.filter((reward) => reward.faction === faction)
}

// Get all prestige rewards
export const getAllPrestigeRewards = (): PrestigeReward[] => {
  return MOCK_PRESTIGE_REWARDS
}

// Simulate season reset (for testing purposes)
export const resetSeasonCounters = (newSeasonId: string): void => {
  // In a real implementation, this would:
  // 1. Archive current season stats
  // 2. Calculate and award prestige rewards
  // 3. Reset all counters to zero
  // 4. Start new season
  console.log(`Resetting counters for new season: ${newSeasonId}`)
}

// Get time remaining in current season
export const getSeasonTimeRemaining = (): number => {
  const currentSeason = getCurrentSeason()
  if (!currentSeason) return 0
  const endDate = new Date(currentSeason.endDate)
  const now = new Date()
  const remaining = endDate.getTime() - now.getTime()
  return Math.max(0, remaining)
}

// Get season progress percentage
export const getSeasonProgress = (): number => {
  const currentSeason = getCurrentSeason()
  if (!currentSeason) return 0
  const startDate = new Date(currentSeason.startDate)
  const endDate = new Date(currentSeason.endDate)
  const now = new Date()
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
}
