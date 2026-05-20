import type { AtlasCameraConstraints, AtlasCameraState } from '@/lib/learning/atlas-camera'
import type { AtlasSubdomainConfig, AtlasTerritoryConfig, HexCell } from '@/lib/learning/schema'
import {
  ARTBOARD_HEIGHT,
  ARTBOARD_WIDTH,
  HEX_ANGLE_OFFSETS,
  SQRT_3,
} from './atlas-config'

// ─── Hex cell geometry ───────────────────────────────────────────────────────

/** Returns the pixel center of a hex cell in flat-top axial coordinates. */
export function getHexCenter(cell: HexCell, radius: number) {
  return {
    x: radius * 1.5 * cell.q,
    y: radius * SQRT_3 * (cell.r + cell.q / 2),
  }
}

/** Returns the SVG path string for a regular hexagon centered at (cx, cy). */
export function getHexPath(cx: number, cy: number, radius: number): string {
  const points = HEX_ANGLE_OFFSETS.map(
    ({ cos, sin }) =>
      `${(cx + radius * cos).toFixed(2)},${(cy + radius * sin).toFixed(2)}`,
  )
  return `M ${points.join(' L ')} Z`
}

// ─── Coordinate mapping ──────────────────────────────────────────────────────

/** Converts a territory's percentage position (0–100) to SVG artboard coordinates. */
export function getTerritoryPoint(territory: Pick<AtlasTerritoryConfig, 'x' | 'y'>) {
  return {
    x: (territory.x / 100) * ARTBOARD_WIDTH,
    y: (territory.y / 100) * ARTBOARD_HEIGHT,
  }
}

/** Converts a subdomain's percentage position (0–100) to SVG artboard coordinates. */
export function getSubdomainPoint(subdomain: Pick<AtlasSubdomainConfig, 'x' | 'y'>) {
  return {
    x: (subdomain.x / 100) * ARTBOARD_WIDTH,
    y: (subdomain.y / 100) * ARTBOARD_HEIGHT,
  }
}

// ─── Camera transforms ───────────────────────────────────────────────────────

/** Returns the pixel dimensions of the map canvas based on the current viewport. */
export function getMapDimensions(viewport: { width: number }) {
  const width =
    viewport.width < 768 ? Math.max(760, viewport.width * 1.95) : viewport.width * 1.12

  return { width, height: width * (ARTBOARD_HEIGHT / ARTBOARD_WIDTH) }
}

/** Returns the min/max scale and overscroll bounds for the camera. */
export function getCameraConstraints(viewport: { width: number }): AtlasCameraConstraints {
  const isMobile = viewport.width < 768
  return {
    /**
     * Mobile: minScale = 0.9 = world view scale.
     * The user cannot zoom out beyond the world view where all islands are already visible.
     * Zooming further out would only show empty dark canvas — no useful information.
     *
     * Desktop: minScale = 1.0 for the same reason.
     */
    minScale: isMobile ? 0.9 : 1.0,
    maxScale: isMobile ? 2.7 : 2.45,
    /**
     * Overscroll = elastic bounce distance when panning beyond the map boundary.
     * At world view scale the map canvas (684×958px) is still larger than the viewport
     * (390×844px), so the user can pan slightly to reposition before tapping an island.
     * A tighter overscroll (24px vs 40px) makes this feel more intentional and less loose.
     */
    overscroll: isMobile ? 24 : 48,
  }
}


/** Returns the camera state that fits the entire world map in view. */
export function getWorldTransform(
  viewport: { width: number; height: number },
  mapWidth: number,
): AtlasCameraState {
  const isMobile = viewport.width < 768
  return {
    // Mobile: 0.41 factor shifts slightly right to center the archipelago horizontally
    x: viewport.width / 2 - mapWidth * (isMobile ? 0.41 : 0.5),
    // Mobile: -41 is calculated so Milieux (top island) sits just below the gradient overlay
    // and Impact (bottom island) sits ~73px above the search bar — near-perfect vertical balance
    y: isMobile ? -41 : -82,
    // Mobile: 0.9 gives more breathing room around the archipelago
    scale: isMobile ? 0.9 : 1,
  }
}


/** Returns the camera state that centers and zooms on a specific territory. */
export function getDomainTransform(
  territory: AtlasTerritoryConfig,
  viewport: { width: number; height: number },
  mapWidth: number,
  reduceMotion: boolean,
): AtlasCameraState {
  const scale = reduceMotion
    ? 1.16
    : viewport.width < 768
      ? Math.min(territory.camera.scale, 1.74)
      : territory.camera.scale
  const scaleFactor = mapWidth / ARTBOARD_WIDTH
  const point = getTerritoryPoint(territory)

  return {
    x: viewport.width / 2 - point.x * scaleFactor * scale,
    y: viewport.height * (viewport.width < 768 ? 0.54 : 0.48) - point.y * scaleFactor * scale,
    scale,
  }
}
