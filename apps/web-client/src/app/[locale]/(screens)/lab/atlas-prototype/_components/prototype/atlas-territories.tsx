// @ts-nocheck
// biome-ignore-all lint: Isolated Claude Design prototype kept close to the handoff for mobile lab testing.
import * as React from 'react'
import { getSvgButtonProps } from './atlas-a11y'

// Voronoi-style 6 territories with SHARED vertices and SHARED edges.
// Two adjacent cells reuse the same perturbed edge so there are no gaps.

// ── Vertex registry ────────────────────────────────────────────
// Outer boundary (clockwise) + internal 3-way junctions
export const VERTICES = {
  // outer perimeter
  OL_top: [12, 75],
  O_top_SM: [190, 30],
  OR_top: [368, 75],
  OR_mid: [378, 260],
  OR_bot: [364, 502],
  O_bot_AI: [268, 538],
  O_bot_Imid: [192, 572],
  O_bot_IM: [116, 538],
  OL_bot: [16, 502],
  OL_mid: [4, 260],
  // internal junctions (where 3 cells meet) — nudged inward to give
  // Milieux and Alphabet more breathing room and keep Relations grounded.
  J_SMR: [192, 195],
  J_SRM: [95, 268],
  J_MRA: [285, 268],
  J_MRI: [130, 452],
  J_ARI: [250, 452],
}

// ── Territories ────────────────────────────────────────────────
// `vertices` walks the boundary clockwise. Cells touching the outer
// edge use outer vertices; the central cell only uses junctions.
export const TERRITORIES = [
  {
    id: 'solutions',
    label: 'Solutions',
    lines: ['Solutions'],
    color: '#7ab84a',
    dark: '#1a2a0e',
    texture: '/lab/atlas-prototype/assets/tex_solutions.webp',
    textureOpacity: 0.8,
    tintOpacity: 0.28,
    darken: 0.1,
    iconXY: [100, 110],
    labelXY: [100, 178],
    labelRX: 78,
    labelRY: 30,
    icon: 'leaf',
    vertices: ['OL_top', 'O_top_SM', 'J_SMR', 'J_SRM', 'OL_mid'],
    stats: [
      ['Catégories', '24'],
      ['Initiatives', '186'],
      ['Près de vous', '7'],
    ],
    cta: 'Découvrir les solutions',
    desc: 'Actions concrètes pour régénérer le vivant : gestes, projets, alliances.',
  },
  {
    id: 'menaces',
    label: 'Menaces',
    lines: ['Menaces'],
    color: '#e25555',
    dark: '#2a0c0c',
    texture: '/lab/atlas-prototype/assets/tex_menaces.webp',
    textureOpacity: 0.72,
    tintOpacity: 0.22,
    darken: 0.2,
    iconXY: [282, 110],
    labelXY: [282, 178],
    labelRX: 78,
    labelRY: 30,
    icon: 'warn',
    vertices: ['O_top_SM', 'OR_top', 'OR_mid', 'J_MRA', 'J_SMR'],
    stats: [
      ['Pressions', '12'],
      ['Alertes', '34'],
      ['Suivies', '3'],
    ],
    cta: 'Lire les menaces',
    desc: 'Pressions, dégradations et risques qui pèsent sur les écosystèmes.',
  },
  {
    id: 'relations',
    label: 'Relations du vivant',
    lines: ['Relations', 'du vivant'],
    color: '#e6ad44',
    dark: '#2d1f08',
    texture: '/lab/atlas-prototype/assets/tex_relations.webp',
    textureOpacity: 0.78,
    tintOpacity: 0.2,
    darken: 0.28,
    iconXY: [191, 298],
    labelXY: [191, 376],
    labelRX: 95,
    labelRY: 40,
    big: true,
    icon: 'net',
    vertices: ['J_SMR', 'J_MRA', 'J_ARI', 'J_MRI', 'J_SRM'],
    stats: [
      ['Liens cartographiés', '4 218'],
      ['Histoires', '92'],
    ],
    cta: 'Explorer les relations',
    desc: 'Les liens invisibles qui tissent les espèces, les milieux et les saisons.',
  },
  {
    id: 'milieux',
    label: 'Milieux',
    lines: ['Milieux'],
    color: '#4d8be0',
    dark: '#091a32',
    texture: '/lab/atlas-prototype/assets/tex_milieux.webp',
    textureOpacity: 0.84,
    tintOpacity: 0.28,
    darken: 0.1,
    iconXY: [68, 358],
    labelXY: [68, 424],
    labelRX: 56,
    labelRY: 30,
    icon: 'drop',
    vertices: ['OL_mid', 'J_SRM', 'J_MRI', 'O_bot_IM', 'OL_bot'],
    stats: [
      ['Habitats', '38'],
      ['Saisons suivies', '4'],
    ],
    cta: 'Parcourir les milieux',
    desc: 'Forêts, rivières, sols et littoraux — où la vie prend racine.',
  },
  {
    id: 'alphabet',
    label: 'Alphabet du vivant',
    lines: ['Alphabet', 'du vivant'],
    color: '#4ebaa9',
    dark: '#0a2a28',
    texture: '/lab/atlas-prototype/assets/tex_alphabet.webp',
    textureOpacity: 0.72,
    tintOpacity: 0.32,
    darken: 0.22,
    iconXY: [312, 358],
    labelXY: [312, 424],
    labelRX: 64,
    labelRY: 38,
    icon: 'paw',
    vertices: ['J_MRA', 'OR_mid', 'OR_bot', 'O_bot_AI', 'J_ARI'],
    stats: [
      ['Espèces', '1 240'],
      ['Familles', '86'],
    ],
    cta: "Ouvrir l'alphabet",
    desc: "Le bestiaire et l'herbier qui composent la grammaire du monde vivant.",
  },
  {
    id: 'impact',
    label: "Lire l'impact",
    lines: ['Lire l\u2019impact'],
    color: '#a8aeb8',
    dark: '#0e1014',
    texture: '/lab/atlas-prototype/assets/tex_impact.webp',
    textureOpacity: 0.85,
    tintOpacity: 0.18,
    darken: 0.14,
    iconXY: [191, 484],
    labelXY: [191, 540],
    labelRX: 70,
    labelRY: 24,
    icon: 'gauge',
    vertices: ['J_MRI', 'J_ARI', 'O_bot_AI', 'O_bot_Imid', 'O_bot_IM'],
    stats: [
      ['Indice global', '+12 %'],
      ['Gestes ce mois', '6'],
    ],
    cta: 'Voir mon impact',
    desc: 'Visualiser votre empreinte et l\u2019effet réel de chaque geste.',
  },
]

