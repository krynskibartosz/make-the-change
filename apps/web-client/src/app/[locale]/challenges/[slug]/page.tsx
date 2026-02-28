import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft, Calendar, CheckCircle2, Flame, Sparkles, Target, Trophy, Zap } from 'lucide-react'
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
          <Button variant="ghost" size="sm" className="hover:bg-muted/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux challenges
          </Button>
        </Link>

        <Card className="border-border/60 bg-card/95 shadow-lg backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardContent className="space-y-6 p-6 sm:p-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div
                  className={cn(
                    'inline-flex w-fit items-center gap-2 rounded-full border backdrop-blur-sm px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]',
                    challenge.type === 'daily'
                      ? 'border-info/20 bg-info/10 text-info'
                      : challenge.type === 'monthly'
                        ? 'border-accent/20 bg-accent/10 text-accent'
                        : 'border-primary/20 bg-primary/10 text-primary',
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  {challenge.type === 'daily'
                    ? 'Quotidien'
                    : challenge.type === 'monthly'
                      ? 'Mensuel'
                      : 'Saisonnier'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">{challenge.title}</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">{challenge.description}</p>
              </div>
              <div className="flex-shrink-0">
                <Badge className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg">
                  <Trophy className="mr-2 h-4 w-4" />
                  {rewardLabel}
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="relative rounded-2xl border border-border/40 bg-muted/30 p-4 backdrop-blur-sm">
                <div className="absolute top-2 right-2">
                  <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-info" />
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Conseil</p>
                <p className="text-sm leading-relaxed pr-8">{hint}</p>
              </div>
              
              <div className="relative rounded-2xl border border-border/40 bg-muted/30 p-4 backdrop-blur-sm">
                <div className="absolute top-2 right-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Flame className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Progression
                </p>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-primary">{Math.round(percentage)}%</p>
                  <p className="text-xs text-muted-foreground">
                    {progress} / {target}
                  </p>
                </div>
              </div>
              
              <div className="relative rounded-2xl border border-border/40 bg-muted/30 p-4 backdrop-blur-sm">
                <div className="absolute top-2 right-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isClaimed ? 'bg-success/10' : isCompleted ? 'bg-primary/10' : 'bg-warning/10'
                  }`}>
                    {isClaimed ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : isCompleted ? (
                      <Zap className="h-4 w-4 text-primary" />
                    ) : (
                      <Flame className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Statut</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {isClaimed ? (
                      <span className="text-success">Récompense réclamée</span>
                    ) : isCompleted ? (
                      <span className="text-primary">Récompense à réclamer</span>
                    ) : (
                      <span className="text-warning">En cours</span>
                    )}
                  </p>
                  {dateLabel ? (
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateLabel}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-r from-muted/20 to-muted/10 border border-border/30">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Avancement
                </span>
                <span className="text-primary font-black">{Math.round(percentage)}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted/50">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 shadow-sm"
                  style={{ width: `${percentage}%` }}
                />
                {percentage > 0 && (
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-md transition-all duration-300"
                    style={{ left: `calc(${percentage}% - 4px)` }}
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{nextStep}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Button asChild className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/projects" className="flex items-center justify-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Découvrir des projets
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-xs border-border/60 hover:bg-muted/50 transition-all duration-300">
                <Link href="/leaderboard" className="flex items-center justify-center gap-2">
                  <Target className="h-4 w-4" />
                  Voir le classement
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
