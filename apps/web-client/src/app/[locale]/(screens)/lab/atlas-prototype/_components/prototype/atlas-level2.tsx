// @ts-nocheck
// biome-ignore-all lint: Isolated Claude Design prototype kept close to the handoff for mobile lab testing.
import * as React from 'react'
import { AtlasBackground } from './atlas-background'

// Atlas Niveau 2 — Relations du vivant
// 7 sous-domaines : 6 en hex-flower autour de Chaînes alimentaires.
// Geometry uses shared vertices/edges so cells are exactly jointive.

// ── Geometry ─────────────────────────────────────────────────
const L2_VERTICES = {
  V_PS: [190, 24],
  V_SCom: [358, 132],
  V_ComDe: [358, 438],
  V_DeCo: [190, 546],
  V_CoCe: [22, 438],
  V_CeP: [22, 132],
  // Inner Y-junctions (between two outer cells + the central cell).
  // Tuned so side cells AND central cell all have usable label width.
  J_PS: [190, 196],
  J_SCom: [240, 240],
  J_ComDe: [240, 336],
  J_DeCo: [190, 380],
  J_CoCe: [140, 336],
  J_CeP: [140, 240],
}
const L2_JUNCTIONS = ['J_PS', 'J_SCom', 'J_ComDe', 'J_DeCo', 'J_CoCe', 'J_CeP']
const L2_OUTER_RING = ['V_PS', 'V_SCom', 'V_ComDe', 'V_DeCo', 'V_CoCe', 'V_CeP']

// ── Sub-domains ──────────────────────────────────────────────
export const SUBDOMAINS = [
  {
    id: 'pollinisation',
    name: 'Pollinisation',
    progress: [4, 12],
    color: '#7ab84a',
    dark: '#19260c',
    texture: '/lab/atlas-prototype/assets/tex_solutions.webp',
    textureOpacity: 0.78,
    tintOpacity: 0.26,
    darken: 0.16,
    icon: 'flower',
    iconXY: [115, 88],
    labelXY: [115, 145],
    progXY: [115, 180],
    labelRX: 70,
    labelRY: 30,
    vertices: ['V_CeP', 'V_PS', 'J_PS', 'J_CeP'],
  },
  {
    id: 'symbiose',
    name: 'Symbiose',
    progress: [2, 10],
    color: '#4ebaa9',
    dark: '#0a2a28',
    texture: '/lab/atlas-prototype/assets/tex_alphabet.webp',
    textureOpacity: 0.72,
    tintOpacity: 0.3,
    darken: 0.22,
    icon: 'leaves',
    iconXY: [265, 88],
    labelXY: [265, 145],
    progXY: [265, 180],
    labelRX: 56,
    labelRY: 30,
    vertices: ['V_PS', 'V_SCom', 'J_SCom', 'J_PS'],
  },
  {
    id: 'communication',
    name: 'Communication',
    progress: [0, 9],
    color: '#9b6dd4',
    dark: '#1a0e2a',
    texture: '/lab/atlas-prototype/assets/atlas_bg.webp',
    textureOpacity: 0.55,
    tintOpacity: 0.55,
    darken: 0.22,
    icon: 'wave',
    iconXY: [300, 248],
    labelXY: [300, 292],
    progXY: [300, 322],
    labelRX: 60,
    labelRY: 30,
    vertices: ['V_SCom', 'V_ComDe', 'J_ComDe', 'J_SCom'],
  },
  {
    id: 'decomposition',
    name: 'Décomposition',
    progress: [2, 7],
    color: '#7a8aa8',
    dark: '#15192a',
    texture: '/lab/atlas-prototype/assets/tex_impact.webp',
    textureOpacity: 0.85,
    tintOpacity: 0.2,
    darken: 0.14,
    icon: 'mushroom',
    iconXY: [256, 402],
    labelXY: [256, 452],
    progXY: [256, 486],
    labelRX: 70,
    labelRY: 30,
    vertices: ['V_ComDe', 'V_DeCo', 'J_DeCo', 'J_ComDe'],
  },
  {
    id: 'cooperation',
    name: 'Coopération',
    progress: [3, 11],
    color: '#d97a3a',
    dark: '#2c1408',
    texture: '/lab/atlas-prototype/assets/tex_menaces.webp',
    textureOpacity: 0.62,
    tintOpacity: 0.34,
    darken: 0.22,
    icon: 'heart',
    iconXY: [124, 402],
    labelXY: [124, 452],
    progXY: [124, 486],
    labelRX: 60,
    labelRY: 30,
    vertices: ['V_DeCo', 'V_CoCe', 'J_CoCe', 'J_DeCo'],
  },
  {
    id: 'competition',
    name: 'Compétition',
    progress: [1, 8],
    color: '#4d8be0',
    dark: '#091a32',
    texture: '/lab/atlas-prototype/assets/tex_milieux.webp',
    textureOpacity: 0.82,
    tintOpacity: 0.28,
    darken: 0.14,
    icon: 'swords',
    iconXY: [80, 248],
    labelXY: [80, 292],
    progXY: [80, 322],
    labelRX: 58,
    labelRY: 30,
    vertices: ['V_CoCe', 'V_CeP', 'J_CeP', 'J_CoCe'],
  },
  {
    id: 'chaines',
    name: 'Chaînes',
    name2: 'alimentaires',
    progress: [5, 14],
    color: '#e6ad44',
    dark: '#2d1f08',
    texture: '/lab/atlas-prototype/assets/tex_relations.webp',
    textureOpacity: 0.78,
    tintOpacity: 0.22,
    darken: 0.24,
    central: true,
    icon: 'link',
    iconXY: [190, 226],
    labelXY: [190, 278],
    label2XY: [190, 296],
    progXY: [190, 338],
    labelRX: 56,
    labelRY: 38,
    vertices: ['J_PS', 'J_SCom', 'J_ComDe', 'J_DeCo', 'J_CoCe', 'J_CeP'],
  },
]

