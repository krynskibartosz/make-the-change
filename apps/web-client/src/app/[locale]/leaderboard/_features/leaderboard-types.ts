export type LeaderboardEntry = {
  id: string
  rank: number
  displayName: string
  score: number
  pointsBalance: number
  avatarUrl: string | null
}

export type CurrentUserRank = {
  rank: number
  score: number
  pointsBalance: number
}
