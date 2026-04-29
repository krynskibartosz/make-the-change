'use client'

import { Button } from '@make-the-change/core/ui'
import {
  ChevronLeft,
  Eye,
  ImageIcon,
  LockKeyhole,
  Maximize2,
  Play,
  RotateCcw,
  ShieldCheck,
  Skull,
  StepForward,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useEcosystem } from '@/hooks/use-ecosystem'
import {
  type EcosystemPerspective,
  getEcosystemById,
  PERSPECTIVE_COPY,
} from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'
import {
  buildPathPoints,
  EcosystemLines,
  EcosystemPathNode,
  getNodeVisual,
  isNodeEmphasized,
  STATUS_VISUALS,
  THEME_ICON,
} from './ecosystem-path-v1'

type EcosystemSpeciesPreview = {
  id: string
  name: string
  scientificName: string
  conservationStatus: string
  imageUrl: string | null
  isUnlocked: boolean
}

type EcosystemDetailProps = {
  ecosystemId: string
  species: EcosystemSpeciesPreview[]
}

const INITIAL_GUIDE_STEP = 1

const PERSPECTIVE_OPTIONS: EcosystemPerspective[] = ['biome', 'project', 'species', 'faction']

function getGuidePriority(point: { type: string; trophicLevel: number }) {
  if (point.type === 'project') return 90 + point.trophicLevel
  if (point.type === 'threat') return 100 + point.trophicLevel
  return point.trophicLevel
}

