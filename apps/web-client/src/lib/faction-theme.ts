import type { Faction } from '@/lib/domain/types'

export type FactionThemeKey = 'neutral' | 'pollinisateurs' | 'forets' | 'mers'

export type FactionTheme = {
  key: FactionThemeKey
  accentText: string
  accentTextSoft: string
  accentBg: string
  accentBgSoft: string
  accentBorder: string
  accentGlow: string
  accentShadow: string
  badgeClassName: string
  heroGradient: string
}

const NEUTRAL_THEME: FactionTheme = {
  key: 'neutral',
  accentText: 'text-lime-400',
  accentTextSoft: 'text-lime-300',
  accentBg: 'bg-lime-400',
  accentBgSoft: 'bg-lime-400/12',
  accentBorder: 'border-lime-400/25',
  accentGlow: 'bg-lime-400/14',
  accentShadow: 'shadow-[0_0_16px_rgba(163,230,53,0.24)]',
  badgeClassName: 'border border-lime-400/20 bg-lime-400/10',
  heroGradient: 'from-lime-500/18 to-[#0B0F15]',
}

export function resolveFactionThemeKey(
  _faction: Faction | null | undefined,
): FactionThemeKey {
  return 'neutral'
}

export function getFactionTheme(_faction: Faction | null | undefined): FactionTheme {
  return NEUTRAL_THEME
}

export function getFactionThemeByKey(_themeKey: FactionThemeKey): FactionTheme {
  return NEUTRAL_THEME
}
