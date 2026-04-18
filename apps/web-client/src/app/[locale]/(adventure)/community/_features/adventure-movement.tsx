import { getCurrentMockChallengeDayKey } from '@/lib/mock/mock-challenge-progress-server'
import { getCurrentProfile, getCurrentViewer } from '@/lib/mock/mock-session-server'
import { AdventureMovementClient } from './adventure-movement-client'

export async function AdventureMovement() {
  const [profile, viewer, currentDayKey] = await Promise.all([
    getCurrentProfile(),
    getCurrentViewer(),
    getCurrentMockChallengeDayKey(),
  ])

  return (
    <AdventureMovementClient
      initialFaction={profile?.faction ?? null}
      viewerId={viewer?.viewerId ?? null}
      currentDayKey={currentDayKey}
    />
  )
}