export function EcosystemDetail({ ecosystemId, species }: EcosystemDetailProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const perspectiveParam = searchParams.get('perspective') as EcosystemPerspective | null
  const [perspective, setPerspective] = useState<EcosystemPerspective>(perspectiveParam || 'biome')
  const [unlockedEcosystemIds, setUnlockedEcosystemIds] = useState<Set<string>>(() => new Set())
  const [isGuideActive, setIsGuideActive] = useState(true)
  const [guideStep, setGuideStep] = useState(INITIAL_GUIDE_STEP)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const ecosystem = useMemo(() => getEcosystemById(ecosystemId), [ecosystemId])
  const isAccessUnlocked =
    ecosystem.access === 'available' || unlockedEcosystemIds.has(ecosystem.id)

  const {
    nodes,
    edges,
    triggerExtinction,
    healEcosystem,
    protectProjectArea,
    revealLockedNodes,
    revealNode,
    hasDeadNodes,
    lockedCount,
  } = useEcosystem(ecosystem, isAccessUnlocked)

  const speciesById = useMemo(() => new Map(species.map((entry) => [entry.id, entry])), [species])
  const points = useMemo(() => buildPathPoints(nodes), [nodes])
  const orderedPoints = useMemo(
    () => [...points].sort((a, b) => getGuidePriority(a) - getGuidePriority(b) || a.lane - b.lane),
    [points],
  )
  const maxGuideStep = Math.max(orderedPoints.length - 1, 0)
  const safeGuideStep = Math.min(guideStep, maxGuideStep)
  const visibleNodeIds = useMemo(() => {
    if (!isGuideActive) {
      return new Set(points.map((point) => point.id))
    }

    return new Set(orderedPoints.slice(0, safeGuideStep + 1).map((point) => point.id))
  }, [isGuideActive, orderedPoints, points, safeGuideStep])

  const selectedPoint = useMemo(() => {
    if (selectedNodeId) {
      return points.find((point) => point.id === selectedNodeId)
    }

    return orderedPoints[Math.min(safeGuideStep, maxGuideStep)]
  }, [maxGuideStep, orderedPoints, points, safeGuideStep, selectedNodeId])

  const selectedSpecies = selectedPoint?.speciesId
    ? speciesById.get(selectedPoint.speciesId)
    : undefined
  const collapsedCount = useMemo(
    () => nodes.filter((node) => node.status === 'collapsed').length,
    [nodes],
  )
  const unlockedCount = useMemo(
    () => nodes.filter((node) => node.status !== 'locked').length,
    [nodes],
  )
  const ThemeIcon = THEME_ICON[ecosystem.theme]

  useEffect(() => {
    if (!selectedNodeId || visibleNodeIds.has(selectedNodeId)) {
      return
    }

    setSelectedNodeId(orderedPoints[Math.min(safeGuideStep, maxGuideStep)]?.id ?? null)
  }, [maxGuideStep, orderedPoints, safeGuideStep, selectedNodeId, visibleNodeIds])

  function handlePerspectiveChange(nextPerspective: EcosystemPerspective) {
    setPerspective(nextPerspective)
    const url = new URL(window.location.href)
    url.searchParams.set('perspective', nextPerspective)
    window.history.pushState({}, '', url.toString())
  }

  function unlockActiveEcosystem() {
    setUnlockedEcosystemIds((current) => {
      const next = new Set(current)
      next.add(ecosystem.id)
      return next
    })
  }

  function advanceGuide() {
    const nextStep = Math.min(safeGuideStep + 1, maxGuideStep)
    setIsGuideActive(true)
    setGuideStep(nextStep)
    setSelectedNodeId(orderedPoints[nextStep]?.id ?? null)
  }

  function restartGuide() {
    setIsGuideActive(true)
    setGuideStep(0)
    setSelectedNodeId(orderedPoints[0]?.id ?? null)
  }

  function showFullWeb() {
    setIsGuideActive(false)
    setGuideStep(maxGuideStep)
    setSelectedNodeId(
      ecosystem.nodes.find((node) => node.focal)?.id ?? orderedPoints.at(-1)?.id ?? null,
    )
  }

  function handleSelectNode(nodeId: string) {
    setSelectedNodeId(nodeId)
  }

  const selectedVisual = selectedPoint ? getNodeVisual(selectedPoint) : null
  const SelectedIcon = selectedVisual?.icon ?? ImageIcon
  const selectedStatus = selectedPoint ? STATUS_VISUALS[selectedPoint.status] : null
  const isSelectedLocked = selectedPoint?.status === 'locked'
  const canAdvance = isGuideActive && safeGuideStep < maxGuideStep
  const graphShift =
    isGuideActive && selectedPoint ? Math.max(-52, Math.min(6, 28 - selectedPoint.y)) : 0

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#05050A] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_20%_70%,rgba(132,204,22,0.08),transparent_28%)]" />
      <div className="mx-auto flex h-[100dvh] w-full max-w-4xl flex-col px-3 pb-[max(9.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        <header className="relative z-30 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 bg-[#05050A]/65 text-white backdrop-blur-xl"
              aria-label="Retour"
              icon={<ChevronLeft className="h-4 w-4" />}
              shimmer={false}
              onClick={() => router.back()}
            />

            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Categorie</span>
              <ThemeIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-emerald-100" />
              <select
                className="h-11 w-full appearance-none truncate rounded-2xl border border-white/10 bg-[#05050A]/65 py-0 pl-9 pr-8 text-sm font-black text-white outline-none backdrop-blur-xl"
                value={perspective}
                onChange={(event) => handlePerspectiveChange(event.target.value as EcosystemPerspective)}
              >
                {PERSPECTIVE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {PERSPECTIVE_COPY[option].label}
                  </option>
                ))}
              </select>
            </label>

            <span
              className={cn(
                'shrink-0 rounded-2xl px-3 py-2 text-xs font-black tabular-nums backdrop-blur-xl',
                hasDeadNodes
                  ? 'bg-red-400/10 text-red-100'
                  : 'bg-emerald-300/10 text-emerald-100',
              )}
            >
              {unlockedCount}/{nodes.length}
            </span>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {!isAccessUnlocked ? (
              <Button
                type="button"
                variant="success"
                size="sm"
                className="h-11 shrink-0 rounded-2xl bg-emerald-300 text-[#05050A]"
                icon={<LockKeyhole className="h-3.5 w-3.5" />}
                onClick={unlockActiveEcosystem}
              >
                Debloquer
              </Button>
            ) : null}

            <Button
              type="button"
              variant={canAdvance ? 'success' : 'glass'}
              size="sm"
              className={cn(
                'h-11 shrink-0 rounded-2xl',
                canAdvance
                  ? 'bg-emerald-300 text-[#05050A]'
                  : 'border border-white/10 bg-[#05050A]/65 text-white backdrop-blur-xl',
              )}
              icon={
                canAdvance ? (
                  <StepForward className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )
              }
              shimmer={false}
              onClick={canAdvance ? advanceGuide : restartGuide}
            >
              {canAdvance ? 'Suite' : 'Rejouer'}
            </Button>

            <Button
              type="button"
              variant="glass"
              size="sm"
              className="h-11 shrink-0 rounded-2xl border border-white/10 bg-[#05050A]/65 text-white backdrop-blur-xl"
              icon={<Maximize2 className="h-3.5 w-3.5" />}
              shimmer={false}
              onClick={showFullWeb}
            >
              Tout voir
            </Button>

            {lockedCount > 0 ? (
              <Button
                type="button"
                variant="glass"
                size="sm"
                className="h-11 shrink-0 rounded-2xl border border-white/10 bg-[#05050A]/65 text-white backdrop-blur-xl"
                icon={<Eye className="h-3.5 w-3.5" />}
                shimmer={false}
                onClick={revealLockedNodes}
              >
                Reveler
              </Button>
            ) : null}
          </div>
        </header>

        <section className="relative flex flex-1 items-center justify-center">
          <div className="absolute left-0 top-3 z-20 rounded-full border border-white/10 bg-[#05050A]/80 px-3 py-1 text-[0.65rem] font-black text-white/45 backdrop-blur-md">
            {isGuideActive ? `Etape ${safeGuideStep + 1}/${nodes.length}` : 'Vue complete'}
          </div>

          <div
            className="pointer-events-none relative h-[35rem] w-full max-w-[44rem] overflow-visible transition-transform duration-700 ease-in-out sm:h-[44rem]"
            style={{ transform: `translateY(${graphShift}%)` }}
          >
            <EcosystemLines
              edges={edges}
              points={points}
              ecosystem={ecosystem}
              perspective={perspective}
              visibleNodeIds={visibleNodeIds}
              selectedNodeId={selectedPoint?.id ?? null}
            />

            {points.map((point) => (
              <EcosystemPathNode
                key={point.id}
                point={point}
                species={point.speciesId ? speciesById.get(point.speciesId) : undefined}
                emphasized={
                  isNodeEmphasized(point, ecosystem, perspective) || point.id === selectedPoint?.id
                }
                isSelected={point.id === selectedPoint?.id}
                isVisible={visibleNodeIds.has(point.id)}
                showInlineActions={false}
                onSelect={handleSelectNode}
              />
            ))}
          </div>
        </section>

        {selectedPoint && selectedStatus ? (
          <section className="fixed inset-x-3 bottom-0 z-50 mx-auto max-w-4xl rounded-t-[1.75rem] border border-white/10 bg-[#05050A]/94 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-18px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="flex gap-3">
              <div
                className={cn(
                  'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white/5',
                  isSelectedLocked ? 'border-white/10 grayscale' : selectedVisual?.orb,
                )}
              >
                {!isSelectedLocked && selectedSpecies?.imageUrl ? (
                  <img
                    src={selectedSpecies.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <SelectedIcon className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-black text-white">
                      {selectedPoint.name}
                    </h2>
                    <p className="truncate text-xs text-white/40">
                      {isSelectedLocked
                        ? selectedPoint.unlockHint || 'Zone voilee'
                        : selectedSpecies?.scientificName || selectedVisual?.label}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-1 text-[0.6rem] font-black uppercase',
                      selectedStatus.badge,
                    )}
                  >
                    {selectedStatus.label}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-white/55">
                  {selectedPoint.summary}
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {isSelectedLocked ? (
                <>
                  {!isAccessUnlocked ? (
                    <Button
                      type="button"
                      variant="success"
                      size="sm"
                      className="h-11 shrink-0 rounded-2xl bg-emerald-300 text-[#05050A]"
                      icon={<LockKeyhole className="h-3.5 w-3.5" />}
                      onClick={unlockActiveEcosystem}
                    >
                      Debloquer la zone
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="glass"
                    size="sm"
                    className="h-11 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
                    icon={<Eye className="h-3.5 w-3.5" />}
                    shimmer={false}
                    onClick={() => revealNode(selectedPoint.id)}
                  >
                    Reveler ce noeud
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-11 shrink-0 rounded-2xl bg-red-500/15 text-red-100 ring-1 ring-red-300/20 hover:bg-red-500/25"
                    icon={<Skull className="h-3.5 w-3.5" />}
                    shimmer={false}
                    onClick={() => triggerExtinction(selectedPoint.id)}
                  >
                    Simuler rupture
                  </Button>

                  <Button
                    type="button"
                    variant="glass"
                    size="sm"
                    className="h-11 shrink-0 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
                    icon={<ShieldCheck className="h-3.5 w-3.5" />}
                    shimmer={false}
                    onClick={protectProjectArea}
                  >
                    Proteger
                  </Button>

                  {hasDeadNodes ? (
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      className="h-11 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
                      icon={<RotateCcw className="h-3.5 w-3.5" />}
                      shimmer={false}
                      onClick={healEcosystem}
                    >
                      Restaurer ({collapsedCount})
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
