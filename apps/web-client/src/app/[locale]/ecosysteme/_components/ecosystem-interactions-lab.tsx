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
  SlidersHorizontal,
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
  type EcosystemEvidenceLevel,
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

const EVIDENCE_LABEL: Record<EcosystemEvidenceLevel, string> = {
  verified: 'verifie',
  plausible: 'plausible',
  proxy: 'proxy',
  needs_source: 'a sourcer',
}

const EVIDENCE_STYLE: Record<EcosystemEvidenceLevel, string> = {
  verified: 'border-emerald-200/25 text-emerald-100',
  plausible: 'border-cyan-200/25 text-cyan-100',
  proxy: 'border-amber-200/25 text-amber-100',
  needs_source: 'border-red-200/25 text-red-100',
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
  const verifiedEdgesCount = activeEdges.filter((edge) => edge.confidence === 'verified').length
  const proxyEdgesCount = activeEdges.filter((edge) => edge.isProxy).length
  const needsSourceEdgesCount = activeEdges.filter((edge) => edge.confidence === 'needs_source').length
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#05050A] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_80%_55%,rgba(34,211,238,0.08),transparent_28%)]" />

      <header className="absolute inset-x-0 top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 bg-[#05050A]/65 text-white backdrop-blur-xl"
            aria-label="Retour"
            icon={<ArrowLeft className="h-4 w-4" />}
            shimmer={false}
            onClick={() => router.push('/ecosysteme')}
          />

          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Ecosysteme</span>
            <ThemeIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-emerald-100" />
            <select
              className="h-11 w-full appearance-none truncate rounded-2xl border border-white/10 bg-[#05050A]/65 py-0 pl-9 pr-8 text-sm font-black text-white outline-none backdrop-blur-xl"
              value={ecosystem.id}
              onChange={(event) => changeEcosystem(event.target.value)}
            >
              {ECOSYSTEMS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.shortName}
                </option>
              ))}
            </select>
          </label>

          <label className="relative w-[8.7rem] shrink-0 sm:w-[11rem]">
            <span className="sr-only">Filtre</span>
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/70" />
            <select
              className={cn(
                'h-11 w-full appearance-none truncate rounded-2xl border py-0 pl-9 pr-7 text-xs font-black outline-none backdrop-blur-xl',
                activeLayer.chip,
                'bg-[#05050A]/65',
              )}
              value={activeLayer.key}
              onChange={(event) => changeLayer(event.target.value as RelationLayerKey)}
            >
              {RELATION_LAYERS.map((layer) => (
                <option key={layer.key} value={layer.key}>
                  {layer.shortLabel} ({getActiveEdges(ecosystem.edges, layer).length})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mx-auto mt-2 flex max-w-5xl justify-end gap-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-white/45">
          <span>{verifiedEdgesCount} verifies</span>
          <span>{proxyEdgesCount} proxies</span>
          {needsSourceEdgesCount > 0 ? <span>{needsSourceEdgesCount} a sourcer</span> : null}
        </div>
      </header>

      <section className="relative mx-auto h-[100dvh] w-full max-w-5xl px-1 pt-16 pb-[max(8.5rem,env(safe-area-inset-bottom))] sm:px-5 lg:pb-5">
        <div className="relative h-full w-full overflow-hidden">
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

        <aside className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-5xl overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#08080F]/88 p-3 shadow-[0_-20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:static lg:mt-3 lg:max-h-none lg:rounded-2xl lg:bg-white/[0.035] lg:shadow-none">
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
                      className="border-t border-white/10 py-2 first:border-t-0"
                    >
                      <div className="flex items-center gap-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/35">
                        <span className={cn('h-2 w-2 rounded-full border', layer.chip)} />
                        <span>{RELATION_LABEL[edge.relation]}</span>
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5',
                            EVIDENCE_STYLE[edge.confidence],
                          )}
                        >
                          {EVIDENCE_LABEL[edge.confidence]}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-bold leading-relaxed text-white/70">
                        {source.name} <span className="text-white/30">vers</span> {target.name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45">
                        {edge.explanation}
                      </p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-white/45"
                          style={{ width: `${Math.round(edge.strength * 100)}%` }}
                        />
                      </div>
                      {edge.sourceUrl ? (
                        <a
                          href={edge.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex text-[0.65rem] font-black uppercase tracking-[0.12em] text-white/40 underline-offset-4 hover:text-white hover:underline"
                        >
                          {edge.sourceLabel}
                        </a>
                      ) : (
                        <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white/30">
                          {edge.sourceLabel}
                        </p>
                      )}
                    </div>
                  )
                })
              ) : !selectedNodeId ? (
                <p className="border-t border-white/10 pt-2 text-xs leading-relaxed text-white/45">
                  {activeEdges.length} liens visibles dont {verifiedEdgesCount} verifies. Touchez
                  une espece pour lire les sources et les liens a sourcer.
                </p>
              ) : (
                <p className="border-t border-white/10 pt-2 text-xs leading-relaxed text-white/45">
                  Aucun lien visible dans ce calque pour le noeud selectionne.
                </p>
              )}
            </div>
        </aside>
      </section>
    </main>
  )
}