// ── Shared edge / path helpers (same algo as L1) ─────────────
function _hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
function _mulberry(seed) {
  let t = (seed + 0x6d2b79f5) >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function buildL2Edges(segments = 7, amplitude = 7) {
  const edges = new Map()
  for (const c of SUBDOMAINS) {
    const vs = c.vertices
    for (let i = 0; i < vs.length; i++) {
      const ka = vs[i],
        kb = vs[(i + 1) % vs.length]
      const [lo, hi] = ka < kb ? [ka, kb] : [kb, ka]
      const key = `${lo}|${hi}`
      if (edges.has(key)) continue
      const p0 = L2_VERTICES[lo],
        p1 = L2_VERTICES[hi]
      const dx = p1[0] - p0[0],
        dy = p1[1] - p0[1]
      const len = Math.hypot(dx, dy) || 1
      const nx = -dy / len,
        ny = dx / len
      const tx = dx / len,
        ty = dy / len
      const seed = _hash(key)
      const isOuter = lo.startsWith('V_') && hi.startsWith('V_')
      const amp = isOuter ? amplitude * 0.95 : amplitude * 0.85
      const interior = []
      for (let j = 1; j < segments; j++) {
        const tt = j / segments
        const skew = _mulberry(seed * 7919) * 0.3 - 0.15
        const env = Math.sin((tt + skew * Math.sin(tt * Math.PI)) * Math.PI)
        const r1 = _mulberry(seed * 1000 + j * 17)
        const r2 = _mulberry(seed * 2003 + j * 31)
        const r3 = _mulberry(seed * 3019 + j * 13)
        const noise = (r1 - 0.5) * 2 * amp * env + (r3 - 0.5) * 0.18 * amp * env
        const tj = (r2 - 0.5) * 0.4 * amp * env
        interior.push([
          p0[0] + dx * tt + nx * noise + tx * tj,
          p0[1] + dy * tt + ny * noise + ty * tj,
        ])
      }
      edges.set(key, interior)
    }
  }
  return edges
}

function _cellPoints(cell, edges, vmap) {
  const vs = cell.vertices
  const out = []
  for (let i = 0; i < vs.length; i++) {
    const ka = vs[i],
      kb = vs[(i + 1) % vs.length]
    out.push(vmap[ka])
    const [lo, hi] = ka < kb ? [ka, kb] : [kb, ka]
    const interior = edges.get(`${lo}|${hi}`)
    if (!interior) continue
    if (ka < kb) out.push(...interior)
    else for (let j = interior.length - 1; j >= 0; j--) out.push(interior[j])
  }
  return out
}

function _smoothClosed(pts) {
  const n = pts.length
  if (n < 3) return ''
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const start = mid(pts[n - 1], pts[0])
  let d = `M ${start[0].toFixed(2)} ${start[1].toFixed(2)} `
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const m = mid(p, pts[(i + 1) % n])
    d += `Q ${p[0].toFixed(2)} ${p[1].toFixed(2)} ${m[0].toFixed(2)} ${m[1].toFixed(2)} `
  }
  return d + 'Z'
}

