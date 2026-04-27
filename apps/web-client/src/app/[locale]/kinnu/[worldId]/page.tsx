'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getKinnuWorldById } from '@/lib/kinnu/graph'
import {
  addMasteredNode,
  computeKinnuStatuses,
  getNewlyUnlockedIds,
  loadWorldMasteredIds,
  type KinnuNodeStatus,
} from '@/lib/kinnu/bridge'
import { KinnuGraphCanvas } from '../_components/kinnu-graph-canvas'
import { KinnuBottomSheet } from '../_components/kinnu-bottom-sheet'
import { KinnuHud } from '../_components/kinnu-hud'

export default function KinnuWorldPage({ params }: { params: { worldId: string } }) {
  const world = useMemo(() => getKinnuWorldById(params.worldId), [params.worldId])

  // ─── Progress ────────────────────────────────────────────────────────────
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [isReady, setIsReady] = useState(false)
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMasteredIds(loadWorldMasteredIds(params.worldId))
    setIsReady(true)
  }, [params.worldId])

  // ─── Statuts calculés ────────────────────────────────────────────────────
  const statuses = useMemo<Record<string, KinnuNodeStatus>>(
    () => computeKinnuStatuses(world.nodes, masteredIds),
    [world.nodes, masteredIds],
  )

  // ─── Sélection ───────────────────────────────────────────────────────────
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const selectedNode = useMemo(
    () => world.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [world.nodes, selectedNodeId],
  )
  const selectedStatus = selectedNodeId ? (statuses[selectedNodeId] ?? null) : null

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
      const unlocked = getNewlyUnlockedIds(world.nodes, masteredIds, nodeId)
      const next = addMasteredNode(params.worldId, nodeId)
      setMasteredIds(next)
      setSelectedNodeId(null)

      // Flash des nœuds nouvellement débloqués
      if (unlocked.length > 0) {
        setNewlyUnlockedIds(new Set(unlocked))
        setTimeout(() => setNewlyUnlockedIds(new Set()), 1800)
      }
    },
    [world.nodes, masteredIds, params.worldId],
  )

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
        masteredCount={masteredIds.size}
        totalNodes={world.nodes.length}
      />

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
        onMaster={handleMaster}
        onClose={handleClose}
      />
    </main>
  )
}
