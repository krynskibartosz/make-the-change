'use client'

import { Button } from '@make-the-change/core/ui'
import {
  Anchor,
  Bug,
  ChevronDown,
  CircleDot,
  Eye,
  Fish,
  Flower2,
  HandHeart,
  ImageIcon,
  LockKeyhole,
  type LucideIcon,
  MapIcon,
  Mountain,
  PawPrint,
  RotateCcw,
  ShieldCheck,
  Skull,
  Sparkles,
  Sprout,
  TreePine,
  Waves,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useEcosystem } from '@/hooks/use-ecosystem'
import {
  DEFAULT_ECOSYSTEM_ID,
  ECOSYSTEMS,
  type EcosystemDefinition,
  type EcosystemEdge,
  type EcosystemFactionKey,
  type EcosystemNode,
  type EcosystemNodeType,
  type EcosystemPerspective,
  type EcosystemStatus,
  FACTION_COPY,
  getEcosystemById,
  PERSPECTIVE_COPY,
} from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'

type EcosystemSpeciesPreview = {
  id: string
  name: string
  scientificName: string
  conservationStatus: string
  imageUrl: string | null
  isUnlocked: boolean
}

type EcosystemPathV1Props = {
  species: EcosystemSpeciesPreview[]
}

type NodeVisual = {
  icon: LucideIcon
  label: string
  halo: string
  orb: string
}

type PathPoint = EcosystemNode & {
  y: number
}

type StatusVisual = {
  label: string
  icon: LucideIcon
  badge: string
  line: string
}

const PERSPECTIVE_ICONS: Record<EcosystemPerspective, LucideIcon> = {
  biome: MapIcon,
  project: HandHeart,
  species: CircleDot,
  faction: Sparkles,
}

const THEME_ICON: Record<EcosystemDefinition['theme'], LucideIcon> = {
  forest: TreePine,
  marine: Waves,
  pollinators: Sprout,
}

const NODE_VISUALS: Record<EcosystemNodeType, NodeVisual> = {
  base: {
    icon: Mountain,
    label: 'Base',
    halo: 'shadow-[0_0_34px_rgba(252,211,77,0.2)]',
    orb: 'border-amber-200/35 bg-amber-300/15 text-amber-100',
  },
  flora: {
    icon: Flower2,
    label: 'Flore',
    halo: 'shadow-[0_0_34px_rgba(52,211,153,0.22)]',
    orb: 'border-emerald-200/35 bg-emerald-300/15 text-emerald-100',
  },
  fauna: {
    icon: PawPrint,
    label: 'Faune',
    halo: 'shadow-[0_0_34px_rgba(103,232,249,0.18)]',
    orb: 'border-cyan-200/35 bg-cyan-300/15 text-cyan-100',
  },
  habitat: {
    icon: Anchor,
    label: 'Habitat',
    halo: 'shadow-[0_0_34px_rgba(96,165,250,0.18)]',
    orb: 'border-blue-200/35 bg-blue-300/15 text-blue-100',
  },
  project: {
    icon: HandHeart,
    label: 'Projet',
    halo: 'shadow-[0_0_34px_rgba(163,230,53,0.18)]',
    orb: 'border-lime-200/35 bg-lime-300/15 text-lime-100',
  },
  threat: {
    icon: Skull,
    label: 'Menace',
    halo: 'shadow-[0_0_34px_rgba(248,113,113,0.18)]',
    orb: 'border-red-200/35 bg-red-400/15 text-red-100',
  },
}

const NODE_ICON_BY_NAME: Record<string, LucideIcon> = {
  'Abeille noire': Bug,
  'Bourdon terrestre': Bug,
  Acropora: Fish,
  'Poisson clown': Fish,
  'Demoiselle bleue': Fish,
  'Tortue verte': Waves,
}

const STATUS_VISUALS = {
  locked: {
    label: 'Voile',
    icon: LockKeyhole,
    badge: 'border-white/10 text-white/35',
    line: 'stroke-white/10',
  },
  discovered: {
    label: 'Decouvert',
    icon: Eye,
    badge: 'border-cyan-200/20 text-cyan-100',
    line: 'stroke-cyan-200/28',
  },
  threatened: {
    label: 'Alerte',
    icon: Skull,
    badge: 'border-red-200/25 text-red-100',
    line: 'stroke-red-300/50 drop-shadow-[0_0_10px_rgba(252,165,165,0.28)]',
  },
  protected: {
    label: 'Protege',
    icon: ShieldCheck,
    badge: 'border-emerald-200/30 text-emerald-100',
    line: 'stroke-emerald-300/55 drop-shadow-[0_0_10px_rgba(110,231,183,0.35)]',
  },
  collapsed: {
    label: 'Rupture',
    icon: Skull,
    badge: 'border-red-300/20 text-red-200/70',
    line: 'stroke-red-950/80',
  },
} satisfies Record<EcosystemStatus, StatusVisual>

