export type LeaderboardEntry = {
  id: string
  rank: number
  displayName: string
  points: number
  avatarUrl: string | null
}

export type CurrentUserRank = {
  rank: number
  points: number
}
