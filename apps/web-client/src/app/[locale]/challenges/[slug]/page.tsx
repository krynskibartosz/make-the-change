import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft, Flame, Trophy } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'

const challenges: Record<
  string,
  { title: string; reward: string; description: string; hint: string }
> = {
  'streak-7': {
    title: 'Streak 7 jours',
    reward: '+150 pts',
    description: 'Revenez chaque jour pour suivre vos progrès et débloquer des points.',
    hint: 'Un petit pas chaque jour.',
  },
  'invest-2-projets': {
    title: '2 projets ce mois-ci',
    reward: '+300 pts',
    description: 'Soutenez 2 projets actifs pendant le mois pour gagner un bonus.',
    hint: 'Choisissez deux projets complémentaires.',
  },
  'top-100': {
    title: 'Top 100',
    reward: 'Badge',
    description: 'Montez dans le classement global cette saison.',
    hint: 'Investissez régulièrement et suivez les updates.',
  },
}

interface ChallengePageProps {
  params: Promise<{ slug: string }>
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params
  const challenge = challenges[slug]
  if (!challenge) notFound()

  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-8"
    >
      <div className="space-y-6">
        <Link href="/challenges">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Challenges
          </Button>
        </Link>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
              <Badge className="rounded-full">{challenge.reward}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conseil</p>
                <p className="mt-2 text-sm">{challenge.hint}</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Progression
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                  <Flame className="h-4 w-4 text-client-amber-500" /> 0%
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="w-full">
                <Link href="/projects">
                  Découvrir des projets
                  <Trophy className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/leaderboard">Voir le classement</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
