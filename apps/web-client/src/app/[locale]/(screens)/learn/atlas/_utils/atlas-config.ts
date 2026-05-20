/**
 * Atlas rendering and interaction constants.
 * Single source of truth — imported by geometry utils, hooks, and components.
 */

// ─── SVG coordinate space ────────────────────────────────────────────────────

export const ARTBOARD_WIDTH = 1000
export const ARTBOARD_HEIGHT = 1400

// ─── Hex grid ────────────────────────────────────────────────────────────────

export const HEX_RADIUS = 27
export const SUBDOMAIN_HEX_RADIUS = 20
export const SQRT_3 = Math.sqrt(3)

/**
 * Hex angle offsets — precomputed at module load.
 * Avoids 6 Math.cos/sin calls per cell per render.
 */
export const HEX_ANGLE_OFFSETS = Array.from({ length: 6 }, (_, i) => ({
  cos: Math.cos((Math.PI / 3) * i),
  sin: Math.sin((Math.PI / 3) * i),
}))

// ─── Scale thresholds ────────────────────────────────────────────────────────

/** Minimum zoom to show subdomain hex shapes. */
export const SUBDOMAIN_VISIBLE_SCALE = 1.1

/** Minimum zoom to show subdomain text labels. */
export const SUBDOMAIN_LABEL_SCALE = 1.35

// ─── Auto-view thresholds ────────────────────────────────────────────────────

/** Below this scale the camera is considered "world view" (no territory selected). */
export const WORLD_AUTO_SCALE = 0.9

/** Above this scale the camera auto-selects the nearest territory. */
export const DETAIL_AUTO_SCALE = 1.48

/** Max artboard distance (in px) between camera center and a territory to trigger auto-select. */
export const DETAIL_AUTO_RADIUS = 230

// ─── Interaction physics ─────────────────────────────────────────────────────

/** Pixel threshold beyond which a pointer move is no longer considered a tap. */
export const TAP_MOVEMENT_THRESHOLD = 8

/** Per-frame velocity decay factor for the momentum (inertia) scroll. */
export const MOMENTUM_DECAY = 0.965

/** Velocity below which momentum is considered stopped. */
export const MOMENTUM_MIN_PX_PER_FRAME = 0.5

/** Milliseconds of wheel inactivity before the interaction state is reset. */
export const WHEEL_IDLE_MS = 150
