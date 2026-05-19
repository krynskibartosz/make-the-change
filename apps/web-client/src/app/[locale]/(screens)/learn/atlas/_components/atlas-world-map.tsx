'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Droplets,
  Map as MapIcon,
  Network,
  Sprout,
  TriangleAlert,
  Waves,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import type { AtlasIslandView, LearningDomainId } from '@/lib/learning/schema'

const ATLAS_WORLD_LINKS: Array<[LearningDomainId, LearningDomainId]> = [
  ['alphabet-du-vivant', 'relations-du-vivant'],
  ['alphabet-du-vivant', 'milieux-habitats'],
  ['relations-du-vivant', 'solutions'],
  ['relations-du-vivant', 'menaces'],
  ['milieux-habitats', 'lire-impact'],
  ['menaces', 'solutions'],
  ['solutions', 'lire-impact'],
]

function getIslandIcon(iconKey: string) {
  if (iconKey === 'book-open') return BookOpen
  if (iconKey === 'droplets') return Droplets
  if (iconKey === 'network') return Network
  if (iconKey === 'triangle-alert') return TriangleAlert
  if (iconKey === 'sprout') return Sprout
  if (iconKey === 'bar-chart-3') return BarChart3
  return MapIcon
}

function getIslandStyle(island: AtlasIslandView): CSSProperties {
  return {
    left: `${island.visual.x}%`,
    top: `${island.visual.y}%`,
    '--island-color': island.visual.color,
    '--island-glow': island.visual.glow,
    '--island-label': island.visual.labelColor,
  } as CSSProperties
}

