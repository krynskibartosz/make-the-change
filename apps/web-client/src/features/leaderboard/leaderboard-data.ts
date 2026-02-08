import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { CurrentUserRank, LeaderboardEntry } from './leaderboard-types'

export async function getLeaderboardTop(limit = 50): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('public_user_rankings')
    .select('id, rank, display_name, points_balance, avatar_url')
    .order('rank', { ascending: true })
    .limit(limit)

  if (error || !data) return []

  return data
    .filter((entry) => typeof entry.rank === 'number' && entry.rank > 0)
    .map((entry) => ({
      id: entry.id,
      rank: entry.rank,
      displayName: entry.display_name || 'Utilisateur',
      points: entry.points_balance || 0,
      avatarUrl: entry.avatar_url,
    }))
}

export async function getCurrentUserRank(userId: string): Promise<CurrentUserRank | null> {
  if (!userId) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('public_user_rankings')
    .select('rank, points_balance')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null
  if (typeof data.rank !== 'number' || data.rank <= 0) return null

  return {
    rank: data.rank,
    points: data.points_balance || 0,
  }
}
