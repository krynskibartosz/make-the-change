'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type UIEvent } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lock,
  Sparkles,
  Sprout,
  UsersRound,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useActionAuth } from '@/hooks/use-action-auth'
import { useHaptic } from '@/hooks/use-haptic'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { recordClientMockChallengeCompletion } from '@/lib/mock/mock-challenge-progress'
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

type EcoFactArticleViewProps = {
  accentTheme: FactionTheme
  challenge: DailyQuest | null
  open: boolean
  onClose: () => void
}

type EcoFactReaderProps = {
  accentTheme: FactionTheme
  challenge: DailyQuest | null
  isCompleted: boolean
  open: boolean
  hasFaction: boolean
  onValidate: () => void
  onClose: () => void
}

type DailyHarvestModalProps = {
  accentTheme: FactionTheme
  challenge: DailyQuest | null
  open: boolean
  onClose: () => void
  onClaim: () => void
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
  pollinisateurs: {
    title: "Quête de l'Essaim",
    mascotImg: '/abeille-transparente.png',
  },
  forets: {
    title: 'Quête de la Forêt',
    mascotImg: '/sylva.png',
  },
  artisans: {
    title: 'Quête du Terroir',
    mascotImg: '/aura.png',
  },
} as const

const resolveArticleParagraphs = (challenge: DailyQuest | null) => {
  const articleSummary =
    challenge?.metadata.articleSummary ||
    'Un geste simple repete chaque jour finit par changer le vivant autour de nous.'

  if (challenge?.metadata.articleBody?.length) {
    return challenge.metadata.articleBody
  }

  return [
    articleSummary,
    challenge?.description ||
      'Comprendre un ecosysteme, c est deja commencer a mieux le proteger.',
    challenge?.metadata.nextStep ||
      'Observe ce que ce sujet change dans ta maniere de regarder les projets et les especes.',
  ]
}

