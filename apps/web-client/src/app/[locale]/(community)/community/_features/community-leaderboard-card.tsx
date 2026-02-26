import { Avatar, AvatarFallback, AvatarImage, Button } from '@make-the-change/core/ui'
import { Trophy } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

// Mock top contributors
const TOP_CONTRIBUTORS = [
  {
    id: '1',
    name: 'Alice Dupont',
    handle: '@alice',
    score: 14500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: '2',
    name: 'Bob Martin',
    handle: '@bobm',
    score: 12300,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    id: '3',
    name: 'Claire Dubois',
    handle: '@clarity',
    score: 9800,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claire',
  },
]

export async function CommunityLeaderboardCard() {
  const t = await getTranslations('community')

  return (
    <div className="space-y-4">
      {/* Top Contributors */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
          {t('leaderboard.top_contributors')}
        </h2>
        <div className="grid gap-4">
          {TOP_CONTRIBUTORS.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2">
              <Link href={`/profile/${user.id}`} className="group flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-[15px] truncate group-hover:underline leading-tight">
                    {user.name}
                  </span>
                  <span className="text-muted-foreground text-[15px] truncate leading-tight">
                    {user.handle}
                  </span>
                </div>
              </Link>
              <div className="shrink-0">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="rounded-full font-bold h-8 px-4 text-[14px]"
                >
                  <Link href={`/profile/${user.id}`}>{t('leaderboard.follow')}</Link>
                </Button>
              </div>
            </div>
          ))}
          <Link
            href="/leaderboard"
            className="text-primary text-[15px] p-0 h-auto justify-start hover:underline text-left mt-2"
          >
            {t('leaderboard.full_leaderboard')}
          </Link>
        </div>
      </div>

      {/* Trending / Recommended */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
          {t('leaderboard.trends_for_you')}
        </h2>
        <div className="flex flex-col gap-4">
          <Link href="/projects" className="group cursor-pointer block">
            <div className="flex justify-between items-start">
              <p className="text-[13px] text-muted-foreground">
                {t('leaderboard.supported_project_popular')}
              </p>
              <span className="text-muted-foreground rounded-full p-1 -mr-1 -mt-1">
                <Trophy className="w-4 h-4 opacity-0" />
              </span>
            </div>
            <p className="font-bold text-[15px] text-foreground mt-0.5 leading-tight">
              {t('leaderboard.sample_project_title')}
            </p>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {t('leaderboard.sample_project_metric')}
            </p>
          </Link>
          <Link href="/products" className="group cursor-pointer block">
            <div className="flex justify-between items-start">
              <p className="text-[13px] text-muted-foreground">{t('leaderboard.shop_trending')}</p>
            </div>
            <p className="font-bold text-[15px] text-foreground mt-0.5 leading-tight">
              {t('leaderboard.sample_product_title')}
            </p>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {t('leaderboard.sample_product_metric')}
            </p>
          </Link>
          <Link
            href="/community/trending"
            className="text-primary text-[15px] p-0 h-auto justify-start hover:underline text-left mt-2"
          >
            {t('leaderboard.show_more')}
          </Link>
        </div>
      </div>
    </div>
  )
}
