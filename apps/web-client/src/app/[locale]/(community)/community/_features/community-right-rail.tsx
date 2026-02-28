import type { ContributorScope, GuildMember } from '@make-the-change/core/shared'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@make-the-change/core/ui'
import { Crown } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getGuildLeaderboard } from '@/lib/social/feed.reads'
import { CommunityLeaderboardCard } from './community-leaderboard-card'

type CommunityRightRailVariant = 'default' | 'guilds' | 'guild_detail'

type CommunityRightRailProps = {
  variant?: CommunityRightRailVariant
  contributorScope?: ContributorScope
  basePath?: string
  extraQuery?: Record<string, string | undefined>
  activeTag?: string
  guildName?: string
  guildMembers?: GuildMember[]
}

const getMemberInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'U'
const getGuildInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return 'G'
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || 'G'
  }

  return `${parts[0]?.charAt(0) || ''}${parts[1]?.charAt(0) || ''}`.toUpperCase() || 'G'
}

export async function CommunityRightRail({
  variant = 'default',
  contributorScope = 'all',
  basePath = '/community',
  extraQuery = {},
  activeTag,
  guildName,
  guildMembers = [],
}: CommunityRightRailProps) {
  const t = await getTranslations('community')
  const guildLeaderboard = variant === 'guilds' ? await getGuildLeaderboard('monthly', 6) : []

  return (
    <div className="space-y-4">
      {activeTag ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs text-muted-foreground">{t('feed_controls.open_hashtags')}</p>
          <p className="text-sm font-semibold text-foreground">#{activeTag}</p>
        </div>
      ) : null}

      {variant === 'guilds' ? (
        <Card className="overflow-hidden border-border/70 bg-muted/30">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('sidebar.guilds')}</CardTitle>
              <Crown className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {guildLeaderboard.length > 0 ? (
              guildLeaderboard.map((entry, index) => (
                <Link
                  key={entry.guild_id}
                  href={`/community/guilds/${entry.guild_slug}`}
                  prefetch={false}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-9 w-9 border border-border/60">
                      <AvatarImage
                        src={entry.guild_logo_url || undefined}
                        alt={entry.guild_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs font-semibold">
                        {getGuildInitials(entry.guild_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">#{index + 1}</p>
                      <p className="truncate text-sm font-medium">{entry.guild_name}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(entry.score).toLocaleString()}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('guilds.no_guilds')}</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {variant === 'guild_detail' ? (
        <Card className="overflow-hidden border-border/70">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <CardTitle className="text-base">
              {guildName
                ? `${guildName} · ${t('guilds.members_title')}`
                : t('guilds.members_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {guildMembers.length > 0 ? (
              guildMembers.map((member) => {
                const fullName = member.user?.full_name || t('thread.user_fallback')
                return (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/90 px-3 py-2"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.user?.avatar_url || undefined} alt={fullName} />
                      <AvatarFallback>{getMemberInitial(fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link
                        href={`/profile/${member.user_id}`}
                        prefetch={false}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {fullName}
                      </Link>
                      <p className="text-xs capitalize text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">{t('guilds.no_members')}</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {variant !== 'guilds' ? (
        <CommunityLeaderboardCard
          contributorScope={contributorScope}
          basePath={basePath}
          extraQuery={extraQuery}
        />
      ) : null}
    </div>
  )
}
