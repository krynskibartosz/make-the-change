import { getGuilds } from '@/lib/social/feed.reads'
import { AdventureMovementClient } from './adventure-movement-client'

export async function AdventureMovement() {
  const guilds = await getGuilds(6)

  return <AdventureMovementClient guilds={guilds} />
}
