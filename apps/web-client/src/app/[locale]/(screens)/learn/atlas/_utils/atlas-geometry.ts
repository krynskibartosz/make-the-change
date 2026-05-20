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
export function getCameraConstraints(
  viewport: { width: number; height: number },
  mapWidth: number,
): AtlasCameraConstraints {
  const isMobile = viewport.width < 768
  const mapHeight = mapWidth * (ARTBOARD_HEIGHT / ARTBOARD_WIDTH)
  
  // The procedurally generated hex islands have a large radius (up to ~15% of map width).
  // With centers from X=23% to 77%, the edges span roughly X=8% to 92% (width 84%).
  // Y centers from 24% to 78%, edges span roughly Y=11% to 91% (height 80%).
  const islandsWidth = mapWidth * 0.84
  const islandsHeight = mapHeight * 0.80 // 80% vertically

  // We leave some padding (using 90% of screen width, 70% of screen height due to top/bottom UI)
  const scaleX = (viewport.width * 0.90) / islandsWidth
  const scaleY = (viewport.height * 0.70) / islandsHeight
  
  // minScale should be exactly what's needed to fit the bounding box
  const minScale = Math.min(scaleX, scaleY)

  return {
    minScale,
    maxScale: isMobile ? 3.5 : 3.2,
    overscroll: isMobile ? 24 : 48,
  }
}

/** Returns the camera state that fits the entire world map in view. */
export function getWorldTransform(
  viewport: { width: number; height: number },
  mapWidth: number,
): AtlasCameraState {
  const constraints = getCameraConstraints(viewport, mapWidth)
  const scale = constraints.minScale
  const mapHeight = mapWidth * (ARTBOARD_HEIGHT / ARTBOARD_WIDTH)
  
  // Center of the archipelago bounding box (X spans ~23 to ~77, Y spans ~24 to ~78)
  const centerX = 0.50
  const centerY = 0.51
  
  return {
    x: viewport.width / 2 - (mapWidth * centerX) * scale,
    y: viewport.height / 2 - (mapHeight * centerY) * scale,
    scale,
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
