import { getCurrentProfile, getCurrentViewer } from '@/lib/mock/mock-session-server'
import { ImpactTabClient } from './impact-tab-client'

export async function ImpactTab() {
  const [profile, viewer] = await Promise.all([
    getCurrentProfile(),
    getCurrentViewer(),
  ])

  return (
    <ImpactTabClient
      initialFaction={profile?.faction ?? null}
      viewerId={viewer?.viewerId ?? null}
    />
  )
}
