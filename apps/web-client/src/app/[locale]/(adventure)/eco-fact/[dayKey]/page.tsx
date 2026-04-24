'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type UIEvent } from 'react'
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle2, Lock, Sprout, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useHaptic } from '@/hooks/use-haptic'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { recordClientMockChallengeCompletion } from '@/lib/mock/mock-challenge-progress'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockSubscription } from '@/lib/mock/mock-member-data'
import type { MockChallengeDetail } from '@/lib/mock/mock-challenges'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

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

const resolveArticleParagraphs = (challenge: MockChallengeDetail | null) => {
  const articleSummary =
    challenge?.metadata.articleSummary ||
    'Un geste simple répété chaque jour finit par changer le vivant autour de nous.'

  if (challenge?.metadata.articleBody?.length) {
    return challenge.metadata.articleBody
  }

  return [
    articleSummary,
    challenge?.description ||
      'Comprendre un écosystème, c\'est déjà commencer à mieux le protéger.',
    challenge?.metadata.nextStep ||
      'Observe ce que ce sujet change dans ta manière de regarder les projets et les espèces.',
  ]
}

type EcoFactArticleViewProps = {
  accentTheme: FactionTheme
  challenge: MockChallengeDetail | null
  open: boolean
  onClose: () => void
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
    articleParagraphs[1] || articleSummary || 'Le vivant répond à la répétition des bons gestes.'
  const articleCtaHref = challenge?.metadata.ctaHref || '/projects'
  const articleCtaLabel = challenge?.metadata.ctaLabel || 'Voir les projets liés'
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
              Passe à l'action
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

export default function EcoFactPage({ params }: { params: { dayKey: string; locale: string } }) {
  const searchParams = useSearchParams()
  const haptic = useHaptic()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isArticleOpen, setIsArticleOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Get params from URL
  const factionParam = searchParams.get('faction') as Faction | null
  const challengeId = searchParams.get('challengeId')
  const viewerId = searchParams.get('viewerId')

  // Mock data - in production this would be fetched from API
  const session = getClientMockViewerSession()
  const hasFaction = !!factionParam || !!session?.faction
  const themeKey = resolveFactionThemeKey(factionParam || session?.faction || null)
  const accentTheme = getFactionTheme(factionParam || session?.faction || null)

  // Mock challenge data
  const challenge: MockChallengeDetail | null = {
    id: challengeId || 'eco-fact-1',
    type: 'education',
    title: "L'importance des pollinisateurs",
    description: 'Découvrez comment les abeilles et autres pollinisateurs soutiennent nos écosystèmes.',
    progress: isCompleted ? 1 : 0,
    max: 1,
    reward: 50,
    rewardBadge: 'Éco-Conscient',
    completedAt: isCompleted ? new Date().toISOString() : null,
    dayKey: params.dayKey,
    metadata: {
      articleTitle: "Le monde secret des pollinisateurs",
      articleSummary: 'Les pollinisateurs sont essentiels à 75% des cultures alimentaires mondiales.',
      articleBody: [
        'Les pollinisateurs, notamment les abeilles, sont essentiels à notre survie. Ils permettent la reproduction de plus de 80% des plantes à fleurs et sont responsables de 35% de la production alimentaire mondiale.',
        'Sans eux, de nombreux aliments comme les pommes, les fraises, les amandes et le café disparaîtraient de notre alimentation.',
        'Malheureusement, les populations de pollinisateurs déclinent à cause de l\'utilisation de pesticides, de la perte d\'habitat et du changement climatique.',
      ],
      themeLabel: 'Biodiversité',
      linkedSpeciesId: 'abeille-domestique',
      nextStep: 'Plantez des fleurs natives dans votre jardin pour soutenir les pollinisateurs locaux.',
      hint: 'Une seule abeille peut visiter jusqu\'à 5 000 fleurs en une journée.',
      ctaHref: '/projects',
      ctaLabel: 'Voir les projets de restauration',
    },
  }

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
    setIsArticleOpen(false)
    setScrollProgress(isCompleted ? 100 : 0)
    setIsUnlocked(isCompleted)
  }, [isCompleted])

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
  }, [])

  const handleValidate = useCallback(() => {
    const timestamp = new Date().toISOString()
    setIsCompleted(true)
    setIsUnlocked(true)
    setScrollProgress(100)

    // Record completion in mock system
    if (viewerId && params.dayKey) {
      recordClientMockChallengeCompletion({
        viewerId,
        dayKey: params.dayKey,
        archetypeId: 'eco-fact',
        max: challenge?.max || 1,
        timestamp,
      })
    }

    haptic.lightTap()
  }, [viewerId, params.dayKey, challenge?.max, haptic])

  const contentKey = themeKey === 'neutral' ? 'forets' : themeKey
  const pageTitle = hasFaction ? FACTION_CONTENT[contentKey as keyof typeof FACTION_CONTENT]?.title : "Les Défis Quotidiens"

  return (
    <div className='min-h-screen bg-[#0B0F15]'>
      {/* Header with back button */}
      <div className='sticky top-0 z-50 bg-[#0B0F15]/80 backdrop-blur-md border-b border-white/10'>
        <div className='px-6 py-4'>
          <Link
            href='/aventure?tab=defis'
            className='inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors'
          >
            <ArrowLeft className='h-5 w-5' />
            <span className='text-sm font-medium'>Retour aux défis</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div ref={contentRef} onScroll={handleScroll} className='relative flex-1 overflow-y-auto pb-44'>
        <div className='relative isolate min-h-[46vh] px-6 pt-6'>
          <div className='pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[80px]' />
          {hasFaction ? (
            <motion.img
              src={FACTION_CONTENT[contentKey as keyof typeof FACTION_CONTENT]?.mascotImg || '/images/logo-icon-bee.png'}
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
          ) : (
            <motion.div
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
              className='relative z-10 mx-auto mt-16 flex gap-2'
            >
              <img
                src="/abeille-transparente.png"
                alt="Melli"
                className='h-20 w-20 object-contain drop-shadow-2xl pointer-events-none'
                draggable='false'
              />
              <img
                src="/sylva.png"
                alt="Sylva"
                className='h-20 w-20 object-contain drop-shadow-2xl pointer-events-none'
                draggable='false'
              />
              <img
                src="/ondine.png"
                alt="Ondine"
                className='h-20 w-20 object-contain drop-shadow-2xl pointer-events-none'
                draggable='false'
              />
            </motion.div>
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
                Déjà lu aujourd'hui. Tu peux relire ce dossier quand tu veux, mais la récompense à
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

      {/* Fixed bottom action bar */}
      <div className='fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12'>
        <div className='mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10'>
          <div
            className={cn('h-full transition-all duration-100 ease-out', accentTheme.accentBg)}
            style={{ width: `${isUnlocked ? 100 : scrollProgress}%` }}
          />
        </div>

        <button
          type='button'
          disabled={!isUnlocked || isCompleted}
          onClick={handleValidate}
          className={cn(
            'flex h-14 w-full items-center justify-center rounded-2xl text-lg font-black transition-all duration-500',
            isCompleted
              ? 'border border-white/10 bg-white/5 text-white/55'
              : isUnlocked
              ? cn(accentTheme.accentBg, 'text-[#0B0F15] active:scale-95', accentTheme.accentShadow)
              : 'border border-white/10 bg-white/5 text-white/40',
          )}
        >
          {isCompleted ? (
            <span className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-lime-400' /> Déjà validé aujourd'hui
            </span>
          ) : isUnlocked ? (
            <span className='flex items-center gap-2 animate-in zoom-in duration-300'>
              C'est noté ! <span className='font-normal opacity-50'>|</span> +{challenge?.reward ?? 50}
              <Sprout className='inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400' />
            </span>
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
    </div>
  )
}
