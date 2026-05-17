'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Banknote,
  Box,
  CheckCircle2,
  Compass,
  ExternalLink,
  Flower2,
  Handshake,
  Map as MapIcon,
  RotateCcw,
  Route,
  ShieldCheck,
  Sprout,
  UserRound,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { cn } from '@/lib/utils'
import type {
  AntsirabeCourseVariant,
  AntsirabeVariantSlide,
  VariantCard,
  VariantIconId,
  VariantTheme,
} from '../_lib/antsirabe-course-variants'

const ICONS: Record<VariantIconId, LucideIcon> = {
  banknote: Banknote,
  boxes: Box,
  check: CheckCircle2,
  compass: Compass,
  flower: Flower2,
  handshake: Handshake,
  map: MapIcon,
  route: Route,
  shield: ShieldCheck,
  sprout: Sprout,
  user: UserRound,
}

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
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          animate={{
            width: index === current ? 20 : 6,
            backgroundColor: index <= current ? theme.progress : 'rgba(255,255,255,0.16)',
          }}
          transition={{ duration: 0.25 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  )
}

function SlideHeader({
  slide,
  index,
  total,
  theme,
}: {
  slide: AntsirabeVariantSlide
  index: number
  total: number
  theme: VariantTheme
}) {
  return (
    <div className="mb-6">
      <p className={cn('text-xs font-black uppercase tracking-[0.2em]', theme.mutedText)}>
        {index + 1} / {total} · {slide.label}
      </p>
      <h1 className="mt-3 text-[30px] font-black leading-[0.98] tracking-tight text-white md:text-4xl">
        {slide.title}
      </h1>
      <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/58">{slide.body}</p>
    </div>
  )
}

function FooterActions({
  isFinal,
  theme,
  onNext,
  onRestart,
  onProject,
}: {
  isFinal: boolean
  theme: VariantTheme
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  if (isFinal) {
    return (
      <div className="mt-8 space-y-3">
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
          className="mx-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white/34 transition-colors active:text-white/55"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Revoir cette version
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onNext}
      className={cn(
        'mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition-all active:translate-y-[4px]',
        theme.button,
        theme.buttonShadow,
      )}
    >
      Continuer
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

function HeroSlide({
  slide,
  index,
  total,
  theme,
  onNext,
}: {
  slide: Extract<AntsirabeVariantSlide, { kind: 'hero' }>
  index: number
  total: number
  theme: VariantTheme
  onNext: () => void
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/78 to-black/20" />
      <div className={cn('absolute inset-x-0 bottom-0 h-2/3', theme.glow)} />

      <div className="relative z-10 mt-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
        <p className={cn('text-xs font-black uppercase tracking-[0.2em]', theme.mutedText)}>
          {index + 1} / {total} · {slide.label}
        </p>
        <h1 className="mt-4 max-w-lg text-[42px] font-black leading-[0.92] tracking-tight text-white md:text-6xl">
          {slide.title}
        </h1>
        <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/66">
          {slide.body}
        </p>

        <div
          className={cn(
            'mt-6 rounded-3xl border p-4 backdrop-blur-md',
            theme.border,
            theme.surface,
          )}
        >
          <p className={cn('text-[40px] font-black leading-none tracking-tight', theme.text)}>
            {slide.metric.value}
          </p>
          <p className="mt-1 text-sm font-black text-white">{slide.metric.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/48">{slide.metric.note}</p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className={cn(
            'mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black transition-all active:translate-y-[4px]',
            theme.button,
            theme.buttonShadow,
          )}
        >
          Explorer cette version
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function SelectableCard({
  card,
  selected,
  theme,
  onClick,
}: {
  card: VariantCard
  selected: boolean
  theme: VariantTheme
  onClick: () => void
}) {
  const Icon = ICONS[card.icon]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-[116px] rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98]',
        selected ? cn(theme.border, theme.surface) : 'border-white/8 bg-white/[0.04]',
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl',
          selected ? cn(theme.button, 'shadow-none') : 'bg-white/[0.06] text-white/45',
        )}
      >
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span className="mt-3 block text-sm font-black leading-tight text-white">{card.title}</span>
      {card.metric ? (
        <span className={cn('mt-1 block text-xs font-black', theme.text)}>{card.metric}</span>
      ) : null}
    </button>
  )
}

