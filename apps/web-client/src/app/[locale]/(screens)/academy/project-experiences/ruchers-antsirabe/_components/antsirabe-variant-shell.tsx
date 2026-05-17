'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ExternalLink, RotateCcw, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { cn } from '@/lib/utils'
import type {
  AntsirabeCourseVariant,
  AntsirabeVariantSlide,
  FinalSlide,
  QuizSlide,
  SortSlide,
  StorySlide,
  VariantTheme,
} from '../_lib/antsirabe-course-variants'

// ── Progress pills ────────────────────────────────────────────────────────────

function ProgressPills({
  current,
  total,
  theme,
}: {
  current: number
  total: number
  theme: VariantTheme
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 20 : 6,
            backgroundColor: i <= current ? theme.progress : 'rgba(255,255,255,0.16)',
          }}
          transition={{ duration: 0.25 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  )
}

// ── STORY slide ───────────────────────────────────────────────────────────────

function StorySlideView({
  slide,
  index,
  total,
  theme,
  onNext,
}: {
  slide: StorySlide
  index: number
  total: number
  theme: VariantTheme
  onNext: () => void
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black">
      {slide.imageUrl && (
        <>
          <motion.div
            initial={{ scale: 1.07, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/80 to-black/20" />
        </>
      )}

      {!slide.imageUrl && <div className="absolute inset-0 bg-[#05050A]" />}

      <div className={cn('absolute inset-x-0 bottom-0 h-2/3', theme.glow)} />

      <div className="relative z-10 mt-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
        <p className={cn('text-xs font-black uppercase tracking-[0.2em]', theme.mutedText)}>
          {index + 1} / {total} · {slide.label}
        </p>

        <h1 className="mt-4 max-w-lg text-[36px] font-black leading-[0.94] tracking-tight text-white">
          {slide.title}
        </h1>
        <p className="mt-4 max-w-md text-[15px] font-medium leading-relaxed text-white/65">
          {slide.body}
        </p>

        {slide.stat && (
          <div
            className={cn(
              'mt-5 rounded-3xl border p-4 backdrop-blur-md',
              theme.border,
              theme.surface,
            )}
          >
            <p className={cn('text-[38px] font-black leading-none tracking-tight', theme.text)}>
              {slide.stat.value}
            </p>
            <p className="mt-1 text-sm font-black text-white">{slide.stat.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">{slide.stat.note}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className={cn(
            'mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition-all active:translate-y-[4px]',
            theme.button,
            theme.buttonShadow,
          )}
        >
          Continuer
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ── QUIZ slide ────────────────────────────────────────────────────────────────

function QuizSlideView({
  slide,
  index,
  total,
  theme,
  onNext,
}: {
  slide: QuizSlide
  index: number
  total: number
  theme: VariantTheme
  onNext: () => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const answered = selectedId !== null
  const selectedOption = slide.options.find((o) => o.id === selectedId) ?? null
  const isCorrect = selectedOption?.correct ?? false

  const getOptionStyle = (optionId: string, correct: boolean) => {
    if (!answered) {
      return 'border-white/8 bg-white/[0.04] text-white active:bg-white/[0.08]'
    }
    if (optionId === selectedId) {
      return isCorrect
        ? 'border-emerald-400/45 bg-emerald-400/12 text-white'
        : 'border-red-400/45 bg-red-400/12 text-white'
    }
    if (correct) {
      return 'border-emerald-400/45 bg-emerald-400/12 text-white'
    }
    return 'border-white/5 bg-white/[0.025] text-white/35'
  }

  const getOptionIcon = (optionId: string, correct: boolean) => {
    if (!answered) return null
    if (optionId === selectedId) {
      return isCorrect ? (
        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" aria-hidden="true" />
      ) : (
        <XCircle className="h-4.5 w-4.5 shrink-0 text-red-400" aria-hidden="true" />
      )
    }
    if (correct) {
      return <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" aria-hidden="true" />
    }
    return null
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <p className={cn('text-xs font-black uppercase tracking-[0.2em]', theme.mutedText)}>
        {index + 1} / {total} · {slide.label}
      </p>

      <h1 className="mt-4 text-[26px] font-black leading-[1.05] tracking-tight text-white">
        {slide.question}
      </h1>

      <div className="mt-6 flex flex-col gap-2.5">
        {slide.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={answered}
            onClick={() => setSelectedId(option.id)}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-4 text-left text-[14px] font-semibold leading-snug transition-all',
              getOptionStyle(option.id, option.correct),
            )}
          >
            <span className="flex-1">{option.text}</span>
            {getOptionIcon(option.id, option.correct)}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answered && selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'mt-4 rounded-3xl border p-4',
              isCorrect ? 'border-emerald-400/25 bg-emerald-400/8' : 'border-white/10 bg-white/[0.04]',
            )}
          >
            <p className="text-sm font-medium leading-relaxed text-white/72">
              {selectedOption.feedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.15 }}
          className="mt-6"
        >
          <button
            type="button"
            onClick={onNext}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition-all active:translate-y-[4px]',
              theme.button,
              theme.buttonShadow,
            )}
          >
            Continuer
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </motion.div>
      )}

      <div className="h-8 shrink-0" />
    </div>
  )
}

