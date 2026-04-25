'use client'

import { Button } from '@make-the-change/core/ui'
import {
  ArrowLeft,
  Bug,
  CircleDot,
  Flower2,
  HandHeart,
  Layers3,
  Link2,
  type LucideIcon,
  Mountain,
  PawPrint,
  ShieldCheck,
  Skull,
  Sprout,
  TreePine,
  Utensils,
  Waves,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  DEFAULT_ECOSYSTEM_ID,
  ECOSYSTEMS,
  type EcosystemDefinition,
  type EcosystemEdge,
  type EcosystemNode,
  type EcosystemNodeType,
  type EcosystemRelation,
  getEcosystemById,
} from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'
import type { SpeciesContext } from '@/types/context'

type RelationLayerKey = 'all' | 'trophic' | 'habitat' | 'symbiose' | 'protege' | 'menace'

type RelationLayer = {
  key: RelationLayerKey
  label: string
  shortLabel: string
  description: string
  relations: EcosystemRelation[]
  icon: LucideIcon
  chip: string
  stroke: string
  glow: string
}

type LabPoint = EcosystemNode & {
  y: number
}

type EcosystemInteractionsLabProps = {
  species: SpeciesContext[]
}

const LEVEL_Y: Record<number, number> = {
  4: 10,
  3: 30,
  2: 51,
  1: 72,
  0: 91,
}

const THEME_ICON: Record<EcosystemDefinition['theme'], LucideIcon> = {
  forest: TreePine,
  marine: Waves,
  pollinators: Sprout,
}

const NODE_ICON: Record<EcosystemNodeType, LucideIcon> = {
  base: Mountain,
  flora: Flower2,
  fauna: PawPrint,
  habitat: CircleDot,
  project: HandHeart,
  threat: Skull,
}

const RELATION_LAYERS: RelationLayer[] = [
  {
    key: 'all',
    label: 'Toutes les interactions',
    shortLabel: 'Tout',
    description:
      'La toile complete affiche ensemble les dependances, les protections et les pressions.',
    relations: ['nourrit', 'proie', 'habitat', 'symbiose', 'protege', 'menace'],
    icon: Layers3,
    chip: 'border-white/15 bg-white/8 text-white',
    stroke: 'stroke-white/35',
    glow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.18)]',
  },
  {
    key: 'trophic',
    label: 'Nourriture et predation',
    shortLabel: 'Predation',
    description: 'Ce calque montre les flux de nourriture : qui nourrit, qui est une proie.',
    relations: ['nourrit', 'proie'],
    icon: Utensils,
    chip: 'border-amber-200/25 bg-amber-300/10 text-amber-100',
    stroke: 'stroke-amber-300/75',
    glow: 'drop-shadow-[0_0_14px_rgba(252,211,77,0.35)]',
  },
  {
    key: 'habitat',
    label: 'Habitats et refuges',
    shortLabel: 'Habitat',
    description: 'Ce calque isole les lieux de vie, d_abri et de reproduction.',
    relations: ['habitat'],
    icon: Mountain,
    chip: 'border-cyan-200/25 bg-cyan-300/10 text-cyan-100',
    stroke: 'stroke-cyan-300/75',
    glow: 'drop-shadow-[0_0_14px_rgba(103,232,249,0.35)]',
  },
  {
    key: 'symbiose',
    label: 'Cooperation et symbiose',
    shortLabel: 'Symbiose',
    description: 'Ce calque rend visibles les relations de cooperation entre especes.',
    relations: ['symbiose'],
    icon: Link2,
    chip: 'border-lime-200/25 bg-lime-300/10 text-lime-100',
    stroke: 'stroke-lime-300/75',
    glow: 'drop-shadow-[0_0_14px_rgba(190,242,100,0.35)]',
  },
  {
    key: 'protege',
    label: 'Protection par projet',
    shortLabel: 'Protection',
    description: 'Ce calque relie les actions terrain aux noeuds qu_elles stabilisent.',
    relations: ['protege'],
    icon: ShieldCheck,
    chip: 'border-emerald-200/25 bg-emerald-300/10 text-emerald-100',
    stroke: 'stroke-emerald-300/80',
    glow: 'drop-shadow-[0_0_14px_rgba(110,231,183,0.4)]',
  },
  {
    key: 'menace',
    label: 'Pressions et menaces',
    shortLabel: 'Menaces',
    description: 'Ce calque montre les pressions qui fragilisent directement la toile.',
    relations: ['menace'],
    icon: Skull,
    chip: 'border-red-200/25 bg-red-400/10 text-red-100',
    stroke: 'stroke-red-300/80',
    glow: 'drop-shadow-[0_0_14px_rgba(252,165,165,0.4)]',
  },
]

