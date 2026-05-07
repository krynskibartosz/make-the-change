/**
 * Système de design des monnaies — R2
 *
 * [CIBLE_VALIDEE] P0-3 : Deux monnaies distinctes
 * - `seeds` = Graines : progression, engagement, Academy, BioDex
 * - `impactCredits` = Credits Impact : valeur boutique issue du soutien producteur
 *
 * [DEPRECIE] Le terme générique `points` ne doit pas être utilisé dans les UI finales.
 *
 * Règles métier :
 * - Un don pur ne génère pas de Credits Impact → utilise Graines
 * - Un soutien producteur génère des Credits Impact
 * - Un achat produit ne génère pas de Credits Impact
 * - Academy/quiz génère des Graines, pas de Credits Impact
 */

export type CurrencyKind = 'seeds' | 'impactCredits'

export type CurrencyIconName = 'Sprout' | 'Hexagon'
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

/**
 * Formate une valeur monétaire avec le label de la monnaie.
 * R2 : Helper centralisé pour éviter la confusion entre points/crédits/graines.
 */
export function formatCurrencyValue(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value)
}

export const CURRENCY_DESIGN = {
  seeds: {
    icon: 'Sprout',
    label: 'graines',
    ariaLabel: 'Graines',
    toneClassName: 'text-emerald-300',
    softToneClassName: 'text-emerald-200',
    surfaceClassName: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    strongSurfaceClassName: 'border-emerald-400/35 bg-emerald-400/15 text-emerald-200',
    ctaClassName: 'bg-emerald-400 text-[#06110e] hover:bg-emerald-300',
    glowClassName: 'shadow-[0_0_18px_rgba(52,211,153,0.28)]',
    progressClassName: 'bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.36)]',
  },
  impactCredits: {
    icon: 'Hexagon',
    label: 'Credits Impact',
    ariaLabel: 'Credits Impact',
    toneClassName: 'text-amber-300',
    softToneClassName: 'text-amber-200',
    surfaceClassName: 'border-amber-300/25 bg-amber-300/10 text-amber-300',
    strongSurfaceClassName: 'border-amber-300/35 bg-amber-300/15 text-amber-200',
    ctaClassName: 'bg-amber-300 text-[#120d04] hover:bg-amber-200',
    glowClassName: 'shadow-[0_0_18px_rgba(252,211,77,0.24)]',
    progressClassName: 'bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.32)]',
  },
} as const satisfies Record<CurrencyKind, CurrencyDesign>

export function getCurrencyDesign(kind: CurrencyKind): CurrencyDesign {
  return CURRENCY_DESIGN[kind]
}

export function getCurrencyToneClassName(
  kind: CurrencyKind,
  tone: CurrencyTone = 'semantic',
): string | undefined {
  if (tone === 'inherit') {
    return undefined
  }

  return getCurrencyDesign(kind).toneClassName
}
