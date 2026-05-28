// @ts-nocheck
// biome-ignore-all lint: Isolated Claude Design prototype kept close to the handoff for mobile lab testing.
import * as React from 'react'
import { getSvgButtonProps, useDialogFocus } from './atlas-a11y'
import { AtlasBackground } from './atlas-background'
import { useAtlasViewportProfile } from './atlas-responsive'

// Atlas Niveau 3 — Pollinisation
// Single large organic cell containing the parcours guidé + cours libres + projet
// + biodex + toile vivante. Below the cell: legend chips, CTA, recommandés.

// ── Blob shape (one big perturbed cell) ─────────────────────────
const L3_BLOB_VERTICES = [
  [40, 80],
  [120, 38],
  [220, 32],
  [310, 70],
  [350, 160],
  [358, 270],
  [340, 380],
  [280, 460],
  [200, 510],
  [120, 488],
  [50, 430],
  [22, 320],
  [16, 200],
]

function _hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
function _mb(seed) {
  let t = (seed + 0x6d2b79f5) >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function _perturbedBlob(points, seed = 555, segments = 7, amp = 9) {
  const out = []
  const n = points.length
  for (let i = 0; i < n; i++) {
    const p0 = points[i]
    const p1 = points[(i + 1) % n]
    out.push(p0)
    const dx = p1[0] - p0[0],
      dy = p1[1] - p0[1]
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len,
      ny = dx / len
    const tx = dx / len,
      ty = dy / len
    const s = seed + i * 1009
    for (let j = 1; j < segments; j++) {
      const tt = j / segments
      const env = Math.sin(tt * Math.PI)
      const r1 = _mb(s * 1000 + j * 17)
      const r2 = _mb(s * 2003 + j * 31)
      const r3 = _mb(s * 3019 + j * 13)
      const noise = (r1 - 0.5) * 2 * amp * env + (r3 - 0.5) * 0.2 * amp * env
      const tj = (r2 - 0.5) * 0.5 * amp * env
      out.push([p0[0] + dx * tt + nx * noise + tx * tj, p0[1] + dy * tt + ny * noise + ty * tj])
    }
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

// ── Inner content layout (in SVG coords) ────────────────────────
const L3_CONTENT = {
  // Center: parcours guidé
  center: { x: 190, y: 280 },
  // Surrounding items — positions inside the blob
  items: [
    {
      id: 'course-flowers',
      type: 'course',
      label: 'COURS LIBRE',
      labelColor: '#4d8be0',
      icon: 'book',
      iconColor: '#4d8be0',
      title: ['Pourquoi les fleurs', 'attirent les insectes'],
      iconXY: [190, 132],
      titleXY: [190, 188],
    },
    {
      id: 'course-night',
      type: 'course',
      label: 'COURS LIBRE',
      labelColor: '#9b6dd4',
      icon: 'moon',
      iconColor: '#c9a4ff',
      title: ['La pollinisation', 'de nuit'],
      iconXY: [78, 235],
      titleXY: [72, 294],
    },
    {
      id: 'course-bees',
      type: 'course',
      label: 'COURS LIBRE',
      labelColor: '#4ebaa9',
      icon: 'bee',
      iconColor: '#6ad9c5',
      title: ['Abeilles sauvages', 'vs domestiques'],
      iconXY: [304, 235],
      titleXY: [308, 294],
    },
    {
      id: 'project',
      type: 'project',
      label: 'PROJET LIÉ',
      labelColor: '#7ab84a',
      icon: 'sprout',
      iconColor: '#9ad762',
      title: ['Prairie fleurie', "de l'école"],
      iconXY: [70, 360],
      titleXY: [70, 418],
    },
  ],
  biodex: {
    label: 'ESPÈCES BIODEX LIÉES',
    labelXY: [300, 356],
    species: [
      { id: 'bee', name: 'Abeille', color: '#e6ad44', dark: '#3a2a08' },
      { id: 'bumble', name: 'Bourdon', color: '#d97a3a', dark: '#3a1f08' },
      { id: 'butterfly', name: 'Papillon', color: '#4ebaa9', dark: '#0e3a36' },
    ],
    speciesY: 388,
    speciesXs: [260, 300, 340],
    nameY: 418,
    moreXY: [300, 438],
  },
  toile: {
    label: 'TOILE VIVANTE',
    labelXY: [190, 460],
    nodesY: 488,
    nodes: [
      { id: 'flower', name: 'Fleur', x: 120, color: '#a05fb3', icon: 'flower-mini' },
      { id: 'bee', name: 'Abeille', x: 170, color: '#e6ad44', icon: 'bee-mini' },
      { id: 'fruit', name: 'Fruit', x: 220, color: '#d44545', icon: 'apple' },
      { id: 'bird', name: 'Oiseau', x: 270, color: '#4d8be0', icon: 'bird' },
    ],
    nameY: 514,
  },
}

// ── Tiny icons ──────────────────────────────────────────────────
function L3Icon({ kind, size = 18, color = '#f4ecd8' }) {
  const s = size
  switch (kind) {
    case 'book':
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
          <path
            d="M4 5 a 2 2 0 0 1 2 -2 h 5 v 17 H 6 a 2 2 0 0 1 -2 -2 Z"
            fill={color}
            fillOpacity="0.18"
          />
          <path
            d="M20 5 a 2 2 0 0 0 -2 -2 h -5 v 17 h 5 a 2 2 0 0 0 2 -2 Z"
            fill={color}
            fillOpacity="0.18"
          />
          <path d="M12 4 v 16" />
        </svg>
      )
    case 'moon':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M20 14 a 8 8 0 1 1 -10 -10 a 6 6 0 0 0 10 10 Z" />
        </svg>
      )
    case 'bee':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <ellipse cx="12" cy="14" rx="6" ry="5" />
          <rect x="6" y="11" width="12" height="1.6" fill="#1a1306" />
          <rect x="6" y="14.5" width="12" height="1.6" fill="#1a1306" />
          <ellipse cx="9" cy="9" rx="3" ry="2" fill="#ffffff" opacity="0.65" />
          <ellipse cx="15" cy="9" rx="3" ry="2" fill="#ffffff" opacity="0.65" />
        </svg>
      )
    case 'sprout':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M12 21 V 12" />
          <path d="M12 12 C 12 8, 8 6, 5 7 C 5 11, 8 13, 12 12 Z" />
          <path d="M12 12 C 12 9, 15 7, 18 8 C 18 11, 15 13, 12 12 Z" opacity="0.85" />
        </svg>
      )
    case 'hex':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        >
          <polygon
            points="12,3 21,7.5 21,16.5 12,21 3,16.5 3,7.5"
            fill={color}
            fillOpacity="0.18"
          />
          <path d="M9 9 c 1 -2 5 -2 6 0 c 0 4 -6 4 -6 0 Z" fill={color} />
          <path d="M12 8 v 8" stroke={color} strokeWidth="1.2" />
          <path d="M10 12 h 4" stroke={color} strokeWidth="1.2" />
        </svg>
      )
    case 'paw':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <ellipse cx="8" cy="9" rx="1.8" ry="2.3" />
          <ellipse cx="16" cy="9" rx="1.8" ry="2.3" />
          <ellipse cx="4.5" cy="13.5" rx="1.5" ry="2" />
          <ellipse cx="19.5" cy="13.5" rx="1.5" ry="2" />
          <path d="M12 12 C 8.5 12, 7 15.5, 8 18 C 9 20, 15 20, 16 18 C 17 15.5, 15.5 12, 12 12 Z" />
        </svg>
      )
    case 'web':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="6" r="2" fill={color} stroke="none" />
          <circle cx="18" cy="6" r="2" fill={color} stroke="none" />
          <circle cx="12" cy="18" r="2" fill={color} stroke="none" />
          <path d="M7.4 7 L 11 16.5 M 16.5 7 L 13 16.5 M 8 6 H 16" />
        </svg>
      )
    case 'flower-mini':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <circle cx="12" cy="6.5" r="3" />
          <circle cx="12" cy="17.5" r="3" />
          <circle cx="6.5" cy="12" r="3" />
          <circle cx="17.5" cy="12" r="3" />
          <circle cx="12" cy="12" r="2" fill="#15071e" />
        </svg>
      )
    case 'bee-mini':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <ellipse cx="12" cy="13" rx="6" ry="5" />
          <rect x="6" y="11" width="12" height="1.4" fill="#1a1306" />
          <rect x="6" y="14" width="12" height="1.4" fill="#1a1306" />
        </svg>
      )
    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M12 8 C 8 8, 5 10, 5 14 C 5 18, 9 21, 12 21 C 15 21, 19 18, 19 14 C 19 10, 16 8, 12 8 Z" />
          <path
            d="M12 8 C 12 5, 14 4, 16 4"
            stroke="#220606"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="9" cy="11" rx="1.4" ry="1" fill="#ffffff" opacity="0.5" />
        </svg>
      )
    case 'bird':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <path d="M5 14 C 5 10, 9 8, 13 9 L 17 8 L 19 11 L 17 12 C 17 16, 13 18, 9 18 C 6 18, 5 16, 5 14 Z" />
          <circle cx="15" cy="11" r="0.8" fill="#0e1a30" />
        </svg>
      )
    case 'info':
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
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11 V 16.5 M 12 7.5 V 8.5" />
        </svg>
      )
    case 'chevron':
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
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )
    case 'arrow':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12 H 19" />
          <polyline points="14 7 19 12 14 17" />
        </svg>
      )
    default:
      return null
  }
}

