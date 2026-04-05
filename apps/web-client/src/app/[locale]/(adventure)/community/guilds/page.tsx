import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Target, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getGuilds } from '@/lib/social/feed.reads'
import { AdventurePageFrame } from '../_features/adventure-page-frame'
import { AdventureRightRail } from '../_features/adventure-right-rail'
import { GuildMembershipButton } from './_features/guild-membership-button'
import { GuildOpenButton } from './_features/guild-open-button'
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
    <AdventurePageFrame
      centerClassName="max-w-[540px]"
      rightRail={<AdventureRightRail variant="guilds" basePath="/community/guilds" />}
    >
      <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="sticky top-0 z-20 space-y-3 bg-background/95 pb-2 backdrop-blur-md">
          <h1 className="text-xl font-bold">Communauté</h1>
          <div className="flex gap-6 border-b border-white/10 mb-6 mt-4">
            <Link href="/community" className="text-muted-foreground pb-2 hover:text-foreground font-medium">Le Fil</Link>
            <Link href="/community/guilds" className="border-b-2 border-lime-400 text-foreground pb-2 font-medium">Mes Guildes</Link>
          </div>
        </div>

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
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span className="font-bold text-foreground">{(guild.members_count || 0).toLocaleString()}</span> {t('guilds.members_label').toLowerCase()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4" />
                      <span className="font-bold text-foreground">{Math.round(guild.xp_total || 0).toLocaleString()}</span> XP
                    </div>
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
    </AdventurePageFrame>
  )
}
