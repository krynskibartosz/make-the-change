/**
 * Mathématiques hexagonales — flat-top
 * Coordonnées axiales (q, r) → pixels (x, y)
 *
 * Réf: https://www.redblobgames.com/grids/hexagons/
 */

export const HEX_SIZE = 44 // rayon (centre → coin)

export type HexCoord = { q: number; r: number }
export type Pixel = { x: number; y: number }

const SQRT3 = Math.sqrt(3)

/** Largeur totale d'un hex flat-top */
export const HEX_WIDTH = 2 * HEX_SIZE
/** Hauteur totale d'un hex flat-top */
export const HEX_HEIGHT = SQRT3 * HEX_SIZE

/** Axial (q, r) → centre pixel (flat-top) */
export function axialToPixel(q: number, r: number): Pixel {
  const x = HEX_SIZE * (3 / 2) * q
  const y = HEX_SIZE * SQRT3 * (r + q / 2)
  return { x, y }
}

/** Renvoie les 6 coins d'un hex centré en (cx, cy), au format SVG points */
export function hexCorners(cx: number, cy: number, size: number = HEX_SIZE): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i) // flat-top: 0°, 60°, 120°, ...
    const x = cx + size * Math.cos(angle)
    const y = cy + size * Math.sin(angle)
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return pts.join(' ')
}

/** Voisins axiaux directs (6) */
export const AXIAL_DIRECTIONS: HexCoord[] = [
  { q: +1, r: 0 },
  { q: +1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: +1 },
  { q: 0, r: +1 },
]

export function neighbors(q: number, r: number): HexCoord[] {
  return AXIAL_DIRECTIONS.map((d) => ({ q: q + d.q, r: r + d.r }))
}

/** Bounding box pixel d'un ensemble de hexes (utile pour viewBox SVG) */
export function computeBoundingBox(coords: HexCoord[]): {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
} {
  if (coords.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 }
  }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const { q, r } of coords) {
    const { x, y } = axialToPixel(q, r)
    if (x - HEX_SIZE < minX) minX = x - HEX_SIZE
    if (x + HEX_SIZE > maxX) maxX = x + HEX_SIZE
    if (y - HEX_HEIGHT / 2 < minY) minY = y - HEX_HEIGHT / 2
    if (y + HEX_HEIGHT / 2 > maxY) maxY = y + HEX_HEIGHT / 2
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
}

/** Translate axial coords par un offset (utile pour positionner une île) */
export function translateAxial(coords: HexCoord[], dq: number, dr: number): HexCoord[] {
  return coords.map(({ q, r }) => ({ q: q + dq, r: r + dr }))
}
