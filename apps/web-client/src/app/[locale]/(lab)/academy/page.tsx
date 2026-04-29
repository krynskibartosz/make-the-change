'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlertTriangle,
  Archive,
  Atom,
  BookOpen,
  Brain,
  ChevronDown,
  Clock,
  Crown,
  Dna,
  Droplets,
  ExternalLink,
  Flame,
  Gift,
  Globe2,
  Leaf,
  Lock,
  MoreHorizontal,
  PawPrint,
  RotateCcw,
  Sprout,
  Sun,
  Timer,
  Trophy,
  Unlock,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { Link, useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  decorateAcademyWithProgress,
  getActiveUnit,
  getDefaultAcademyProgress,
  getCurrentChapter,
  getNextChapter,
  getCompletedLessonCountForUnit,
  getNextLessonForUnit,
  isRewardAlreadyEarned,
  getActiveEvents,
  getArchivedEvents,
  type AcademyChapterWithStatus,
  type AcademyEvent,
  type AcademyProgress,
  type AcademyUnitKind,
  type AcademyUnitWithStatus,
} from '@/lib/mock/mock-academy'
import { isUnlimitedLives } from '@/lib/lives'
import { LivesCounter } from '@/components/lives-counter'
import { cn, formatPoints } from '@/lib/utils'

const LOADING_STEPS = [
  { label: 'Chargement du cours...', duration: 450 },
  { label: 'Préparation des exercices...', duration: 550 },
  { label: 'Ajustement à ton niveau...', duration: 450 },
  { label: "C'est parti !", duration: 300 },
]

const UNIT_KIND_LABELS: Record<AcademyUnitKind, string> = {
  foundation: 'Fondamental',
  fauna: 'Faune',
  flora: 'Flore',
  training: 'Entraînement',
  project: 'Projet',
  boss: 'Boss final',
}

const UNIT_ICON_BY_KEY = {
  atom: Atom,
  crown: Crown,
  dna: Dna,
  fauna: PawPrint,
  globe: Globe2,
  leaf: Leaf,
  paw: PawPrint,
  sprout: Sprout,
  sun: Sun,
  water: Droplets,
  zap: Zap,
}

function UnitIcon({ unit, className }: { unit: AcademyUnitWithStatus; className?: string }) {
  const Icon = UNIT_ICON_BY_KEY[unit.iconKey as keyof typeof UNIT_ICON_BY_KEY] ?? Leaf
  return <Icon className={className} />
}

