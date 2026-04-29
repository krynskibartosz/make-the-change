'use client'

import { motion } from 'framer-motion'
import { Check, Dumbbell, Heart } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  getDefaultAcademyProgress,
  type AcademyProgress,
} from '@/lib/mock/mock-academy'
import { MAX_LIVES, isUnlimitedLives } from '@/lib/lives'
import { cn } from '@/lib/utils'

const TRAINING_QUESTIONS = [
  {
    id: 'tr-1',
    question: 'La photosynthèse transforme la lumière solaire en...',
    options: [
      { text: 'Énergie chimique (sucre)', correct: true },
      { text: 'Chaleur directe', correct: false },
      { text: 'Électricité', correct: false },
    ],
    mascot: 'sylva',
  },
  {
    id: 'tr-2',
    question: 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?',
    options: [
      { text: 'Oxygène (O₂)', correct: false },
      { text: 'Dioxyde de carbone (CO₂)', correct: true },
      { text: 'Azote (N₂)', correct: false },
    ],
    mascot: 'ondine',
  },
  {
    id: 'tr-3',
    question: "Qu'est-ce que la biodiversité ?",
    options: [
      { text: 'La variété du vivant sur Terre', correct: true },
      { text: 'Le nombre de plantes dans une forêt', correct: false },
      { text: 'La quantité d\'eau dans un écosystème', correct: false },
    ],
    mascot: 'abeille-transparente',
  },
]

export default function TrainingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<AcademyProgress>(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )
  const [qIndex, setQIndex] = useState(() => Math.floor(Math.random() * TRAINING_QUESTIONS.length))
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setProgress(academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const question = TRAINING_QUESTIONS[qIndex]!
  const unlimited = isUnlimitedLives(progress.seedsBalance)

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (answered !== null) return
      setAnswered(correct)
      if (correct) {
        const next = academyRepository.awardTrainingLife(MOCK_ACADEMY_VIEWER_ID)
        setProgress(next)
      }
      setTimeout(() => setDone(true), 1200)
    },
    [answered],
  )

  if (done) {
    const wonLife = answered === true && !unlimited
    return (
      <FullScreenSlideModal headerMode="none" className="bg-[#05050A] text-white">
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className={cn(
              'mb-8 flex h-28 w-28 items-center justify-center rounded-full border',
              wonLife
                ? 'border-emerald-500/30 bg-emerald-500/15 shadow-[0_0_60px_rgba(16,185,129,0.3)]'
                : 'border-white/10 bg-white/5',
            )}
          >
            {wonLife ? (
              <Heart className="h-14 w-14 fill-red-400 text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
            ) : (
              <Check className="h-14 w-14 text-emerald-400" />
            )}
          </motion.div>
          <h2 className="mb-3 text-3xl font-black text-white">
            {wonLife ? '+1 Vie gagnée !' : answered ? 'Bien joué !' : 'Presque...'}
          </h2>
          <p className="mb-10 max-w-xs text-base leading-relaxed text-white/60">
            {wonLife
              ? 'Ta réponse était correcte. Tu as récupéré une vie.'
              : answered
                ? 'Continue comme ça ! Tes vies se régénèrent progressivement.'
                : 'Pas de panique. Reviens quand tu es prêt.'}
          </p>
          {wonLife && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 flex gap-1.5"
            >
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    'h-6 w-6 transition-all',
                    i < progress.lives.remaining
                      ? 'fill-red-400 text-red-400'
                      : 'text-white/15',
                  )}
                />
              ))}
            </motion.div>
          )}
          <button
            type="button"
            onClick={() => router.replace('/academy')}
            className="mt-auto w-full rounded-2xl bg-emerald-500 py-5 text-lg font-black text-black shadow-[0_6px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_#065f46] active:translate-y-[5px] active:shadow-[0_1px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Retour à l'Academy
          </button>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal
      headerMode="back"
      fallbackHref="/academy/out-of-lives"
      className="bg-[#05050A] text-white"
      contentClassName="flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 px-6 pb-6 pt-8 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <Dumbbell className="h-4.5 w-4.5 text-amber-400" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">Mode Entraînement · +1 vie</p>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-6 h-28 w-28 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        >
          <Image src={`/${question.mascot}.png`} alt="" width={112} height={112} className="object-contain" />
        </motion.div>

        {/* Question */}
        <motion.h2
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center text-2xl font-black leading-snug text-white"
        >
          {question.question}
        </motion.h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isSelected = answered !== null
            const isCorrect = option.correct
            const showResult = isSelected

            return (
              <motion.button
                key={i}
                type="button"
                disabled={answered !== null}
                onClick={() => handleAnswer(option.correct)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                  !isSelected && 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10',
                  showResult && isCorrect && 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300',
                  showResult && !isCorrect && 'border-white/10 bg-white/5 text-white/30',
                )}
              >
                {option.text}
              </motion.button>
            )
          })}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