function _envelopePts(edges) {
  const out = []
  for (let i = 0; i < L2_OUTER_RING.length; i++) {
    const ka = L2_OUTER_RING[i]
    const kb = L2_OUTER_RING[(i + 1) % L2_OUTER_RING.length]
    out.push(L2_VERTICES[ka])
    const [lo, hi] = ka < kb ? [ka, kb] : [kb, ka]
    const interior = edges.get(`${lo}|${hi}`)
    if (!interior) continue
    if (ka < kb) out.push(...interior)
    else for (let j = interior.length - 1; j >= 0; j--) out.push(interior[j])
  }
  return out
}

function _bbox(pts) {
  let xmin = Infinity,
    ymin = Infinity,
    xmax = -Infinity,
    ymax = -Infinity
  for (const [x, y] of pts) {
    if (x < xmin) xmin = x
    if (y < ymin) ymin = y
    if (x > xmax) xmax = x
    if (y > ymax) ymax = y
  }
  return { x: xmin, y: ymin, w: xmax - xmin, h: ymax - ymin }
}

// ── Icons ────────────────────────────────────────────────────
function SubdomainIcon({ kind, size = 22, color = '#f4ecd8' }) {
  const s = size
  switch (kind) {
    case 'flower':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <circle cx="12" cy="5.5" r="2.8" />
          <circle cx="12" cy="18.5" r="2.8" />
          <circle cx="5.5" cy="12" r="2.8" />
          <circle cx="18.5" cy="12" r="2.8" />
          <circle cx="7.5" cy="7.5" r="2.2" />
          <circle cx="16.5" cy="7.5" r="2.2" />
          <circle cx="7.5" cy="16.5" r="2.2" />
          <circle cx="16.5" cy="16.5" r="2.2" />
          <circle cx="12" cy="12" r="2" fill="#19260c" />
        </svg>
      )
    case 'leaves':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M3 14 C 3 8, 8 4, 13 4 C 13 9, 9 14, 3 14 Z" />
          <path d="M21 18 C 21 13, 17 9, 12 9 C 12 13, 15 18, 21 18 Z" opacity="0.75" />
        </svg>
      )
    case 'wave':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <path d="M8.5 12 a 3.5 3.5 0 0 1 7 0" />
          <path d="M5.5 12 a 6.5 6.5 0 0 1 13 0" />
          <path d="M3 12 a 9 9 0 0 1 18 0" />
        </svg>
      )
    case 'mushroom':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M4 12 a 8 6 0 0 1 16 0 v 1 H 4 Z" />
          <rect x="10" y="13" width="4" height="7" rx="1.2" />
          <circle cx="9" cy="10" r="1.2" fill="#15192a" />
          <circle cx="14" cy="9" r="1" fill="#15192a" />
        </svg>
      )
    case 'heart':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M12 20 C 4 14, 4 8, 8 7 C 10 6.5, 11.5 7.5, 12 9 C 12.5 7.5, 14 6.5, 16 7 C 20 8, 20 14, 12 20 Z" />
        </svg>
      )
    case 'swords':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4 L 13 13 L 11 15 L 3 15 V 7 Z" fill={color} stroke="none" />
          <path d="M20 4 L 11 13 L 13 15 L 21 15 V 7 Z" fill={color} stroke="none" />
          <path d="M10 16 L 14 20" />
          <path d="M14 16 L 10 20" />
        </svg>
      )
    case 'link':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 8 a 4 4 0 0 0 0 8 h 2" />
          <path d="M14 8 h 2 a 4 4 0 0 1 0 8 h -2" />
          <path d="M9 12 h 6" />
        </svg>
      )
    default:
      return null
  }
}

