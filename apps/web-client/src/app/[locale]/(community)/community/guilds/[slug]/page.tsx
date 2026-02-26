import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import type { FeedSort } from '@make-the-change/core/shared'
import { ArrowLeft, Target, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { getGuildBySlug } from '@/lib/social/feed.actions'
import { CommunityFeedControls } from '../../_features/community-feed-controls'
import { GuildMembershipButton } from '../_features/guild-membership-button'

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

export async function generateMetadata({ params }: CommunityGuildDetailPageProps) {
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
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community/guilds">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{guildDetails.guild.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {guildDetails.guild.description || t('guilds.no_description')}
              </p>
            </div>
            {guildDetails.guild.is_member ? <Badge>{t('guilds.member_badge')}</Badge> : null}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              {guildDetails.guild.members_count || 0} {t('guilds.members_label')}
            </div>
            <div className="inline-flex items-center gap-2">
              <Target className="h-4 w-4" />
              {Math.round(guildDetails.guild.xp_total || 0)} {t('guilds.points_suffix')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GuildMembershipButton guildId={guildDetails.guild.id} isMember={!!guildDetails.guild.is_member} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <CommunityFeedControls sort={sort} scope="my_guilds" showScope={false} />
          <Feed
            sort={sort}
            scope={feedScope}
            guildId={guildDetails.guild.id}
            hideCreatePost={!guildDetails.guild.is_member}
          />
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>{t('guilds.members_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {guildDetails.members.length > 0 ? (
                guildDetails.members.map((member) => (
                  <div key={member.user_id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.user?.avatar_url || undefined} />
                      <AvatarFallback>{member.user?.full_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link href={`/profile/${member.user_id}`} className="truncate text-sm font-medium hover:underline">
                        {member.user?.full_name || t('thread.user_fallback')}
                      </Link>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('guilds.no_members')}</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