function AtlasWorldIsland({
  island,
  selected,
  transitioning,
  onOpen,
}: {
  island: AtlasIslandView
  selected: boolean
  transitioning: boolean
  onOpen: () => void
}) {
  const Icon = getIslandIcon(island.visual.iconKey)
  const dimmed = transitioning && !selected

  return (
    <motion.button
      type="button"
      aria-label={`Explorer l'ile ${island.domain.title}`}
      onClick={onOpen}
      disabled={transitioning}
      initial={false}
      animate={{
        left: selected && transitioning ? '50%' : `${island.visual.x}%`,
        top: selected && transitioning ? '50%' : `${island.visual.y}%`,
        opacity: dimmed ? 0 : 1,
        filter: dimmed ? 'blur(5px)' : 'blur(0px)',
      }}
      transition={{ duration: transitioning ? 0.62 : 0.34, ease: [0.2, 0.8, 0.2, 1] }}
      className="group absolute z-20 h-[7.8rem] w-[9rem] -translate-x-1/2 -translate-y-1/2 text-left touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-100 md:h-[9.7rem] md:w-[11rem]"
      style={getIslandStyle(island)}
    >
      <motion.span
        initial={false}
        animate={{ scale: selected && transitioning ? 1.35 : island.visual.size }}
        transition={{ duration: transitioning ? 0.62 : 0.28, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative block h-full w-full"
      >
        <span className="absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[13px] font-black text-[var(--island-label)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] md:-top-8 md:text-[16px]">
          {island.visual.shortTitle}
        </span>
        <span
          className="relative block h-full w-full overflow-hidden rounded-[49%_51%_45%_55%/50%_44%_56%_50%] border border-white/16 bg-[#071411] shadow-[0_0_74px_var(--island-glow)] transition-[brightness] duration-300 group-hover:brightness-110"
          style={{
            background: `radial-gradient(circle at 42% 30%, ${island.visual.color}66 0 20%, rgba(9,31,25,0.98) 39%, rgba(5,12,16,0.99) 78%)`,
          }}
        >
          <span className="absolute inset-x-7 bottom-5 h-6 rounded-full bg-black/30 blur-md" />
          <span className="absolute -left-4 top-6 h-16 w-20 rotate-[-18deg] rounded-full bg-white/10 blur-2xl" />
          <span className="absolute right-4 top-5 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-black/28 text-[var(--island-color)] shadow-[0_0_28px_var(--island-glow)] md:h-14 md:w-14">
            <Icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
          </span>
          <span className="absolute left-6 top-[46%] h-7 w-7 rounded-full border border-white/20 bg-white/15 shadow-[0_0_22px_var(--island-glow)]" />
          <span className="absolute left-[48%] top-[64%] h-4 w-4 rounded-full border border-white/18 bg-white/10" />
          <span className="absolute bottom-6 right-8 h-5 w-5 rounded-full border border-white/20 bg-black/24" />
        </span>
      </motion.span>
    </motion.button>
  )
}

export function AtlasWorldMap({ islands }: { islands: AtlasIslandView[] }) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const timeoutRef = useRef<number | null>(null)
  const [transitioningDomainId, setTransitioningDomainId] = useState<LearningDomainId | null>(null)
  const islandById = useMemo(
    () => new Map(islands.map((island) => [island.domain.id, island])),
    [islands],
  )

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    },
    [],
  )

  function openIsland(domainId: LearningDomainId) {
    if (transitioningDomainId) {
      return
    }

    setTransitioningDomainId(domainId)
    timeoutRef.current = window.setTimeout(
      () => router.push(`/learn/atlas/${domainId}`),
      reduceMotion ? 150 : 650,
    )
  }

  return (
    <main className="relative h-[100dvh] min-h-[38rem] overflow-hidden bg-[#03070A] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,117,105,0.22),transparent_30%),linear-gradient(145deg,rgba(7,26,34,0.97),rgba(3,7,10,0.99)_55%,rgba(8,18,18,0.98))]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="atlas-world-current" width="12" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M 0 8 C 4 5, 8 11, 12 7"
              fill="none"
              stroke="rgba(134,210,212,0.075)"
              strokeWidth="0.28"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#atlas-world-current)" />
        {ATLAS_WORLD_LINKS.map(([fromId, toId]) => {
          const from = islandById.get(fromId)
          const to = islandById.get(toId)

          if (!from || !to) {
            return null
          }

          return (
            <motion.path
              key={`${fromId}-${toId}`}
              d={`M ${from.visual.x} ${from.visual.y} C ${(from.visual.x + to.visual.x) / 2} ${Math.min(from.visual.y, to.visual.y) - 14}, ${(from.visual.x + to.visual.x) / 2} ${Math.max(from.visual.y, to.visual.y) + 13}, ${to.visual.x} ${to.visual.y}`}
              fill="none"
              stroke="rgba(222,255,238,0.24)"
              strokeDasharray="1.4 3"
              strokeLinecap="round"
              strokeWidth="0.46"
              initial={false}
              animate={{ opacity: transitioningDomainId ? 0 : 1 }}
              transition={{ duration: 0.28 }}
            />
          )
        })}
      </svg>

      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
        <Link
          href="/learn"
          aria-label="Retour a Apprendre"
          className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/28 text-white/78 shadow-[0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-100"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-100/58">
            Vue monde
          </p>
          <h1 className="text-[22px] font-black tracking-tight md:text-[28px]">Atlas du vivant</h1>
        </div>
        <div className="h-12 w-12" aria-hidden="true" />
      </header>

      <section className="relative mx-auto h-full w-full max-w-7xl" aria-label="Iles de l'Atlas">
        <div className="absolute left-5 top-[7.2rem] z-10 hidden max-w-[17rem] rounded-[1.6rem] border border-white/10 bg-black/24 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.3)] backdrop-blur-xl lg:block">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-teal-100/60">
            <Waves className="h-4 w-4" aria-hidden="true" />
            Archipel pedagogique
          </div>
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/52">
            Choisis une ile pour entrer dans ses chapitres, cours libres et liens vivants.
          </p>
        </div>

        {islands.map((island) => (
          <AtlasWorldIsland
            key={island.domain.id}
            island={island}
            selected={transitioningDomainId === island.domain.id}
            transitioning={Boolean(transitioningDomainId)}
            onOpen={() => openIsland(island.domain.id)}
          />
        ))}
      </section>

      {transitioningDomainId && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.42 }}
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(225,255,235,0.24), rgba(29,88,74,0.12) 22%, rgba(3,7,10,0.9) 76%)',
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#03070A] to-transparent" />
      <div className="absolute inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-20 flex justify-center lg:hidden">
        <span className="rounded-full border border-white/10 bg-black/28 px-4 py-2 text-[12px] font-black text-white/62 shadow-[0_12px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          Touchez une ile pour zoomer
        </span>
      </div>
      <div className="sr-only" aria-live="polite">
        {transitioningDomainId
          ? `Ouverture de ${islandById.get(transitioningDomainId)?.domain.title ?? 'l ile'}`
          : 'Atlas du vivant pret'}
      </div>
    </main>
  )
}