// ── Carte ────────────────────────────────────────────────────
function SubdomainCarte({ onPick, glow = 1, animate = true }) {
  const [pressed, setPressed] = React.useState(null)

  const { cellPaths, cellPts, envelopePath } = React.useMemo(() => {
    const edges = buildL2Edges()
    const cellPaths = {},
      cellPts = {}
    for (const c of SUBDOMAINS) {
      const pts = _cellPoints(c, edges, L2_VERTICES)
      cellPts[c.id] = pts
      cellPaths[c.id] = _smoothClosed(pts)
    }
    const envelopePath = _smoothClosed(_envelopePts(edges))
    return { cellPaths, cellPts, envelopePath }
  }, [])

  // Render central last so its content sits cleanly on top of borders.
  const ordered = [...SUBDOMAINS].sort((a, b) => (a.central ? 1 : 0) - (b.central ? 1 : 0))

  return (
    <svg
      viewBox="0 0 380 570"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', isolation: 'isolate' }}
    >
      <defs>
        {SUBDOMAINS.map((c) => (
          <clipPath key={c.id} id={`l2-clip-${c.id}`}>
            <path d={cellPaths[c.id]} />
          </clipPath>
        ))}
        {SUBDOMAINS.map((c) => (
          <radialGradient key={c.id + '-edge'} id={`l2-edge-${c.id}`} cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.78" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.30" />
          </radialGradient>
        ))}
        <filter id="l2CellGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={2.2 * glow} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="l2NodeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={2.6 * glow} />
        </filter>
        <filter id="l2LabelBlur" x="-30%" y="-50%" width="160%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Continuous dark land underlay */}
      <path d={envelopePath} fill="#0a0d10" />

      {ordered.map((c, idx) => {
        const d = cellPaths[c.id]
        const bbox = _bbox(cellPts[c.id])
        const pad = 10
        const rx = bbox.x - pad,
          ry = bbox.y - pad
        const rw = bbox.w + pad * 2,
          rh = bbox.h + pad * 2
        const isPressed = pressed === c.id
        const [ix, iy] = c.iconXY
        const [lx, ly] = c.labelXY
        const [px, py] = c.progXY
        const [done, total] = c.progress
        const ratio = total ? done / total : 0
        return (
          <g
            key={c.id}
            role="button"
            aria-label={c.name + (c.name2 ? ' ' + c.name2 : '')}
            style={{
              cursor: 'pointer',
              transition: 'transform 220ms cubic-bezier(.2,.7,.2,1)',
              transformOrigin: `${lx}px ${iy}px`,
              transform: isPressed ? 'scale(0.97)' : 'scale(1)',
            }}
            onPointerDown={() => setPressed(c.id)}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
            onClick={() => onPick && onPick(c)}
          >
            {/* outer halo */}
            <path d={d} fill={c.color} opacity={0.1 * glow} filter="url(#l2CellGlow)">
              {animate && (
                <animate
                  attributeName="opacity"
                  values={`${0.07 * glow};${0.13 * glow};${0.07 * glow}`}
                  dur={`${6 + idx * 0.5}s`}
                  repeatCount="indefinite"
                />
              )}
            </path>

            <g clipPath={`url(#l2-clip-${c.id})`} style={{ isolation: 'isolate' }}>
              <rect x={rx} y={ry} width={rw} height={rh} fill={c.dark} />
              <image
                href={c.texture}
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                preserveAspectRatio="xMidYMid slice"
                opacity={c.textureOpacity}
              />
              <image
                href={c.texture}
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                preserveAspectRatio="xMidYMid slice"
                style={{ mixBlendMode: 'soft-light' }}
                opacity={0.55}
              />
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill={c.color}
                style={{ mixBlendMode: 'soft-light' }}
                opacity={c.tintOpacity}
              />
              <rect x={rx} y={ry} width={rw} height={rh} fill={`url(#l2-edge-${c.id})`} />
              <rect x={rx} y={ry} width={rw} height={rh} fill="#000" opacity={c.darken} />
              {/* Soft radial dark wash covering icon + title + chip */}
              <ellipse
                cx={c.labelXY[0]}
                cy={(c.iconXY[1] + c.progXY[1]) / 2}
                rx={c.labelRX * 1.05}
                ry={Math.max(28, (c.progXY[1] - c.iconXY[1]) * 0.62)}
                fill="#000"
                opacity="0.38"
                filter="url(#l2LabelBlur)"
              />
            </g>

            {/* edge glow */}
            <path
              d={d}
              fill="none"
              stroke={c.color}
              strokeOpacity="0.85"
              strokeWidth="1.1"
              filter="url(#l2CellGlow)"
            />
            <path d={d} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.4" />

            {/* Content: icon + title + progress */}
            <g style={{ pointerEvents: 'none' }}>
              {/* Icon backplate — visually small, but the tap target is the whole cell. */}
              <circle
                cx={ix}
                cy={iy}
                r="18"
                fill="rgba(8,10,12,0.82)"
                stroke={c.color}
                strokeOpacity="0.78"
                strokeWidth="1"
              />
              <foreignObject x={ix - 11} y={iy - 11} width="22" height="22">
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
                >
                  <SubdomainIcon kind={c.icon} size={20} color={c.color} />
                </div>
              </foreignObject>

              {/* Title (1 or 2 lines) */}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                fill="#f6efdc"
                fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
                fontSize={c.central ? 13 : 13.5}
                fontWeight="600"
                letterSpacing="0.1"
                style={{
                  paintOrder: 'stroke',
                  stroke: 'rgba(0,0,0,0.92)',
                  strokeWidth: '3.4px',
                  strokeLinejoin: 'round',
                }}
              >
                {c.name}
              </text>
              {c.name2 && (
                <text
                  x={c.label2XY[0]}
                  y={c.label2XY[1]}
                  textAnchor="middle"
                  fill="#f6efdc"
                  fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
                  fontSize="13"
                  fontWeight="600"
                  letterSpacing="0.1"
                  style={{
                    paintOrder: 'stroke',
                    stroke: 'rgba(0,0,0,0.92)',
                    strokeWidth: '3.4px',
                    strokeLinejoin: 'round',
                  }}
                >
                  {c.name2}
                </text>
              )}

              {/* Progress chip — uniform size for all cells */}
              <g>
                <rect
                  x={px - 24}
                  y={py - 11}
                  width="48"
                  height="21"
                  rx="10.5"
                  fill="rgba(8,10,12,0.82)"
                  stroke={c.color}
                  strokeOpacity="0.55"
                  strokeWidth="0.8"
                />
                <text
                  x={px}
                  y={py + 3.5}
                  textAnchor="middle"
                  fill="#eae3d2"
                  fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
                  fontSize="11.5"
                  fontWeight="600"
                  letterSpacing="0.3"
                >
                  {done} / {total}
                </text>
              </g>
            </g>
          </g>
        )
      })}

      {/* Y-junction lit dots */}
      {L2_JUNCTIONS.map((k, i) => {
        const p = L2_VERTICES[k]
        return (
          <g key={k} style={{ pointerEvents: 'none' }}>
            <circle
              cx={p[0]}
              cy={p[1]}
              r={9 * glow}
              fill="#f4d889"
              opacity="0.30"
              filter="url(#l2NodeGlow)"
            />
            <circle
              cx={p[0]}
              cy={p[1]}
              r={5 * glow}
              fill="#f4d889"
              opacity="0.5"
              filter="url(#l2NodeGlow)"
            />
            <circle cx={p[0]} cy={p[1]} r="1.6" fill="#fff5d8" opacity="0.92" />
            {animate && (
              <circle cx={p[0]} cy={p[1]} r="1.6" fill="#fff5d8">
                <animate
                  attributeName="r"
                  values="1.6;3.2;1.6"
                  dur={`${3 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.85;0.2;0.85"
                  dur={`${3 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Full screen ──────────────────────────────────────────────
export function Level2Screen({ onBack, onPickSubdomain, animateNodes = true }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04060a',
      }}
    >
      <AtlasBackground dust={0.2} vignette={0.55} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '46px 0 14px',
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', padding: '2px 16px 0', flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <button
              onClick={onBack}
              aria-label="Retour à l'Atlas"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'rgba(20,22,24,0.55)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px) saturate(180%)',
                WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                color: '#eae3d2',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                flex: '0 0 auto',
              }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px 0' }}>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: 2.6,
                  textTransform: 'uppercase',
                  color: '#e6ad44',
                  fontWeight: 500,
                }}
              >
                Relations du vivant
              </div>
              <h1
                style={{
                  margin: '1px 0 0',
                  fontFamily: 'var(--atlas-prototype-serif), serif',
                  fontWeight: 500,
                  fontSize: 26,
                  lineHeight: 1.05,
                  color: '#f6efdc',
                  letterSpacing: '-0.3px',
                  textShadow: '0 2px 16px rgba(0,0,0,0.7)',
                }}
              >
                Sous-domaines
              </h1>
              <div
                style={{
                  margin: '2px auto 0',
                  maxWidth: 290,
                  fontSize: 11.5,
                  lineHeight: 1.35,
                  color: '#b9b09a',
                }}
              >
                Explore les liens qui unissent les espèces entre elles.
              </div>
            </div>
            <div style={{ width: 42, height: 42, flex: '0 0 auto' }} />
          </div>
        </div>

        {/* Carte — dominant element */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 2px 0',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              aspectRatio: '380 / 570',
              width: '100%',
              maxWidth: 412,
              maxHeight: '100%',
              display: 'flex',
            }}
          >
            <SubdomainCarte onPick={onPickSubdomain} animate={animateNodes} />
          </div>
        </div>
      </div>
    </div>
  )
}
