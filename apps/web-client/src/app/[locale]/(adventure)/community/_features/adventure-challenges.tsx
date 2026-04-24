'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Crown,
  Lock,
  Sparkles,
  Sprout,
  UsersRound,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useActionAuth } from '@/hooks/use-action-auth'
import { useHaptic } from '@/hooks/use-haptic'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { recordClientMockChallengeCompletion } from '@/lib/mock/mock-challenge-progress'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockSubscription } from '@/lib/mock/mock-member-data'
import type { MockChallengeDetail, MockMonthlyQuestOverview } from '@/lib/mock/mock-challenges'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

type DailyQuest = MockChallengeDetail
type DailyQuestType = DailyQuest['type']

type QuestTheme = {
  icon: typeof BookOpen
  iconClassName: string
  progressClassName: string
}

type AdventureChallengesProps = {
  initialFaction?: Faction | null
  viewerId?: string | null
  initialDayKey?: string | null
  initialDayLabel?: string
  initialDailyQuests?: DailyQuest[]
  initialMonthlyQuest?: MockMonthlyQuestOverview | null
}


const questThemes: Record<DailyQuestType, QuestTheme> = {
  education: {
    icon: BookOpen,
    iconClassName: 'text-sky-200',
    progressClassName: 'bg-sky-300',
  },
  social: {
    icon: UsersRound,
    iconClassName: 'text-lime-300',
    progressClassName: 'bg-lime-400',
  },
  daily_harvest: {
    icon: Sparkles,
    iconClassName: 'text-amber-200',
    progressClassName: 'bg-amber-300',
  },
}

const EMPTY_MONTHLY_QUEST: MockMonthlyQuestOverview = {
  title: 'Cycle du mois',
  timeLeft: '0 jour restant',
  objective: 'Valide 20 jours de présence',
  progress: 0,
  max: 20,
  completedDays: 0,
  currentDayKey: '',
  monthKey: '',
}

const FACTION_CONTENT = {
  neutral: {
    title: "Les Défis Quotidiens",
    mascotImg: '/images/logo-icon-bee.png',
  },
  pollinisateurs: {
    title: 'Quête de Melli',
    mascotImg: '/abeille-transparente.png',
  },
  forets: {
    title: 'Quête de Sylva',
    mascotImg: '/sylva.png',
  },
  mers: {
    title: "Quête d'Ondine",
    mascotImg: '/ondine.png',
  },
} as const


