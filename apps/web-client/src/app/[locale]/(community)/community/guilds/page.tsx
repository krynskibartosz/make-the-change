import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Target, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getGuilds } from '@/lib/social/feed.reads'
import { CommunityPageFrame } from '../_features/community-page-frame'
import { CommunityRightRail } from '../_features/community-right-rail'
import { GuildMembershipButton } from './_features/guild-membership-button'
import { GuildAvatar, GuildCover } from './_features/guild-visuals'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('guilds.meta_title'),
  }
}

export default async function CommunityGuildsPage() {
  const t = await getTranslations('community')
  const guilds = await getGuilds(60)

  const totalMembers = guilds.reduce((sum, guild) => sum + (guild.members_count || 0), 0)
  const totalPoints = Math.round(guilds.reduce((sum, guild) => sum + (guild.xp_total || 0), 0))

  return (
    <CommunityPageFrame
      centerClassName="max-w-[540px]"
      rightRail={<CommunityRightRail variant="guilds" basePath="/community/guilds" />}
    >
      <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
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

        <div className="grid gap-4 md:grid-cols-2">
          {guilds.length > 0 ? (
            guilds.map((guild) => (
              <Link
                key={guild.id}
                href={`/community/guilds/${guild.slug}`}
                prefetch={false}
                className="block transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card
                  className="overflow-hidden border-border/70 bg-linear-to-b from-background to-muted/30"
                >
                <GuildCover
                  name={guild.name}
                  bannerUrl={guild.banner_url}
                  className="h-24 border-b border-border/60 px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <GuildAvatar
                        name={guild.name}
                        logoUrl={guild.logo_url}
                        className="h-11 w-11 border-white/30 bg-background/90"
                        fallbackClassName="bg-emerald-500/20 text-emerald-50"
                      />
                      <CardTitle className="line-clamp-1 text-lg text-white">
                        {guild.name}
                      </CardTitle>
                    </div>
                    {guild.is_member ? <Badge>{t('guilds.member_badge')}</Badge> : null}
                  </div>
                </GuildCover>
                <CardHeader className="pb-2 pt-4">
                  {guild.description ? (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {guild.description}
                    </p>
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
                    <div onClick={(e) => e.stopPropagation()}>
                      <GuildMembershipButton guildId={guild.id} isMember={!!guild.is_member} />
                    </div>
                    <Button asChild variant="outline" className="w-full" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/community/guilds/${guild.slug}`} prefetch={false}>
                        {t('guilds.open')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground md:col-span-2">
              {t('guilds.no_guilds')}
            </div>
          )}
        </div>
      </div>
    </CommunityPageFrame>
  )
}
