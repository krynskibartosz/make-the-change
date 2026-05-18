'use client'

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Droplets,
  Map as MapIcon,
  Network,
  Play,
  Search,
  Sprout,
  TriangleAlert,
  Waves,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { readLearningProgress } from '@/lib/learning/progress'
import type { AtlasIslandNode, AtlasIslandView, LearningDomainId } from '@/lib/learning/schema'
import { cn } from '@/lib/utils'
import { learningInteractiveClassName } from '../../_features/learning-cards'

const ATLAS_VIEWER_ID = 'mock-viewer'

const ATLAS_LINKS: Array<[LearningDomainId, LearningDomainId]> = [
  ['alphabet-du-vivant', 'relations-du-vivant'],
  ['alphabet-du-vivant', 'milieux-habitats'],
  ['relations-du-vivant', 'solutions'],
  ['relations-du-vivant', 'menaces'],
  ['milieux-habitats', 'lire-impact'],
  ['menaces', 'solutions'],
  ['solutions', 'lire-impact'],
]

function getIcon(iconKey: string) {
  if (iconKey === 'book-open') return BookOpen
  if (iconKey === 'droplets') return Droplets
  if (iconKey === 'network') return Network
  if (iconKey === 'triangle-alert') return TriangleAlert
  if (iconKey === 'sprout') return Sprout
  if (iconKey === 'bar-chart-3') return BarChart3
  return MapIcon
}

function getNodeIcon(kind: AtlasIslandNode['kind']) {
  if (kind === 'chapter') return BookOpen
  if (kind === 'toile') return Network
  return Play
}

function getNodeSize(node: AtlasIslandNode) {
  if (node.size === 'large') return 34
  if (node.size === 'medium') return 27
  return 20
}

