import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, Calendar, Flame } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'

const challenges = [
  {
    slug: 'streak-7',
    title: 'Streak 7 jours',
    tag: 'Daily',
    reward: '+150 pts',
    description: 'Revenez chaque jour pour suivre vos progrès.',
  },
  {
    slug: 'invest-2-projets',
    title: '2 projets ce mois-ci',
    tag: 'Monthly',
    reward: '+300 pts',
    description: 'Soutenez 2 projets actifs pendant le mois.',
  },
  {
    slug: 'top-100',
    title: 'Top 100',
    tag: 'Season',
    reward: 'Badge',
    description: 'Montez dans le classement global.',
  },
]

export default function ChallengesPage() {
  return (
    <SectionContainer
      size="lg"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Challenges</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Missions</h1>
          </div>
          <Badge variant="secondary" className="rounded-full">
            Saison en cours
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <Link key={c.slug} href={`/challenges/${c.slug}`} className="group block h-full">
              <Card className="h-full border bg-background/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="rounded-full">
                      {c.tag}
                    </Badge>
                    <Badge className="rounded-full">{c.reward}</Badge>
                  </div>
                  <p className="text-lg font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> En cours
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" /> Progression
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl border bg-background/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Astuce</p>
              <p className="text-sm text-muted-foreground">
                Les challenges restent courts: une action claire, une récompense immédiate.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/leaderboard">
                Voir le classement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
