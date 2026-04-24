'use client'

import { Button } from '@make-the-change/core/ui'
import {
  ChevronLeft,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEcosystem } from '@/hooks/use-ecosystem'
import {
  DEFAULT_ECOSYSTEM_ID,
  ECOSYSTEMS,
  FACTION_COPY,
  PERSPECTIVE_COPY,
  type EcosystemDefinition,
  type EcosystemEdge,
  type EcosystemFactionKey,
  type EcosystemNode,
  type EcosystemPerspective,
  type EcosystemStatus,
  getEcosystemById,
} from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'
import {
  EcosystemLines,
  EcosystemPathNode,
  PerspectiveTabs,
  ContextPanel,
  SpeciesStrip,
  FactionPanel,
  LEVEL_Y,
  buildPathPoints,
  getNodeVisual,
  isNodeEmphasized,
  getEdgeStatus,
  STATUS_VISUALS,
  PERSPECTIVE_ICONS,
  THEME_ICON,
  NODE_VISUALS,
  NODE_ICON_BY_NAME,
} from './ecosystem-path-v1'

type EcosystemSpeciesPreview = {
  id: string
  name: string
  scientificName: string
  conservationStatus: string
  imageUrl: string | null
  isUnlocked: boolean
}

type PathPoint = EcosystemNode & {
  y: number
}

type EcosystemDetailProps = {
  ecosystemId: string
  species: EcosystemSpeciesPreview[]
}

export function EcosystemDetail({ ecosystemId, species }: EcosystemDetailProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const perspectiveParam = searchParams.get('perspective') as EcosystemPerspective | null
  const [perspective, setPerspective] = useState<EcosystemPerspective>(perspectiveParam || 'biome')
  const [unlockedEcosystemIds, setUnlockedEcosystemIds] = useState<Set<string>>(() => new Set())
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false)
  const [isSpeciesStripOpen, setIsSpeciesStripOpen] = useState(false)
  
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

  function handleBack() {
    router.push('/ecosysteme')
  }

  function handleFactionSelect(ecosystemId: string) {
    router.push(`/ecosysteme/${ecosystemId}?perspective=faction`)
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col">
        {/* Header fix avec bouton retour */}
        <header className="shrink-0 py-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
              aria-label="Retour à la liste"
              icon={<ChevronLeft className="h-4 w-4" />}
              shimmer={false}
              onClick={handleBack}
            />
            
            <div className="flex min-w-0 flex-1 items-center gap-3">
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

            {hasDeadNodes ? (
              <Button
                type="button"
                variant="glass"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
                aria-label="Restaurer rapidement l'ecosysteme"
                icon={<RotateCcw className="h-4 w-4" />}
                shimmer={false}
                onClick={healEcosystem}
              />
            ) : null}

            <span
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-black tabular-nums',
                hasDeadNodes ? 'bg-red-400/10 text-red-100' : 'bg-emerald-300/10 text-emerald-100',
              )}
            >
              {unlockedCount} / {nodes.length}
            </span>
          </div>

          {/* PerspectiveTabs en top bar */}
          <div className="mt-4">
            <PerspectiveTabs perspective={perspective} onChange={handlePerspectiveChange} />
          </div>

          {/* ContextPanel en accordéon */}
          <div className="mt-4">
            <Button
              type="button"
              variant="glass"
              size="sm"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.035] text-white"
              onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
              shimmer={false}
            >
              {isContextPanelOpen ? 'Masquer les détails' : 'Voir les détails'}
            </Button>
            
            {isContextPanelOpen ? (
              <div className="mt-2">
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
              </div>
            ) : null}
          </div>

          {/* FactionPanel conditionnel */}
          {perspective === 'faction' ? (
            <div className="mt-4">
              <FactionPanel
                activeFaction={ecosystem.factionFocus}
                onSelectEcosystem={handleFactionSelect}
              />
            </div>
          ) : null}
        </header>

        {/* Visualisation principale */}
        <div className="relative flex flex-1 items-center justify-center py-4">
          <div className="relative h-[48rem] w-full max-w-[46rem] overflow-visible sm:h-[56rem]">
            <EcosystemLines
              edges={edges}
              points={points}
              ecosystem={ecosystem}
              perspective={perspective}
            />

            {points.map((point: PathPoint) => (
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

        {/* SpeciesStrip en bas ou accordéon */}
        <div className="mt-4">
          <Button
            type="button"
            variant="glass"
            size="sm"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] text-white"
            onClick={() => setIsSpeciesStripOpen(!isSpeciesStripOpen)}
            shimmer={false}
          >
            {isSpeciesStripOpen ? 'Masquer les espèces' : 'Voir les espèces'}
          </Button>
          
          {isSpeciesStripOpen ? (
            <div className="mt-2">
              <SpeciesStrip points={points} speciesById={speciesById} />
            </div>
          ) : null}
        </div>

        {/* Footer restore */}
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
          <span>•</span>
          <span>Détail écosystème</span>
        </div>
      </div>
    </main>
  )
}
