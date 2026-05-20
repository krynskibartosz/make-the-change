import type { HexCell } from './schema'

// ─── Hex Spiral Generation ───────────────────────────────────────────────────
// Generates hex cell coordinates in a compact spiral pattern (flat-top axial).
// The spiral grows outward ring by ring from the center (0,0), producing
// organic, circular clusters regardless of the number of cells requested.

/** Axial direction vectors for the 6 hex neighbors (flat-top). */
const AXIAL_DIRECTIONS: HexCell[] = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
]

/**
 * Generates `count` hex cells in a spiral pattern starting from the center.
 *
 * Ring 0 = center cell (0,0)
 * Ring 1 = 6 cells around center
 * Ring 2 = 12 cells around ring 1
 * Ring N = 6×N cells
 *
 * Total cells available up to ring N = 1 + 3N(N+1)
 *
 * The spiral always fills completely, so clusters look dense and organic.
 */
export function generateHexSpiral(count: number): HexCell[] {
  if (count <= 0) return []

  const cells: HexCell[] = [{ q: 0, r: 0 }]
  if (count === 1) return cells

  let ring = 1
  while (cells.length < count) {
    // Start position for this ring: move to (ring, 0) then walk the ring
    let q = ring
    let r = 0

    for (let side = 0; side < 6; side++) {
      const dir = AXIAL_DIRECTIONS[side]
      if (!dir) continue
      for (let step = 0; step < ring; step++) {
        if (cells.length >= count) return cells
        cells.push({ q, r })
        q += dir.q
        r += dir.r
      }
    }

    ring++
  }

  return cells.slice(0, count)
}

// ─── Course-to-Cell Mapping ──────────────────────────────────────────────────

/** The type of content a cell represents on the map. */
export type HexCellKind = 'module' | 'course'

/** The completion status of a cell's content. */
export type HexCellStatus = 'not-started' | 'in-progress' | 'completed'

/** A hex cell enriched with course/module metadata for rendering. */
export type MapHexCell = HexCell & {
  /** Unique ID of the course or module this cell represents. */
  contentId: string
  /** Human-readable title for deep-zoom labels. */
  title: string
  /** Whether this cell represents a guided module or a standalone course. */
  kind: HexCellKind
  /** Completion status of this cell's content. */
  status: HexCellStatus
  /** Navigation href when clicked. */
  href: string
  /** For modules: number of completed steps. */
  progressCount?: number
  /** For modules: total number of steps. */
  progressTotal?: number
}

/**
 * Maps an ordered list of content items (modules first, then courses) onto
 * a hex spiral. Modules are placed at the center (most prominent), courses
 * on the periphery.
 */
export function mapContentToHexCells(
  items: Array<{
    id: string
    title: string
    kind: HexCellKind
    status: HexCellStatus
    href: string
    progressCount?: number
    progressTotal?: number
  }>,
): MapHexCell[] {
  if (items.length === 0) return []

  // Sort: modules first (center), then courses (periphery)
  const sorted = [...items].sort((a, b) => {
    if (a.kind === 'module' && b.kind !== 'module') return -1
    if (a.kind !== 'module' && b.kind === 'module') return 1
    return 0
  })

  const spiralCells = generateHexSpiral(sorted.length)

  return sorted.map((item, index) => {
    const cell = spiralCells[index]!
    return {
      q: cell.q,
      r: cell.r,
      contentId: item.id,
      title: item.title,
      kind: item.kind,
      status: item.status,
      href: item.href,
      progressCount: item.progressCount,
      progressTotal: item.progressTotal,
    }
  })
}
