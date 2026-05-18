/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Calculateur d'impact écologique unifié.
 * 
 * Centralise les constantes et fonctions de calcul d'impact pour éviter
 * la duplication entre project-map-data.ts, producers/[slug]/page.tsx,
 * et project-impact-metrics.ts.
 * 
 * Sources de vérité : mocks (project seeds avec impact défini)
 * Legacy : Supabase (à remplacer par mocks à terme)
 */

export type ImpactKind = 'beehive' | 'orchard' | 'reef'

export type ImpactDisplay = {
  value: number
  label: string
  kind: ImpactKind
}

// ── Constantes de calcul d'impact ──
// Références : ruches (1300€ = 50000 abeilles), oliviers (150€/unité), coraux (30€/unité)
export const BEEHIVE_REFERENCE_VALUE_EUR = 1300
export const BEEHIVE_REFERENCE_POPULATION = 50000
export const BEES_PER_EUR = BEEHIVE_REFERENCE_POPULATION / BEEHIVE_REFERENCE_VALUE_EUR

export const OLIVE_PRICE_EUR = 150
export const CORAL_PRICE_EUR = 30

// ── Calcul d'impact pour un projet individuel ──
// Usage : cartes projet, listes, affichage simple
export function getProjectImpactDisplay(project: {
  current_funding: number | null
  type: string | null
}): ImpactDisplay {
  const funding = Number.isFinite(project.current_funding) ? project.current_funding || 0 : 0
  const projectType = project.type || 'beehive'

  if (projectType === 'orchard' || projectType === 'olive_tree') {
    return {
      value: Math.round(funding / OLIVE_PRICE_EUR),
      label: 'oliviers soutenus',
      kind: 'orchard',
    }
  }

  if (projectType === 'reef' || projectType === 'coral') {
    return {
      value: Math.round(funding / CORAL_PRICE_EUR),
      label: 'coraux plantés',
      kind: 'reef',
    }
  }

  return {
    value: Math.round(funding * BEES_PER_EUR),
    label: 'abeilles associées',
    kind: 'beehive',
  }
}

// ── Agrégation d'impact pour un producteur ──
// Usage : page détail producteur (agrège tous les projets du producteur)
export type AggregatedImpactStat = {
  value: number
  label: string
  kind: ImpactKind
}

export function getProducerAggregatedImpact(
  projects: Array<{ current_funding: number | null; type: string | null }>,
): AggregatedImpactStat[] {
  const stats: AggregatedImpactStat[] = []

  const beesTotal = projects.reduce((sum, p) => {
    if (p.type === 'beehive') return sum + Math.round((p.current_funding ?? 0) * BEES_PER_EUR)
    return sum
  }, 0)

  const oliviersTotal = projects.reduce((sum, p) => {
    if (p.type === 'orchard' || p.type === 'olive_tree') {
      return sum + Math.round((p.current_funding ?? 0) / OLIVE_PRICE_EUR)
    }
    return sum
  }, 0)

  const corauxTotal = projects.reduce((sum, p) => {
    if (p.type === 'reef' || p.type === 'coral') {
      return sum + Math.round((p.current_funding ?? 0) / CORAL_PRICE_EUR)
    }
    return sum
  }, 0)

  if (beesTotal > 0) {
    stats.push({ value: beesTotal, label: 'abeilles associées', kind: 'beehive' })
  }
  if (oliviersTotal > 0) {
    stats.push({ value: oliviersTotal, label: 'oliviers soutenus', kind: 'orchard' })
  }
  if (corauxTotal > 0) {
    stats.push({ value: corauxTotal, label: 'coraux plantés', kind: 'reef' })
  }

  return stats
}
