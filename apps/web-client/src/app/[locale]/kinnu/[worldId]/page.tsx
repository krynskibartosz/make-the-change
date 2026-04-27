'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getKinnuWorldById } from '@/lib/kinnu/graph'
import {
  computeKinnuStatuses,
  getNewlyUnlockedIds,
  loadWorldMastery,
  masterNode,
  addTimeOffsetDays,
  type ComputedKinnuStatus,
  type NodeMastery,
} from '@/lib/kinnu/bridge'
import { Clock } from 'lucide-react'
import { KinnuGraphCanvas } from '../_components/kinnu-graph-canvas'
import { KinnuBottomSheet } from '../_components/kinnu-bottom-sheet'
import { KinnuHud } from '../_components/kinnu-hud'

export default function KinnuWorldPage({ params }: { params: { worldId: string } }) {
  const world = useMemo(() => getKinnuWorldById(params.worldId), [params.worldId])

  // ─── Progress ────────────────────────────────────────────────────────────
  const [mastery, setMastery] = useState<Record<string, NodeMastery>>({})
  const [isReady, setIsReady] = useState(false)
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<Set<string>>(new Set())
  const [renderKey, setRenderKey] = useState(0) // Forcer un re-rendu lors du time-travel

  useEffect(() => {
    setMastery(loadWorldMastery(params.worldId))
    setIsReady(true)
  }, [params.worldId])

  // ─── Statuts calculés ────────────────────────────────────────────────────
  const statuses = useMemo<Record<string, ComputedKinnuStatus>>(
    () => computeKinnuStatuses(world.nodes, mastery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [world.nodes, mastery, renderKey],
  )

  // ─── Sélection ───────────────────────────────────────────────────────────
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const selectedNode = useMemo(
    () => world.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [world.nodes, selectedNodeId],
  )
  const selectedStatusObj = selectedNodeId ? (statuses[selectedNodeId] ?? null) : null
  const selectedStatus = selectedStatusObj?.status ?? null
  const selectedHealth = selectedStatusObj?.health ?? null

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId))
    },
    [],
  )

  const handleClose = useCallback(() => setSelectedNodeId(null), [])

  // ─── Maîtrise ────────────────────────────────────────────────────────────
  const handleMaster = useCallback(
    (nodeId: string) => {
      const unlocked = getNewlyUnlockedIds(world.nodes, mastery, nodeId)
      const nextMastery = masterNode(params.worldId, nodeId)
      setMastery(nextMastery)
      setSelectedNodeId(null)

      // Flash des nœuds nouvellement débloqués
      if (unlocked.length > 0) {
        setNewlyUnlockedIds(new Set(unlocked))
        setTimeout(() => setNewlyUnlockedIds(new Set()), 1800)
      }
    },
    [world.nodes, mastery, params.worldId],
  )

  // ─── Time Travel (Debug) ─────────────────────────────────────────────────
  const handleTimeTravel = () => {
    addTimeOffsetDays(1)
    setRenderKey((k) => k + 1) // Force le recalcul de `statuses`
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#05050A] text-white">
      {/* Ambiance radiale */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-cyan-500/6 blur-3xl" />
      </div>

      {/* HUD */}
      <KinnuHud
        world={world}
        masteredCount={Object.keys(mastery).length}
        totalNodes={world.nodes.length}
      />

      {/* Debug: Time Travel Button */}
      <div className="absolute right-4 top-[5.5rem] z-50">
        <button
          onClick={handleTimeTravel}
          className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-purple-200 backdrop-blur-md transition-colors hover:bg-purple-500/20"
          title="Avancer le temps de 1 jour pour tester la dégradation"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>+1 Jour</span>
        </button>
      </div>

      {/* Canvas graphe */}
      <section className="relative h-[100dvh] w-full px-2 pb-4 pt-28 sm:px-6">
        {isReady ? (
          <KinnuGraphCanvas
            nodes={world.nodes}
            edges={world.edges}
            statuses={statuses}
            selectedNodeId={selectedNodeId}
            newlyUnlockedIds={newlyUnlockedIds}
            onNodeClick={handleNodeClick}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          </div>
        )}
      </section>

      {/* Tagline */}
      <div className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center">
        <p className="rounded-full border border-white/8 bg-[#05050A]/60 px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30 backdrop-blur-xl">
          {world.tagline}
        </p>
      </div>

      {/* Bottom Sheet */}
      <KinnuBottomSheet
        node={selectedNode}
        status={selectedStatus}
        health={selectedHealth}
        onMaster={handleMaster}
        onClose={handleClose}
      />
    </main>
  )
}