function useAcademySurface() {
  const [progress, setProgress] = useState<AcademyProgress>(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )

  const refresh = useCallback(() => {
    setProgress(academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const reset = useCallback(() => {
    setProgress(academyRepository.resetProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const chapters = useMemo(
    () => decorateAcademyWithProgress(academyRepository.getCurriculum(), progress),
    [progress],
  )

  return { chapters, progress, reset }
}

function MascotSpacer({
  mascot,
  side,
  isLocked,
}: {
  mascot: string
  side: 'left' | 'right'
  isLocked: boolean
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative h-24 w-16 shrink-0 overflow-visible sm:w-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        animate={{ opacity: isLocked ? 0.2 : 1, scale: 1, y: reduceMotion ? 0 : [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
          y: { duration: 3, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' },
        }}
        className={cn(
          'pointer-events-none absolute top-1/2 h-28 w-28 -translate-y-1/2 sm:h-36 sm:w-36',
          side === 'right' ? 'left-full translate-x-1 sm:translate-x-2' : 'right-full -translate-x-1 sm:-translate-x-2',
          isLocked && 'grayscale',
        )}
      >
        <Image
          src={`/${mascot}.png`}
          alt=""
          fill
          className={cn('object-contain drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]', side === 'left' && 'scale-x-[-1]')}
        />
      </motion.div>
    </div>
  )
}

function LockedUnitModal({
  unit,
  activeUnit,
  onClose,
  onStartActive,
}: {
  unit: AcademyUnitWithStatus
  activeUnit: AcademyUnitWithStatus | null
  onClose: () => void
  onStartActive: (unit: AcademyUnitWithStatus) => void
}) {
  return (
    <FullScreenSlideModal
      title="Unité verrouillée"
      headerMode="close"
      onClose={onClose}
      className="z-[90] bg-[#05050A] text-white"
    >
      <div className="mx-auto flex min-h-full max-w-sm flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Lock className="h-7 w-7 text-white/50" />
        </div>
        <h3 className="mb-2 text-xl font-black text-white">{unit.title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-white/50">
          {activeUnit
            ? `Termine "${activeUnit.title}" pour débloquer cette unité.`
            : unit.lockedHint}
        </p>
        <div className="flex w-full flex-col gap-3">
          {activeUnit && (
            <button
              type="button"
              onClick={() => onStartActive(activeUnit)}
              className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-black shadow-[0_5px_0_#065f46] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:translate-y-[4px] active:shadow-[0_1px_0_#065f46]"
            >
              Reprendre l'unité active
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-white/10 py-4 font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[4px] active:shadow-[0_1px_0_rgba(0,0,0,0.5)]"
          >
            Retour au parcours
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}

function ResetConfirmModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <FullScreenSlideModal
      title="Réinitialiser"
      headerMode="close"
      onClose={onCancel}
      className="z-[90] bg-[#05050A] text-white"
    >
      <div className="mx-auto flex min-h-full max-w-sm flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="h-7 w-7 text-amber-300" />
        </div>
        <h3 className="mb-2 text-xl font-black text-white">Effacer la progression locale ?</h3>
        <p className="mb-6 text-sm leading-relaxed text-white/55">
          Cela remettra les unités, graines et série Academy à zéro sur cet appareil.
        </p>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-2xl bg-white/10 py-4 font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[4px] active:shadow-[0_1px_0_rgba(0,0,0,0.5)]"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-2xl bg-red-500/20 py-4 font-bold text-red-300 shadow-[0_5px_0_rgba(127,29,29,0.5)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(127,29,29,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200 active:translate-y-[4px] active:shadow-[0_1px_0_rgba(127,29,29,0.5)]"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}

function CourseLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let accumulated = 0
    const timers = LOADING_STEPS.map((step, index) => {
      const timer = window.setTimeout(() => {
        setStepIndex(index)
        setProgress(Math.round(((index + 1) / LOADING_STEPS.length) * 100))
        if (index === LOADING_STEPS.length - 1) {
          window.setTimeout(onComplete, reduceMotion ? 50 : step.duration)
        }
      }, reduceMotion ? index * 50 : accumulated)
      accumulated += step.duration
      return timer
    })

    return () => timers.forEach(window.clearTimeout)
  }, [onComplete, reduceMotion])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#05050A] p-8 text-center"
    >
      <motion.div
        animate={reduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-10 flex h-32 w-32 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.3)]"
      >
        <Leaf className="h-12 w-12 text-emerald-400" />
      </motion.div>
      <h2 className="mb-2 text-2xl font-black text-white">Préparation du cours</h2>
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-10 h-5 text-sm text-white/50"
        >
          {LOADING_STEPS[stepIndex]?.label}
        </motion.p>
      </AnimatePresence>
      <div className="mb-3 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        />
      </div>
      <span className="text-xs tabular-nums text-white/30">{progress}%</span>
    </motion.div>
  )
}

function UnitNode({
  unit,
  onSelect,
  onLocked,
}: {
  unit: AcademyUnitWithStatus
  onSelect: (unit: AcademyUnitWithStatus) => void
  onLocked: (unit: AcademyUnitWithStatus) => void
}) {
  const reduceMotion = useReducedMotion()
  const isLocked = unit.status === 'locked'
  const isCompleted = unit.status === 'completed'
  const isActive = unit.status === 'active'
  const isBoss = unit.kind === 'boss'
  const stateLabel = isActive ? 'À continuer' : isCompleted ? 'Rejouer' : null

  return (
    <div
      className={cn(
        'relative my-4 flex flex-col items-center justify-start',
        stateLabel ? 'min-h-48 pt-12' : 'min-h-44 pt-3',
      )}
    >
      {isActive && (
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? { opacity: 0.28 } : { scale: [0.94, 1.08, 0.94], opacity: [0.18, 0.34, 0.18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className={cn(
            'absolute inset-0 -z-10 m-auto h-32 w-32 rounded-full blur-2xl',
            isBoss ? 'bg-amber-400/25' : 'bg-emerald-400/25',
          )}
        />
      )}
      {stateLabel && (
        <motion.div
          initial={{ y: 4, opacity: 0 }}
          animate={isActive && !reduceMotion ? { y: [0, -3, 0], opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 2.2, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
          className={cn(
            'absolute top-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-black shadow-[0_10px_26px_rgba(0,0,0,0.24)]',
            isActive
              ? isBoss
                ? 'border border-amber-200/40 bg-amber-300 text-[#1b1103]'
                : 'border border-emerald-300/30 bg-emerald-400 text-[#03140d]'
              : 'border border-emerald-400/18 bg-emerald-500/10 text-emerald-100/85',
          )}
        >
          {stateLabel}
        </motion.div>
      )}
      <button
        type="button"
        onClick={() => {
          if (isLocked) {
            onLocked(unit)
            return
          }
          onSelect(unit)
        }}
        className={cn(
          'group relative flex h-[84px] w-[84px] items-center justify-center rounded-full transition-all duration-100 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300',
          isActive && [
            'h-[92px] w-[92px]',
            isBoss
              ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-orange-700 shadow-[0_10px_0_#78350f,0_0_34px_rgba(245,158,11,0.38)] ring-2 ring-amber-200/40 ring-offset-[6px] ring-offset-[#05050A] hover:translate-y-[2px] hover:shadow-[0_8px_0_#78350f,0_0_36px_rgba(245,158,11,0.42)] active:translate-y-[9px] active:shadow-[0_1px_0_#78350f]'
              : 'bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700 shadow-[0_10px_0_#064e3b,0_0_34px_rgba(16,185,129,0.36)] ring-2 ring-emerald-300/40 ring-offset-[6px] ring-offset-[#05050A] hover:translate-y-[2px] hover:shadow-[0_8px_0_#064e3b,0_0_36px_rgba(16,185,129,0.42)] active:translate-y-[9px] active:shadow-[0_1px_0_#064e3b]',
          ],
          isCompleted && [
            isBoss
              ? 'bg-gradient-to-b from-amber-300 to-orange-700 shadow-[0_8px_0_#78350f] hover:translate-y-[2px] hover:shadow-[0_6px_0_#78350f] active:translate-y-[8px] active:shadow-none'
              : 'bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-[0_8px_0_#064e3b] hover:translate-y-[2px] hover:shadow-[0_6px_0_#064e3b] active:translate-y-[8px] active:shadow-none',
          ],
          isLocked && [
            isBoss
              ? 'border border-amber-300/10 bg-gradient-to-b from-amber-300/10 to-white/5 shadow-[0_8px_0_#000]'
              : 'bg-gradient-to-b from-white/10 to-white/5 shadow-[0_8px_0_#000]',
            'hover:translate-y-[2px] hover:shadow-[0_6px_0_#000] active:translate-y-[8px] active:shadow-none',
          ],
        )}
        aria-label={`${unit.title} - ${UNIT_KIND_LABELS[unit.kind]} - ${isLocked ? 'verrouillé' : isCompleted ? 'terminé' : 'actif'}`}
      >
        {isCompleted && <div className="pointer-events-none absolute inset-x-5 top-[3px] h-1.5 rounded-full bg-emerald-100/25" />}
        {isLocked ? (
          <Lock className={cn('h-8 w-8', isBoss ? 'text-amber-200/25' : 'text-white/20')} />
        ) : (
          <UnitIcon unit={unit} className="h-9 w-9 text-white drop-shadow-md" />
        )}
      </button>
      <div className="mt-4 max-w-[138px] text-center">
        <p className={cn('text-sm font-black leading-tight', isLocked ? 'text-white/35' : 'text-white/90')}>
          {unit.pathLabel}
        </p>
        <p className={cn('mt-1 text-[10px] font-black uppercase tracking-[0.14em]', isBoss ? 'text-amber-300/70' : 'text-emerald-300/60')}>
          {UNIT_KIND_LABELS[unit.kind]}
        </p>
      </div>
    </div>
  )
}

function useCountdown(expiresAt: string) {
  const [label, setLabel] = useState('')
  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      if (diff <= 0) { setLabel('Expiré'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      if (d > 0) setLabel(`${d}j ${h}h`)
      else {
        const m = Math.floor((diff % 3600000) / 60000)
        setLabel(`${h}h ${m}m`)
      }
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [expiresAt])
  return label
}

function EventCard({ event, onStart }: { event: AcademyEvent; onStart: (e: AcademyEvent) => void }) {
  const countdown = useCountdown(event.expiresAt)

  return (
    <motion.button
      type="button"
      onClick={() => onStart(event)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex min-h-[118px] w-full items-center gap-4 overflow-hidden rounded-[28px] border border-amber-300/18 bg-white/[0.03] p-4 text-left shadow-[0_16px_44px_rgba(0,0,0,0.24)] backdrop-blur-sm transition-colors touch-manipulation hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,rgba(251,191,36,0.16),transparent_34%),linear-gradient(90deg,rgba(251,191,36,0.08),transparent_42%)]" />
      <div className="relative flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-orange-700 shadow-[0_8px_0_rgba(120,53,15,0.9),0_0_26px_rgba(245,158,11,0.28)] ring-2 ring-amber-200/30 ring-offset-4 ring-offset-[#090805]">
        <div className="relative h-[58px] w-[58px] overflow-hidden rounded-full border border-black/20">
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-black/20 bg-amber-300 text-black shadow-[0_3px_0_rgba(120,53,15,0.8)]">
          <Leaf className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-amber-200">
            Nœud projet
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-black tabular-nums text-amber-200">
            <Timer className="h-3 w-3" />
            {countdown}
          </span>
        </div>
        <h3 className="overflow-hidden text-sm font-black leading-snug text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {event.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/50">
          Leçon making-of · {event.impactTarget}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-white/40">
          <span className="truncate">{event.location}</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>{event.sponsor.name}</span>
        </div>
      </div>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-black/35 text-amber-200 transition-transform group-hover:translate-x-0.5">
        <ChevronDown className="-rotate-90 h-4 w-4" />
      </div>
    </motion.button>
  )
}

function EventCarousel({ onStartEvent }: { onStartEvent: (e: AcademyEvent) => void }) {
  const events = useMemo(() => getActiveEvents(), [])
  if (events.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">Mission active</h2>
      </div>
      <div className="flex flex-col gap-3 pb-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onStart={onStartEvent} />
        ))}
      </div>
    </motion.div>
  )
}

function ArchiveCard({ event }: { event: AcademyEvent }) {
  const img = event.archiveImageUrl ?? event.imageUrl
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={img} alt={event.title} fill className="object-cover grayscale-[30%]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">{event.sponsor.name}</p>
        <h4 className="mb-1 text-sm font-black leading-snug text-white/90">{event.title}</h4>
        {event.archiveImpact && (
          <p className="mb-2 text-[11px] text-emerald-400/80">{event.archiveImpact}</p>
        )}
        <div className="flex gap-2">
          {event.archiveCta && (
            <a href={event.sponsor.projectUrl ?? '#'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" />
              {event.archiveCta}
            </a>
          )}
        </div>
      </div>
      <div className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 p-1.5">
        <Trophy className="h-4 w-4 text-emerald-400" />
      </div>
    </div>
  )
}

function ArchivesPanel() {
  const archived = useMemo(() => getArchivedEvents(), [])
  const [open, setOpen] = useState(false)
  if (archived.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="mt-8 rounded-3xl border border-white/8 bg-white/[0.02] p-5"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Archive className="h-4 w-4 text-white/50" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">🏆 Nos Victoires</p>
            <p className="text-xs font-bold text-white/60">{archived.length} mission{archived.length > 1 ? 's' : ''} accomplie{archived.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-white/40 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-3">
              {archived.map((event) => <ArchiveCard key={event.id} event={event} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ChapterBanner({ chapter }: { chapter: AcademyChapterWithStatus }) {
  return (
    <div className="relative flex min-h-[210px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-2xl">
      <div className="absolute right-0 top-0 z-10 p-3">
        <span className="flex items-center gap-1.5 rounded-lg bg-black/40 px-2.5 py-1 text-sm font-bold text-white/80 backdrop-blur-sm">
          {chapter.completedUnitsCount}/{chapter.units.length} <Crown className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        </span>
      </div>
      <div className="relative z-10 mb-3 h-16 w-16 drop-shadow-[0_0_15px_rgba(251,191,36,0.25)]">
        <Image src="/abeille-transparente.png" alt="" fill className="object-contain" />
      </div>
      <h2 className="relative z-10 mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-400">
        Chapitre {chapter.order} · {chapter.level}
      </h2>
      <h1 className="relative z-10 mb-2 text-2xl font-black leading-tight text-white">{chapter.title}</h1>
      <p className="relative z-10 max-w-[280px] text-sm text-white/60">{chapter.subtitle}</p>
      <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[50px]" />
    </div>
  )
}

export default function AcademyPage() {
  const router = useRouter()
  const { chapters, progress, reset } = useAcademySurface()
  const [selectedUnit, setSelectedUnit] = useState<AcademyUnitWithStatus | null>(null)
  const [lockedUnit, setLockedUnit] = useState<AcademyUnitWithStatus | null>(null)
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null)
  const [showDevMenu, setShowDevMenu] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const currentChapter = getCurrentChapter(chapters)
  const nextChapter = getNextChapter(chapters, currentChapter.id)
  const units = currentChapter.units
  const activeUnitBase = getActiveUnit(academyRepository.getCurriculum(), progress)
  const activeUnit =
    activeUnitBase
      ? chapters.flatMap((chapter) => chapter.units).find((unit) => unit.id === activeUnitBase.id) ?? null
      : null
  const currentChapterLessonTotal = units.reduce((total, unit) => total + unit.lessons.length, 0)
  const completedCurrentChapterLessons = units.reduce(
    (total, unit) => total + getCompletedLessonCountForUnit(unit, progress),
    0,
  )
  const currentChapterLessonProgress = currentChapterLessonTotal > 0
    ? Math.round((completedCurrentChapterLessons / currentChapterLessonTotal) * 100)
    : 0
  const selectedRewardEarned = selectedUnit
    ? isRewardAlreadyEarned(progress, selectedUnit.id)
    : false
  const selectedLesson = selectedUnit ? getNextLessonForUnit(selectedUnit, progress) : null
  const selectedCompletedLessons = selectedUnit ? getCompletedLessonCountForUnit(selectedUnit, progress) : 0
  const selectedLessonIndex = selectedUnit ? Math.min(selectedCompletedLessons + 1, selectedUnit.lessons.length) : 1
  const selectedCanEarnReward = Boolean(
    selectedUnit && selectedLessonIndex === selectedUnit.lessons.length && !selectedRewardEarned,
  )

  const handleResetConfirmed = useCallback(() => {
    reset()
    setShowResetConfirm(false)
    setShowDevMenu(false)
  }, [reset])

  const handleStartCourse = useCallback(
    (unit: AcademyUnitWithStatus) => {
      const chapter = chapters.find((entry) => entry.id === unit.chapterId)
      if (!chapter) {
        return
      }

      const latestProgress = academyRepository.regenerateLives(MOCK_ACADEMY_VIEWER_ID)
      const unlimited = isUnlimitedLives(latestProgress.seedsBalance)

      if (!unlimited && latestProgress.lives.remaining <= 0) {
        setSelectedUnit(null)
        setLockedUnit(null)
        router.push('/academy/out-of-lives')
        return
      }

      setSelectedUnit(null)
      setLockedUnit(null)
      setLoadingTarget(`/academy/${chapter.slug}/${unit.slug}`)
    },
    [chapters, router],
  )

  const handleLoadingComplete = useCallback(() => {
    if (loadingTarget) {
      router.push(loadingTarget)
    }
  }, [loadingTarget, router])

  return (
    <FullScreenSlideModal
      headerMode="none"
      className="relative overflow-x-hidden bg-[#05050A] font-sans text-white"
      contentClassName="pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="relative z-10">
        <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 border-b border-white/5 bg-white/5 px-3 pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
          <Link
            href="/academy/chapters"
            aria-label={`Ouvrir les chapitres, chapitre ${currentChapter.order}`}
            className="group flex min-h-11 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 transition-all touch-manipulation hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span className="text-[11px] font-black leading-none text-white">Chapitre {currentChapter.order}</span>
            <ChevronDown className="h-3 w-3 text-white/40 transition-colors group-hover:text-white/70" />
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-black tabular-nums text-emerald-300 min-[390px]:inline-flex">
              {completedCurrentChapterLessons}/{currentChapterLessonTotal}
            </span>
            <LivesCounter
              lives={progress.lives.remaining}
              unlimited={isUnlimitedLives(progress.seedsBalance)}
              updatedAt={progress.lives.updatedAt}
              onClick={() => router.push('/academy/out-of-lives')}
            />
            <Link
              href="/academy/streak"
              prefetch={false}
              aria-label={`Ouvrir la série Academy, ${progress.streak.current} jours`}
              className="flex min-h-11 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 transition-transform touch-manipulation hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              <span className="text-[11px] font-bold text-white">{progress.streak.current} j</span>
            </Link>
            <Link
              href="/seeds"
              prefetch={false}
              aria-label={`Ouvrir les graines, solde ${formatPoints(progress.seedsBalance)}`}
              className="flex min-h-11 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 transition-transform touch-manipulation hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <Sprout className="h-3.5 w-3.5 text-lime-400" />
              <span className="text-[11px] font-bold tabular-nums text-white">{formatPoints(progress.seedsBalance)}</span>
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDevMenu((isOpen) => !isOpen)}
              aria-label="Ouvrir les outils Academy"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors touch-manipulation hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showDevMenu && (
              <div className="absolute right-0 top-11 w-48 rounded-2xl border border-white/10 bg-[#111116]/95 p-2 shadow-2xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold text-white/70 transition-colors touch-manipulation hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset progression
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="px-5 pt-[calc(5rem+env(safe-area-inset-top))]">
          <ChapterBanner chapter={currentChapter} />

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
              <span>Voyage Academy</span>
              <span>{completedCurrentChapterLessons}/{currentChapterLessonTotal} leçons</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                data-academy-progress-bar
                style={{ width: `${currentChapterLessonProgress}%` }}
                animate={{ width: `${currentChapterLessonProgress}%` }}
                className="h-full rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.75)]"
              />
            </div>
          </div>

          <EventCarousel onStartEvent={(event) => setLoadingTarget(`/academy/events/${event.slug}`)} />

          <div className="mt-8 flex flex-col items-center pb-[max(8rem,calc(4rem+env(safe-area-inset-bottom)))]">
            {units.flatMap((unit, index) => {
              const nextUnit = units[index + 1]
              const isGoingLeft = index % 4 === 1
              const isGoingRight = index % 4 === 3
              const alignmentClass = isGoingLeft ? 'mr-16 sm:mr-20' : isGoingRight ? 'ml-16 sm:ml-20' : ''

              let mascotSpacer: React.ReactNode = null
              if (nextUnit) {
                const nextAlignment = (index + 1) % 4
                if (nextAlignment === 1) {
                  mascotSpacer = (
                    <MascotSpacer
                      key={`m-${unit.id}`}
                      mascot={nextUnit.mascot}
                      side="right"
                      isLocked={nextUnit.status === 'locked'}
                    />
                  )
                } else if (nextAlignment === 3) {
                  mascotSpacer = (
                    <MascotSpacer
                      key={`m-${unit.id}`}
                      mascot={nextUnit.mascot}
                      side="left"
                      isLocked={nextUnit.status === 'locked'}
                    />
                  )
                }
              }

              const node = (
                <div key={unit.id} className={cn('relative mt-6', alignmentClass)}>
                  <UnitNode unit={unit} onSelect={setSelectedUnit} onLocked={setLockedUnit} />
                </div>
              )

              return mascotSpacer ? [node, mascotSpacer] : [node]
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className={cn(
              'relative w-full overflow-hidden rounded-3xl border',
              currentChapter.status === 'completed' && nextChapter
                ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-900/40 to-purple-900/30'
                : 'border-white/10 bg-white/[0.03]',
            )}
          >
            {currentChapter.status === 'completed' && nextChapter && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5" />
            )}
            <div className="relative z-10 flex flex-col gap-3 p-6">
              <span className="self-start rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                À suivre
              </span>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-300">
                    {nextChapter ? `Chapitre ${nextChapter.order}` : 'Félicitations'}
                  </p>
                  <h3 className="text-xl font-black leading-tight text-white">
                    {nextChapter ? nextChapter.title : 'Tu as tout terminé'}
                  </h3>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  {currentChapter.status === 'completed' && nextChapter ? (
                    <Unlock className="h-5 w-5 text-indigo-400" />
                  ) : nextChapter ? (
                    <Lock className="h-5 w-5 text-white/40" />
                  ) : (
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {currentChapter.status === 'completed' && nextChapter
                  ? `Bravo ! Tu peux maintenant explorer : ${nextChapter.subtitle}`
                  : nextChapter
                    ? `Termine tous les niveaux du Chapitre ${currentChapter.order} pour débloquer la suite.`
                    : "Tu as exploré tous les chapitres de l'Académie."}
              </p>
            </div>
          </motion.div>

          <ArchivesPanel />
        </main>

        <AnimatePresence>
          {selectedUnit && (
            <FullScreenSlideModal
              key="prep-modal"
              headerMode="dynamic"
              title={selectedUnit.title}
              onClose={() => setSelectedUnit(null)}
              className="bg-[#05050A]"
            >
              <div className="relative mt-[-env(safe-area-inset-top)] h-52 shrink-0 overflow-hidden rounded-b-[32px] bg-emerald-900/30">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#05050A] via-[#05050A]/20 to-transparent" />
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/25 blur-[70px]" />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                  transition={{
                    scale: { duration: 0.4, ease: 'backOut' },
                    opacity: { duration: 0.3 },
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                  }}
                  className="absolute bottom-2 left-1/2 z-20 h-32 w-32 -translate-x-1/2 drop-shadow-[0_0_30px_rgba(52,211,153,0.45)]"
                >
                  <Image src={`/${selectedUnit.mascot}.png`} alt="" fill className="object-contain" />
                </motion.div>
              </div>
              <div className="flex flex-1 flex-col items-center px-6 pb-32 pt-7 text-center">
                <span className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {UNIT_KIND_LABELS[selectedUnit.kind]} · Leçon {selectedLessonIndex} / {selectedUnit.lessons.length}
                </span>
                <h2 className="mb-4 text-3xl font-black leading-tight text-white">{selectedUnit.title}</h2>
                <p className="mb-5 text-base leading-relaxed text-white/70">{selectedUnit.subtitle}</p>
                <div className="mb-5 w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                    Objectif de maîtrise
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-white/80">
                    {selectedUnit.masteryGoal}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-white/55">
                    {selectedLesson?.learningGoal ?? selectedUnit.learningGoal}
                  </p>
                </div>
                <div className="mb-auto flex flex-wrap justify-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 shadow-lg">
                    <Clock className="h-4 w-4 text-white/50" /> {selectedLesson?.estimatedMinutes ?? selectedUnit.estimatedMinutes}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 shadow-lg">
                    <Brain className="h-4 w-4 text-white/50" /> {selectedLesson?.exercises.length ?? selectedUnit.exercises.length} exercices
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 shadow-lg">
                    <Crown className="h-4 w-4 text-amber-300" /> Leçon {selectedLessonIndex} / {selectedUnit.lessons.length}
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 left-0 z-20 w-full bg-gradient-to-t from-[#05050A] via-[#05050A]/95 to-transparent p-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
                <div className="mb-6 mt-6 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-2 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Gift className="h-4 w-4 text-emerald-400" />
                    {selectedRewardEarned ? (
                      <span className="text-white/70">{selectedUnit.replayLabel}</span>
                    ) : selectedCanEarnReward ? (
                      <>
                        <span className="text-white">Couronne :</span>
                        <span className="text-emerald-400">+{selectedUnit.reward.amount}</span>
                      </>
                    ) : (
                      <span className="text-white/70">Récompense à la Couronne</span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartCourse(selectedUnit)}
                  className="w-full rounded-2xl bg-emerald-500 py-5 text-lg font-black text-black shadow-[0_6px_0_#065f46] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_4px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:translate-y-[5px] active:shadow-[0_1px_0_#065f46]"
                >
                  {selectedRewardEarned ? 'REJOUER LA MISSION' : 'COMMENCER'}
                </button>
              </div>
            </FullScreenSlideModal>
          )}

          {lockedUnit && (
            <LockedUnitModal
              key="locked-modal"
              unit={lockedUnit}
              activeUnit={activeUnit}
              onClose={() => setLockedUnit(null)}
              onStartActive={handleStartCourse}
            />
          )}

          {showResetConfirm && (
            <ResetConfirmModal
              key="reset-confirm-modal"
              onCancel={() => setShowResetConfirm(false)}
              onConfirm={handleResetConfirmed}
            />
          )}

          {loadingTarget && <CourseLoadingScreen key="loading-screen" onComplete={handleLoadingComplete} />}
        </AnimatePresence>
      </div>
    </FullScreenSlideModal>
  )
}
