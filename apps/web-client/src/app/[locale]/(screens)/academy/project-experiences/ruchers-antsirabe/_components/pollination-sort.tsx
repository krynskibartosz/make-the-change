'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, X, ExternalLink } from 'lucide-react'
import {
  POLLINATION_CARDS,
  type PollinationCategory,
} from '../_lib/antsirabe-experience-content'
import { ANTSIRABE_SOURCES } from '../_lib/antsirabe-sources'

type Answer = {
  cardId: string
  chosen: PollinationCategory
  isCorrect: boolean
}

const CATEGORY_META: Record<
  PollinationCategory,
  { label: string; btnClass: string; badgeClass: string }
> = {
  'strongly-bees': {
    label: 'Dépend fortement des abeilles',
    btnClass:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 active:scale-[0.97]',
    badgeClass: 'bg-emerald-500/20 text-emerald-300',
  },
  'benefits-bees': {
    label: 'Bénéficie des abeilles',
    btnClass:
      'border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 active:scale-[0.97]',
    badgeClass: 'bg-sky-500/20 text-sky-300',
  },
  'other-pollinators': {
    label: 'Autres pollinisateurs surtout',
    btnClass:
      'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 active:scale-[0.97]',
    badgeClass: 'bg-amber-500/20 text-amber-300',
  },
  'no-bees': {
    label: "Pas besoin d'abeilles",
    btnClass:
      'border-slate-400/30 bg-slate-400/10 text-slate-300 hover:bg-slate-400/20 active:scale-[0.97]',
    badgeClass: 'bg-slate-400/20 text-slate-300',
  },
}

const RECAP_SOURCES = ANTSIRABE_SOURCES.filter((s) =>
  ['cacao-midges', 'coffee-bees'].includes(s.id),
)

// ─── Sorting phase ────────────────────────────────────────────────────────────

