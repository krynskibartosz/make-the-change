import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdventurePageFrame } from '../../_features/adventure-page-frame'
import { AdventureRightRail } from '../../_features/adventure-right-rail'
import { getGuildBySlug } from '@/lib/social/feed.reads'
import { GuildDetailClient, type ActiveMission, type GuildDetailMember } from './guild-detail-client'
import { createClient } from '@/lib/supabase/server'
import { asString, asNumber, isRecord } from '@/lib/type-guards'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guildDetails = await getGuildBySlug(slug)
  const name = guildDetails?.guild.name ?? slug

  return {
    title: `${name} | Tribu — Make the Change`,
    description: guildDetails?.guild.description ?? `Rejoignez la tribu ${name} et contribuez à notre mission collective.`,
  }
}

// Parse active_mission from jsonb metadata
function parseActiveMission(metadata: unknown): ActiveMission | null {
  if (!isRecord(metadata)) return null
  const raw = metadata.active_mission
  if (!isRecord(raw)) return null

  const target = asNumber(raw.goal_target, 0)
  if (!target) return null

  return {
    title: asString(raw.title) || 'Mission du Mois',
    goal_label: asString(raw.goal_label) || '',
    goal_target: target,
    goal_current: asNumber(raw.goal_current, 0),
    goal_unit: asString(raw.goal_unit) || '',
    ends_at: asString(raw.ends_at) || '',
    reward_species_name: asString(raw.reward_species_name) || '',
    reward_species_emoji: asString(raw.reward_species_emoji) || '🌿',
    reward_points: asNumber(raw.reward_points, 500),
  }
}

// Fetch member avatars from profiles
async function getGuildMemberProfiles(guildId: string): Promise<GuildDetailMember[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .schema('identity')
      .from('guild_members')
      .select('user_id, joined_at')
      .eq('guild_id', guildId)
      .order('joined_at', { ascending: false })
      .limit(5)

    if (!data || data.length === 0) return []

    const userIds = data.map((row: { user_id: string }) => row.user_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', userIds)

    return (profiles ?? []).map((p: { id: string; first_name: string | null; last_name: string | null; avatar_url: string | null }) => ({
      user_id: p.id,
      full_name: [p.first_name, p.last_name].filter(Boolean).join(' ') || null,
      avatar_url: p.avatar_url,
    }))
  } catch {
    return []
  }
}

export default async function CommunityGuildDetailPage({ params }: PageProps) {
  const { slug } = await params
  const guildDetails = await getGuildBySlug(slug)

  if (!guildDetails) {
    notFound()
  }

  const { guild, members } = guildDetails
  const activeMission = parseActiveMission(guild.metadata)
  const memberProfiles = await getGuildMemberProfiles(guild.id)

  return (
    <AdventurePageFrame
      centerClassName="max-w-[600px]"
      rightRail={
        <AdventureRightRail
          variant="guild_detail"
          basePath={`/community/guilds/${guild.slug}`}
          guildName={guild.name}
          guildMembers={members}
        />
      }
    >
      <GuildDetailClient
        guildId={guild.id}
        guildName={guild.name}
        guildSlug={guild.slug}
        description={guild.description}
        bannerUrl={guild.banner_url}
        logoUrl={guild.logo_url}
        type={guild.type}
        membersCount={guild.members_count ?? 0}
        isMember={!!guild.is_member}
        activeMission={activeMission}
        members={memberProfiles}
      />
    </AdventurePageFrame>
  )
}
