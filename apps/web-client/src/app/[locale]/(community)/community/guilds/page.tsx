import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Crown, Target, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getGuildLeaderboard, getGuilds } from '@/lib/social/feed.reads'
import { GuildMembershipButton } from './_features/guild-membership-button'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('guilds.meta_title'),
  }
}

export default async function CommunityGuildsPage() {
  const t = await getTranslations('community')

  const [guilds, leaderboard] = await Promise.all([
    getGuilds(60),
    getGuildLeaderboard('monthly', 6),
  ])

  const totalMembers = guilds.reduce((sum, guild) => sum + (guild.members_count || 0), 0)
  const totalPoints = Math.round(guilds.reduce((sum, guild) => sum + (guild.xp_total || 0), 0))

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <header className="overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-emerald-100/70 via-background to-sky-100/60 p-5 sm:p-7">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">
          {t('guilds.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t('guilds.description')}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
            <p className="text-xl font-bold text-foreground">{totalMembers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t('guilds.members_label')}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
            <p className="text-xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t('guilds.points_suffix')}</p>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-border/70 bg-background/95 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('sidebar.trending')}
          </h2>
          <Crown className="h-4 w-4 text-amber-500" />
        </div>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <Link
                key={entry.guild_id}
                href={`/community/guilds/${entry.guild_slug}`}
                prefetch={false}
                className="rounded-2xl border border-border/70 bg-linear-to-br from-background to-muted/40 p-3 transition-colors hover:bg-muted/30"
              >
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>#{index + 1}</span>
                  <Crown className="h-3.5 w-3.5" />
                </div>
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {entry.guild_name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.round(entry.score).toLocaleString()} {t('guilds.points_suffix')}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('guilds.no_guilds')}</p>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guilds.length > 0 ? (
          guilds.map((guild) => (
            <Card
              key={guild.id}
              className="overflow-hidden border-border/70 bg-linear-to-b from-background to-muted/30"
            >
              <div className="h-16 border-b border-border/60 bg-linear-to-r from-emerald-500/15 via-sky-500/10 to-background px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg">{guild.name}</CardTitle>
                  {guild.is_member ? <Badge>{t('guilds.member_badge')}</Badge> : null}
                </div>
              </div>
              <CardHeader className="pb-2 pt-4">
                {guild.description ? (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{guild.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('guilds.no_description')}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-border/60 bg-background/80 p-3">
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {t('guilds.members_label')}
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {(guild.members_count || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/80 p-3">
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3.5 w-3.5" />
                      {t('guilds.points_suffix')}
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {Math.round(guild.xp_total || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <GuildMembershipButton guildId={guild.id} isMember={!!guild.is_member} />
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/community/guilds/${guild.slug}`} prefetch={false}>
                      {t('guilds.open')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground md:col-span-2 xl:col-span-3">
            {t('guilds.no_guilds')}
          </div>
        )}
      </div>
    </div>
  )
}