// ── Big organic cell ────────────────────────────────────────────
function PollinisationCarte({ onTapItem, onTapCenter, animate = true }) {
  const blobPath = React.useMemo(() => {
    const sub = _perturbedBlob(L3_BLOB_VERTICES, 47, 8, 8)
    return _smoothClosed(sub)
  }, [])

  return (
    <svg
      viewBox="0 0 380 540"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', isolation: 'isolate' }}
    >
      <defs>
        <clipPath id="l3-blob-clip">
          <path d={blobPath} />
        </clipPath>
        <radialGradient id="l3-tint" cx="0.5" cy="0.5" r="0.65">
          <stop offset="0" stopColor="#f0c460" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#a8732a" stopOpacity="0.15" />
          <stop offset="1" stopColor="#180c00" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="l3-center-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd97a" stopOpacity="0.55" />
          <stop offset="0.4" stopColor="#e6a330" stopOpacity="0.30" />
          <stop offset="1" stopColor="#e6a330" stopOpacity="0" />
        </radialGradient>
        <filter id="l3-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="l3-strong-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="l3-soft-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Outer ambient halo */}
      <path d={blobPath} fill="#e6ad44" opacity="0.10" filter="url(#l3-glow)">
        {animate && (
          <animate
            attributeName="opacity"
            values="0.08;0.13;0.08"
            dur="6s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Blob material */}
      <g clipPath="url(#l3-blob-clip)" style={{ isolation: 'isolate' }}>
        <rect x="0" y="0" width="380" height="540" fill="#0a0d10" />
        <image
          href="/lab/atlas-prototype/assets/tex_relations.webp"
          x="-10"
          y="-10"
          width="400"
          height="560"
          preserveAspectRatio="xMidYMid slice"
          opacity="0.78"
        />
        <image
          href="/lab/atlas-prototype/assets/tex_relations.webp"
          x="-10"
          y="-10"
          width="400"
          height="560"
          preserveAspectRatio="xMidYMid slice"
          style={{ mixBlendMode: 'soft-light' }}
          opacity="0.55"
        />
        <rect x="0" y="0" width="380" height="540" fill="url(#l3-tint)" />
        <rect x="0" y="0" width="380" height="540" fill="#000" opacity="0.22" />
        {/* Subtle organic vines as decoration in lower area */}
        <image
          href="/lab/atlas-prototype/assets/tex_solutions.webp"
          x="-30"
          y="380"
          width="440"
          height="220"
          preserveAspectRatio="xMidYMid slice"
          style={{ mixBlendMode: 'overlay' }}
          opacity="0.32"
        />
        {/* Central golden glow halo */}
        <circle cx="190" cy="280" r="110" fill="url(#l3-center-glow)" />
      </g>

      {/* Glowing amber edge */}
      <path
        d={blobPath}
        fill="none"
        stroke="#f0c460"
        strokeOpacity="0.85"
        strokeWidth="1.6"
        filter="url(#l3-glow)"
      />
      <path d={blobPath} fill="none" stroke="#ffe7a3" strokeOpacity="0.4" strokeWidth="0.5" />



      {/* ─── Connection lines from periphery to center hex ─── */}
      <g style={{ pointerEvents: 'none' }}>
        {([
          { x1: 190, y1: 152, x2: 190, y2: 230 },
          { x1: 98,  y1: 235, x2: 171, y2: 241 },
          { x1: 284, y1: 235, x2: 209, y2: 241 },
          { x1: 90,  y1: 360, x2: 171, y2: 263 },
        ] as { x1: number; y1: number; x2: number; y2: number }[]).map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1}
            x2={l.x2} y2={l.y2}
            stroke="#f0c460"
            strokeOpacity="0.22"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
        ))}
      </g>

      {/* ─── Surrounding items ─── */}
      {L3_CONTENT.items.map((it) => {
        const [ix, iy] = it.iconXY
        const [tx, ty] = it.titleXY
        const buttonProps = getSvgButtonProps(it.title.join(' '), () => onTapItem && onTapItem(it))
        return (
          <g key={it.id} {...buttonProps} style={{ cursor: 'pointer' }}>
            {/* invisible enlarged tap target */}
            <rect x={ix - 50} y={iy - 28} width="100" height="100" fill="transparent" />
            {/* icon backplate */}
            <circle
              cx={ix}
              cy={iy}
              r="20"
              fill="rgba(8,10,14,0.85)"
              stroke={it.iconColor}
              strokeOpacity="0.7"
              strokeWidth="1.1"
              filter="url(#l3-glow)"
            />
            <foreignObject x={ix - 12} y={iy - 12} width="24" height="24">
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
              >
                <L3Icon kind={it.icon} size={20} color={it.iconColor} />
              </div>
            </foreignObject>
            {/* eyebrow label */}
            <text
              x={ix}
              y={iy + 32}
              textAnchor="middle"
              fill={it.labelColor}
              fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
              fontSize="10"
              fontWeight="700"
              letterSpacing="1.6"
              style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.2px' }}
            >
              {it.label}
            </text>
            {/* title (1-2 lines) */}
            {it.title.map((line, j) => (
              <text
                key={j}
                x={tx}
                y={ty + j * 16}
                textAnchor="middle"
                fill="#f6efdc"
                fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
                fontSize={it.id === 'course-flowers' ? '12.5' : '11.6'}
                fontWeight="500"
                style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.6px' }}
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}

      {/* ─── BioDex (right side) ─── */}
      <g
        {...getSvgButtonProps(
          'Espèces BioDex liées',
          () => onTapItem && onTapItem({ id: 'biodex', type: 'biodex', title: ['Espèces BioDex'] }),
        )}
        aria-hidden="true"
        style={{ cursor: 'pointer', display: 'none' }}
      >
        <rect
          x={L3_CONTENT.biodex.labelXY[0] - 70}
          y={L3_CONTENT.biodex.labelXY[1] - 12}
          width="140"
          height="18"
          rx="9"
          fill="rgba(10,12,14,0.6)"
          stroke="#e6ad44"
          strokeOpacity="0.4"
        />
        <text
          x={L3_CONTENT.biodex.labelXY[0]}
          y={L3_CONTENT.biodex.labelXY[1] + 1.5}
          textAnchor="middle"
          fill="#e6ad44"
          fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
          fontSize="10"
          fontWeight="700"
          letterSpacing="1.6"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.2px' }}
        >
          {L3_CONTENT.biodex.label}
        </text>
        {L3_CONTENT.biodex.species.map((sp, i) => {
          const cx = L3_CONTENT.biodex.speciesXs[i]
          const cy = L3_CONTENT.biodex.speciesY
          return (
            <g key={sp.id}>
              <circle
                cx={cx}
                cy={cy}
                r="16"
                fill={sp.dark}
                stroke={sp.color}
                strokeOpacity="0.8"
                strokeWidth="1.2"
              />
              <circle cx={cx} cy={cy} r="14" fill={`url(#l3-tint)`} opacity="0.55" />
              <foreignObject x={cx - 12} y={cy - 12} width="24" height="24">
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
                >
                  <L3Icon
                    kind={
                      sp.id === 'bee' ? 'bee-mini' : sp.id === 'bumble' ? 'bee-mini' : 'flower-mini'
                    }
                    size={18}
                    color={sp.color}
                  />
                </div>
              </foreignObject>
            </g>
          )
        })}
        <text
          x={L3_CONTENT.biodex.labelXY[0]}
          y={L3_CONTENT.biodex.nameY}
          textAnchor="middle"
          fill="#dbd2bb"
          fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
          fontSize="9.8"
          fontWeight="500"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.4px' }}
        >
          Abeille · Bourdon · Papillon
        </text>
        <rect
          x={L3_CONTENT.biodex.moreXY[0] - 55}
          y={L3_CONTENT.biodex.moreXY[1] - 13}
          width="110"
          height="22"
          rx="11"
          fill="rgba(240,196,96,0.12)"
          stroke="#f0c460"
          strokeOpacity="0.3"
        />
        <text
          x={L3_CONTENT.biodex.moreXY[0]}
          y={L3_CONTENT.biodex.moreXY[1] + 2}
          textAnchor="middle"
          fill="#f0c460"
          fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
          fontSize="10.5"
          fontWeight="600"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.4px' }}
        >
          Voir toutes (12) ›
        </text>
      </g>

      {/* ─── Toile vivante (bottom) ─── */}
      <g aria-hidden="true" style={{ display: 'none' }}>
        <rect
          x={L3_CONTENT.toile.labelXY[0] - 60}
          y={L3_CONTENT.toile.labelXY[1] - 12}
          width="120"
          height="18"
          rx="9"
          fill="rgba(10,12,14,0.6)"
          stroke="#f0c460"
          strokeOpacity="0.4"
        />
        <text
          x={L3_CONTENT.toile.labelXY[0]}
          y={L3_CONTENT.toile.labelXY[1] + 2}
          textAnchor="middle"
          fill="#f0c460"
          fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
          fontSize="10.5"
          fontWeight="700"
          letterSpacing="1.6"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.2px' }}
        >
          {L3_CONTENT.toile.label}
        </text>
        {L3_CONTENT.toile.nodes.map((node, i) => (
          <g
            key={node.id}
            {...getSvgButtonProps(
              `Nœud ${node.name}`,
              () =>
                onTapItem &&
                onTapItem({
                  id: 'toile-' + node.id,
                  type: 'toile',
                  title: [`Nœud "${node.name}"`],
                }),
            )}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={node.x}
              cy={L3_CONTENT.toile.nodesY}
              r="13"
              fill="rgba(8,10,14,0.85)"
              stroke={node.color}
              strokeOpacity="0.85"
              strokeWidth="1.1"
            />
            <foreignObject x={node.x - 9} y={L3_CONTENT.toile.nodesY - 9} width="18" height="18">
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
              >
                <L3Icon kind={node.icon} size={14} color={node.color} />
              </div>
            </foreignObject>
            <text
              x={node.x}
              y={L3_CONTENT.toile.nameY}
              textAnchor="middle"
              fill="#dbd2bb"
              fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
              fontSize="10.5"
              fontWeight="500"
              style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.2px' }}
            >
              {node.name}
            </text>
            {i < L3_CONTENT.toile.nodes.length - 1 && (
              <g>
                <path
                  d={`M ${node.x + 14} ${L3_CONTENT.toile.nodesY} L ${L3_CONTENT.toile.nodes[i + 1].x - 14} ${L3_CONTENT.toile.nodesY}`}
                  stroke="#dbd2bb"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  fill="none"
                  markerEnd="url(#arrowtip)"
                />
              </g>
            )}
          </g>
        ))}
        {/* Define arrow head */}
        <defs>
          <marker
            id="arrowtip"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 5 L 0 10 Z" fill="#dbd2bb" opacity="0.6" />
          </marker>
        </defs>
      </g>

      {/* ─── Central Parcours Guidé (last, on top) ─── */}
      <g
        {...getSvgButtonProps(
          'Parcours guidé : Le rôle des pollinisateurs',
          () => onTapCenter && onTapCenter(),
        )}
        style={{ cursor: 'pointer' }}
      >
        {/* halo */}
        <circle
          cx="190"
          cy="280"
          r="62"
          fill="#f0c460"
          opacity="0.18"
          filter="url(#l3-strong-glow)"
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.16;0.28;0.16"
              dur="4s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        {/* hex badge */}
        <g transform="translate(190 252)">
          <polygon
            points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
            fill="rgba(10,12,14,0.85)"
            stroke="#f0c460"
            strokeOpacity="0.9"
            strokeWidth="1.2"
          />
          <g transform="translate(-10 -10)">
            <L3Icon kind="hex" size={20} color="#f0c460" />
          </g>
        </g>
        {/* PARCOURS GUIDÉ label */}
        <text
          x="190"
          y="292"
          textAnchor="middle"
          fill="#f0c460"
          fontFamily="var(--atlas-prototype-sans), Inter, system-ui, sans-serif"
          fontSize="10"
          fontWeight="700"
          letterSpacing="2"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '2.4px' }}
        >
          PARCOURS GUIDÉ
        </text>
        {/* Title */}
        <text
          x="190"
          y="312"
          textAnchor="middle"
          fill="#f6efdc"
          fontFamily="var(--atlas-prototype-serif), 'Cormorant Garamond', serif"
          fontSize="18.5"
          fontWeight="500"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '3px' }}
        >
          Le rôle des
        </text>
        <text
          x="190"
          y="334"
          textAnchor="middle"
          fill="#f6efdc"
          fontFamily="var(--atlas-prototype-serif), 'Cormorant Garamond', serif"
          fontSize="18.5"
          fontWeight="500"
          style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.85)', strokeWidth: '3px' }}
        >
          pollinisateurs
        </text>
      </g>
    </svg>
  )
}

