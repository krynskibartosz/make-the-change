'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Check, Flame, Info, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  getAcademyMonthLabel,
  getDefaultAcademyProgress,
  getMonthActivityDays,
  type AcademyProgress,
} from '@/lib/mock/mock-academy'
import { cn } from '@/lib/utils'

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function StreakPage() {
  const [progress, setProgress] = useState<AcademyProgress>(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    setProgress(academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const days = useMemo(() => getMonthActivityDays(progress), [progress])
  const monthLabel = useMemo(() => getAcademyMonthLabel(), [])

  const reset = () => {
    setProgress(academyRepository.resetProgress(MOCK_ACADEMY_VIEWER_ID))
    setShowResetConfirm(false)
  }

  return (
    <FullScreenSlideModal
      title="Série"
      headerMode="close"
      fallbackHref="/academy"
      className="bg-[#05050A] text-white"
    >
      <div className="mx-auto flex max-w-xl flex-col gap-8 px-5 pb-32 pt-6">
        <div className="mt-4 flex items-center justify-between px-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-8xl font-black tracking-tighter text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              {progress.streak.current}
            </span>
            <span className="-mt-2 text-xl font-bold text-white/80">jours de série</span>
            <span className="mt-2 text-sm font-bold text-white/40">Record : {progress.streak.best} j</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-[40px]" />
            <Flame className="relative z-10 h-32 w-32 fill-orange-500 text-orange-500 drop-shadow-[0_10px_20px_rgba(249,115,22,0.4)]" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/15">
              <Flame className="h-7 w-7 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <h3 className="mb-0.5 text-lg font-black text-white">Série locale</h3>
              <p className="text-sm text-white/50">Une leçon terminée aujourd'hui maintient ta série.</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Informations sur la série locale"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Info className="h-5 w-5 text-white/60" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[32px] border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-black capitalize text-white">{monthLabel}</h3>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-sm font-bold text-white/50 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-7 gap-x-2 gap-y-4">
            {weekDays.map((day, index) => (
              <div key={`${day}-${index}`} className="mb-2 text-center text-xs font-bold text-white/40">
                {day}
              </div>
            ))}

            {days.map(({ day, dayKey, isCompleted, isToday }) => (
              <div key={dayKey} className="flex justify-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all',
                    isCompleted
                      ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                      : 'bg-white/5 text-white/30',
                    isToday && 'ring-2 ring-orange-500 ring-offset-2 ring-offset-[#05050A]',
                  )}
                >
                  {isCompleted ? <Flame className="h-5 w-5 fill-black/30" /> : day}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-black/30 p-4">
            <div className="mt-0.5">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Complète une leçon chaque jour pour construire ta série. La progression reste en local pour cette V1 mockée.
            </p>
          </div>
        </motion.div>
      </div>
      {showResetConfirm && (
        <FullScreenSlideModal
          title="Réinitialiser"
          headerMode="close"
          onClose={() => setShowResetConfirm(false)}
          className="z-[90] bg-[#05050A] text-white"
        >
          <div className="mx-auto flex min-h-full max-w-sm flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
              <AlertTriangle className="h-7 w-7 text-amber-300" />
            </div>
            <h3 className="mb-2 text-xl font-black text-white">Effacer la série locale ?</h3>
            <p className="mb-6 text-sm leading-relaxed text-white/55">
              Toute la progression Academy locale sera remise à zéro sur cet appareil.
            </p>
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-full rounded-2xl bg-white/10 py-4 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={reset}
                className="w-full rounded-2xl bg-red-500/20 py-4 font-bold text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </FullScreenSlideModal>
      )}
    </FullScreenSlideModal>
  )
}
