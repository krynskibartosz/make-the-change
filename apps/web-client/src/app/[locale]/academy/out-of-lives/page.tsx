'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Clock, Crown, Dumbbell, Heart, HeartCrack, Infinity, Sprout } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  getDefaultAcademyProgress,
} from '@/lib/mock/mock-academy'
import {
  MAX_LIVES,
  SEEDS_COST,
  formatMsCountdown,
  isUnlimitedLives,
  msUntilNextRegen,
} from '@/lib/lives'
import { cn } from '@/lib/utils'

function RegenTimer({ lives, updatedAt }: { lives: number; updatedAt: string }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const livesState = { remaining: lives, updatedAt }
    const update = () => {
      const ms = msUntilNextRegen(livesState, false)
      if (ms <= 0) {
        setLabel('Maintenant !')
      } else {
        setLabel(formatMsCountdown(ms))
      }
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [lives, updatedAt])

  return (
    <span className="text-4xl font-black tabular-nums text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
      {label}
    </span>
  )
}

export default function OutOfLivesPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )
  const [spending, setSpending] = useState(false)
  const [spendError, setSpendError] = useState(false)

  useEffect(() => {
    const latest = academyRepository.regenerateLives(MOCK_ACADEMY_VIEWER_ID)
    setProgress(latest)
    if (latest.lives.remaining > 0) {
      router.replace('/academy')
    }
  }, [router])

  const unlimited = isUnlimitedLives(progress.seedsBalance)
  const canAffordSeeds = progress.seedsBalance >= SEEDS_COST

  const handleSpendSeeds = useCallback(() => {
    setSpending(true)
    setSpendError(false)
    const result = academyRepository.spendSeedsForLives(MOCK_ACADEMY_VIEWER_ID)
    if (result) {
      setProgress(result)
      setTimeout(() => router.replace('/academy'), 800)
    } else {
      setSpendError(true)
      setSpending(false)
    }
  }, [router])

  const handleTraining = useCallback(() => {
    router.push('/academy/training')
  }, [router])

  const handleWait = useCallback(() => {
    router.replace('/academy')
  }, [router])

  return (
    <FullScreenSlideModal
      headerMode="back"
      fallbackHref="/academy"
      className="bg-[#05050A] text-white"
      contentClassName="flex flex-col"
    >
      {/* Hero */}
      <div className="flex flex-col items-center px-6 pb-6 pt-12 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
        >
          <HeartCrack className="h-12 w-12 text-red-400" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-3xl font-black text-white"
        >
          Plus de vies !
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xs text-sm leading-relaxed text-white/55"
        >
          Choisis comment récupérer des vies pour continuer ton voyage.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">

        {/* Door 1: Wait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
              <Clock className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Attendre la régénération</p>
              <p className="text-xs text-white/45">1 vie toutes les 30 min · Gratuit</p>
            </div>
          </div>
          <div className="mb-4 flex flex-col items-center rounded-2xl border border-sky-500/10 bg-sky-500/5 py-4">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-sky-400">
              Prochaine vie dans
            </p>
            <RegenTimer lives={progress.lives.remaining} updatedAt={progress.lives.updatedAt} />
            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < progress.lives.remaining
                      ? 'fill-red-400 text-red-400'
                      : i === progress.lives.remaining
                        ? 'fill-sky-400/50 text-sky-400/50'
                        : 'text-white/15',
                  )}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleWait}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-black text-white/70 transition-all hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            D'accord, j'attendrai
          </button>
        </motion.div>

        {/* Door 2: Spend seeds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={cn(
            'rounded-3xl border p-5',
            canAffordSeeds
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-white/8 bg-white/[0.02] opacity-60',
          )}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border',
              canAffordSeeds ? 'border-emerald-500/25 bg-emerald-500/10' : 'border-white/10 bg-white/5',
            )}>
              <Sprout className={cn('h-5 w-5', canAffordSeeds ? 'text-emerald-400' : 'text-white/30')} />
            </div>
            <div>
              <p className="text-sm font-black text-white">Utiliser des graines</p>
              <p className="text-xs text-white/45">−{SEEDS_COST} graines → {MAX_LIVES} vies</p>
            </div>
            <div className="ml-auto shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <span className="text-xs font-black tabular-nums text-emerald-300">
                {progress.seedsBalance} 🌱
              </span>
            </div>
          </div>
          <AnimatePresence>
            {spendError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400"
              >
                Graines insuffisantes. Gagne-en en terminant des leçons !
              </motion.p>
            )}
          </AnimatePresence>
          <button
            type="button"
            disabled={!canAffordSeeds || spending}
            onClick={handleSpendSeeds}
            className={cn(
              'w-full rounded-2xl py-3.5 text-sm font-black transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200',
              canAffordSeeds && !spending
                ? 'bg-emerald-500 text-black shadow-[0_4px_0_#065f46] hover:translate-y-0.5 hover:shadow-[0_2px_0_#065f46] active:translate-y-[3px] active:shadow-none'
                : 'cursor-not-allowed bg-white/10 text-white/30',
            )}
          >
            {spending ? '✓ Rechargé !' : `Utiliser ${SEEDS_COST} graines`}
          </button>
        </motion.div>

        {/* Door 3: Training */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
              <Dumbbell className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Mode Entraînement</p>
              <p className="text-xs text-white/45">Révise une notion maîtrisée · +1 vie</p>
            </div>
          </div>
          <p className="mb-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-amber-200/70">
            Révise rapidement un concept déjà acquis. En réussissant, tu gagnes 1 vie.
          </p>
          <button
            type="button"
            onClick={handleTraining}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-sm font-black text-black shadow-[0_4px_0_#92400e] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_#92400e] active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            S'entraîner
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Ambassador upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-900/25 to-purple-900/15 p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.08),transparent_60%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <Crown className="h-5 w-5 text-violet-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white">Ambassadeur MTC</p>
              <p className="text-xs text-white/45">Vies illimitées incluses dans l'abonnement</p>
            </div>
            <Infinity className="h-5 w-5 shrink-0 text-violet-300" />
          </div>
          <p className="relative mt-3 mb-4 text-xs leading-relaxed text-white/50">
            Avec l'abonnement Ambassadeur, plus jamais de limite de vies. Continue ton apprentissage sans interruption.
          </p>
          <button
            type="button"
            onClick={() => router.push('/seeds')}
            className="relative flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-400/30 bg-violet-500/15 py-3.5 text-sm font-black text-violet-200 transition-all hover:bg-violet-500/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          >
            Découvrir l'abonnement
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </FullScreenSlideModal>
  )
}