// ── Small "preview" sheet ───────────────────────────────────────
function PreviewSheet({ item, onClose }) {
  const open = !!item
  const dialogRef = useDialogFocus(open, onClose)
  const [last, setLast] = React.useState(item)
  React.useEffect(() => {
    if (item) setLast(item)
  }, [item])
  const c = item || last

  const TYPE_META = {
    course: {
      label: 'COURS LIBRE',
      color: '#4d8be0',
      cta: 'Disponible prochainement',
      body: 'Un format court pour approfondir ce point sans quitter le thème Pollinisation.',
      facts: ['Lecture guidée', '20 à 30 min', 'Relié aux espèces BioDex'],
    },
    project: {
      label: 'PROJET LIÉ',
      color: '#7ab84a',
      cta: 'Disponible prochainement',
      body: 'Un passage vers une action concrète liée au terrain et aux pollinisateurs.',
      facts: ['Action locale', 'Impact visible', 'Lien avec les partenaires'],
    },
    biodex: {
      label: 'ESPÈCES BIODEX',
      color: '#e6ad44',
      cta: 'Disponible prochainement',
      body: 'Les espèces associées à ce thème, avec leurs rôles dans la pollinisation.',
      facts: ['Abeille', 'Bourdon', 'Papillon'],
    },
    toile: {
      label: 'TOILE VIVANTE',
      color: '#a05fb3',
      cta: 'Disponible prochainement',
      body: 'Une lecture simple des liens entre fleur, insecte, fruit et autres espèces.',
      facts: ['Fleur', 'Abeille', 'Fruit'],
    },
    parcours: {
      label: 'PARCOURS GUIDÉ',
      color: '#f0c460',
      cta: 'Disponible prochainement',
      body: 'Le chemin principal du thème. Il explique le rôle des pollinisateurs et pourquoi leur disparition change tout.',
      facts: ['Parcours principal', '6 contenus explorés sur 18', '33 % du thème découvert'],
    },
    reco: {
      label: 'RECOMMANDÉ',
      color: '#f0c460',
      cta: 'Disponible prochainement',
      body: 'Des contenus conseilles pour continuer sans chercher.',
      facts: ['Selection personnalisee', 'Cours et projets', 'A ouvrir plus tard'],
    },
    info: {
      label: 'À PROPOS',
      color: '#f0c460',
      cta: 'Fermer',
      body: 'Pollinisation rassemble le parcours principal, quelques cours libres et des liens vers les espèces concernées.',
      facts: ['Thème ouvert', '6 contenus explorés sur 18', 'Cours, projet, BioDex'],
    },
  }
  const meta = c ? TYPE_META[c.type] || TYPE_META.course : TYPE_META.course
  const title = c ? (Array.isArray(c.title) ? c.title.join(' ') : c.title) : ''

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 260ms ease',
          zIndex: 60,
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby="atlas-preview-title"
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          transform: open ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 360ms cubic-bezier(.2,.7,.2,1)',
        }}
      >
        {c && (
          <div
            style={{
              margin: '0 8px 8px',
              background: 'linear-gradient(180deg, #1a1d20 0%, #0f1113 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 24,
              padding: '14px 22px 26px',
              color: '#eae3d2',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.55)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <div
                style={{
                  width: 46,
                  height: 4,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.18)',
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: 2,
                color: meta.color,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {meta.label}
            </div>
            <div
              id="atlas-preview-title"
              style={{
                fontFamily: 'var(--atlas-prototype-serif), serif',
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.15,
                color: '#f6efdc',
                marginBottom: 12,
              }}
            >
              {title}
            </div>
            <p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.5, color: '#cfc8b5' }}>
              {c.body || meta.body}
            </p>
            {meta.facts && (
              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                {meta.facts.map((fact) => (
                  <div
                    key={fact}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12.5,
                      color: '#d8cfae',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: meta.color,
                        boxShadow: `0 0 10px ${meta.color}88`,
                      }}
                    />
                    {fact}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={meta.cta === 'Fermer' ? onClose : undefined}
              disabled={meta.cta !== 'Fermer'}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 9999,
                border: 'none',
                cursor: meta.cta === 'Fermer' ? 'pointer' : 'default',
                background: 'linear-gradient(180deg, #f4ecd8, #d9cfb0)',
                color: '#1c1a14',
                opacity: meta.cta === 'Fermer' ? 1 : 0.92,
                fontWeight: 600,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${meta.color}44`,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1c1a14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {meta.cta}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── Level 3 screen ──────────────────────────────────────────────
export function Level3Screen({
  onBack,
  subdomain = { name: 'Pollinisation' },
  animateNodes = true,
}) {
  const viewport = useAtlasViewportProfile()
  const [preview, setPreview] = React.useState(null)
  const navButtonSize = viewport.isNarrow ? 38 : 42
  const progressRingSize = viewport.isCompact ? 34 : 42

  const startGuide = () =>
    setPreview({
      type: 'parcours',
      title: ['Le rôle des pollinisateurs'],
    })

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
      <AtlasBackground dust={0.18} vignette={0.55} />

      {/* Map layer (full screen overlay) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: viewport.isShort ? 210 : 230,
          paddingTop: viewport.isShort ? 112 : 122,
        }}
      >
        <div
          style={{
            width: viewport.isNarrow ? '94%' : '92%',
            maxWidth: 430,
            aspectRatio: '380 / 540',
            transform: 'scale(0.96)',
          }}
        >
          <PollinisationCarte
            onTapItem={(it) => setPreview(it)}
            onTapCenter={startGuide}
            animate={animateNodes}
          />
        </div>
      </div>

      {/* Top overlay (Header + Progress) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: 'none',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          background: 'linear-gradient(180deg, rgba(4,6,10,0.85) 0%, rgba(4,6,10,0) 100%)',
        }}
      >
        <div style={{ padding: '0 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <button
            onClick={onBack}
            aria-label="Retour"
            style={{
              width: navButtonSize,
              height: navButtonSize,
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
              pointerEvents: 'auto',
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
            <div style={{ fontSize: viewport.isNarrow ? 9.5 : 10.5, letterSpacing: viewport.isNarrow ? 2 : 2.6, textTransform: 'uppercase', color: '#e6ad44', fontWeight: 500, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Relations du vivant
            </div>
            <h1 style={{ margin: '1px 0 0', fontFamily: 'var(--atlas-prototype-serif), serif', fontWeight: 500, fontSize: viewport.isNarrow ? 27 : 30, lineHeight: 1.05, color: '#f6efdc', letterSpacing: '-0.3px', textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
              {subdomain.name}
            </h1>
          </div>

          <button
            aria-label="Informations"
            onClick={() => setPreview({ type: 'info', title: ['À propos de Pollinisation'] })}
            style={{
              width: navButtonSize,
              height: navButtonSize,
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
              pointerEvents: 'auto',
            }}
          >
            <L3Icon kind="info" size={18} color="#eae3d2" />
          </button>
        </div>

        <div style={{ padding: '16px 16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(10,12,14,0.72)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9999, padding: '6px 14px 6px 6px', boxShadow: '0 6px 20px rgba(0,0,0,0.4)', pointerEvents: 'auto' }}>
            <div style={{ position: 'relative', width: progressRingSize, height: progressRingSize }}>
              <svg width={progressRingSize} height={progressRingSize} viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <circle cx="21" cy="21" r="17" fill="none" stroke="#f0c460" strokeWidth="3" strokeDasharray={`${2 * Math.PI * 17 * 0.33} ${2 * Math.PI * 17}`} strokeLinecap="round" transform="rotate(-90 21 21)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, color: '#f6efdc' }}>
              <div style={{ lineHeight: 1 }}>6/18</div>
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, color: '#9a937f', lineHeight: 1.2 }}>Thème découvert</div>
              <div style={{ fontSize: 12.5, color: '#f0c460', fontWeight: 700, marginTop: 1 }}>33 %</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom overlay (Recommandé) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: 'none',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
          paddingTop: 56,
          background: 'linear-gradient(0deg, rgba(4,6,10,0.95) 0%, rgba(4,6,10,0.6) 60%, rgba(4,6,10,0) 100%)',
        }}
      >
        <div
          style={{
            padding: '0 16px 12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={() => setPreview({ type: 'biodex', title: ['Espèces liées'] })}
            style={{
              border: '1px solid rgba(230,173,68,0.28)',
              background: 'rgba(10,12,14,0.72)',
              color: '#eae3d2',
              borderRadius: 14,
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 9, color: '#e6ad44', letterSpacing: 1.2, fontWeight: 700 }}>
              BIODEX
            </div>
            <div style={{ marginTop: 3, fontSize: 12.5, fontWeight: 600 }}>Espèces liées</div>
          </button>
          <button
            onClick={() => setPreview({ type: 'toile', title: ['Toile vivante'] })}
            style={{
              border: '1px solid rgba(160,95,179,0.3)',
              background: 'rgba(10,12,14,0.72)',
              color: '#eae3d2',
              borderRadius: 14,
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 9, color: '#c9a4ff', letterSpacing: 1.2, fontWeight: 700 }}>
              LIENS
            </div>
            <div style={{ marginTop: 3, fontSize: 12.5, fontWeight: 600 }}>Toile vivante</div>
          </button>
        </div>
        <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: 'var(--atlas-prototype-serif), serif', fontSize: 18, fontWeight: 500, color: '#f6efdc', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Recommandé pour toi
          </div>
          <button
            onClick={() => setPreview({ type: 'reco', title: ['Tous les recommandés'] })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b9b09a', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4, pointerEvents: 'auto' }}
          >
            Voir tout <L3Icon kind="chevron" size={10} color="#b9b09a" />
          </button>
        </div>
        
        {/* Horizontal scroll list */}
        <style>{`#atlas-reco-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div
          id="atlas-reco-scroll"
          style={{
            display: 'flex',
            gap: 12,
            padding: '0 16px',
            overflowX: 'auto',
            pointerEvents: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <div style={{ scrollSnapAlign: 'start' }}>
            <RecoCard
              type="COURS LIBRE"
              typeColor="#4d8be0"
              title="Plantes mellifères : les alliées des pollinisateurs"
              meta="28 min"
              dotColor="#4d8be0"
              gradient={['#3a1f4a', '#1a0a26']}
              imageTexture="/lab/atlas-prototype/assets/tex_alphabet.webp"
              onClick={() => setPreview({ type: 'course', title: ['Plantes mellifères'] })}
            />
          </div>
          <div style={{ scrollSnapAlign: 'start', paddingRight: 16 }}>
            <RecoCard
              type="PROJET LIÉ"
              typeColor="#7ab84a"
              title="Rucher partenaire : comprendre, agir, protéger"
              meta="45 min"
              dotColor="#7ab84a"
              gradient={['#1f3a14', '#0a1a08']}
              imageTexture="/lab/atlas-prototype/assets/tex_solutions.webp"
              onClick={() => setPreview({ type: 'project', title: ['Rucher partenaire'] })}
            />
          </div>
        </div>
      </div>

      <PreviewSheet item={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function RecoCard({ type, typeColor, title, meta, dotColor, gradient, imageTexture, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 150,
        flex: '0 0 auto',
        background: 'rgba(10,12,14,0.85)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          height: 42,
          background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${imageTexture}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.2,
            fontWeight: 700,
            color: typeColor,
            marginBottom: 4,
          }}
        >
          {type}
        </div>
        <div
          style={{
            fontSize: 11,
            lineHeight: 1.25,
            color: '#eae3d2',
            fontWeight: 500,
            minHeight: 26,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 5, fontSize: 9.5, color: '#9a937f' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor }} />
          {meta}
        </div>
      </div>
    </button>
  )
}
