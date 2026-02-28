import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft, Calendar, CheckCircle2, Flame, Sparkles, Trophy, Zap } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, isRecord } from '@/lib/type-guards'
import { cn } from '@/lib/utils'

type ChallengeDetailRow = {
  id: string
  slug: string
  title: string
  description: string
  type: string
  reward_points: number
  reward_badge: string | null
  start_date: string | null
  end_date: string | null
  metadata: Record<string, unknown>
}

type UserChallengeRow = {
  progress: number
  target: number
  completed_at: string | null
  claimed_at: string | null
}

const toChallengeDetail = (value: unknown): ChallengeDetailRow | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const slug = asString(value.slug)

  if (!id || !slug) {
    return null
  }

  return {
    id,
    slug,
    title: asString(value.title) || 'Challenge',
    description: asString(value.description) || 'Aucune description disponible.',
    type: asString(value.type) || 'seasonal',
    reward_points: Math.max(0, Math.floor(asNumber(value.reward_points, 0))),
    reward_badge: asString(value.reward_badge) || null,
    start_date: asString(value.start_date) || null,
    end_date: asString(value.end_date) || null,
    metadata: isRecord(value.metadata) ? value.metadata : {},
  }
}

interface ChallengePageProps {
  params: Promise<{ slug: string }>
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: challengeData } = await supabase
    .schema('gamification')
    .from('challenges')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  const challenge = toChallengeDetail(challengeData)

  if (!challenge) notFound()

  let userChallenge: UserChallengeRow | null = null

  if (user) {
    const { data: userChallengeData } = await supabase
      .schema('gamification')
      .from('user_challenges')
      .select('progress, target, completed_at, claimed_at')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge.id)
      .maybeSingle()

    if (userChallengeData) {
      userChallenge = {
        progress: asNumber(userChallengeData.progress, 0),
        target: Math.max(1, asNumber(userChallengeData.target, 100)),
        completed_at: asString(userChallengeData.completed_at) || null,
        claimed_at: asString(userChallengeData.claimed_at) || null,
      }
    }
  }

  const progress = userChallenge?.progress ?? 0
  const target = userChallenge?.target ?? 100
  const percentage = Math.min((progress / target) * 100, 100)
  const isCompleted = Boolean(userChallenge?.completed_at)
  const isClaimed = Boolean(userChallenge?.claimed_at)
  const rewardLabel =
    challenge.reward_points > 0
      ? `+${challenge.reward_points} pts`
      : challenge.reward_badge || 'Badge'
  const hint =
    asString(challenge.metadata.hint) ||
    (challenge.type === 'daily'
      ? 'Revenez régulièrement pour faire progresser ce challenge.'
      : challenge.type === 'monthly'
        ? 'Accumulez vos actions sur la période en cours.'
        : 'Concentrez-vous sur les actions à fort impact pour le terminer.')
  const nextStep =
    asString(challenge.metadata.next_step) ||
    'Complétez vos actions depuis les projets, le dashboard et la communauté.'
  const dateLabel = challenge.end_date
    ? new Date(challenge.end_date).toLocaleDateString('fr-FR')
    : challenge.start_date
      ? new Date(challenge.start_date).toLocaleDateString('fr-FR')
      : null

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
                <div
                  className={cn(
                    'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]',
                    challenge.type === 'daily'
                      ? 'border-info/20 bg-info/10 text-info'
                      : challenge.type === 'monthly'
                        ? 'border-accent/20 bg-accent/10 text-accent'
                        : 'border-primary/20 bg-primary/10 text-primary',
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {challenge.type === 'daily'
                    ? 'Quotidien'
                    : challenge.type === 'monthly'
                      ? 'Mensuel'
                      : 'Saisonnier'}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
              <Badge className="rounded-full">{rewardLabel}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conseil</p>
                <p className="mt-2 text-sm">{hint}</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Progression
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                  <Flame className="h-4 w-4 text-client-amber-500" /> {Math.round(percentage)}%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {progress} / {target}
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Statut</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-success" /> Récompense réclamée
                    </>
                  ) : isCompleted ? (
                    <>
                      <Zap className="h-4 w-4 text-primary" /> Récompense à réclamer
                    </>
                  ) : (
                    <>
                      <Flame className="h-4 w-4 text-client-amber-500" /> En cours
                    </>
                  )}
                </p>
                {dateLabel ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {dateLabel}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <span>Avancement</span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{nextStep}</p>
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
