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
  PerspectiveTabs,
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
  const copy = PERSPECTIVE_COPY[perspective]

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
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(12rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col">
        <header className="shrink-0 py-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
              aria-label="Retour"
              icon={<ChevronLeft className="h-4 w-4" />}
              shimmer={false}
              onClick={() => router.back()}
            />

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/20 bg-emerald-300/10">
                <ThemeIcon className="h-4 w-4 text-emerald-100" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-black text-white">{ecosystem.name}</h1>
                <p className="truncate text-xs text-white/45">{ecosystem.location}</p>
              </div>
            </div>

            <span
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-black tabular-nums',
                hasDeadNodes ? 'bg-red-400/10 text-red-100' : 'bg-emerald-300/10 text-emerald-100',
              )}
            >
              {unlockedCount}/{nodes.length}
            </span>
          </div>

          <div className="mt-3">
            <PerspectiveTabs perspective={perspective} onChange={handlePerspectiveChange} />
          </div>

          <div className="mt-3 rounded-3xl border border-white/10 bg-white/[0.035] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-200/55">
                  {copy.label}
                </p>
                <p className="mt-1 text-sm font-black text-white">{copy.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/45">
                  {ecosystem.thesis}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/10 bg-[#05050A]/70 px-3 py-2 text-right">
                <p className="text-sm font-black text-white">{ecosystem.impact.value}</p>
                <p className="max-w-24 text-[0.6rem] leading-tight text-white/35">impact estime</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!isAccessUnlocked ? (
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  className="h-9 shrink-0 rounded-2xl bg-emerald-300 text-[#05050A]"
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
                  'h-9 shrink-0 rounded-2xl',
                  canAdvance
                    ? 'bg-emerald-300 text-[#05050A]'
                    : 'border border-white/10 bg-white/5 text-white',
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
                className="h-9 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
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
                  className="h-9 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
                  icon={<Eye className="h-3.5 w-3.5" />}
                  shimmer={false}
                  onClick={revealLockedNodes}
                >
                  Reveler
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        <section className="relative flex flex-1 items-center justify-center py-3">
          <div className="absolute left-0 top-3 z-20 rounded-full border border-white/10 bg-[#05050A]/80 px-3 py-1 text-[0.65rem] font-black text-white/45 backdrop-blur-md">
            {isGuideActive ? `Etape ${safeGuideStep + 1}/${nodes.length}` : 'Vue complete'}
          </div>

          <div
            className="pointer-events-none relative h-[30rem] w-full max-w-[44rem] overflow-visible transition-transform duration-700 ease-in-out sm:h-[44rem]"
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
                      className="h-9 shrink-0 rounded-2xl bg-emerald-300 text-[#05050A]"
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
                    className="h-9 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
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
                    className="h-9 shrink-0 rounded-2xl bg-red-500/15 text-red-100 ring-1 ring-red-300/20 hover:bg-red-500/25"
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
                    className="h-9 shrink-0 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
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
                      className="h-9 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
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
