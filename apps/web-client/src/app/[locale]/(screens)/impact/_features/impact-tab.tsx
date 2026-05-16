import { getCurrentMockChallengeDayKey } from '@/lib/mock/mock-challenge-progress-server'
import { getCurrentProfile, getCurrentViewer } from '@/lib/mock/mock-session-server'
import { ImpactTabClient } from './impact-tab-client'

export async function ImpactTab() {
  const [profile, viewer, currentDayKey] = await Promise.all([
    getCurrentProfile(),
    getCurrentViewer(),
    getCurrentMockChallengeDayKey(),
  ])

  return (
    <ImpactTabClient
      initialFaction={profile?.faction ?? null}
      viewerId={viewer?.viewerId ?? null}
      currentDayKey={currentDayKey}
    />
  )
}