const RELATION_LABEL: Record<EcosystemRelation, string> = {
  nourrit: 'nourrit',
  habitat: 'habitat',
  proie: 'proie',
  symbiose: 'symbiose',
  protege: 'protege',
  menace: 'menace',
}

const FALLBACK_RELATION_LAYER = RELATION_LAYERS[0]!

function buildLabPoints(nodes: readonly EcosystemNode[]): LabPoint[] {
  return nodes.map((node) => ({
    ...node,
    y: LEVEL_Y[node.trophicLevel] ?? 50,
  }))
}

function getLayerForRelation(relation: EcosystemRelation): RelationLayer {
  return (
    RELATION_LAYERS.find((layer) => layer.key !== 'all' && layer.relations.includes(relation)) ??
    FALLBACK_RELATION_LAYER
  )
}

function getActiveEdges(edges: readonly EcosystemEdge[], layer: RelationLayer) {
  if (layer.key === 'all') {
    return [...edges]
  }

  return edges.filter((edge) => layer.relations.includes(edge.relation))
}

export function EcosystemInteractionsLab({ species }: EcosystemInteractionsLabProps) {
  const router = useRouter()
  const [ecosystemId, setEcosystemId] = useState(DEFAULT_ECOSYSTEM_ID)
  const [activeLayerKey, setActiveLayerKey] = useState<RelationLayerKey>('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const ecosystem = useMemo(() => getEcosystemById(ecosystemId), [ecosystemId])
  const speciesById = useMemo(() => new Map(species.map((entry) => [entry.id, entry])), [species])
  const points = useMemo(() => buildLabPoints(ecosystem.nodes), [ecosystem])
  const pointById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])
  const activeLayer =
    RELATION_LAYERS.find((layer) => layer.key === activeLayerKey) ?? FALLBACK_RELATION_LAYER
  const activeEdges = useMemo(
    () => getActiveEdges(ecosystem.edges, activeLayer),
    [activeLayer, ecosystem.edges],
  )
  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>()

    for (const edge of activeEdges) {
      ids.add(edge.source)
      ids.add(edge.target)
    }

    return ids
  }, [activeEdges])
  const selectedEdges = useMemo(() => {
    if (!selectedNodeId) return activeEdges
    return activeEdges.filter(
      (edge) => edge.source === selectedNodeId || edge.target === selectedNodeId,
    )
  }, [activeEdges, selectedNodeId])
  const detailEdges = selectedNodeId ? selectedEdges : []
  const selectedNode = selectedNodeId ? pointById.get(selectedNodeId) : null
  const selectedSpecies = selectedNode?.speciesId ? speciesById.get(selectedNode.speciesId) : null
  const ThemeIcon = THEME_ICON[ecosystem.theme]
  const ActiveLayerIcon = activeLayer.icon

  function changeEcosystem(nextEcosystemId: string) {
    setEcosystemId(nextEcosystemId)
    setSelectedNodeId(null)
  }

  function changeLayer(nextLayerKey: RelationLayerKey) {
    setActiveLayerKey(nextLayerKey)
    setSelectedNodeId(null)
  }

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#05050A] px-3 pb-[max(9rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:px-5 lg:overflow-hidden lg:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col">
        <header className="shrink-0 py-2 lg:py-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
              aria-label="Retour"
              icon={<ArrowLeft className="h-4 w-4" />}
              shimmer={false}
              onClick={() => router.push('/ecosysteme')}
            />

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <ThemeIcon className="h-4 w-4 text-emerald-100" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-200/60">
                  Labo interactions
                </p>
                <h1 className="truncate text-base font-black text-white">{ecosystem.name}</h1>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black tabular-nums text-white/70">
              {activeEdges.length}/{ecosystem.edges.length}
            </span>
          </div>

          <div className="-mx-3 mt-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ECOSYSTEMS.map((entry) => {
              const Icon = THEME_ICON[entry.theme]
              const isActive = entry.id === ecosystem.id

              return (
                <button
                  key={entry.id}
                  type="button"
                  className={cn(
                    'flex h-11 shrink-0 snap-start items-center gap-2 rounded-2xl border px-3 text-left text-xs font-black transition-all duration-300',
                    isActive
                      ? 'border-emerald-200/30 bg-emerald-300/12 text-white'
                      : 'border-white/10 bg-white/[0.04] text-white/45',
                  )}
                  onClick={() => changeEcosystem(entry.id)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {entry.shortName}
                </button>
              )
            })}
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-3 pb-3 lg:grid lg:grid-cols-[15rem_1fr_17rem]">
          <aside className="order-1 grid grid-cols-3 gap-2 lg:order-none lg:flex lg:flex-col">
            {RELATION_LAYERS.map((layer) => {
              const Icon = layer.icon
              const isActive = layer.key === activeLayer.key
              const count = getActiveEdges(ecosystem.edges, layer).length

              return (
                <button
                  key={layer.key}
                  type="button"
                  className={cn(
                    'flex min-w-0 items-center gap-2 rounded-2xl border px-2.5 py-2.5 text-left transition-all duration-300 lg:px-3 lg:py-3',
                    isActive
                      ? layer.chip
                      : 'border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/[0.06]',
                  )}
                  onClick={() => changeLayer(layer.key)}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-black">{layer.shortLabel}</span>
                    <span className="block text-[0.62rem] text-white/35">
                      {count} lien{count > 1 ? 's' : ''}
                    </span>
                  </span>
                </button>
              )
            })}
          </aside>

          <div className="order-2 flex h-[48dvh] min-h-[23rem] max-h-[30rem] flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-2 lg:order-none lg:h-auto lg:min-h-[31rem] lg:max-h-none lg:rounded-[2rem] lg:p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  {activeLayer.label}
                </p>
                <p className="mt-1 hidden text-sm leading-relaxed text-white/55 sm:line-clamp-2 sm:block">
                  {activeLayer.description}
                </p>
              </div>
              <div
                className={cn(
                  'shrink-0 rounded-2xl border px-3 py-2 text-xs font-black',
                  activeLayer.chip,
                )}
              >
                {activeEdges.length} actifs
              </div>
            </div>

            <div className="relative mt-2 flex-1 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#05050A]/70 lg:mt-3 lg:rounded-[1.5rem]">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                {ecosystem.edges.map((edge) => {
                  const source = pointById.get(edge.source)
                  const target = pointById.get(edge.target)
                  if (!source || !target) return null

                  const isActiveEdge = activeEdges.includes(edge)
                  const isSelectedEdge = selectedEdges.includes(edge)
                  const layer =
                    activeLayer.key === 'all' ? getLayerForRelation(edge.relation) : activeLayer
                  const controlY = (source.y + target.y) / 2

                  return (
                    <path
                      key={`${edge.source}-${edge.target}-${edge.relation}`}
                      d={`M ${source.lane} ${source.y} C ${source.lane} ${controlY}, ${target.lane} ${controlY}, ${target.lane} ${target.y}`}
                      className={cn(
                        'transition-all duration-500 ease-in-out',
                        layer.stroke,
                        layer.glow,
                        isActiveEdge
                          ? isSelectedEdge
                            ? 'opacity-100'
                            : 'opacity-55'
                          : 'opacity-5',
                      )}
                      fill="none"
                      strokeLinecap="round"
                      strokeWidth={isSelectedEdge ? '1.8' : isActiveEdge ? '1.15' : '0.65'}
                    />
                  )
                })}
              </svg>

              {points.map((point) => {
                const Icon = point.name.includes('Abeille') ? Bug : NODE_ICON[point.type]
                const pointSpecies = point.speciesId ? speciesById.get(point.speciesId) : null
                const displayName = pointSpecies?.name_default ?? point.name
                const isConnected = connectedNodeIds.has(point.id)
                const isSelected = point.id === selectedNodeId
                const hasSelectedFilter = Boolean(selectedNodeId)
                const isSelectedNeighbor =
                  hasSelectedFilter &&
                  selectedEdges.some((edge) => edge.source === point.id || edge.target === point.id)

                return (
                  <button
                    key={point.id}
                    type="button"
                    className={cn(
                      'absolute z-10 flex w-[4.7rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center transition-all duration-500 sm:w-[5.8rem]',
                      isConnected ? 'opacity-100' : 'opacity-25 grayscale',
                      hasSelectedFilter &&
                        !isSelectedNeighbor &&
                        !isSelected &&
                        'opacity-20 grayscale',
                    )}
                    style={{ left: `${point.lane}%`, top: `${point.y}%` }}
                    onClick={() => setSelectedNodeId(point.id === selectedNodeId ? null : point.id)}
                  >
                    <span
                      className={cn(
                        'relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-[#05050A]/90 backdrop-blur-md transition-all duration-500 sm:h-14 sm:w-14',
                        isSelected
                          ? 'border-white bg-white text-[#05050A] ring-4 ring-white/15'
                          : point.status === 'threatened'
                            ? 'border-red-200/25 text-red-100'
                            : point.status === 'protected'
                              ? 'border-emerald-200/30 text-emerald-100'
                              : 'border-white/15 text-white/70',
                      )}
                    >
                      {pointSpecies?.image_url ? (
                        <img
                          src={pointSpecies.image_url}
                          alt={pointSpecies.name_default}
                          className={cn(
                            'h-full w-full object-cover transition-all duration-500',
                            point.status === 'locked' && 'scale-105 grayscale opacity-45',
                            !isConnected && 'grayscale opacity-55',
                          )}
                        />
                      ) : (
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </span>
                    <span className="max-w-full truncate rounded-full border border-white/10 bg-[#05050A]/80 px-2 py-1 text-[0.55rem] font-black text-white/70 sm:text-[0.58rem]">
                      {displayName}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <aside className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 order-3 max-h-[32dvh] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080F]/92 p-3 shadow-[0_-20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:static lg:order-none lg:max-h-none lg:overflow-visible lg:rounded-[2rem] lg:bg-white/[0.035] lg:p-4 lg:shadow-none lg:backdrop-blur-none">
            <div className="flex items-center gap-2">
              {selectedSpecies?.image_url ? (
                <img
                  src={selectedSpecies.image_url}
                  alt={selectedSpecies.name_default}
                  className="h-8 w-8 shrink-0 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <ActiveLayerIcon className="h-4 w-4 shrink-0 text-white/70" />
              )}
              <div className="min-w-0">
                <h2 className="truncate text-sm font-black text-white">
                  {selectedSpecies?.name_default ?? 'Lecture active'}
                </h2>
                {selectedSpecies ? (
                  <p className="truncate text-[0.65rem] font-bold italic text-white/40">
                    {selectedSpecies.scientific_name} - {selectedSpecies.conservation_status}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55 lg:mt-3 lg:line-clamp-none">
              {selectedNode
                ? selectedNode.summary
                : 'Selectionne un noeud pour voir uniquement ses relations dans le calque actif.'}
            </p>

            <div className="mt-3 max-h-[14dvh] space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] lg:mt-4 lg:max-h-none lg:overflow-visible lg:pr-0 [&::-webkit-scrollbar]:hidden">
              {detailEdges.length > 0 ? (
                detailEdges.map((edge) => {
                  const source = pointById.get(edge.source)
                  const target = pointById.get(edge.target)
                  const layer = getLayerForRelation(edge.relation)

                  if (!source || !target) return null

                  return (
                    <div
                      key={`${edge.source}-${edge.target}-${edge.relation}-detail`}
                      className="rounded-2xl border border-white/10 bg-[#05050A]/60 p-3"
                    >
                      <div className="flex items-center gap-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/35">
                        <span className={cn('h-2 w-2 rounded-full border', layer.chip)} />
                        {RELATION_LABEL[edge.relation]}
                      </div>
                      <p className="mt-2 text-xs font-bold leading-relaxed text-white/70">
                        {source.name} <span className="text-white/30">vers</span> {target.name}
                      </p>
                    </div>
                  )
                })
              ) : !selectedNodeId ? (
                <div className="rounded-2xl border border-white/10 bg-[#05050A]/60 p-3 text-xs leading-relaxed text-white/45">
                  {activeEdges.length} liens visibles. Touchez une espece pour isoler ses
                  connexions.
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#05050A]/60 p-3 text-xs leading-relaxed text-white/45">
                  Aucun lien visible dans ce calque pour le noeud selectionne.
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