function CardsSlide({
  slide,
  index,
  total,
  theme,
  isFinal,
  onNext,
  onRestart,
  onProject,
}: {
  slide: Extract<AntsirabeVariantSlide, { kind: 'cards' }>
  index: number
  total: number
  theme: VariantTheme
  isFinal: boolean
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  const [selectedId, setSelectedId] = useState(slide.cards[0]?.title ?? '')
  const selectedCard = slide.cards.find((card) => card.title === selectedId) ?? slide.cards[0]
  const SelectedIcon = selectedCard ? ICONS[selectedCard.icon] : CheckCircle2

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <SlideHeader slide={slide} index={index} total={total} theme={theme} />

      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/32">
        {slide.prompt}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {slide.cards.map((card) => (
          <SelectableCard
            key={card.title}
            card={card}
            selected={card.title === selectedCard?.title}
            theme={theme}
            onClick={() => setSelectedId(card.title)}
          />
        ))}
      </div>

      {selectedCard ? (
        <motion.div
          key={selectedCard.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className={cn('mt-5 rounded-3xl border p-5', theme.border, theme.surface)}
        >
          <div className="flex items-start gap-3">
            <span
              className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', theme.button)}
            >
              <SelectedIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-black text-white">{selectedCard.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/56">{selectedCard.body}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      <div className="mt-auto">
        <FooterActions
          isFinal={isFinal}
          theme={theme}
          onNext={onNext}
          onRestart={onRestart}
          onProject={onProject}
        />
      </div>
    </div>
  )
}

function FlowSlide({
  slide,
  index,
  total,
  theme,
  isFinal,
  onNext,
  onRestart,
  onProject,
}: {
  slide: Extract<AntsirabeVariantSlide, { kind: 'flow' }>
  index: number
  total: number
  theme: VariantTheme
  isFinal: boolean
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <SlideHeader slide={slide} index={index} total={total} theme={theme} />

      <div className="space-y-3">
        {slide.steps.map((step, stepIndex) => {
          const Icon = ICONS[step.icon]
          const isActive = stepIndex === activeIndex
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setActiveIndex(stepIndex)}
              className={cn(
                'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.99]',
                isActive ? cn(theme.border, theme.surface) : 'border-white/8 bg-white/[0.035]',
              )}
            >
              <span
                className={cn(
                  'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
                  isActive ? theme.button : 'bg-white/[0.06] text-white/42',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black text-white">
                  {stepIndex + 1}. {step.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-white/48">
                  {step.body}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto">
        <FooterActions
          isFinal={isFinal}
          theme={theme}
          onNext={onNext}
          onRestart={onRestart}
          onProject={onProject}
        />
      </div>
    </div>
  )
}

function CompareSlide({
  slide,
  index,
  total,
  theme,
  isFinal,
  onNext,
  onRestart,
  onProject,
}: {
  slide: Extract<AntsirabeVariantSlide, { kind: 'compare' }>
  index: number
  total: number
  theme: VariantTheme
  isFinal: boolean
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <SlideHeader slide={slide} index={index} total={total} theme={theme} />

      <div className="grid gap-3 md:grid-cols-2">
        {slide.columns.map((column) => (
          <div key={column.title} className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
            <p className="text-sm font-black text-white">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-snug text-white/55"
                >
                  <CheckCircle2
                    className={cn('mt-0.5 h-4 w-4 shrink-0', theme.text)}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={cn('mt-5 rounded-3xl border p-5', theme.border, theme.surface)}>
        <p className="text-base font-black leading-snug text-white">{slide.closing}</p>
      </div>

      <div className="mt-auto">
        <FooterActions
          isFinal={isFinal}
          theme={theme}
          onNext={onNext}
          onRestart={onRestart}
          onProject={onProject}
        />
      </div>
    </div>
  )
}

function FinalSlide({
  slide,
  index,
  total,
  theme,
  onNext,
  onRestart,
  onProject,
}: {
  slide: Extract<AntsirabeVariantSlide, { kind: 'final' }>
  index: number
  total: number
  theme: VariantTheme
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <SlideHeader slide={slide} index={index} total={total} theme={theme} />

      <div className="grid gap-3">
        {slide.cards.map((card) => {
          const Icon = ICONS[card.icon]
          return (
            <div
              key={card.title}
              className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-4"
            >
              <span
                className={cn(
                  'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
                  theme.button,
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black text-white">{card.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/48">{card.body}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className={cn('mt-5 rounded-3xl border p-5', theme.border, theme.surface)}>
        <p className="text-lg font-black leading-snug text-white">{slide.closing}</p>
      </div>

      <div className="mt-auto">
        <FooterActions
          isFinal
          theme={theme}
          onNext={onNext}
          onRestart={onRestart}
          onProject={onProject}
        />
      </div>
    </div>
  )
}

function SlideRenderer({
  slide,
  index,
  total,
  theme,
  isFinal,
  onNext,
  onRestart,
  onProject,
}: {
  slide: AntsirabeVariantSlide
  index: number
  total: number
  theme: VariantTheme
  isFinal: boolean
  onNext: () => void
  onRestart: () => void
  onProject: () => void
}) {
  if (slide.kind === 'hero') {
    return <HeroSlide slide={slide} index={index} total={total} theme={theme} onNext={onNext} />
  }

  if (slide.kind === 'cards') {
    return (
      <CardsSlide
        slide={slide}
        index={index}
        total={total}
        theme={theme}
        isFinal={isFinal}
        onNext={onNext}
        onRestart={onRestart}
        onProject={onProject}
      />
    )
  }

  if (slide.kind === 'flow') {
    return (
      <FlowSlide
        slide={slide}
        index={index}
        total={total}
        theme={theme}
        isFinal={isFinal}
        onNext={onNext}
        onRestart={onRestart}
        onProject={onProject}
      />
    )
  }

  if (slide.kind === 'compare') {
    return (
      <CompareSlide
        slide={slide}
        index={index}
        total={total}
        theme={theme}
        isFinal={isFinal}
        onNext={onNext}
        onRestart={onRestart}
        onProject={onProject}
      />
    )
  }

  return (
    <FinalSlide
      slide={slide}
      index={index}
      total={total}
      theme={theme}
      onNext={onNext}
      onRestart={onRestart}
      onProject={onProject}
    />
  )
}

export function AntsirabeVariantShell({ variant }: { variant: AntsirabeCourseVariant }) {
  const [index, setIndex] = useState(0)
  const router = useRouter()
  const firstSlide = variant.slides[0]

  if (!firstSlide) {
    return null
  }

  const slide = variant.slides[index] ?? firstSlide
  const isFinal = index === variant.slides.length - 1

  const goNext = () => {
    if (isFinal) {
      router.push('/learn')
      return
    }
    setIndex((current) => Math.min(current + 1, variant.slides.length - 1))
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
            isFinal={isFinal}
            onNext={goNext}
            onRestart={goRestart}
            onProject={goProject}
          />
        </motion.div>
      </AnimatePresence>
    </FullScreenSlideModal>
  )
}
