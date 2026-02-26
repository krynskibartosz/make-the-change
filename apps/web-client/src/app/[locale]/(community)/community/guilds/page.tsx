import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Target, Users } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata() {
  const t = await getTranslations('community')
  return {
    title: t('guilds.meta_title'),
  }
}

export default async function CommunityGuildsPage() {
  const t = await getTranslations('community')
  const sampleGuilds = [
    {
      id: 'guild-tech',
      name: t('guilds.sample_name_tech'),
      members: 128,
      impact: '12 400 pts',
      goal: t('guilds.sample_goal_tech'),
    },
    {
      id: 'guild-campus',
      name: t('guilds.sample_name_campus'),
      members: 74,
      impact: '8 950 pts',
      goal: t('guilds.sample_goal_campus'),
    },
    {
      id: 'guild-family',
      name: t('guilds.sample_name_family'),
      members: 33,
      impact: '4 520 pts',
      goal: t('guilds.sample_goal_family'),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sampleGuilds.map((guild) => (
          <Card key={guild.id} className="border-border/70">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{guild.name}</CardTitle>
                <Badge variant="secondary">{guild.impact}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {guild.members} {t('guilds.members_label')}
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Target className="mt-0.5 h-4 w-4" />
                <span>{guild.goal}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/community/posts/new">{t('guilds.join_and_post')}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
