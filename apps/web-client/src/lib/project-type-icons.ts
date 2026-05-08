import {
  Activity,
  Bug,
  Cloud,
  Droplet,
  Fish,
  Flower2,
  Grid2x2,
  TreePine,
  Waves,
  type LucideIcon,
} from 'lucide-react'

// ── Types de projet ──────────────────────────────────────────────────────────

export type ProjectType = 'beehive' | 'coral' | 'olive_tree'

export type ProjectTypeDesign = {
  icon: LucideIcon
  color: string
  label: string
}

export const PROJECT_TYPE_DESIGN: Record<ProjectType, ProjectTypeDesign> = {
  beehive:    { icon: Bug,      color: 'text-amber-400',   label: 'Ruche' },
  coral:      { icon: Waves,    color: 'text-cyan-400',    label: 'Récif' },
  olive_tree: { icon: TreePine, color: 'text-emerald-400', label: 'Verger' },
}

export function getProjectTypeDesign(type: string): ProjectTypeDesign {
  return PROJECT_TYPE_DESIGN[type as ProjectType] ?? PROJECT_TYPE_DESIGN.beehive
}

// ── Métriques par type de projet ─────────────────────────────────────────────

export type ProjectMetricDesign = {
  icon: LucideIcon
  color: string
  label: string
  unit?: string
}

// Miel : Droplet amber est le meilleur disponible dans lucide.
// Swap futur → HoneyIcon custom (même pattern que SeedIcon/ImpactCreditIcon).
export const BEEHIVE_METRICS = {
  bees:    { icon: Bug,     color: 'text-amber-400', label: 'Abeilles' },
  honey:   { icon: Droplet, color: 'text-amber-400', label: 'Miel',    unit: 'kg' },
  flowers: { icon: Flower2, color: 'text-lime-400',  label: 'Fleurs' },
  co2:     { icon: Cloud,   color: 'text-sky-400',   label: 'CO₂',     unit: 'kg' },
} satisfies Record<string, ProjectMetricDesign>

export const CORAL_METRICS = {
  corals:   { icon: Waves,    color: 'text-cyan-400',  label: 'Coraux' },
  area:     { icon: Grid2x2,  color: 'text-cyan-400',  label: 'Surface', unit: 'm²' },
  refuges:  { icon: Fish,     color: 'text-sky-400',   label: 'Refuges' },
  survival: { icon: Activity, color: 'text-teal-400',  label: 'Survie',  unit: '%' },
  co2:      { icon: Cloud,    color: 'text-sky-400',   label: 'CO₂',     unit: 'kg' },
} satisfies Record<string, ProjectMetricDesign>

// Huile : même situation que le miel — Droplet yellow-600 en attendant OilIcon custom.
export const ORCHARD_METRICS = {
  trees: { icon: TreePine, color: 'text-emerald-400', label: 'Oliviers' },
  oil:   { icon: Droplet,  color: 'text-yellow-600',  label: 'Huile',   unit: 'L' },
  co2:   { icon: Cloud,    color: 'text-sky-400',     label: 'CO₂',     unit: 'kg' },
} satisfies Record<string, ProjectMetricDesign>
