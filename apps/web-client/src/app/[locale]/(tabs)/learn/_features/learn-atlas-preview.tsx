import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Droplets,
  Map as MapIcon,
  Network,
  Search,
  Sprout,
  TriangleAlert,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from '@/i18n/navigation'
import type { AtlasIslandView } from '@/lib/learning/schema'
import { learningInteractiveClassName } from './learning-cards'

const PREVIEW_LINKS = [
  ['alphabet-du-vivant', 'relations-du-vivant'],
  ['relations-du-vivant', 'solutions'],
  ['milieux-habitats', 'lire-impact'],
  ['menaces', 'solutions'],
  ['alphabet-du-vivant', 'milieux-habitats'],
] as const

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
    transform: `translate(-50%, -50%) scale(${island.visual.size})`,
    '--island-color': island.visual.color,
    '--island-glow': island.visual.glow,
  } as CSSProperties
}

export function LearnAtlasPreview({ islands }: { islands: AtlasIslandView[] }) {
  const islandById = new Map(islands.map((island) => [island.domain.id, island]))

  return (
    <Link
      href="/learn/atlas"
      aria-label="Ouvrir l'Atlas du vivant"
      className={`group relative block min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#061018] shadow-[0_22px_70px_rgba(0,0,0,0.36)] transition-transform active:scale-[0.99] ${learningInteractiveClassName}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(10,34,43,0.92),rgba(3,8,13,0.96)_58%,rgba(8,20,22,0.98))]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-65"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <pattern id="atlas-preview-current" width="14" height="14" patternUnits="userSpaceOnUse">
            <path
              d="M 0 8 C 4 5, 10 11, 14 7"
              fill="none"
              stroke="rgba(145, 220, 218, 0.08)"
              strokeWidth="0.35"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#atlas-preview-current)" />
        {PREVIEW_LINKS.map(([fromId, toId]) => {
          const from = islandById.get(fromId)
          const to = islandById.get(toId)
          if (!from || !to) return null

          return (
            <path
              key={`${fromId}-${toId}`}
              d={`M ${from.visual.x} ${from.visual.y} C ${(from.visual.x + to.visual.x) / 2} ${Math.min(from.visual.y, to.visual.y) - 12}, ${(from.visual.x + to.visual.x) / 2} ${Math.max(from.visual.y, to.visual.y) + 12}, ${to.visual.x} ${to.visual.y}`}
              fill="none"
              stroke="rgba(197, 242, 228, 0.28)"
              strokeDasharray="1.2 2.2"
              strokeLinecap="round"
              strokeWidth="0.45"
            />
          )
        })}
      </svg>

      <div className="absolute left-5 top-5 z-10">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-100/55">
          Atlas du vivant
        </p>
        <h2 className="mt-1 text-[24px] font-black tracking-tight text-white">
          Visualiser tout le vivant
        </h2>
      </div>

      <div className="absolute inset-x-3 bottom-16 top-20">
        {islands.map((island) => {
          const Icon = getIslandIcon(island.visual.iconKey)

          return (
            <div key={island.domain.id} className="absolute" style={getIslandStyle(island)}>
              <div
                className="relative grid h-[3.7rem] w-[4.8rem] place-items-center rounded-[48%] border border-white/12 bg-[#0b1715] shadow-[0_0_38px_var(--island-glow)] sm:h-[4.8rem] sm:w-[6.2rem]"
                style={{
                  background: `radial-gradient(circle at 44% 32%, ${island.visual.color}44, rgba(11,23,21,0.94) 38%, rgba(5,13,17,0.98) 72%)`,
                }}
              >
                <div className="absolute inset-x-4 bottom-3 h-3 rounded-full bg-black/22 blur-sm" />
                <span className="grid h-7 w-7 place-items-center rounded-full border border-white/18 bg-black/30 text-[var(--island-color)] sm:h-8 sm:w-8">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                </span>
                <span className="absolute -bottom-4 hidden whitespace-nowrap text-[10px] font-black text-white/68 sm:block">
                  {island.visual.shortTitle}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-[#071016]/80 px-3 py-2 text-[13px] font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <Search className="h-4 w-4 text-teal-200" aria-hidden="true" />
        Explorer l’atlas
      </div>
      <div className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 transition-transform group-active:translate-x-0.5">
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </div>
    </Link>
  )
}
