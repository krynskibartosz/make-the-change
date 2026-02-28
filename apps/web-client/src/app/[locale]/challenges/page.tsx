import { Button, Card, CardContent } from '@make-the-change/core/ui'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, isRecord } from '@/lib/type-guards'
import { cn } from '@/lib/utils'

type ChallengeProgressRow = {
  progress?: number | null
  target?: number | null
  completed_at?: string | null
  claimed_at?: string | null
}

type ChallengeRow = {
  id: string
  slug: string
  type: string
  reward_points: number
  title: string
  description: string
  user_challenges?: ChallengeProgressRow[] | ChallengeProgressRow | null
}

const toChallengeProgress = (value: unknown): ChallengeProgressRow => {
  const record = isRecord(value) ? value : {}

  return {
    progress: asNumber(record.progress, 0),
    target: asNumber(record.target, 100),
    completed_at: asString(record.completed_at) || null,
    claimed_at: asString(record.claimed_at) || null,
  }
}

const toChallengeRow = (value: unknown): ChallengeRow | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  const rawUserChallenges = value.user_challenges
  const userChallenges = Array.isArray(rawUserChallenges)
    ? rawUserChallenges.map((entry) => toChallengeProgress(entry))
    : rawUserChallenges
      ? toChallengeProgress(rawUserChallenges)
      : null

  return {
    id,
    slug: asString(value.slug),
    type: asString(value.type),
    reward_points: Math.max(0, Math.floor(asNumber(value.reward_points, 0))),
    title: asString(value.title),
    description: asString(value.description),
    user_challenges: userChallenges,
  }
}

export default async function ChallengesPage() {
  const supabase = await createClient()

  const { data: challenges, error } = await supabase
    .schema('gamification')
    .from('challenges')
    .select('*, user_challenges(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching challenges:', error)
  }

  const challengeRows = Array.isArray(challenges)
    ? challenges
        .map((challenge) => toChallengeRow(challenge))
        .filter((challenge): challenge is ChallengeRow => challenge !== null)
    : []

  const items = challengeRows.map((c) => {
    const progressEntry = Array.isArray(c.user_challenges)
      ? c.user_challenges[0]
      : (c.user_challenges ?? null)
    const progress = progressEntry?.progress ?? 0
    const target = progressEntry?.target ?? 100
    const percentage = Math.min((progress / target) * 100, 100)
    const isCompleted = !!progressEntry?.completed_at
    const isClaimed = !!progressEntry?.claimed_at

    return {
      ...c,
      userProgress: {
        progress,
        target,
        percentage,
        isCompleted,
        isClaimed,
      },
    }
  })

  return (
    <>
      <PageHero
        badge={
          <span className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-primary animate-pulse" />
            Saison 1 : Éveil de la Conscience
          </span>
        }
        title="Missions & Challenges"
        description="Accomplissez des actions concrètes pour la planète et gagnez des récompenses exclusives."
        size="lg"
        variant="gradient"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-client-amber-500/20 blur-[100px]" />
        </div>
      </PageHero>

      <SectionContainer size="lg" className="-mt-12 relative z-20 pb-24">
        {items.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
                <Target className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-xl font-black tracking-tight">Aucune mission disponible</p>
              <p className="text-muted-foreground font-medium">
                Revenez bientôt pour de nouveaux défis !
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Link key={c.id} href={`/challenges/${c.slug}`} className="group block h-full">
                <Card className="relative h-full border-border/60 bg-card/95 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 rounded-3xl overflow-hidden">
                  {/* Card Header with Type Badge and Reward */}
                  <div className="absolute left-4 top-4 z-10">
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-widest',
                        c.type === 'daily'
                          ? 'bg-info/90 text-info-foreground border-info/20'
                          : c.type === 'monthly'
                            ? 'bg-accent/90 text-accent-foreground border-accent/20'
                            : 'bg-primary/90 text-primary-foreground border-primary/20',
                      )}
                    >
                      <Sparkles className="h-3 w-3" />
                      {c.type === 'daily'
                        ? 'Quotidien'
                        : c.type === 'monthly'
                          ? 'Mensuel'
                          : 'Saisonnier'}
                    </div>
                  </div>
                  
                  <div className="absolute right-4 top-4 z-10">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white border border-amber-400/20 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-tight shadow-lg">
                      <Trophy className="h-3 w-3" />
                      {c.reward_points > 0 ? `+${c.reward_points} pts` : 'Badge'}
                    </div>
                  </div>

                  <CardContent className="space-y-6 p-6 pt-16">
                    {/* Title Section */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                        {c.title}
                        {c.userProgress.isCompleted && (
                          <div className="bg-success text-success-foreground rounded-full p-1 shadow-lg">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                        {c.description}
                      </p>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          Progression
                        </span>
                        <span className="text-foreground font-bold">
                          {c.userProgress.progress} / {c.userProgress.target}
                        </span>
                      </div>
                      <div className="relative h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out shadow-sm"
                          style={{ width: `${c.userProgress.percentage}%` }}
                        />
                        {c.userProgress.percentage > 0 && (
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-md transition-all duration-300"
                            style={{ left: `calc(${c.userProgress.percentage}% - 4px)` }}
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-primary">
                          {Math.round(c.userProgress.percentage)}%
                        </span>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {c.type === 'daily' ? 'Expire aujourd\'hui' : c.type === 'monthly' ? 'Expire ce mois' : 'Expire bientôt'}
                      </div>

                      {c.userProgress.isCompleted && !c.userProgress.isClaimed ? (
                        <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest animate-pulse bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                          <Zap className="h-3.5 w-3.5" />
                          Réclamer !
                        </div>
                      ) : c.userProgress.isClaimed ? (
                        <div className="flex items-center gap-1.5 text-success font-black text-[10px] uppercase tracking-widest bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Récupéré
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-warning font-black text-[10px] uppercase tracking-widest bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
                          <Flame className="h-3.5 w-3.5" />
                          En cours
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Gamification Tip Card */}
        <div className="mt-16 relative group overflow-hidden rounded-[3rem] border bg-client-slate-950 p-8 md:p-12 text-client-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-40" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-client-white/5 backdrop-blur-xl border border-client-white/10 flex items-center justify-center shrink-0 rotate-12 group-hover:rotate-0 transition-transform">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black tracking-tight">Boostez votre Impact Score</p>
                <p className="text-client-slate-400 font-medium max-w-md">
                  Chaque challenge accompli vous propulse dans le classement global et débloque des
                  avantages exclusifs en boutique.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto h-14 px-8 rounded-2xl border-client-white/10 text-client-white hover:bg-client-white/5 font-black uppercase tracking-widest text-xs"
            >
              <Link href="/leaderboard">
                Voir le classement <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