// Internal 3-way junctions — golden dot positions
const JUNCTION_KEYS = ['J_SMR', 'J_SRM', 'J_MRA', 'J_MRI', 'J_ARI']

// ── Deterministic noise ───────────────────────────────────────
function mulberry32(seed) {
  let t = (seed + 0x6d2b79f5) >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function hashKey(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// ── Build shared edge interior points (perturbed once) ────────
// Map key = "vKeyA|vKeyB" with vKeyA < vKeyB lexicographically.
// Value = array of interior points along the edge from A→B.
function buildEdgeMap(segments = 7, amplitude = 7.5) {
  const edges = new Map()
  for (const t of TERRITORIES) {
    const vs = t.vertices
    for (let i = 0; i < vs.length; i++) {
      const ka = vs[i],
        kb = vs[(i + 1) % vs.length]
      const [lo, hi] = ka < kb ? [ka, kb] : [kb, ka]
      const key = `${lo}|${hi}`
      if (edges.has(key)) continue

      const p0 = VERTICES[lo]
      const p1 = VERTICES[hi]
      const dx = p1[0] - p0[0],
        dy = p1[1] - p0[1]
      const len = Math.hypot(dx, dy) || 1
      const nx = -dy / len,
        ny = dx / len
      const tx = dx / len,
        ty = dy / len
      const seed = hashKey(key)
      const isOuter = lo.startsWith('O') && hi.startsWith('O')
      // Outer silhouette gets a touch more irregularity; inner shared
      // boundaries stay more controlled so cells read as carved from one mass.
      const amp = isOuter ? amplitude * 1.1 : amplitude * 0.92

      const interior = []
      for (let j = 1; j < segments; j++) {
        const tt = j / segments
        const skew = mulberry32(seed * 7919) * 0.3 - 0.15
        const env = Math.sin((tt + skew * Math.sin(tt * Math.PI)) * Math.PI)
        const r1 = mulberry32(seed * 1000 + j * 17)
        const r2 = mulberry32(seed * 2003 + j * 31)
        const r3 = mulberry32(seed * 3019 + j * 13)
        const slow = (r1 - 0.5) * 2 * amp * env
        const fine = (r3 - 0.5) * 0.18 * amp * env
        const noise = slow + fine
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

// Outer envelope of the carte (clockwise). Used to draw a continuous dark
// underlay so any sub-pixel seam between cells reads as continuous land,
// never as a gap.
const OUTER_RING = [
  'OL_top',
  'O_top_SM',
  'OR_top',
  'OR_mid',
  'OR_bot',
  'O_bot_AI',
  'O_bot_Imid',
  'O_bot_IM',
  'OL_bot',
  'OL_mid',
]

function envelopePoints(edges) {
  const out = []
  for (let i = 0; i < OUTER_RING.length; i++) {
    const ka = OUTER_RING[i]
    const kb = OUTER_RING[(i + 1) % OUTER_RING.length]
    out.push(VERTICES[ka])
    const [lo, hi] = ka < kb ? [ka, kb] : [kb, ka]
    const interior = edges.get(`${lo}|${hi}`)
    if (!interior) continue
    if (ka < kb) out.push(...interior)
    else for (let j = interior.length - 1; j >= 0; j--) out.push(interior[j])
  }
  return out
}

// Walk a cell's vertices and assemble its full point list,
// using the shared edge interior points (reversed if needed).
function cellPoints(cell, edges) {
  const vs = cell.vertices
  const out = []
  for (let i = 0; i < vs.length; i++) {
    const ka = vs[i],
      kb = vs[(i + 1) % vs.length]
    out.push(VERTICES[ka])
    const [lo, hi] = ka < kb ? [ka, kb] : [kb, ka]
    const interior = edges.get(`${lo}|${hi}`)
    if (ka < kb) {
      out.push(...interior)
    } else {
      for (let j = interior.length - 1; j >= 0; j--) out.push(interior[j])
    }
  }
  return out
}

// Smooth closed path via quadratic curves through edge midpoints.
function smoothClosed(pts) {
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

function getBBox(pts) {
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

// ── Icons ──────────────────────────────────────────────────────
export function TerritoryIcon({ kind, size = 28, color = '#f4ecd8' }) {
  const s = size
  switch (kind) {
    case 'leaf':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M5 19 C 5 11, 11 5, 19 5 C 19 13, 13 19, 5 19 Z" fill={color} />
          <path
            d="M5.5 18.5 L 14 10"
            stroke="#1d3010"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'warn':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M12 4 L 21.5 20.5 H 2.5 Z" fill={color} />
          <path d="M12 10 V 14.6" stroke="#3a1212" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="12" cy="17.4" r="1" fill="#3a1212" />
        </svg>
      )
    case 'net':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="2.2" fill={color} stroke="none" />
          <circle cx="4" cy="4" r="1.6" fill={color} stroke="none" />
          <circle cx="20" cy="4" r="1.6" fill={color} stroke="none" />
          <circle cx="4" cy="20" r="1.6" fill={color} stroke="none" />
          <circle cx="20" cy="20" r="1.6" fill={color} stroke="none" />
          <path d="M5.4 5.4 L 10.4 10.4 M 18.6 5.4 L 13.6 10.4 M 5.4 18.6 L 10.4 13.6 M 18.6 18.6 L 13.6 13.6" />
        </svg>
      )
    case 'drop':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M12 3 C 7 10, 6 14, 6 16 a 6 6 0 0 0 12 0 c 0 -2 -1 -6 -6 -13 Z" fill={color} />
          <path
            d="M9 14.5 C 9 17, 10.5 18, 12 18.2"
            stroke="#0e2342"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'paw':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <ellipse cx="7" cy="9" rx="2" ry="2.6" />
          <ellipse cx="17" cy="9" rx="2" ry="2.6" />
          <ellipse cx="3.8" cy="14.6" rx="1.6" ry="2.2" />
          <ellipse cx="20.2" cy="14.6" rx="1.6" ry="2.2" />
          <path d="M12 12 C 8 12, 6 16, 7 18.5 C 8 21, 16 21, 17 18.5 C 18 16, 16 12, 12 12 Z" />
        </svg>
      )
    case 'gauge':
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
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
          <path d="M12 6 V 8.2" />
          <path d="M16.6 9.5 L 13.6 12" />
        </svg>
      )
    default:
      return null
  }
}

// ── Main carte ─────────────────────────────────────────────────
export function VoronoiAtlas({ onPick, glow = 1, animate = true, focusedId = null }) {
  const [pressed, setPressed] = React.useState(null)

  const { cellPaths, cellPts, envelopePath } = React.useMemo(() => {
    const edges = buildEdgeMap()
    const cellPaths = {}
    const cellPts = {}
    for (const t of TERRITORIES) {
      const pts = cellPoints(t, edges)
      cellPts[t.id] = pts
      cellPaths[t.id] = smoothClosed(pts)
    }
    const envelopePath = smoothClosed(envelopePoints(edges))
    return { cellPaths, cellPts, envelopePath }
  }, [])

  return (
    <svg
      viewBox="0 0 380 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', isolation: 'isolate' }}
    >
      <defs>
        {TERRITORIES.map((t) => (
          <clipPath key={t.id} id={`clip-${t.id}`}>
            <path d={cellPaths[t.id]} />
          </clipPath>
        ))}
        {TERRITORIES.map((t) => (
          <radialGradient key={t.id + '-edge'} id={`edge-${t.id}`} cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.78" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.28" />
          </radialGradient>
        ))}
        <filter id="cellGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={2.4 * glow} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={3 * glow} />
        </filter>
        <filter id="labelBlur" x="-30%" y="-50%" width="160%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Continuous dark land underlay — same outer envelope as the cells.
          Acts as a safety net so seams between cells never reveal the page background. */}
      <path d={envelopePath} fill="#0a0d10" />

      {/* Cells */}
      {TERRITORIES.map((t, idx) => {
        const d = cellPaths[t.id]
        const bbox = getBBox(cellPts[t.id])
        const pad = 14
        const rx = bbox.x - pad,
          ry = bbox.y - pad
        const rw = bbox.w + pad * 2,
          rh = bbox.h + pad * 2
        const isPressed = pressed === t.id
        const buttonProps = getSvgButtonProps(t.label, () => onPick && onPick(t))
        return (
          <g
            key={t.id}
            {...buttonProps}
            data-focus={focusedId === t.id ? '1' : undefined}
            style={{
              cursor: 'pointer',
              transition: 'transform 240ms cubic-bezier(.2,.7,.2,1)',
              transformOrigin: `${t.labelXY[0]}px ${t.iconXY[1]}px`,
              transform: isPressed ? 'scale(0.97)' : 'scale(1)',
            }}
            onPointerDown={() => setPressed(t.id)}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
          >
            {/* Outer ambient halo */}
            <path d={d} fill={t.color} opacity={0.1 * glow} filter="url(#cellGlow)">
              {animate && (
                <animate
                  attributeName="opacity"
                  values={`${0.08 * glow};${0.14 * glow};${0.08 * glow}`}
                  dur={`${6 + idx * 0.6}s`}
                  repeatCount="indefinite"
                />
              )}
            </path>

            {/* Clipped material composition */}
            <g clipPath={`url(#clip-${t.id})`} style={{ isolation: 'isolate' }}>
              <rect x={rx} y={ry} width={rw} height={rh} fill={t.dark} />
              <image
                href={t.texture}
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                preserveAspectRatio="xMidYMid slice"
                opacity={t.textureOpacity}
              />
              <image
                href={t.texture}
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
                fill={t.color}
                style={{ mixBlendMode: 'soft-light' }}
                opacity={t.tintOpacity}
              />
              <rect x={rx} y={ry} width={rw} height={rh} fill={`url(#edge-${t.id})`} />
              <rect x={rx} y={ry} width={rw} height={rh} fill="#000" opacity={t.darken} />
              <ellipse
                cx={t.labelXY[0]}
                cy={t.labelXY[1] - 2}
                rx={t.labelRX * 1.15}
                ry={t.labelRY * 1.05}
                fill="#000"
                opacity="0.30"
                filter="url(#labelBlur)"
              />
            </g>
          </g>
        )
      })}

      {/* Shared boundary strokes — drawn after all fills, once per edge.
          Because cells share the exact same path, drawing each cell's stroke
          would double-up. Instead we just draw each cell path's stroke; the
          shared geometry means strokes on neighbours overlap pixel-perfectly. */}
      {TERRITORIES.map((t) => (
        <g key={t.id + '-stroke'} style={{ pointerEvents: 'none' }}>
          <path
            d={cellPaths[t.id]}
            fill="none"
            stroke={t.color}
            strokeOpacity="0.85"
            strokeWidth="1.1"
            filter="url(#cellGlow)"
          />
          <path
            d={cellPaths[t.id]}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.18"
            strokeWidth="0.4"
          />
        </g>
      ))}

      {/* Lit golden junction nodes — softer, more diffuse */}
      {JUNCTION_KEYS.map((k, i) => {
        const p = VERTICES[k]
        return (
          <g key={k} style={{ pointerEvents: 'none' }}>
            <circle
              cx={p[0]}
              cy={p[1]}
              r={11 * glow}
              fill="#f4d889"
              opacity="0.32"
              filter="url(#nodeGlow)"
            />
            <circle
              cx={p[0]}
              cy={p[1]}
              r={6 * glow}
              fill="#f4d889"
              opacity="0.5"
              filter="url(#nodeGlow)"
            />
            <circle cx={p[0]} cy={p[1]} r="1.8" fill="#fff5d8" opacity="0.92" />
            {animate && (
              <circle cx={p[0]} cy={p[1]} r="1.8" fill="#fff5d8">
                <animate
                  attributeName="r"
                  values="1.8;3.6;1.8"
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

      {/* Icons + labels */}
      <g style={{ pointerEvents: 'none' }}>
        {TERRITORIES.map((t) => {
          const [ix, iy] = t.iconXY
          const [lx, ly] = t.labelXY
          const r = t.big ? 28 : 24
          const iconSize = t.big ? 32 : 28
          const labelSize = t.big ? 19 : 18
          return (
            <g key={t.id}>
              <circle
                cx={ix}
                cy={iy}
                r={r + 1.5}
                fill="none"
                stroke={t.color}
                strokeOpacity="0.6"
                strokeWidth="0.9"
              />
              <circle
                cx={ix}
                cy={iy}
                r={r}
                fill="rgba(8,10,12,0.78)"
                stroke={t.color}
                strokeOpacity="0.7"
                strokeWidth="0.9"
              />
              <foreignObject
                x={ix - iconSize / 2}
                y={iy - iconSize / 2}
                width={iconSize}
                height={iconSize}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
                >
                  <TerritoryIcon kind={t.icon} size={iconSize} color="#f4ecd8" />
                </div>
              </foreignObject>
              {t.lines.map((line, j) => (
                <text
                  key={j}
                  x={lx}
                  y={ly + j * (labelSize + 4)}
                  textAnchor="middle"
                  fill="#f6efdc"
                  fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
                  fontSize={labelSize}
                  fontWeight="600"
                  letterSpacing="0.2"
                  style={{
                    paintOrder: 'stroke',
                    stroke: 'rgba(0,0,0,0.9)',
                    strokeWidth: '3.6px',
                    strokeLinejoin: 'round',
                  }}
                >
                  {line}
                </text>
              ))}
            </g>
          )
        })}
      </g>
    </svg>
  )
}