const LEVEL_Y: Record<number, number> = {
  4: 8,
  3: 28,
  2: 50,
  1: 72,
  0: 92,
}

function buildPathPoints(nodes: readonly EcosystemNode[]): PathPoint[] {
  return nodes.map((node) => ({
    ...node,
    y: LEVEL_Y[node.trophicLevel] ?? 50,
  }))
}

function getNodeVisual(node: EcosystemNode) {
  const visual = NODE_VISUALS[node.type]
  return {
    ...visual,
    icon: NODE_ICON_BY_NAME[node.name] ?? visual.icon,
  }
}

function isNodeEmphasized(
  node: EcosystemNode,
  ecosystem: EcosystemDefinition,
  perspective: EcosystemPerspective,
) {
  if (perspective === 'biome') return true
  if (perspective === 'project') return Boolean(node.projectProtected || node.type === 'project')
  if (perspective === 'species')
    return Boolean(node.focal || node.speciesId === ecosystem.focusSpeciesId)
  return node.factionTags?.includes(ecosystem.factionFocus) ?? false
}

function getEdgeStatus(edge: EcosystemEdge, nodeById: Map<string, PathPoint>) {
  const source = nodeById.get(edge.source)
  const target = nodeById.get(edge.target)
  if (source?.status === 'collapsed' || target?.status === 'collapsed') {
    return 'collapsed'
  }

  if (source?.status === 'locked' || target?.status === 'locked') {
    return 'locked'
  }

  if (
    source?.status === 'threatened' ||
    target?.status === 'threatened' ||
    edge.relation === 'menace'
  ) {
    return 'threatened'
  }

  if (source?.status === 'protected' && target?.status === 'protected') {
    return 'protected'
  }

  return 'discovered'
}

function EcosystemLines({
  edges,
  points,
  ecosystem,
  perspective,
}: {
  edges: readonly EcosystemEdge[]
  points: readonly PathPoint[]
  ecosystem: EcosystemDefinition
  perspective: EcosystemPerspective
}) {
  const pointById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M 50 93 C 45 78, 50 64, 52 52 C 54 38, 49 22, 58 7"
        className="stroke-white/10"
        fill="none"
        strokeLinecap="round"
        strokeWidth="1.4"
      />

      {edges.map((edge) => {
        const source = pointById.get(edge.source)
        const target = pointById.get(edge.target)

        if (!source || !target) {
          return null
        }

        const status = getEdgeStatus(edge, pointById)
        const controlY = (source.y + target.y) / 2
        const emphasized =
          isNodeEmphasized(source, ecosystem, perspective) ||
          isNodeEmphasized(target, ecosystem, perspective)

        return (
          <path
            key={`${edge.source}-${edge.target}`}
            d={`M ${source.lane} ${source.y} C ${source.lane} ${controlY}, ${target.lane} ${controlY}, ${target.lane} ${target.y}`}
            className={cn(
              'transition-all duration-700 ease-in-out',
              STATUS_VISUALS[status].line,
              emphasized ? 'opacity-100' : 'opacity-20',
            )}
            fill="none"
            strokeLinecap="round"
            strokeWidth={emphasized ? '1.1' : '0.75'}
          />
        )
      })}
    </svg>
  )
}

