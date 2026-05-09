export type ImpactInputs = {
  points: number
  projects: number
  totalContributed: number
}

type LevelThreshold = {
  level: 'explorateur' | 'protecteur' | 'ambassadeur'
  min: number
  max: number
}

const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 'explorateur', min: 0, max: 999 },
  { level: 'protecteur', min: 1000, max: 4999 },
  { level: 'ambassadeur', min: 5000, max: Infinity },
]

const WEIGHTS = {
  points: 1,
  projects: 250,
  totalContributed: 0.5,
}

export function calculateImpactScore({ points, projects, totalContributed }: ImpactInputs) {
  const score = points * WEIGHTS.points + projects * WEIGHTS.projects + totalContributed * WEIGHTS.totalContributed
  return Math.max(0, Math.round(score))
}

export function getLevelProgress(score: number) {
  const current = LEVEL_THRESHOLDS.find(
    (threshold) => score >= threshold.min && score <= threshold.max,
  )
  const currentLevel = current?.level ?? 'explorateur'
  const currentMin = current?.min ?? 0
  const next = LEVEL_THRESHOLDS.find((threshold) => threshold.min > currentMin)
  const nextLevel = next?.level ?? null
  const nextMin = next?.min ?? currentMin
  const progress = next ? Math.min(((score - currentMin) / (nextMin - currentMin)) * 100, 100) : 100

  return {
    currentLevel,
    nextLevel,
    progress,
    currentMin,
    nextMin,
  }
}

export function getMilestoneBadges({
  points,
  projects,
  totalContributed,
  leaderboardRank,
}: ImpactInputs & { leaderboardRank?: number }) {
  const badges: string[] = []

  if (projects >= 1) badges.push('Premier projet')
  if (projects >= 10) badges.push('10 projets')
  if (points >= 1000) badges.push('1000 crédits')
  if (totalContributed >= 1000) badges.push('Soutien engagé')
  if (leaderboardRank && leaderboardRank <= 10) badges.push('Top 10')

  return badges
}
