import { getCurrentProfile } from '@/lib/mock/mock-session-server'
import { AdventureMovementClient } from './adventure-movement-client'

export async function AdventureMovement() {
  const profile = await getCurrentProfile()

  return <AdventureMovementClient initialFaction={profile?.faction ?? null} />
}
