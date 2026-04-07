import { Button, Card, CardContent } from '@make-the-change/core/ui'
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Flame,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
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
  reward_graines: number
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
    reward_graines: Math.max(0, Math.floor(asNumber(value.reward_graines, 0))),
    title: asString(value.title),
    description: asString(value.description),
    user_challenges: userChallenges,
  }
}

export async function AdventureChallenges() {
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
    <div className="gap-8 px-4 sm:px-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {items.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
              <Target className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-black tracking-tight">Aucune mission disponible</p>
            <p className="text-muted-foreground font-medium">Revenez bientôt pour de nouveaux défis !</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Link key={c.id} href={`/challenges/${c.slug}`} className="group block h-full">
              <Card className="relative h-full border-border/60 bg-card/95 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 rounded-3xl overflow-hidden">
                <div className="absolute left-4 top-4 z-10">
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-widest',
                      c.type === 'daily'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/20'
                        : c.type === 'monthly'
                          ? 'bg-orange-500/15 text-orange-300 border-orange-500/20'
                          : 'bg-lime-500/15 text-lime-400 border-lime-500/20',
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    {c.type === 'daily' ? 'Quotidien' : c.type === 'monthly' ? 'Mensuel' : 'Saisonnier'}
                  </div>
                </div>
                
                <div className="absolute right-4 top-4 z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-tight shadow-md">
                    {c.reward_graines > 0 ? (
                      <>
                        <Sprout className="h-3 w-3" />
                        +{c.reward_graines} Graines
                      </>
                    ) : (
                      <>
                        <Trophy className="h-3 w-3" />
                        Badge
                      </>
                    )}
                  </div>
                </div>

                <CardContent className="space-y-6 p-6 pt-16">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      {c.title === 'Streak 7 jours' || c.title === 'Série 7 jours' ? 'Série de 7 jours' : c.title}
                      {c.userProgress.isCompleted && (
                        <div className="bg-success text-success-foreground rounded-full p-1 shadow-md">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </h3>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-3">
                      {c.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Flame size={14} className="opacity-80" />
                        Progression
                      </span>
                      <span className="text-white font-semibold tabular-nums">
                        {c.userProgress.progress} / {c.userProgress.target}{' '}
                        {c.title.toLowerCase().includes('jour') ? 'jours' : c.title.toLowerCase().includes('projet') ? 'projets' : ''}
                      </span>
                    </div>
                    <div className="relative h-2 w-full bg-slate-700/40 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-lime-400 transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${c.userProgress.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock size={14} className="opacity-80" />
                      {c.type === 'daily' ? "Expire aujourd'hui" : c.type === 'monthly' ? 'Expire ce mois' : 'Expire bientôt'}
                    </div>

                    {c.userProgress.isCompleted && !c.userProgress.isClaimed ? (
                      <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest animate-pulse bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        <Zap className="h-3.5 w-3.5" />
                        Réclamer !
                      </div>
                    ) : c.userProgress.isClaimed ? (
                      <div className="flex items-center gap-1.5 text-success font-black text-[10px] uppercase tracking-widest bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Validé
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Gamification Tip Card */}
      <div className="relative group overflow-hidden rounded-[2rem] border bg-client-slate-950 p-6 md:p-8 text-client-white shadow-xl mt-8">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-40" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-client-white/5 backdrop-blur-xl border border-client-white/10 flex items-center justify-center shrink-0 rotate-12 group-hover:rotate-0 transition-transform">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black tracking-tight">Boostez votre Impact Score</p>
              <p className="text-client-slate-400 font-medium text-sm max-w-sm">
                Progressez dans le classement global et débloquez des avantages exclusifs en boutique.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-12 px-6 rounded-xl border-client-white/10 text-client-white hover:bg-client-white/5 font-black uppercase tracking-widest text-xs mt-4 sm:mt-0"
          >
            <Link href="/leaderboard">
              Voir le classement <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
