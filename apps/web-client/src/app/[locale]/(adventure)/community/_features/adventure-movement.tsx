import { getCurrentMockChallengeDayKey } from '@/lib/mock/mock-challenge-progress-server'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'
import { AdventureMovementClient } from './adventure-movement-client'

export async function AdventureMovement() {
  const [profile, currentDayKey] = await Promise.all([
    getCurrentProfile(),
    getCurrentMockChallengeDayKey(),
  ])

  return (
    <AdventureMovementClient
      initialFaction={profile?.faction ?? null}
      currentDayKey={currentDayKey}
    />
  )
}
