export type CurrencyKind = 'seeds' | 'impactCredits'

export type CurrencyIconName = 'Sprout' | 'Hexagon'

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
    label: 'crédits impact',
    ariaLabel: 'Crédits Impact',
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