function EcosystemPathNode({
  point,
  species,
  emphasized,
  onExtinction,
}: {
  point: PathPoint
  species: EcosystemSpeciesPreview | undefined
  emphasized: boolean
  onExtinction: (nodeId: string) => void
}) {
  const isCollapsed = point.status === 'collapsed'
  const isLocked = point.status === 'locked'
  const visual = getNodeVisual(point)
  const statusVisual = STATUS_VISUALS[point.status]
  const Icon = visual.icon
  const StatusIcon = statusVisual.icon
  const imageUrl = species?.imageUrl

  return (
    <section
      className={cn(
        'absolute z-10 flex w-[6.6rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition-all duration-700 sm:w-[7.4rem]',
        emphasized ? 'opacity-100' : 'opacity-40 grayscale',
      )}
      style={{ left: `${point.lane}%`, top: `${point.y}%` }}
      aria-label={`${point.name} - ${statusVisual.label}`}
    >
      <div
        className={cn(
          'relative flex h-[4.9rem] w-[4.9rem] items-center justify-center overflow-hidden rounded-full border backdrop-blur-md transition-all duration-700 ease-in-out sm:h-[5.4rem] sm:w-[5.4rem]',
          isCollapsed
            ? 'border-white/10 bg-white/5 text-white/35 opacity-50 grayscale'
            : isLocked
              ? 'border-white/10 bg-white/5 text-white/25 opacity-60 grayscale'
              : cn('opacity-100', visual.orb, visual.halo),
        )}
      >
        {!isLocked && !isCollapsed && imageUrl ? (
          <>
            <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[#05050A]/20" />
          </>
        ) : isLocked ? (
          <LockKeyhole className="h-7 w-7 sm:h-8 sm:w-8" />
        ) : (
          <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
        )}

        {!imageUrl || isLocked || isCollapsed ? null : (
          <div className="absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#05050A]/80 text-white">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}

        <div
          className={cn(
            'absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-[#05050A] transition-all duration-700',
            statusVisual.badge,
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
        </div>
      </div>

      <div
        className={cn(
          'mt-2 max-w-full rounded-2xl border bg-[#05050A]/82 px-2 py-1 backdrop-blur-md transition-all duration-700',
          isCollapsed || isLocked ? 'border-white/5 opacity-70 grayscale' : 'border-white/10',
        )}
      >
        <p className="text-[0.68rem] font-black leading-tight text-white sm:text-xs">
          {point.name}
        </p>
        <p className="mt-0.5 truncate text-[0.52rem] font-bold uppercase tracking-[0.13em] text-white/35">
          {isLocked
            ? point.unlockHint || 'A debloquer'
            : species?.conservationStatus || visual.label}
        </p>
      </div>

      {!isCollapsed && !isLocked ? (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="mt-2 h-8 w-8 rounded-full bg-red-500/15 text-red-100 shadow-none ring-1 ring-red-300/20 hover:bg-red-500/25"
          aria-label={`Simuler rupture ${point.name}`}
          icon={<Skull className="h-3 w-3" />}
          shimmer={false}
          onClick={() => onExtinction(point.id)}
        />
      ) : null}
    </section>
  )
}

function EcosystemPicker({
  activeId,
  unlockedIds,
  onSelect,
}: {
  activeId: string
  unlockedIds: ReadonlySet<string>
  onSelect: (ecosystemId: string) => void
}) {
  return (
    <div className="-mx-3 mt-4 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {ECOSYSTEMS.map((ecosystem) => {
        const Icon = THEME_ICON[ecosystem.theme]
        const isActive = ecosystem.id === activeId
        const isUnlocked = ecosystem.access === 'available' || unlockedIds.has(ecosystem.id)

        return (
          <button
            key={ecosystem.id}
            type="button"
            className={cn(
              'flex min-w-[9rem] items-center gap-2 rounded-2xl border px-3 py-2 text-left transition-all duration-300',
              isActive
                ? 'border-emerald-200/35 bg-emerald-300/12 text-white'
                : 'border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.07]',
            )}
            onClick={() => onSelect(ecosystem.id)}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              {isUnlocked ? <Icon className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-black">{ecosystem.shortName}</p>
              <p className="truncate text-[0.65rem] text-white/40">{ecosystem.location}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function PerspectiveTabs({
  perspective,
  onChange,
}: {
  perspective: EcosystemPerspective
  onChange: (nextPerspective: EcosystemPerspective) => void
}) {
  const perspectives = Object.entries(PERSPECTIVE_COPY) as Array<
    [EcosystemPerspective, (typeof PERSPECTIVE_COPY)[EcosystemPerspective]]
  >

  return (
    <div className="grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-white/[0.035] p-1">
      {perspectives.map(([key, copy]) => {
        const Icon = PERSPECTIVE_ICONS[key]
        const isActive = perspective === key
        return (
          <button
            key={key}
            type="button"
            className={cn(
              'flex h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[0.58rem] font-black uppercase tracking-[0.05em] transition-all sm:flex-row sm:gap-1 sm:text-[0.7rem]',
              isActive
                ? 'bg-white text-[#05050A]'
                : 'text-white/45 hover:bg-white/8 hover:text-white',
            )}
            onClick={() => onChange(key)}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="leading-none">{copy.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function FactionPanel({
  activeFaction,
  onSelectEcosystem,
}: {
  activeFaction: EcosystemFactionKey
  onSelectEcosystem: (ecosystemId: string) => void
}) {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {(
        Object.entries(FACTION_COPY) as Array<
          [EcosystemFactionKey, (typeof FACTION_COPY)[EcosystemFactionKey]]
        >
      ).map(([key, copy]) => {
        const ecosystem = ECOSYSTEMS.find((entry) => entry.factionFocus === key)
        const isActive = key === activeFaction
        return (
          <button
            key={key}
            type="button"
            className={cn(
              'rounded-3xl border p-3 text-left transition-all duration-300',
              isActive
                ? 'border-emerald-200/30 bg-emerald-300/10 text-white'
                : 'border-white/10 bg-white/[0.035] text-white/55 hover:bg-white/[0.06]',
            )}
            onClick={() => {
              if (ecosystem) onSelectEcosystem(ecosystem.id)
            }}
          >
            <p className="text-sm font-black">{copy.name}</p>
            <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/35">
              {copy.mascot}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/48">{copy.description}</p>
          </button>
        )
      })}
    </div>
  )
}

function ContextPanel({
  ecosystem,
  perspective,
  lockedCount,
  collapsedCount,
  isAccessUnlocked,
  onUnlockEcosystem,
  onProtectProject,
  onRevealNodes,
}: {
  ecosystem: EcosystemDefinition
  perspective: EcosystemPerspective
  lockedCount: number
  collapsedCount: number
  isAccessUnlocked: boolean
  onUnlockEcosystem: () => void
  onProtectProject: () => void
  onRevealNodes: () => void
}) {
  const copy = PERSPECTIVE_COPY[perspective]
  const faction = FACTION_COPY[ecosystem.factionFocus]

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-200/60">
            {copy.label}
          </p>
          <h2 className="mt-1 text-lg font-black leading-tight text-white">{copy.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{copy.description}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
          <p className="text-xs font-black text-white">{ecosystem.impact.value}</p>
          <p className="max-w-24 text-[0.6rem] leading-tight text-white/35">
            {ecosystem.impact.metric}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#05050A]/50 px-3 py-2">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/35">
            Projet
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">{ecosystem.projectName}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#05050A]/50 px-3 py-2">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/35">
            Espece focus
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">{ecosystem.focusSpeciesName}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#05050A]/50 px-3 py-2">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/35">
            Faction
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">{faction.name}</p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-white/45">{ecosystem.thesis}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {!isAccessUnlocked ? (
          <Button
            type="button"
            variant="success"
            size="sm"
            className="rounded-2xl bg-emerald-300 text-[#05050A]"
            icon={<LockKeyhole className="h-3.5 w-3.5" />}
            onClick={onUnlockEcosystem}
          >
            Debloquer la zone
          </Button>
        ) : null}

        <Button
          type="button"
          variant="glass"
          size="sm"
          className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          shimmer={false}
          onClick={onProtectProject}
        >
          Marquer le projet protege
        </Button>

        {lockedCount > 0 ? (
          <Button
            type="button"
            variant="glass"
            size="sm"
            className="rounded-2xl border border-white/10 bg-white/5 text-white"
            icon={<Eye className="h-3.5 w-3.5" />}
            shimmer={false}
            onClick={onRevealNodes}
          >
            Reveler {lockedCount}
          </Button>
        ) : null}

        {collapsedCount > 0 ? (
          <span className="inline-flex items-center rounded-2xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100">
            {collapsedCount} rupture{collapsedCount > 1 ? 's' : ''}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function SpeciesStrip({
  points,
  speciesById,
}: {
  points: readonly PathPoint[]
  speciesById: Map<string, EcosystemSpeciesPreview>
}) {
  const speciesNodes = points.filter((point) => point.speciesId)

  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {speciesNodes.map((point) => {
        const species = point.speciesId ? speciesById.get(point.speciesId) : undefined
        return (
          <div
            key={point.id}
            className="flex min-w-[9.5rem] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-2.5 py-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {species?.imageUrl ? (
                <img src={species.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-4 w-4 text-white/35" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-white">
                {species?.name || point.name}
              </p>
              <p className="truncate text-[0.62rem] text-white/35">
                {point.status === 'locked'
                  ? 'BioDex voile'
                  : species?.conservationStatus || 'Noeud'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function EcosystemPathV1({ species }: EcosystemPathV1Props) {
  const [activeEcosystemId, setActiveEcosystemId] = useState(DEFAULT_ECOSYSTEM_ID)
  const [perspective, setPerspective] = useState<EcosystemPerspective>('biome')
  const [unlockedEcosystemIds, setUnlockedEcosystemIds] = useState<Set<string>>(() => new Set())
  const ecosystem = useMemo(() => getEcosystemById(activeEcosystemId), [activeEcosystemId])
  const isAccessUnlocked =
    ecosystem.access === 'available' || unlockedEcosystemIds.has(ecosystem.id)
  const {
    nodes,
    edges,
    triggerExtinction,
    healEcosystem,
    protectProjectArea,
    revealLockedNodes,
    hasDeadNodes,
    lockedCount,
  } = useEcosystem(ecosystem, isAccessUnlocked)

  const speciesById = useMemo(() => new Map(species.map((entry) => [entry.id, entry])), [species])
  const points = useMemo(() => buildPathPoints(nodes), [nodes])
  const collapsedCount = useMemo(
    () => nodes.filter((node) => node.status === 'collapsed').length,
    [nodes],
  )
  const unlockedCount = useMemo(
    () => nodes.filter((node) => node.status !== 'locked').length,
    [nodes],
  )
  const ThemeIcon = THEME_ICON[ecosystem.theme]

  function unlockActiveEcosystem() {
    setUnlockedEcosystemIds((current) => {
      const next = new Set(current)
      next.add(ecosystem.id)
      return next
    })
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col">
        <header className="shrink-0 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/60">
                Prototype autonome
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Toile vivante</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                Une base pour tester les lectures par biome, projet, espece et faction sans brancher
                encore les autres pages.
              </p>
            </div>

            {hasDeadNodes ? (
              <Button
                type="button"
                variant="glass"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
                aria-label="Restaurer rapidement l'ecosysteme"
                icon={<RotateCcw className="h-4 w-4" />}
                shimmer={false}
                onClick={healEcosystem}
              />
            ) : null}
          </div>

          <EcosystemPicker
            activeId={ecosystem.id}
            unlockedIds={unlockedEcosystemIds}
            onSelect={setActiveEcosystemId}
          />

          <div className="mt-4">
            <PerspectiveTabs perspective={perspective} onChange={setPerspective} />
          </div>

          <div className="mt-4 flex items-center justify-between border-y border-white/10 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <ThemeIcon className="h-4 w-4 text-emerald-100" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-sm font-black text-white">
                  {ecosystem.name}
                </span>
                <span className="block truncate text-xs text-white/40">{ecosystem.location}</span>
              </div>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-black tabular-nums',
                hasDeadNodes ? 'bg-red-400/10 text-red-100' : 'bg-emerald-300/10 text-emerald-100',
              )}
            >
              {unlockedCount} / {nodes.length}
            </span>
          </div>

          <ContextPanel
            ecosystem={ecosystem}
            perspective={perspective}
            lockedCount={lockedCount}
            collapsedCount={collapsedCount}
            isAccessUnlocked={isAccessUnlocked}
            onUnlockEcosystem={unlockActiveEcosystem}
            onProtectProject={protectProjectArea}
            onRevealNodes={revealLockedNodes}
          />

          {perspective === 'faction' ? (
            <FactionPanel
              activeFaction={ecosystem.factionFocus}
              onSelectEcosystem={(ecosystemId) => {
                setActiveEcosystemId(ecosystemId)
                setPerspective('faction')
              }}
            />
          ) : null}

          <SpeciesStrip points={points} speciesById={speciesById} />
        </header>

        <div className="relative flex flex-1 items-center justify-center py-4">
          <div className="relative h-[48rem] w-full max-w-[46rem] overflow-visible sm:h-[56rem]">
            <EcosystemLines
              edges={edges}
              points={points}
              ecosystem={ecosystem}
              perspective={perspective}
            />

            {points.map((point) => (
              <EcosystemPathNode
                key={point.id}
                point={point}
                species={point.speciesId ? speciesById.get(point.speciesId) : undefined}
                emphasized={isNodeEmphasized(point, ecosystem, perspective)}
                onExtinction={triggerExtinction}
              />
            ))}
          </div>
        </div>

        {hasDeadNodes ? (
          <div className="sticky bottom-0 mt-auto border-t border-white/10 bg-[#05050A]/88 py-3 backdrop-blur-xl">
            <Button
              type="button"
              variant="success"
              size="lg"
              className="h-12 w-full rounded-2xl bg-emerald-300 text-[#05050A] shadow-[0_0_28px_rgba(110,231,183,0.22)]"
              aria-label="Restaurer l'ecosysteme"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={healEcosystem}
            >
              Restaurer la simulation ({collapsedCount})
            </Button>
          </div>
        ) : null}

        <div className="flex items-center justify-center gap-1 pb-2 text-[0.65rem] text-white/28">
          <span>Prototype V1</span>
          <ChevronDown className="h-3 w-3" />
          <span>donnees BioDex referencees, etats simules localement</span>
        </div>
      </div>
    </main>
  )
}
