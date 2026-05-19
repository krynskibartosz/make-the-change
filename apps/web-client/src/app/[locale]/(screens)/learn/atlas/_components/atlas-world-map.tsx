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

const WORLD_TERRAIN_PATHS: Record<
  LearningDomainId,
  {
    land: string
    ridge: string
    marks: Array<{ x: number; y: number; r: number }>
  }
> = {
  'alphabet-du-vivant': {
    land: 'M31 84C19 70 25 43 47 29C69 14 112 18 137 33C162 48 161 80 137 100C113 119 59 119 31 84Z',
    ridge: 'M45 70C62 54 87 48 112 56C126 61 137 70 145 82',
    marks: [
      { x: 67, y: 48, r: 5 },
      { x: 93, y: 69, r: 4 },
      { x: 121, y: 86, r: 4 },
    ],
  },
  'milieux-habitats': {
    land: 'M24 75C21 50 41 24 74 18C112 11 153 30 163 58C174 89 139 115 95 116C55 117 27 102 24 75Z',
    ridge: 'M39 82C61 70 74 46 105 42C128 39 145 50 155 68',
    marks: [
      { x: 55, y: 60, r: 4 },
      { x: 86, y: 42, r: 5 },
      { x: 126, y: 73, r: 4 },
    ],
  },
  'relations-du-vivant': {
    land: 'M30 63C37 34 73 18 110 24C145 29 169 56 158 83C147 109 103 120 65 108C40 100 23 86 30 63Z',
    ridge: 'M49 78C67 58 94 54 116 66C132 75 143 83 154 82',
    marks: [
      { x: 66, y: 56, r: 4 },
      { x: 100, y: 64, r: 5 },
      { x: 128, y: 84, r: 4 },
    ],
  },
  menaces: {
    land: 'M35 94C18 75 29 39 58 25C87 10 139 22 156 51C174 82 139 108 94 113C67 116 47 107 35 94Z',
    ridge: 'M58 42L76 65L68 84L96 72L110 94L124 67L149 55',
    marks: [
      { x: 62, y: 61, r: 4 },
      { x: 97, y: 44, r: 4 },
      { x: 129, y: 82, r: 5 },
    ],
  },
  solutions: {
    land: 'M23 70C21 40 49 20 84 18C122 16 159 37 163 68C166 95 137 117 93 119C51 121 25 101 23 70Z',
    ridge: 'M44 84C62 62 81 55 104 60C122 64 139 75 150 92',
    marks: [
      { x: 58, y: 73, r: 5 },
      { x: 91, y: 55, r: 4 },
      { x: 124, y: 82, r: 5 },
    ],
  },
  'lire-impact': {
    land: 'M32 91C16 63 41 30 78 21C114 12 153 29 164 59C176 91 143 111 101 115C68 118 42 108 32 91Z',
    ridge: 'M51 83C69 73 76 52 102 48C124 44 141 55 154 72',
    marks: [
      { x: 66, y: 79, r: 4 },
      { x: 98, y: 53, r: 5 },
      { x: 134, y: 76, r: 4 },
    ],
  },
}

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
  const terrain = WORLD_TERRAIN_PATHS[island.domain.id]
  const dimmed = transitioning && !selected

  return (
    <motion.button
      type="button"
      aria-label={`Entrer dans le territoire ${island.domain.title}`}
      onClick={onOpen}
      onPointerUp={(event) => {
        if (event.pointerType === 'touch') {
          onOpen()
        }
      }}
      onTouchEnd={(event) => {
        event.preventDefault()
        onOpen()
      }}
      disabled={transitioning}
      initial={false}
      animate={{
        left: selected && transitioning ? '50%' : `${island.visual.x}%`,
        top: selected && transitioning ? '50%' : `${island.visual.y}%`,
        opacity: dimmed ? 0 : 1,
        filter: dimmed ? 'blur(5px)' : 'blur(0px)',
      }}
      transition={{ duration: transitioning ? 0.62 : 0.34, ease: [0.2, 0.8, 0.2, 1] }}
      className="group absolute z-20 h-[8.2rem] w-[10.4rem] -translate-x-1/2 -translate-y-1/2 text-left touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-100 md:h-[10.2rem] md:w-[12.8rem]"
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
        <span className="relative block h-full w-full transition-[filter] duration-300 group-hover:brightness-110">
          <span className="absolute inset-4 rounded-full bg-[var(--island-glow)] blur-3xl" />
          <svg className="relative h-full w-full overflow-visible" viewBox="0 0 180 140">
            <defs>
              <linearGradient
                id={`terrain-fill-${island.domain.id}`}
                x1="35"
                x2="145"
                y1="20"
                y2="116"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={island.visual.color} stopOpacity="0.78" />
                <stop offset="0.42" stopColor="#10231f" stopOpacity="0.98" />
                <stop offset="1" stopColor="#051018" stopOpacity="0.99" />
              </linearGradient>
              <filter
                id={`terrain-shadow-${island.domain.id}`}
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feDropShadow
                  dx="0"
                  dy="12"
                  stdDeviation="10"
                  floodColor="#000000"
                  floodOpacity="0.55"
                />
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="16"
                  floodColor={island.visual.color}
                  floodOpacity="0.34"
                />
              </filter>
            </defs>
            <path
              d={terrain.land}
              fill={`url(#terrain-fill-${island.domain.id})`}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.3"
              filter={`url(#terrain-shadow-${island.domain.id})`}
            />
            <path
              d={terrain.ridge}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.15"
            />
            {terrain.marks.map((mark) => (
              <circle
                key={`${mark.x}-${mark.y}`}
                cx={mark.x}
                cy={mark.y}
                r={mark.r}
                fill="rgba(255,255,255,0.17)"
                stroke="rgba(255,255,255,0.24)"
                strokeWidth="0.7"
              />
            ))}
          </svg>
          <span className="absolute right-7 top-8 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-black/30 text-[var(--island-color)] shadow-[0_0_28px_var(--island-glow)] backdrop-blur-md md:right-9 md:top-9 md:h-14 md:w-14">
            <Icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
          </span>
        </span>
      </motion.span>
    </motion.button>
  )
}

export function AtlasWorldMap({ islands }: { islands: AtlasIslandView[] }) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const timeoutRef = useRef<number | null>(null)
  const openingRef = useRef(false)
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
    if (transitioningDomainId || openingRef.current) {
      return
    }

    openingRef.current = true
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
          aria-label="Retour à Apprendre"
          className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/28 text-white/78 shadow-[0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-100"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="text-center">
          <h1 className="text-[22px] font-black tracking-tight md:text-[28px]">Atlas du vivant</h1>
          <p className="mt-1 hidden max-w-[19rem] text-[12px] font-semibold leading-snug text-teal-50/58 sm:block">
            Explore les grandes clés du vivant.
          </p>
        </div>
        <div className="h-12 w-12" aria-hidden="true" />
      </header>

      <section className="relative mx-auto h-full w-full max-w-7xl" aria-label="Îles de l'Atlas">
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
          Choisis une île pour explorer un domaine
        </span>
      </div>
      <div className="sr-only" aria-live="polite">
        {transitioningDomainId
          ? `Ouverture de ${islandById.get(transitioningDomainId)?.domain.title ?? "l'île"}`
          : 'Atlas du vivant prêt'}
      </div>
    </main>
  )
}
