import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Crown, Target, Users } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getGuildLeaderboard, getGuilds } from '@/lib/social/feed.actions'
import { GuildMembershipButton } from './_features/guild-membership-button'

export async function generateMetadata() {
  const t = await getTranslations('community')
  return {
    title: t('guilds.meta_title'),
  }
}

export default async function CommunityGuildsPage() {
  const t = await getTranslations('community')

  const [guilds, leaderboard] = await Promise.all([
    getGuilds(60),
    getGuildLeaderboard('monthly', 5),
  ])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('guilds.title')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('guilds.description')}</p>
      </header>

      <section className="grid gap-3 rounded-xl border border-border/70 bg-background p-4 md:grid-cols-2 xl:grid-cols-5">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => (
            <Link
              key={entry.guild_id}
              href={`/community/guilds/${entry.guild_slug}`}
              className="rounded-lg border border-border/70 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
            >
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>#{index + 1}</span>
                <Crown className="h-3.5 w-3.5" />
              </div>
              <p className="line-clamp-1 text-sm font-semibold">{entry.guild_name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {Math.round(entry.score)} {t('guilds.points_suffix')}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{t('guilds.no_guilds')}</p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guilds.length > 0 ? (
          guilds.map((guild) => (
            <Card key={guild.id} className="border-border/70">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-lg">{guild.name}</CardTitle>
                  {guild.is_member ? <Badge>{t('guilds.member_badge')}</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {guild.members_count || 0} {t('guilds.members_label')}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {Math.round(guild.xp_total || 0)} {t('guilds.points_suffix')}
                </div>

                {guild.description ? (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{guild.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('guilds.no_description')}</p>
                )}

                <div className="space-y-2">
                  <GuildMembershipButton guildId={guild.id} isMember={!!guild.is_member} />
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/community/guilds/${guild.slug}`}>{t('guilds.open')}</Link>
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