// ── SORT slide ────────────────────────────────────────────────────────────────

const SORT_COLUMN_STYLES: Record<
  'green' | 'amber',
  { button: string; badge: string; border: string; bg: string }
> = {
  green: {
    button: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 active:bg-emerald-400/18',
    badge: 'bg-emerald-400/15 text-emerald-200',
    border: 'border-emerald-400/35',
    bg: 'bg-emerald-400/8',
  },
  amber: {
    button: 'border-amber-400/30 bg-amber-400/10 text-amber-200 active:bg-amber-400/18',
    badge: 'bg-amber-400/15 text-amber-200',
    border: 'border-amber-400/35',
    bg: 'bg-amber-400/8',
  },
}

function SortSlideView({
  slide,
  index,
  total,
  theme,
  onNext,
}: {
  slide: SortSlide
  index: number
  total: number
  theme: VariantTheme
  onNext: () => void
}) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const done = currentItemIndex >= slide.items.length

  const currentItem = slide.items[currentItemIndex]

  const handleChoice = (columnId: string) => {
    if (!currentItem) return
    setAnswers((prev) => ({ ...prev, [currentItem.id]: columnId }))
    setCurrentItemIndex((prev) => prev + 1)
  }

  const correctCount = slide.items.filter(
    (item) => answers[item.id] === item.correctColumnId,
  ).length

  if (done) {
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
        <p className={cn('text-xs font-black uppercase tracking-[0.2em]', theme.mutedText)}>
          {index + 1} / {total} · {slide.label}
        </p>

        <div className="mt-5 flex items-baseline gap-2">
          <span className={cn('text-[52px] font-black leading-none', theme.text)}>
            {correctCount}
          </span>
          <span className="text-[22px] font-black text-white/35">/ {slide.items.length}</span>
        </div>
        <p className="mt-1 text-sm font-semibold text-white/50">
          {correctCount === slide.items.length
            ? 'Tout juste !'
            : correctCount >= Math.ceil(slide.items.length / 2)
              ? 'Bien vu.'
              : 'À retenir.'}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {slide.items.map((item) => {
            const userColumnId = answers[item.id]
            const correct = userColumnId === item.correctColumnId
            const correctColumn = slide.columns.find((c) => c.id === item.correctColumnId)
            const userColumn = slide.columns.find((c) => c.id === userColumnId)

            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-3.5',
                  correct ? 'border-emerald-400/25 bg-emerald-400/7' : 'border-red-400/20 bg-red-400/6',
                )}
              >
                {correct ? (
                  <CheckCircle2
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-400"
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-white">{item.text}</p>
                  {!correct && correctColumn && userColumn && (
                    <p className="mt-1 text-[11px] text-white/45">
                      Réponse : <span className="font-bold text-emerald-300">{correctColumn.title}</span>
                      {' · '}vous avez choisi{' '}
                      <span className="font-bold text-red-300">{userColumn.title}</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div
          className={cn('mt-5 rounded-3xl border p-4', theme.border, theme.surface)}
        >
          <p className="text-sm font-medium leading-relaxed text-white/72">
            {slide.successMessage}
          </p>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onNext}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition-all active:translate-y-[4px]',
              theme.button,
              theme.buttonShadow,
            )}
          >
            Continuer
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="h-8 shrink-0" />
      </div>
    )
  }

  const [colA, colB] = slide.columns
  const stylesA = SORT_COLUMN_STYLES[colA.colorKey]
  const stylesB = SORT_COLUMN_STYLES[colB.colorKey]

  return (
    <div className="flex h-full flex-col bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <p className={cn('text-xs font-black uppercase tracking-[0.2em]', theme.mutedText)}>
        {index + 1} / {total} · {slide.label}
      </p>
      <p className="mt-4 text-[22px] font-black leading-tight tracking-tight text-white">
        {slide.instruction}
      </p>

      <div className="mt-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-white/38">
          <span>
            {currentItemIndex + 1} / {slide.items.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem?.id}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 text-center"
          >
            <p className="text-[18px] font-black leading-snug text-white">{currentItem?.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => handleChoice(colA.id)}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border py-4 text-sm font-black transition-all active:scale-[0.97]',
              stylesA.button,
            )}
          >
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]',
                stylesA.badge,
              )}
            >
              A
            </span>
            {colA.title}
          </button>
          <button
            type="button"
            onClick={() => handleChoice(colB.id)}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border py-4 text-sm font-black transition-all active:scale-[0.97]',
              stylesB.button,
            )}
          >
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]',
                stylesB.badge,
              )}
            >
              B
            </span>
            {colB.title}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── FINAL slide ───────────────────────────────────────────────────────────────