function getIslandStyle(island: AtlasIslandView, selected: boolean): CSSProperties {
  const scale = selected ? island.visual.size * 1.04 : island.visual.size
  return {
    left: `${island.visual.x}%`,
    top: `${island.visual.y}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    '--island-color': island.visual.color,
    '--island-glow': island.visual.glow,
    '--island-label': island.visual.labelColor,
  } as CSSProperties
}

function getNodeStyle(node: AtlasIslandNode): CSSProperties {
  const size = getNodeSize(node)
  return {
    left: `${node.x}%`,
    top: `${node.y}%`,
    width: size,
    height: size,
    transform: 'translate(-50%, -50%)',
  }
}

function uniqueCourseIds(nodes: AtlasIslandNode[]) {
  return Array.from(new Set(nodes.flatMap((node) => node.courseIds)))
}

function AtlasIslandButton({
  island,
  selected,
  onSelect,
}: {
  island: AtlasIslandView
  selected: boolean
  onSelect: () => void
}) {
  const Icon = getIcon(island.visual.iconKey)

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`Ouvrir l’île ${island.domain.title}`}
      onClick={onSelect}
      className={cn(
        'absolute z-10 text-left transition-transform duration-300',
        learningInteractiveClassName,
      )}
      style={getIslandStyle(island, selected)}
    >
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-black tracking-tight text-[var(--island-label)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.75)] md:text-[16px]">
        {island.visual.shortTitle}
      </span>
      <span
        className={cn(
          'relative block h-[6.7rem] w-[8rem] overflow-hidden rounded-[48%] border bg-[#07120f] shadow-[0_0_58px_var(--island-glow)] transition-all duration-300 md:h-[8.4rem] md:w-[10rem]',
          selected ? 'border-white/35 brightness-110' : 'border-white/12 brightness-95',
        )}
        style={{
          background: `radial-gradient(circle at 48% 34%, ${island.visual.color}55, rgba(9,25,22,0.96) 34%, rgba(4,11,16,0.98) 72%)`,
        }}
      >
        <span className="absolute inset-x-6 bottom-5 h-6 rounded-full bg-black/25 blur-md" />
        <span className="absolute left-1/2 top-4 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-[var(--island-color)] shadow-[0_0_24px_var(--island-glow)] md:top-5 md:h-12 md:w-12">
          <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
        </span>
        {island.nodes.slice(0, 7).map((node) => {
          const NodeIcon = getNodeIcon(node.kind)

          return (
            <span
              key={node.id}
              className={cn(
                'absolute grid place-items-center rounded-full border shadow-[0_0_18px_var(--island-glow)]',
                node.kind === 'chapter'
                  ? 'border-white/40 bg-white/18 text-white'
                  : node.kind === 'toile'
                    ? 'border-teal-100/45 bg-teal-200/16 text-teal-50'
                    : 'border-white/28 bg-black/35 text-white/78',
              )}
              style={getNodeStyle(node)}
            >
              <NodeIcon
                className={node.size === 'large' ? 'h-4 w-4' : 'h-3 w-3'}
                aria-hidden="true"
              />
            </span>
          )
        })}
      </span>
    </button>
  )
}

function AtlasIslandPanel({
  island,
  completedCourseIds,
}: {
  island: AtlasIslandView
  completedCourseIds: ReadonlySet<string>
}) {
  const courseIds = uniqueCourseIds(island.nodes)
  const completedCount = courseIds.filter((courseId) => completedCourseIds.has(courseId)).length
  const progressPercent =
    courseIds.length > 0 ? Math.round((completedCount / courseIds.length) * 100) : 0
  const primaryHref = island.featuredPathId
    ? `/learn/parcours/${island.featuredPathId}`
    : `/learn/courses?domain=${island.domain.id}`
  const primaryLabel = island.featuredPathId ? 'Continuer le module' : 'Explorer les cours'

  return (
    <aside className="fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-40 mx-auto max-h-[46dvh] max-w-lg overflow-y-auto rounded-[2rem] border border-white/10 bg-[#071018]/92 p-4 shadow-[0_-22px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl lg:absolute lg:bottom-14 lg:left-auto lg:right-6 lg:max-h-[calc(100dvh-8rem)] lg:w-[28rem] lg:rounded-[2rem]">
      <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-white/18 lg:hidden" />
      <div className="flex items-start gap-4">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.15rem] border border-white/14 bg-black/25 lg:h-16 lg:w-16"
          style={{ color: island.visual.color, boxShadow: `0 0 28px ${island.visual.glow}` }}
        >
          {(() => {
            const Icon = getIcon(island.visual.iconKey)
            return <Icon className="h-7 w-7 lg:h-8 lg:w-8" aria-hidden="true" />
          })()}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[11px] font-black uppercase tracking-[0.16em]"
            style={{ color: island.visual.labelColor }}
          >
            {island.visual.shortTitle}
          </p>
          <h2 className="mt-1 text-[22px] font-black leading-tight text-white lg:text-[24px]">
            {island.domain.title}
          </h2>
          <p className="mt-1 line-clamp-1 text-[13px] leading-relaxed text-white/56 lg:line-clamp-2">
            {island.domain.description}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 lg:mt-5 lg:gap-4">
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${island.visual.color}, rgba(255,255,255,0.86))`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] font-semibold text-white/42">
            {completedCount}/{courseIds.length} portes déjà maîtrisées
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-right">
          <p className="text-[18px] font-black text-white">{island.domain.courseCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/36">cours</p>
        </div>
      </div>

      <div className="mt-3 divide-y divide-white/8 overflow-hidden rounded-[1.1rem] border border-white/8 bg-white/[0.025] sm:grid sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:mt-5 lg:block lg:divide-x-0 lg:divide-y">
        {island.nodes.slice(0, 2).map((node) => {
          const NodeIcon = getNodeIcon(node.kind)

          return (
            <Link
              key={node.id}
              href={node.href}
              className={cn(
                'group flex min-h-[4.25rem] min-w-0 items-center gap-3 p-3 transition-colors active:bg-white/[0.07]',
                learningInteractiveClassName,
              )}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/10 bg-black/22 lg:h-10 lg:w-10"
                style={{ color: island.visual.color }}
              >
                <NodeIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-black text-white">
                  {node.title}
                </span>
                <span className="block truncate text-[11px] font-semibold text-white/42">
                  {node.subtitle}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-white/28 transition-transform group-active:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 lg:mt-4">
        <Link
          href={primaryHref}
          className={cn(
            'inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[1.1rem] bg-white px-4 text-[14px] font-black text-[#061018] transition-transform active:scale-[0.99]',
            learningInteractiveClassName,
          )}
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/learn/courses?domain=${island.domain.id}`}
          aria-label={`Chercher dans ${island.domain.title}`}
          className={cn(
            'grid h-12 w-12 shrink-0 place-items-center rounded-[1.1rem] border border-white/10 bg-white/[0.055] text-white/68 active:bg-white/[0.08]',
            learningInteractiveClassName,
          )}
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}

export function AtlasArchipelago({ islands }: { islands: AtlasIslandView[] }) {
  const [selectedId, setSelectedId] = useState<LearningDomainId>('solutions')
  const [completedCourseIds, setCompletedCourseIds] = useState<Set<string>>(() => new Set())
  const islandById = useMemo(
    () => new Map(islands.map((island) => [island.domain.id, island])),
    [islands],
  )
  const selectedIsland = islandById.get(selectedId) ?? islands[0]

  useEffect(() => {
    setCompletedCourseIds(new Set(readLearningProgress(ATLAS_VIEWER_ID).completedCourseIds))
  }, [])

  if (!selectedIsland) {
    return null
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#05070A] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(8,25,32,0.94),rgba(5,7,10,0.98)_54%,rgba(7,16,18,0.96))]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="atlas-current-lines" width="12" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M 0 8 C 4 5, 8 11, 12 7"
              fill="none"
              stroke="rgba(134, 210, 212, 0.075)"
              strokeWidth="0.28"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#atlas-current-lines)" />
      </svg>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          href="/learn"
          className={cn(
            'pointer-events-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/28 text-white/76 shadow-[0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl active:bg-white/[0.07]',
            learningInteractiveClassName,
          )}
          aria-label="Retour à Apprendre"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="text-center">
          <h1 className="text-[20px] font-black tracking-tight md:text-[24px]">Atlas du vivant</h1>
          <p className="mt-0.5 hidden text-[12px] font-semibold text-white/42 sm:block">
            Îles, modules guidés et cours libres
          </p>
        </div>
        <Link
          href="/learn/courses"
          className={cn(
            'pointer-events-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/28 text-white/76 shadow-[0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl active:bg-white/[0.07]',
            learningInteractiveClassName,
          )}
          aria-label="Tous les cours"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Link>
      </header>

      <section className="relative z-10 min-h-[calc(100dvh-5rem)] pb-[22rem] pt-24 lg:min-h-[100dvh] lg:pb-0">
        <div className="relative mx-auto h-[34rem] max-w-6xl lg:h-[calc(100dvh-2rem)] lg:min-h-[44rem]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {ATLAS_LINKS.map(([fromId, toId]) => {
              const from = islandById.get(fromId)
              const to = islandById.get(toId)
              if (!from || !to) return null
              const active =
                from.domain.id === selectedIsland.domain.id ||
                to.domain.id === selectedIsland.domain.id

              return (
                <path
                  key={`${fromId}-${toId}`}
                  d={`M ${from.visual.x} ${from.visual.y} C ${(from.visual.x + to.visual.x) / 2} ${Math.min(from.visual.y, to.visual.y) - 15}, ${(from.visual.x + to.visual.x) / 2} ${Math.max(from.visual.y, to.visual.y) + 15}, ${to.visual.x} ${to.visual.y}`}
                  fill="none"
                  stroke={active ? 'rgba(222, 255, 238, 0.42)' : 'rgba(222, 255, 238, 0.18)'}
                  strokeDasharray={active ? '0' : '1.4 2.8'}
                  strokeLinecap="round"
                  strokeWidth={active ? '0.72' : '0.42'}
                />
              )
            })}
          </svg>

          <div className="absolute left-5 top-6 hidden max-w-[16rem] rounded-[1.5rem] border border-white/10 bg-black/20 p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl lg:block">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-teal-100/58">
              <Waves className="h-4 w-4" aria-hidden="true" />
              Vue monde
            </div>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/52">
              Choisis une île pour voir ses modules guidés, ses cours libres et ses liens vivants.
            </p>
          </div>

          {islands.map((island) => (
            <AtlasIslandButton
              key={island.domain.id}
              island={island}
              selected={island.domain.id === selectedIsland.domain.id}
              onSelect={() => setSelectedId(island.domain.id)}
            />
          ))}
        </div>
      </section>

      <AtlasIslandPanel island={selectedIsland} completedCourseIds={completedCourseIds} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070A] to-transparent" />
      <div className="sr-only" aria-live="polite">
        Île sélectionnée : {selectedIsland.domain.title}
      </div>
      <div className="absolute left-4 top-[calc(max(1rem,env(safe-area-inset-top))+4rem)] z-30 flex items-center gap-2 lg:hidden">
        <span className="rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-[11px] font-black text-white/62 backdrop-blur-xl">
          Touchez une île
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-[11px] font-black text-white/62 backdrop-blur-xl">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
          {selectedIsland.visual.shortTitle}
        </span>
      </div>
    </main>
  )
}
