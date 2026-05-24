/**
 * Système de design des monnaies — Vision A
 *
 * Une seule monnaie : `impactCredits` (Crédits Impact).
 * Les Graines (`seeds`) ont été supprimées (Phase 4 du refactor stratégique).
 * Le kind 'seeds' reste accepté en type pour compat ascendante mais est traité
 * comme impactCredits côté rendu.
 */

export type CurrencyKind = 'seeds' | 'impactCredits'

export type CurrencyIconName = 'ImpactCreditIcon'
export type CurrencyTone = 'semantic' | 'inherit'

type CurrencyDesign = {
  icon: CurrencyIconName
  label: string
  ariaLabel: string
  toneClassName: string
  softToneClassName: string
  surfaceClassName: string
  strongSurfaceClassName: string
  ctaClassName: string
  glowClassName: string
  progressClassName: string
}

export function formatCurrencyValue(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value)
}

const IMPACT_CREDITS_DESIGN: CurrencyDesign = {
  icon: 'ImpactCreditIcon',
  label: 'Crédits Impact',
  ariaLabel: 'Crédits Impact',
  toneClassName: 'text-amber-300',
  softToneClassName: 'text-amber-200',
  surfaceClassName: 'border-amber-300/25 bg-amber-300/10 text-amber-300',
  strongSurfaceClassName: 'border-amber-300/35 bg-amber-300/15 text-amber-200',
  ctaClassName: 'bg-amber-300 text-[#120d04] hover:bg-amber-200',
  glowClassName: 'shadow-[0_0_18px_rgba(252,211,77,0.24)]',
  progressClassName: 'bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.32)]',
}

export const CURRENCY_DESIGN: Record<CurrencyKind, CurrencyDesign> = {
  seeds: IMPACT_CREDITS_DESIGN,
  impactCredits: IMPACT_CREDITS_DESIGN,
}

export function getCurrencyDesign(_kind: CurrencyKind): CurrencyDesign {
  return IMPACT_CREDITS_DESIGN
}

export function getCurrencyToneClassName(
  _kind: CurrencyKind,
  tone: CurrencyTone = 'semantic',
): string | undefined {
  if (tone === 'inherit') {
    return undefined
  }

  return IMPACT_CREDITS_DESIGN.toneClassName
}
