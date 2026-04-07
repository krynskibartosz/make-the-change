import { Button, Card, CardContent } from '@make-the-change/core/ui'
import {
  CheckCircle2,
  Flame,
  Leaf,
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
    
    // FIX : Cohérence mathématique selon titre
    const target = c.title.toLowerCase().includes('7 jours') || c.title.toLowerCase().includes('série')
      ? 7
      : c.title.toLowerCase().includes('3 projet')
        ? 3
        : progressEntry?.target ?? 100
    
    const percentage = Math.min((progress / target) * 100, 100)
    const isCompleted = !!progressEntry?.completed_at
    const isClaimed = !!progressEntry?.claimed_at

    // Icône selon type de défi
    const getIcon = () => {
      if (c.title.toLowerCase().includes('série') || c.title.toLowerCase().includes('streak')) {
        return Flame
      }
      if (c.title.toLowerCase().includes('projet')) {
        return Sprout
      }
      return Target
    }

    return {
      ...c,
      userProgress: {
        progress,
        target,
        percentage,
        isCompleted,
        isClaimed,
      },
      icon: getIcon(),
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
        <div className="w-full">
          {items.map((c) => {
            const Icon = c.icon
            const unitLabel = c.title.toLowerCase().includes('jour')
              ? 'jours'
              : c.title.toLowerCase().includes('projet')
                ? 'projets'
                : ''

            return (
              <div
                key={c.id}
                className="w-full px-6 py-5 flex flex-row items-center gap-4 border-b border-white/5 last:border-0 active:bg-white/5 transition-colors cursor-pointer"
              >
                {/* Icône gauche (Squircle) */}
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-white/10 group-hover:bg-lime-500/20 transition-colors">
                  <Icon size={24} className="text-white group-hover:text-lime-400 transition-colors" />
                </div>

                {/* Contenu central */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  {/* Titre */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground tracking-tight truncate">
                      {c.title === 'Streak 7 jours' || c.title === 'Série 7 jours' ? 'Série de 7 jours' : c.title}
                    </h3>
                    {c.userProgress.isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    )}
                  </div>

                  {/* Barre de progression */}
                  <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-lime-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${c.userProgress.percentage}%` }}
                    />
                  </div>

                  {/* Sous-texte fusionné */}
                  <p className="text-xs text-muted-foreground font-medium">
                    {c.userProgress.progress} / {c.userProgress.target} {unitLabel}
                    {c.type === 'daily' && ' • Expire aujourd\'hui'}
                  </p>
                </div>

                {/* Récompense droite */}
                <div className="flex-shrink-0 text-right">
                  {c.userProgress.isClaimed ? (
                    <div className="flex items-center gap-1.5 text-success font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validé</span>
                    </div>
                  ) : c.userProgress.isCompleted ? (
                    <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs uppercase animate-pulse">
                      <Zap className="w-4 h-4" />
                      <span>Réclamer</span>
                    </div>
                  ) : c.reward_graines > 0 ? (
                    <span className="font-bold text-lime-400 text-sm">
                      +{c.reward_graines} 🌱
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Trophy className="w-4 h-4" />
                      <span>Badge</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Clôture cognitive (End of List State) */}
        <p className="text-center text-sm text-muted-foreground mt-8 mb-4">
          Vous êtes à jour ! Revenez demain pour semer de nouvelles graines. 🌱
        </p>
      )}
    </div>
  )
}
