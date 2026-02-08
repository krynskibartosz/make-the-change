import { getCurrentUserRank, getLeaderboardTop } from '@/features/leaderboard/leaderboard-data'
import { PodiumTestView } from '@/features/leaderboard/podium-test-view'
import { createClient } from '@/lib/supabase/server'

export default async function PodiumTestPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [leaders, currentUserRank] = await Promise.all([
    getLeaderboardTop(3), // On ne prend que les 3 premiers pour le podium
    user ? getCurrentUserRank(user.id) : Promise.resolve(null),
  ])

  return <PodiumTestView leaders={leaders} currentUserRank={currentUserRank} />
}