function SortingPhase({
  currentIndex,
  chosen,
  onChoose,
  onNext,
}: {
  currentIndex: number
  chosen: PollinationCategory | null
  onChoose: (cat: PollinationCategory) => void
  onNext: () => void
}) {
  const card = POLLINATION_CARDS[currentIndex]
  if (!card) return null
  const isAnswered = chosen !== null
  const isCorrect = isAnswered && chosen === card.category
  const correctMeta = CATEGORY_META[card.category]
  const showSurprise = card.surprise === true && isAnswered && !isCorrect
  const isLastCard = currentIndex + 1 >= POLLINATION_CARDS.length

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#05050A]">
      {/* Header */}
      <div className="shrink-0 px-6 pb-3 pt-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="shrink-0 text-xs font-bold tabular-nums text-white/30">
            {currentIndex + 1} / {POLLINATION_CARDS.length}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={{ width: `${(currentIndex / POLLINATION_CARDS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
        <p className="text-xs text-white/35">
          Classe chaque aliment selon son lien avec les pollinisateurs.
        </p>
      </div>

      {/* Card + interactive area — animates between cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          className="flex flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          {/* Food card */}
          <motion.div
            animate={{ opacity: isAnswered ? 0.5 : 1, scale: isAnswered ? 0.97 : 1 }}
            transition={{ duration: 0.2 }}
            className="mb-4 flex shrink-0 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] py-7"
          >
            <span className="text-6xl leading-none">{card.emoji}</span>
            <p className="mt-3 text-2xl font-black text-white">{card.name}</p>
          </motion.div>

          {/* Buttons ↔ Feedback */}
          <AnimatePresence mode="wait">
            {!isAnswered ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="grid flex-1 grid-cols-2 gap-2"
              >
                {(Object.keys(CATEGORY_META) as PollinationCategory[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChoose(key)}
                    className={`rounded-2xl border px-3 py-3.5 text-left text-xs font-bold leading-snug transition-all ${CATEGORY_META[key].btnClass}`}
                  >
                    {CATEGORY_META[key].label}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex flex-col rounded-3xl border p-4 ${
                  isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-amber-500/30 bg-amber-500/10'
                }`}
              >
                {/* Status row */}
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      isCorrect ? 'bg-emerald-500/25' : 'bg-amber-500/25'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <X className="h-3 w-3 text-amber-400" />
                    )}
                  </span>
                  {showSurprise && (
                    <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-black text-amber-200">
                      Surprise !
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${correctMeta.badgeClass}`}>
                    {correctMeta.label}
                  </span>
                </div>

                {/* Feedback text */}
                <p className="text-sm leading-relaxed text-white/85">
                  {isCorrect ? card.correctFeedback : card.incorrectFeedback}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
                  {card.explanation}
                </p>

                <button
                  type="button"
                  onClick={onNext}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 text-sm font-black text-white transition-colors hover:bg-white/15"
                >
                  {isLastCard ? 'Voir le bilan' : 'Suivant'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Recap ────────────────────────────────────────────────────────────────────

function RecapView({
  answers,
  onNext,
}: {
  answers: Answer[]
  onNext: (() => void) | null
}) {
  const correctCount = answers.filter((a) => a.isCorrect).length
  const answerMap = Object.fromEntries(answers.map((a) => [a.cardId, a]))

  const groups = (Object.keys(CATEGORY_META) as PollinationCategory[])
    .map((key) => ({
      key,
      meta: CATEGORY_META[key],
      cards: POLLINATION_CARDS.filter((c) => c.category === key),
    }))
    .filter((g) => g.cards.length > 0)

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="px-6 pb-4 pt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/60">Bilan</p>
        <h2 className="mt-1 text-2xl font-black text-white">
          {correctCount} / {POLLINATION_CARDS.length} correct{correctCount > 1 ? 's' : ''}
        </h2>
        <p className="mt-1 text-sm text-white/40">
          Chaque pollinisateur a son rôle. Les abeilles sont essentielles — mais pas partout.
        </p>
      </div>

      {/* Groups */}
      <div className="space-y-3 px-6">
        {groups.map(({ key, meta, cards }) => (
          <div key={key} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="mb-2.5 text-[10px] font-black uppercase tracking-wider text-white/40">
              {meta.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cards.map((card) => {
                const a = answerMap[card.id]
                return (
                  <span
                    key={card.id}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm font-bold text-white"
                  >
                    {card.emoji} {card.name}
                    {a &&
                      (a.isCorrect ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <X className="h-3 w-3 text-red-400/60" />
                      ))}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sources */}
      <div className="mx-6 mt-5 space-y-3">
        {RECAP_SOURCES.map((source) => (
          <div key={source.id}>
            <p className="text-[10px] leading-relaxed text-white/30">{source.claim}</p>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-emerald-500/50 hover:text-emerald-500/80"
              >
                {source.label}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ) : (
              <p className="mt-0.5 text-[10px] text-white/20">{source.label}</p>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mx-6 mt-8">
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-black shadow-[0_5px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] active:translate-y-[4px] active:shadow-[0_1px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Continuer
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex w-full flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-center">
            <span className="text-sm font-black text-white/30">Suite en préparation</span>
            <span className="text-[11px] text-white/20">La danse · Le miel · Impact</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────

export function PollinationSort({ onNext }: { onNext: (() => void) | null }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [chosen, setChosen] = useState<PollinationCategory | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [phase, setPhase] = useState<'sorting' | 'recap'>('sorting')

  function handleChoose(cat: PollinationCategory) {
    if (chosen !== null) return
    const card = POLLINATION_CARDS[currentIndex]
    if (!card) return
    setChosen(cat)
    setAnswers((prev) => [...prev, { cardId: card.id, chosen: cat, isCorrect: cat === card.category }])
  }

  function handleNext() {
    if (currentIndex + 1 >= POLLINATION_CARDS.length) {
      setPhase('recap')
    } else {
      setCurrentIndex((i) => i + 1)
      setChosen(null)
    }
  }

  if (phase === 'recap') {
    return <RecapView answers={answers} onNext={onNext} />
  }

  return (
    <SortingPhase
      currentIndex={currentIndex}
      chosen={chosen}
      onChoose={handleChoose}
      onNext={handleNext}
    />
  )
}