function EcoFactArticleView({
  accentTheme,
  challenge,
  open,
  onClose,
}: EcoFactArticleViewProps) {
  const articleTitle = challenge?.metadata.articleTitle || challenge?.title || "L'Eco-Fact du jour"
  const articleSummary =
    challenge?.metadata.articleSummary ||
    'Une lecture courte pour mieux comprendre le vivant et ton impact.'
  const articleTagline = challenge?.metadata.themeLabel || 'Observation du jour'
  const articleFacts = [
    challenge?.metadata.hint,
    challenge?.metadata.articleSummary,
    challenge?.metadata.nextStep,
  ].filter((value): value is string => Boolean(value))
  const articleParagraphs = resolveArticleParagraphs(challenge)
  const articleQuote =
    articleParagraphs[1] || articleSummary || 'Le vivant repond a la repetition des bons gestes.'
  const articleCtaHref = challenge?.metadata.ctaHref || '/projects'
  const articleCtaLabel = challenge?.metadata.ctaLabel || 'Voir les projets lies'
  const articleBadge = challenge?.rewardBadge || 'Rituel quotidien'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className='fixed inset-0 z-[95] overflow-y-auto bg-[#0B0F15]'
          onClick={(event) => event.stopPropagation()}
        >
          <div className='relative h-72 w-full'>
            <img
              src='https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80'
              alt={articleTagline}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent' />
            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation()
                onClose()
              }}
              className='absolute left-5 top-6 z-20 rounded-full bg-black/50 p-2 backdrop-blur-md'
              aria-label="Fermer l'article"
            >
              <X className='h-5 w-5 text-white' />
            </button>
          </div>

          <div className='px-6 pt-8'>
            <div className='flex flex-wrap items-center gap-2'>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]',
                  accentTheme.accentBorder,
                  accentTheme.accentText,
                )}
              >
                {articleTagline}
              </span>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55'>
                {articleBadge}
              </span>
            </div>
            <h1 className='mb-6 mt-5 text-3xl font-black leading-[1.05] tracking-tight text-white'>
              {articleTitle}
            </h1>
          </div>

          {articleFacts.length > 0 ? (
            <div
              className={cn(
                'mx-6 mb-8 rounded-2xl border p-5',
                accentTheme.accentBgSoft,
                accentTheme.accentBorder,
              )}
            >
              <h3
                className={cn(
                  'mb-3 text-[10px] font-bold uppercase tracking-widest',
                  accentTheme.accentText,
                )}
              >
                En bref
              </h3>
              <ul className='space-y-3 text-sm text-white/80'>
                {articleFacts.map((fact) => (
                  <li key={fact} className='flex items-start gap-3'>
                    <span className='mt-1 text-lg leading-none text-lime-400'>&bull;</span>
                    <span className='flex-1'>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className='space-y-6 px-6 pb-24'>
            {articleParagraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph} className='text-[17px] leading-relaxed text-white/80'>
                {paragraph}
              </p>
            ))}
          </div>

          <div className='my-10 px-6'>
            <img
              src='https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'
              alt={articleTagline}
              className='h-48 w-full rounded-2xl object-cover opacity-90'
            />
          </div>

          <div className='space-y-6 px-6 pb-24'>
            {articleParagraphs.slice(2).map((paragraph) => (
              <p key={paragraph} className='text-[17px] leading-relaxed text-white/80'>
                {paragraph}
              </p>
            ))}
            <blockquote className={cn('my-12 border-l-4 py-2 pl-6', accentTheme.accentBorder)}>
              <p className='text-2xl font-medium italic leading-snug text-white'>
                &quot;{articleQuote}&quot;
              </p>
            </blockquote>
          </div>

          <div
            className={cn(
              'mx-6 mb-12 mt-16 rounded-3xl border p-6 text-center',
              accentTheme.accentBgSoft,
              accentTheme.accentBorder,
            )}
          >
            <h3 className={cn('mb-2 text-xl font-black', accentTheme.accentText)}>
              Passe a l'action
            </h3>
            <p className='mb-4 text-sm text-white/70'>{articleSummary}</p>
            <Link
              href={articleCtaHref}
              onClick={onClose}
              className={cn(
                'inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-bold text-black',
                accentTheme.accentBg,
              )}
            >
              {articleCtaLabel}
            </Link>
          </div>

          <div className='pb-40' />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function EcoFactReader({
  accentTheme,
  challenge,
  isCompleted,
  open,
  hasFaction,
  onValidate,
  onClose,
}: EcoFactReaderProps) {
  const haptic = useHaptic()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isArticleOpen, setIsArticleOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const articleTitle = challenge?.metadata.articleTitle || challenge?.title || "L'Eco-Fact du jour"
  const articleSummary =
    challenge?.metadata.articleSummary ||
    challenge?.description ||
    'Une lecture courte pour comprendre le vivant.'
  const challengeLabel = challenge?.metadata.themeLabel || 'Observation du jour'
  const challengeBadge = challenge?.rewardBadge || 'Rituel quotidien'
  const challengeNumber = challenge?.dayKey ? challenge.dayKey.slice(-2) : '01'
  const questMeta = [
    challengeLabel,
    challenge?.metadata.linkedSpeciesId ? 'Biodex' : null,
    challenge?.metadata.linkedProjectSlug ? 'Projet terrain' : null,
  ].filter((value): value is string => Boolean(value))

  useEffect(() => {
    if (!open) {
      return
    }

    setIsArticleOpen(false)
    setScrollProgress(isCompleted ? 100 : 0)
    setIsUnlocked(isCompleted)
  }, [isCompleted, open])

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
      const maxScrollable = scrollHeight - clientHeight

      if (maxScrollable <= 0) {
        setScrollProgress(100)
        if (!isUnlocked) {
          setIsUnlocked(true)
        }
        return
      }

      const progress = Math.min(100, Math.max(0, (scrollTop / maxScrollable) * 100))
      setScrollProgress(progress)

      if (progress >= 90 && !isUnlocked) {
        setIsUnlocked(true)
        haptic.mediumTap()
      }
    },
    [haptic, isUnlocked],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const checkScrollable = () => {
      const node = contentRef.current
      if (!node) {
        return
      }

      const maxScrollable = node.scrollHeight - node.clientHeight
      if (maxScrollable <= 0) {
        setScrollProgress(100)
        setIsUnlocked(true)
        return
      }

      setScrollProgress(Math.min(100, Math.max(0, (node.scrollTop / maxScrollable) * 100)))
    }

    const rafId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(checkScrollable)
    })
    const timeoutId = window.setTimeout(checkScrollable, 300)
    window.addEventListener('resize', checkScrollable)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('resize', checkScrollable)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className='fixed inset-0 z-[80] flex flex-col overflow-hidden bg-[#0B0F15]'
        >
          <button
            type='button'
            aria-label='Fermer'
            onClick={(event) => {
              event.stopPropagation()
              onClose()
            }}
            className='absolute right-6 top-6 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:text-white'
          >
            <X className='h-4 w-4' />
          </button>

          <div ref={contentRef} onScroll={handleScroll} className='relative flex-1 overflow-y-auto pb-44'>
            <div className='relative isolate min-h-[46vh] px-6 pt-6'>
              <div className='pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />
              {hasFaction && (
                <motion.img
                  src='/images/logo-icon-bee.png'
                  alt={challengeLabel}
                  initial={{ opacity: 0, scale: 0.85, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { duration: 0.35, delay: 0.15 },
                    scale: { duration: 0.35, delay: 0.15 },
                    y: {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                      delay: 0.55,
                    },
                  }}
                  className='relative z-10 mx-auto mt-16 h-56 w-56 object-contain drop-shadow-2xl'
                />
              )}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className='mb-2 mt-6 px-6'
              >
                <div className='flex flex-wrap gap-2'>
                  <span className='inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50'>
                    Eco-Fact #{challengeNumber}
                  </span>
                  <span
                    className={cn(
                      'inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]',
                      accentTheme.accentBorder,
                      accentTheme.accentText,
                    )}
                  >
                    {challengeLabel}
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial='hidden'
              animate='show'
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.35,
                  },
                },
              }}
              className='mt-8 flex flex-col'
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                className='text-balance px-6 text-3xl font-black leading-tight tracking-tight text-white'
              >
                {articleTitle}
              </motion.h1>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                className='mb-8 mt-4 flex flex-wrap gap-2 px-6'
              >
                {questMeta.map((meta) => (
                  <span
                    key={meta}
                    className='rounded-full border border-lime-400/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-lime-400'
                  >
                    {meta}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                className='grid grid-cols-2 gap-3 px-6'
              >
                <div className='col-span-2 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6'>
                  <div className='flex shrink-0 items-baseline text-lime-400'>
                    <span className='text-6xl font-black leading-none tracking-tighter'>
                      {challenge?.reward ?? 50}
                    </span>
                    <span className='ml-1 text-xs font-medium uppercase tracking-[0.22em] opacity-70'>
                      graines
                    </span>
                  </div>
                  <p className='text-[13px] leading-relaxed text-white/70'>{articleSummary}</p>
                </div>

                <div className='flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-4'>
                  <span className='mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40'>
                    Progression
                  </span>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-2xl font-black tracking-tight text-white'>
                      {challenge?.progress ?? 0}
                    </span>
                    <span className='text-xs font-medium text-white/60'>/ {challenge?.max ?? 1}</span>
                  </div>
                </div>

                <div className='flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-4'>
                  <span className='mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40'>
                    Badge
                  </span>
                  <span className='line-clamp-2 text-sm font-black leading-tight text-white'>
                    {challengeBadge}
                  </span>
                </div>
              </motion.div>

              {isCompleted ? (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className='mt-4 px-6'
                >
                  <div
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-sm font-medium text-white/75',
                      accentTheme.accentBgSoft,
                      accentTheme.accentBorder,
                    )}
                  >
                    Déjà lu aujourd'hui. Tu peux relire ce dossier quand tu veux, mais la récompense a
                    déjà été comptée.
                  </div>
                </motion.div>
              ) : null}

              <div className='flex justify-center px-5'>
                <button
                  type='button'
                  onClick={(event) => {
                    event.stopPropagation()
                    haptic.mediumTap()
                    setIsArticleOpen(true)
                  }}
                  className='mx-auto mb-32 mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 transition-all hover:bg-white/10 active:bg-white/15'
                >
                  <BookOpen className='h-4 w-4 text-lime-400' />
                  <span className='text-sm font-bold text-white'>Explorer le dossier complet</span>
                  <ChevronRight className='h-4 w-4 text-white/30' />
                </button>
              </div>
            </motion.div>
          </div>

          <div className='absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12'>
            <div className='mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10'>
              <div
                className={cn('h-full transition-all duration-100 ease-out', accentTheme.accentBg)}
                style={{ width: `${isUnlocked ? 100 : scrollProgress}%` }}
              />
            </div>

            <button
              type='button'
              disabled={(!isUnlocked || isCompleted) && hasFaction}
              onClick={(event) => {
                event.stopPropagation()
                if (!isUnlocked || isCompleted) {
                  return
                }
                if (!hasFaction) {
                  window.location.href = '/welcome/setup'
                  return
                }
                onValidate()
              }}
              className={cn(
                'flex h-14 w-full items-center justify-center rounded-2xl text-lg font-black transition-all duration-500',
                isCompleted
                  ? 'border border-white/10 bg-white/5 text-white/55'
                  : isUnlocked
                  ? !hasFaction
                    ? 'bg-lime-400 text-black active:scale-95'
                    : cn(accentTheme.accentBg, 'text-[#0B0F15] active:scale-95', accentTheme.accentShadow)
                  : 'border border-white/10 bg-white/5 text-white/40',
              )}
            >
              {isCompleted ? (
                <span className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-lime-400' /> Déjà validé aujourd'hui
                </span>
              ) : isUnlocked ? (
                !hasFaction ? (
                  <span className='flex items-center gap-2 animate-in zoom-in duration-300'>
                    Rejoindre pour récolter {challenge?.reward ?? 50}
                    <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
                  </span>
                ) : (
                  <span className='flex items-center gap-2 animate-in zoom-in duration-300'>
                    C'est noté ! <span className='font-normal opacity-50'>|</span> +{challenge?.reward ?? 50}
                    <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
                  </span>
                )
              ) : (
                <span className='flex items-center gap-2'>
                  <Lock className='h-4 w-4' /> Faites défiler pour débloquer
                </span>
              )}
            </button>
          </div>

          <EcoFactArticleView
            accentTheme={accentTheme}
            challenge={challenge}
            open={isArticleOpen}
            onClose={() => setIsArticleOpen(false)}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function DailyHarvestModal({
  accentTheme,
  challenge,
  open,
  onClose,
  onClaim,
}: DailyHarvestModalProps) {
  const [phase, setPhase] = useState<'idle' | 'charging' | 'revealed'>('idle')
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearChargeInterval = useCallback(() => {
    if (!intervalRef.current) {
      return
    }

    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  useEffect(() => {
    if (!open) {
      clearChargeInterval()
      setPhase('idle')
      setProgress(0)
    }

    return () => {
      clearChargeInterval()
    }
  }, [clearChargeInterval, open])

  const startCharging = useCallback(() => {
    if (phase === 'revealed' || intervalRef.current) {
      return
    }

    setPhase('charging')
    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 4, 100)
        if (next >= 100) {
          clearChargeInterval()
          setPhase('revealed')
        }
        return next
      })
    }, 25)
  }, [clearChargeInterval, phase])

  const stopCharging = useCallback(() => {
    if (phase !== 'charging') {
      return
    }

    clearChargeInterval()
    setPhase('idle')
    setProgress(0)
  }, [clearChargeInterval, phase])

  const handleClose = useCallback(() => {
    clearChargeInterval()
    setPhase('idle')
    setProgress(0)
    onClose()
  }, [clearChargeInterval, onClose])

  const handleClaim = useCallback(() => {
    clearChargeInterval()
    setPhase('idle')
    setProgress(0)
    onClaim()
  }, [clearChargeInterval, onClaim])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className='fixed inset-0 z-[85] flex flex-col items-center justify-center overflow-hidden bg-[#0B0F15]/95 px-6 backdrop-blur-md'
        >
          <button
            type='button'
            aria-label='Fermer'
            onClick={handleClose}
            className='absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:text-white'
          >
            <X className='h-4 w-4' />
          </button>

          <div className='pointer-events-none absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />

          {phase !== 'revealed' ? (
            <div className='relative z-10 flex flex-col items-center'>
              <button
                type='button'
                onMouseDown={startCharging}
                onMouseUp={stopCharging}
                onMouseLeave={stopCharging}
                onTouchStart={(event) => {
                  event.preventDefault()
                  startCharging()
                }}
                onTouchEnd={(event) => {
                  event.preventDefault()
                  stopCharging()
                }}
                onTouchCancel={(event) => {
                  event.preventDefault()
                  stopCharging()
                }}
                className='relative rounded-full'
              >
                <img
                  src='/images/logo-icon-bee.png'
                  alt='Mascotte'
                  className={cn(
                    'h-48 w-48 object-contain drop-shadow-2xl transition-transform duration-100',
                    phase === 'charging' ? 'scale-110' : 'scale-100',
                  )}
                  draggable='false'
                />
              </button>

              <p className='mt-8 text-center text-sm font-bold uppercase tracking-widest text-white/55'>
                Maintiens pour récolter
              </p>
              <p className='mt-2 max-w-[250px] text-center text-sm text-white/55'>
                {challenge?.description || 'Charge ton rituel quotidien pour recevoir tes graines.'}
              </p>
              <div className='mt-5 h-2 w-56 overflow-hidden rounded-full bg-white/10'>
                <div
                  className={cn('h-full transition-all duration-75 ease-linear', accentTheme.accentBg)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className='animate-in zoom-in slide-in-from-bottom-10 duration-700 z-10 flex flex-col items-center'>
              <h2 className={cn('mb-2 text-sm font-bold uppercase tracking-widest', accentTheme.accentText)}>
                Récompense quotidienne
              </h2>
              <div className='relative mb-4'>
                <div className='pointer-events-none absolute inset-0 -z-10 flex items-center justify-center'>
                  <div className={cn('h-64 w-64 rounded-full blur-2xl', accentTheme.accentGlow)} />
                </div>
                <div className={cn('text-7xl font-black', accentTheme.accentText, accentTheme.accentShadow)}>
                  + {challenge?.reward ?? 50}{' '}
                  <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
                </div>
              </div>
              <p className='max-w-[250px] text-center text-white/60'>
                Ton compagnon a travaillé toute la nuit. Reviens demain pour continuer ta série.
              </p>
              <button
                type='button'
                onClick={handleClaim}
                className='mt-12 h-14 rounded-2xl bg-white px-8 font-bold text-black transition-transform active:scale-95'
              >
                Génial !
              </button>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

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
  const [isEcoFactReaderOpen, setIsEcoFactReaderOpen] = useState(false)
  const [isDailyHarvestOpen, setIsDailyHarvestOpen] = useState(false)
  const [floatingReward, setFloatingReward] = useState<{ id: number; amount: number } | null>(null)

  const themeKey = resolveFactionThemeKey(initialFaction)
  const contentKey = themeKey === 'neutral' ? 'forets' : themeKey
  const accentTheme = getFactionTheme(initialFaction)
  const factionTheme = {
    ...FACTION_CONTENT[contentKey],
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

  useEffect(() => {
    const intent = searchParams.get('intent')
    if (intent === 'eco-fact') {
      setIsEcoFactReaderOpen(true)
    } else if (
      intent === 'daily-harvest' &&
      !(dailyHarvestQuest && dailyHarvestQuest.progress >= dailyHarvestQuest.max)
    ) {
      setIsDailyHarvestOpen(true)
    } else {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('intent')
    nextParams.delete('targetId')
    const nextQuery = nextParams.toString()
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname
    window.history.replaceState(window.history.state, '', nextUrl)
  }, [dailyHarvestQuest, searchParams])

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

  const handleEcoFactOpen = useCallback(() => {
    guardAction(
      () => {
        setIsEcoFactReaderOpen(true)
      },
      { intent: 'eco-fact' },
    )
  }, [guardAction])

  const handleEcoFactValidate = useCallback(() => {
    const timestamp = new Date().toISOString()
    markQuestAsClaimed('education', timestamp)
    awardQuestReward(ecoFactQuest, 'eco-fact', timestamp)
    setIsEcoFactReaderOpen(false)
  }, [awardQuestReward, ecoFactQuest, markQuestAsClaimed])

  const handleDailyHarvestOpen = useCallback(() => {
    if (dailyHarvestQuest && dailyHarvestQuest.progress >= dailyHarvestQuest.max) {
      haptic.lightTap()
      return
    }

    guardAction(
      () => {
        setIsDailyHarvestOpen(true)
      },
      { intent: 'daily-harvest' },
    )
  }, [dailyHarvestQuest, guardAction, haptic])

  const handleDailyHarvestClaim = useCallback(() => {
    const timestamp = new Date().toISOString()
    markQuestAsClaimed('daily_harvest', timestamp)
    awardQuestReward(dailyHarvestQuest, 'daily-harvest', timestamp)
    setIsDailyHarvestOpen(false)
  }, [awardQuestReward, dailyHarvestQuest, markQuestAsClaimed])

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
              src={factionTheme.mascotImg}
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
            return (
              <button
                key={quest.id}
                type='button'
                onClick={handleEcoFactOpen}
                className='flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left transition-colors active:bg-white/5'
              >
                {rowContent}
              </button>
            )
          }

          if (quest.type === 'daily_harvest') {
            return (
                <button
                  key={quest.id}
                  type='button'
                  onClick={handleDailyHarvestOpen}
                  disabled={isHarvestComplete}
                  className={cn(
                    'flex w-full items-center gap-4 border-b border-white/5 bg-transparent px-6 py-4 text-left transition-colors',
                    isHarvestComplete ? 'cursor-default opacity-70' : 'active:bg-white/5',
                  )}
                >
                  {rowContent}
                </button>
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
          href='/paywall'
          className='mx-6 mb-4 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold text-amber-400/70 transition-colors hover:text-amber-400 active:opacity-50'
        >
          Débloquer en tant que Gardien <ChevronRight className='h-3.5 w-3.5' />
        </Link>
      </div>

      <EcoFactReader
        accentTheme={accentTheme}
        challenge={ecoFactQuest}
        isCompleted={Boolean(ecoFactQuest && ecoFactQuest.progress >= ecoFactQuest.max)}
        open={isEcoFactReaderOpen}
        hasFaction={Boolean(initialFaction)}
        onValidate={handleEcoFactValidate}
        onClose={() => setIsEcoFactReaderOpen(false)}
      />

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

      <DailyHarvestModal
        accentTheme={accentTheme}
        challenge={dailyHarvestQuest}
        open={isDailyHarvestOpen}
        onClose={() => setIsDailyHarvestOpen(false)}
        onClaim={handleDailyHarvestClaim}
      />
    </section>
  )
}
