import type { FeedSort } from '@make-the-change/core/shared'
import { Badge, Button } from '@make-the-change/core/ui'
import { ArrowLeft, Target, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { getGuildBySlug } from '@/lib/social/feed.reads'
import { CommunityFeedControls } from '../../_features/community-feed-controls'
import { CommunityPageFrame } from '../../_features/community-page-frame'
import { CommunityRightRail } from '../../_features/community-right-rail'
import { GuildMembershipButton } from '../_features/guild-membership-button'
import { GuildAvatar, GuildCover } from '../_features/guild-visuals'

const FEED_SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']

type CommunityGuildDetailPageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    sort?: string
  }>
}

const parseFeedSort = (value: string | undefined): FeedSort =>
  FEED_SORT_VALUES.includes(value as FeedSort) ? (value as FeedSort) : 'newest'

export async function generateMetadata({
  params,
}: CommunityGuildDetailPageProps): Promise<Metadata> {
  const t = await getTranslations('community')
  const { slug } = await params
  return {
    title: t('guilds.detail_meta_title', { slug }),
  }
}

export default async function CommunityGuildDetailPage({
  params,
  searchParams,
}: CommunityGuildDetailPageProps) {
  const t = await getTranslations('community')
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const guildDetails = await getGuildBySlug(slug)

  if (!guildDetails) {
    notFound()
  }

  const sort = parseFeedSort(query.sort)
  const feedScope = guildDetails.guild.is_member ? 'my_guilds' : 'all'

  return (
    <CommunityPageFrame
      centerClassName="max-w-[760px]"
      rightRail={
        <CommunityRightRail
          variant="guild_detail"
          basePath={`/community/guilds/${guildDetails.guild.slug}`}
          guildName={guildDetails.guild.name}
          guildMembers={guildDetails.members}
        />
      }
    >
      <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
          <Link href="/community/guilds">
            <ArrowLeft className="h-4 w-4" />
            {t('actions.back_to_feed')}
          </Link>
        </Button>

        <section className="overflow-hidden rounded-3xl border border-border/70 bg-background">
          <GuildCover
            name={guildDetails.guild.name}
            bannerUrl={guildDetails.guild.banner_url}
            className="border-b border-border/60 px-5 py-8 text-foreground sm:px-7 sm:py-10"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <GuildAvatar
                name={guildDetails.guild.name}
                logoUrl={guildDetails.guild.logo_url}
                className="h-16 w-16 border-white/30 bg-background/90"
                fallbackClassName="bg-emerald-500/20 text-emerald-50"
              />
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {guildDetails.guild.is_member ? <Badge>{t('guilds.member_badge')}</Badge> : null}
                  <Badge variant="outline">{guildDetails.guild.type}</Badge>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
                  {guildDetails.guild.name}
                </h1>
                <p className="max-w-3xl text-sm text-white/90 sm:text-base">
                  {guildDetails.guild.description || t('guilds.no_description')}
                </p>
              </div>
            </div>
          </GuildCover>

          <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:px-7">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border/70 bg-muted/25 p-3">
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {t('guilds.members_label')}
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {(guildDetails.guild.members_count || 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/25 p-3">
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  {t('guilds.points_suffix')}
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {Math.round(guildDetails.guild.xp_total || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="sm:justify-self-end">
              <GuildMembershipButton
                guildId={guildDetails.guild.id}
                isMember={!!guildDetails.guild.is_member}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 overflow-hidden rounded-2xl border border-border/70 bg-background">
          <div className="border-b border-border/70 p-4 sm:p-5">
            <CommunityFeedControls sort={sort} scope="my_guilds" showScope={false} />
          </div>
          <Feed
            sort={sort}
            scope={feedScope}
            guildId={guildDetails.guild.id}
            hideCreatePost={!guildDetails.guild.is_member}
          />
        </section>
      </div>
    </CommunityPageFrame>
  )
}
