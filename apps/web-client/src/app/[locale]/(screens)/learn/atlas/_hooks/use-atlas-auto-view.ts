'use client'

import { useEffect } from 'react'
import { getAtlasCameraAutoView } from '@/lib/learning/atlas-camera'
import type { AtlasCameraState } from '@/lib/learning/atlas-camera'
import type { AtlasTerritoryConfig, LearningDomainId } from '@/lib/learning/schema'
import {
  ARTBOARD_HEIGHT,
  ARTBOARD_WIDTH,
  DETAIL_AUTO_RADIUS,
  DETAIL_AUTO_SCALE,
  WORLD_AUTO_SCALE,
} from '../_utils/atlas-config'
import { getTerritoryPoint } from '../_utils/atlas-geometry'

// ─── Types ───────────────────────────────────────────────────────────────────

export type UseAtlasAutoViewOptions = {
  camera: AtlasCameraState
  territories: AtlasTerritoryConfig[]
  viewportRef: React.MutableRefObject<{ width: number; height: number }>
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>
  /** Focal point of the last user gesture — used to bias territory selection. */
  autoViewPointRef: React.MutableRefObject<{ x: number; y: number } | null>
  setSelectedTerritoryId: (id: LearningDomainId | null) => void
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Derives the selected territory from the current camera state.
 *
 * Runs as a derived-state effect: whenever the camera moves, it determines
 * whether the viewport is in "world view", focused on a specific territory,
 * or unchanged — and updates selectedTerritoryId accordingly.
 *
 * Reads viewport/dimensions/autoViewPoint from refs (stable, no re-subscription needed).
 */
export function useAtlasAutoView({
  camera,
  territories,
  viewportRef,
  dimensionsRef,
  autoViewPointRef,
  setSelectedTerritoryId,
}: UseAtlasAutoViewOptions) {
  useEffect(() => {
    const autoViewTargets = territories.map((territory) => ({
      id: territory.domain.id,
      ...getTerritoryPoint(territory),
    }))

    const autoView = getAtlasCameraAutoView<LearningDomainId>(
      camera,
      viewportRef.current,
      dimensionsRef.current,
      { width: ARTBOARD_WIDTH, height: ARTBOARD_HEIGHT },
      autoViewTargets,
      {
        worldScale: WORLD_AUTO_SCALE,
        detailScale: DETAIL_AUTO_SCALE,
        detailRadius: DETAIL_AUTO_RADIUS,
        viewportPoint: autoViewPointRef.current ?? undefined,
      },
    )

    if (autoView.mode === 'world') {
      setSelectedTerritoryId(null)
    } else if (autoView.mode === 'domain') {
      setSelectedTerritoryId(autoView.targetId)
    }
    // autoView.mode === 'unchanged' → no state update needed
  }, [camera, territories, setSelectedTerritoryId])
  // viewportRef, dimensionsRef, autoViewPointRef are refs (stable object references).
  // Their .current values are read inside the effect — no need to list them as deps.
}
