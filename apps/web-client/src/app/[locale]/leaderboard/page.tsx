import { getCurrentUserRank, getLeaderboardTop } from '@/features/leaderboard/leaderboard-data'
import { LeaderboardView } from '@/features/leaderboard/leaderboard-view'
import { createClient } from '@/lib/supabase/server'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [leaders, currentUserRank] = await Promise.all([
    getLeaderboardTop(50),
    user ? getCurrentUserRank(user.id) : Promise.resolve(null),
  ])

  return <LeaderboardView leaders={leaders} currentUserRank={currentUserRank} />
}