function FinalSlideView({
  slide,
  theme,
  onNext,
  onRestart,
  onProject,
}: {
  slide: FinalSlide
  theme: VariantTheme
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <span
        className={cn(
          'inline-flex self-start rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]',
          theme.surface,
          theme.text,
        )}
      >
        {slide.badge}
      </span>

      <h1 className="mt-5 text-[32px] font-black leading-[0.96] tracking-tight text-white">
        {slide.title}
      </h1>
      <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/60">{slide.body}</p>

      <div className={cn('mt-6 rounded-3xl border p-5', theme.border, theme.surface)}>
        <p className="text-base font-black leading-snug text-white">{slide.closing}</p>
      </div>

      <div className="mt-auto pt-8 space-y-3">
        <button
          type="button"
          onClick={onProject}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition-all active:translate-y-[4px]',
            theme.button,
            theme.buttonShadow,
          )}
        >
          Voir le projet
          <ExternalLink className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm font-black text-white transition-colors active:bg-white/[0.075]"
        >
          Retour à Apprendre
          <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="mx-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white/32 transition-colors active:text-white/55"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Revoir cette version
        </button>
      </div>
    </div>
  )
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

function SlideRenderer({
  slide,
  index,
  total,
  theme,
  onNext,
  onRestart,
  onProject,
}: {
  slide: AntsirabeVariantSlide
  index: number
  total: number
  theme: VariantTheme
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  if (slide.kind === 'story') {
    return (
      <StorySlideView
        slide={slide}
        index={index}
        total={total}
        theme={theme}
        onNext={onNext}
      />
    )
  }

  if (slide.kind === 'quiz') {
    return (
      <QuizSlideView
        slide={slide}
        index={index}
        total={total}
        theme={theme}
        onNext={onNext}
      />
    )
  }

  if (slide.kind === 'sort') {
    return (
      <SortSlideView
        slide={slide}
        index={index}
        total={total}
        theme={theme}
        onNext={onNext}
      />
    )
  }

  return (
    <FinalSlideView
      slide={slide}
      theme={theme}
      onNext={onNext}
      onRestart={onRestart}
      onProject={onProject}
    />
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function AntsirabeVariantShell({ variant }: { variant: AntsirabeCourseVariant }) {
  const [index, setIndex] = useState(0)
  const router = useRouter()
  const firstSlide = variant.slides[0]

  if (!firstSlide) return null

  const slide = variant.slides[index] ?? firstSlide
  const isFinal = index === variant.slides.length - 1

  const goNext = () => {
    if (isFinal) {
      router.push('/learn')
      return
    }
    setIndex((prev) => Math.min(prev + 1, variant.slides.length - 1))
  }

  const goRestart = () => setIndex(0)
  const goProject = () => router.push(variant.projectHref)

  return (
    <FullScreenSlideModal
      headerMode="dynamic"
      title={variant.shortTitle}
      fallbackHref="/learn"
      className="bg-[#05050A] text-white"
      contentClassName="relative flex h-full flex-col overflow-hidden"
      headerRight={
        <ProgressPills current={index} total={variant.slides.length} theme={variant.theme} />
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${variant.id}-${slide.id}`}
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -36 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          className="absolute inset-0"
        >
          <SlideRenderer
            slide={slide}
            index={index}
            total={variant.slides.length}
            theme={variant.theme}
            onNext={goNext}
            onRestart={goRestart}
            onProject={goProject}
          />
        </motion.div>
      </AnimatePresence>
    </FullScreenSlideModal>
  )
}