export function AdventureChallenges({
  initialFaction = null,
  viewerId = null,
  initialDayKey = null,
  initialDayLabel = "aujourd'hui",
  initialDailyQuests = [],
  initialMonthlyQuest = null,
}: AdventureChallengesProps) {
  const haptic = useHaptic()
  const searchParams = useSearchParams()
  const { guardAction } = useActionAuth({
    viewerId,
    faction: initialFaction,
  })

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(initialDailyQuests)
  const [monthlyQuestState, setMonthlyQuestState] = useState<MockMonthlyQuestOverview | null>(
    initialMonthlyQuest,
  )
  const [floatingReward, setFloatingReward] = useState<{ id: number; amount: number } | null>(null)

  // Utiliser les données mockées existantes pour l'abonnement
  const session = getClientMockViewerSession()
  const subscription = session ? getMockSubscription(session.viewerId) : null
  const hasSubscription = subscription?.status === 'active'
  const isConnected = !!session

  const themeKey = resolveFactionThemeKey(initialFaction)
  const contentKey = themeKey === 'neutral' ? 'forets' : themeKey
  const accentTheme = getFactionTheme(initialFaction)
  const factionTheme = {
    title: initialFaction ? FACTION_CONTENT[contentKey].title : "Les Défis Quotidiens",
    mascotImg: initialFaction ? FACTION_CONTENT[contentKey].mascotImg : undefined,
    accentBg: accentTheme.accentBg,
    accentText: accentTheme.accentText,
    badgeBg: accentTheme.badgeClassName,
    bgGradient: accentTheme.heroGradient,
  }

  const activeMonthlyQuest = monthlyQuestState ?? initialMonthlyQuest ?? EMPTY_MONTHLY_QUEST
  const monthlyProgressRatio =
    activeMonthlyQuest.max > 0
      ? Math.min((activeMonthlyQuest.progress / activeMonthlyQuest.max) * 100, 100)
      : 0
  const dayHeading =
    initialDayLabel && initialDayLabel !== "aujourd'hui"
      ? `Quêtes du ${initialDayLabel}`
      : 'Quêtes du jour'

  const ecoFactQuest = useMemo(
    () => dailyQuests.find((quest) => quest.type === 'education') ?? null,
    [dailyQuests],
  )
  const dailyHarvestQuest = useMemo(
    () => dailyQuests.find((quest) => quest.type === 'daily_harvest') ?? null,
    [dailyQuests],
  )

  useEffect(() => {
    setDailyQuests(initialDailyQuests)
    setMonthlyQuestState(initialMonthlyQuest)
  }, [initialDailyQuests, initialMonthlyQuest])

  useEffect(() => {
    if (!floatingReward) {
      return
    }

    const timeoutId = window.setTimeout(() => setFloatingReward(null), 1300)
    return () => window.clearTimeout(timeoutId)
  }, [floatingReward])


  const incrementMonthlyQuestIfNeeded = useCallback(() => {
    const hasCompletedQuest = dailyQuests.some((quest) => Boolean(quest.completedAt || quest.claimedAt))
    if (hasCompletedQuest) {
      return
    }

    setMonthlyQuestState((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        progress: Math.min(current.progress + 1, current.max),
        completedDays: Math.min(current.completedDays + 1, current.max),
      }
    })
  }, [dailyQuests])

  const markQuestAsClaimed = useCallback((questType: DailyQuestType, timestamp: string) => {
    setDailyQuests((current) =>
      current.map((quest) => {
        if (quest.type !== questType || quest.progress >= quest.max) {
          return quest
        }

        return {
          ...quest,
          progress: quest.max,
          completedAt: quest.completedAt || timestamp,
          claimedAt: quest.claimedAt || timestamp,
          status: 'claimed',
        }
      }),
    )
  }, [])

  const awardQuestReward = useCallback(
    (quest: DailyQuest | null, archetypeId: 'eco-fact' | 'daily-harvest', timestamp: string) => {
      if (!quest || quest.progress >= quest.max) {
        return
      }

      incrementMonthlyQuestIfNeeded()
      setFloatingReward({
        id: Date.now(),
        amount: quest.reward,
      })
      haptic.lightTap()

      if (viewerId && initialDayKey) {
        recordClientMockChallengeCompletion({
          viewerId,
          dayKey: initialDayKey,
          archetypeId,
          max: quest.max,
          timestamp,
        })
      }
    },
    [haptic, incrementMonthlyQuestIfNeeded, initialDayKey, viewerId],
  )


  return (
    <section className='w-full animate-in fade-in slide-in-from-bottom-2 pb-36 duration-500 md:pb-10'>
      <div className='relative isolate w-full overflow-hidden'>
        <div className={`absolute inset-0 z-[-1] bg-gradient-to-b ${factionTheme.bgGradient}`} />

        <div className='relative z-20 px-6 pb-24 pt-12'>
          {initialFaction ? (
            <p className={`text-[11px] font-bold uppercase tracking-widest ${factionTheme.accentText}`}>
              {activeMonthlyQuest.title}
            </p>
          ) : (
            <p className='text-[11px] font-bold uppercase tracking-widest text-white/40'>
              Exploration libre
            </p>
          )}
          <h1 className='mt-1 text-3xl font-black tracking-tight text-white drop-shadow-md'>
            {initialFaction ? factionTheme.title : 'Les Défis du Vivant'}
          </h1>
          <p className={`mt-2 text-[11px] font-bold uppercase tracking-widest ${initialFaction ? factionTheme.accentText : 'text-white/40'}`}>
            {initialFaction ? activeMonthlyQuest.timeLeft : 'Découvrez les actions quotidiennes pour protéger la biodiversité.'}
          </p>
        </div>

        {initialFaction && (
          <div className='absolute bottom-0 right-[-10px] z-10 h-40 w-40 opacity-90'>
            <img
              src={factionTheme.mascotImg || '/images/logo-icon-bee.png'}
              alt={factionTheme.title}
              className='h-full w-full object-contain object-bottom drop-shadow-2xl'
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      <div className='relative z-30 -mt-12 mb-8 px-4'>
        <div className='rounded-2xl border border-white/10 bg-card/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-xl'>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <h2 className='text-base font-bold tracking-tight text-white'>{activeMonthlyQuest.objective}</h2>
            <span
              className={cn(
                'rounded-full px-2 py-1 text-[10px] font-bold tabular-nums',
                factionTheme.badgeBg,
                factionTheme.accentText,
              )}
            >
              +500{' '}
              <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
            </span>
          </div>

          <div className='h-3 w-full overflow-hidden rounded-full bg-white/5'>
            <div
              className={`h-full rounded-full ${factionTheme.accentBg}`}
              style={{ width: `${monthlyProgressRatio}%` }}
            />
          </div>
          <div className='mt-2 text-right text-[11px] font-medium tabular-nums text-white/50'>
            {activeMonthlyQuest.progress} / {activeMonthlyQuest.max} jours
          </div>
        </div>
      </div>

      <div className='flex w-full flex-col'>
        <h2 className='mb-2 flex justify-between px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
          <span>{dayHeading}</span>
          <span>{initialDayLabel}</span>
        </h2>

        {dailyQuests.length === 0 ? (
          <div className='px-6 py-8 text-sm text-white/60'>
            Aucun défi disponible pour le moment.
          </div>
        ) : null}

        {dailyQuests.map((quest) => {
          const theme = questThemes[quest.type]
          const Icon = theme.icon
          const progress = Math.min((quest.progress / quest.max) * 100, 100)
          const isComplete = quest.progress >= quest.max
          const isHarvestComplete = quest.type === 'daily_harvest' && isComplete
          const isSocialComplete = quest.type === 'social' && isComplete

          const rowContent = (
            <>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5'>
                <Icon className={cn('h-5 w-5', theme.iconClassName)} />
              </div>

              <div className='min-w-0 flex-1'>
                <div className='flex min-w-0 items-center gap-2'>
                  <h3 className='truncate text-sm font-semibold text-white'>{quest.title}</h3>
                  {isComplete ? <CheckCircle2 className='h-4 w-4 shrink-0 text-lime-400' /> : null}
                </div>
                  <p className='mt-0.5 line-clamp-2 text-[12px] leading-tight text-white/60'>
                    {quest.description}
                  </p>
                  {isHarvestComplete ? (
                    <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-lime-400'>
                      Récolte déjà effectuée
                    </p>
                  ) : null}
                  {isSocialComplete ? (
                    <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-lime-400'>
                      3 Bravos déjà distribués
                    </p>
                  ) : null}

                  <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10'>
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', theme.progressClassName)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className='mt-1 text-[10px] font-medium tabular-nums text-white/40'>
                  {quest.progress} / {quest.max}
                </p>
              </div>

              <div
                className={cn(
                  'shrink-0 rounded-full px-2 py-1 text-[10px] font-bold tabular-nums whitespace-nowrap',
                  accentTheme.badgeClassName,
                  accentTheme.accentText,
                )}
              >
                +{quest.reward}{' '}
                <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
              </div>
            </>
          )

          if (quest.type === 'education') {
            const ecoFactUrl = new URLSearchParams()
            if (initialFaction) ecoFactUrl.set('faction', initialFaction)
            if (quest.id) ecoFactUrl.set('challengeId', quest.id)
            if (viewerId) ecoFactUrl.set('viewerId', viewerId)
            const ecoFactPath = `/aventure/eco-fact/${initialDayKey || 'today'}${ecoFactUrl.toString() ? `?${ecoFactUrl.toString()}` : ''}`
            
            return (
              <Link
                key={quest.id}
                href={ecoFactPath}
                className='flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left transition-colors active:bg-white/5'
              >
                {rowContent}
              </Link>
            )
          }

          if (quest.type === 'daily_harvest') {
            const harvestUrl = new URLSearchParams()
            if (initialFaction) harvestUrl.set('faction', initialFaction)
            if (quest.id) harvestUrl.set('challengeId', quest.id)
            if (viewerId) harvestUrl.set('viewerId', viewerId)
            const harvestPath = `/aventure/daily-harvest/${initialDayKey || 'today'}${harvestUrl.toString() ? `?${harvestUrl.toString()}` : ''}`
            
            return (
              isHarvestComplete ? (
                <div
                  key={quest.id}
                  className='flex w-full cursor-default items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 opacity-70'
                >
                  {rowContent}
                </div>
              ) : (
                <Link
                  key={quest.id}
                  href={harvestPath}
                  className={cn(
                    'flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left transition-colors active:bg-white/5',
                  )}
                >
                  {rowContent}
                </Link>
              )
            )
          }

          return quest.href ? (
            isSocialComplete ? (
              <button
                key={quest.id}
                type='button'
                disabled
                className='flex w-full cursor-default items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left opacity-70'
              >
                {rowContent}
              </button>
            ) : (
              <Link
                key={quest.id}
                href={quest.href}
                className='flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 transition-colors active:bg-white/5'
              >
                {rowContent}
              </Link>
            )
          ) : (
            <div key={quest.id} className='flex w-full items-center gap-4 border-b border-white/5 px-6 py-4'>
              {rowContent}
            </div>
          )
        })}

        {/* ── UPSELL PREMIUM : BOOST GARDIEN ── */}
        {!hasSubscription ? (
          <>
            <div className='mx-6 mt-3 mb-2 flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 opacity-80'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10'>
                <Sparkles className='h-5 w-5 text-amber-400' />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-sm font-bold text-white/60'>Boost Gardien</span>
                  <span className='rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400'>
                    ×2
                  </span>
                  <span className='ml-auto rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400'>
                    👑 Gardiens
                  </span>
                </div>
                <p className='mt-0.5 text-[11px] text-white/40'>
                  Double vos graines sur toutes les quêtes du jour.
                </p>
              </div>
              <Lock className='h-4 w-4 shrink-0 text-white/25' />
            </div>
            <Link
              href={isConnected ? '/dashboard/subscription' : '/onboarding/step-0'}
              className='mx-6 mb-4 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold text-amber-400/70 transition-colors hover:text-amber-400 active:opacity-50'
            >
              Débloquer en tant que Gardien <ChevronRight className='h-3.5 w-3.5' />
            </Link>
          </>
        ) : (
          <div className='mx-6 mt-3 mb-4 flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10'>
              <Crown className='h-5 w-5 text-amber-400' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-1.5'>
                <span className='text-sm font-bold text-amber-400'>Boost Gardien Actif</span>
                <span className='rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400'>
                  ×2
                </span>
              </div>
              <p className='mt-0.5 text-[11px] text-white/60'>
                Vos graines sont doublées sur toutes les quêtes du jour.
              </p>
            </div>
          </div>
        )}
      </div>


      <AnimatePresence>
        {floatingReward ? (
          <motion.div
            key={floatingReward.id}
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 1.06 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className='pointer-events-none fixed inset-x-0 top-[18%] z-[95] flex justify-center px-4'
          >
            <div
              className={cn(
                'rounded-full px-4 py-2 text-sm font-black backdrop-blur-md',
                accentTheme.badgeClassName,
                accentTheme.accentText,
                accentTheme.accentShadow,
              )}
            >
              +{floatingReward.amount} graines gagnées
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </section>
  )
}
