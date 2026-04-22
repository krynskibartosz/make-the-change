import type { Faction } from '@/lib/mock/types'

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

const FACTION_THEMES: Record<FactionThemeKey, FactionTheme> = {
  neutral: {
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
  },
  pollinisateurs: {
    key: 'pollinisateurs',
    accentText: 'text-amber-400',
    accentTextSoft: 'text-amber-300',
    accentBg: 'bg-amber-400',
    accentBgSoft: 'bg-amber-400/12',
    accentBorder: 'border-amber-400/25',
    accentGlow: 'bg-amber-400/14',
    accentShadow: 'shadow-[0_0_16px_rgba(251,191,36,0.24)]',
    badgeClassName: 'border border-amber-400/20 bg-amber-400/10',
    heroGradient: 'from-amber-500/18 to-[#0B0F15]',
  },
  forets: {
    key: 'forets',
    accentText: 'text-emerald-400',
    accentTextSoft: 'text-emerald-300',
    accentBg: 'bg-emerald-400',
    accentBgSoft: 'bg-emerald-400/12',
    accentBorder: 'border-emerald-400/25',
    accentGlow: 'bg-emerald-400/14',
    accentShadow: 'shadow-[0_0_16px_rgba(52,211,153,0.24)]',
    badgeClassName: 'border border-emerald-400/20 bg-emerald-400/10',
    heroGradient: 'from-emerald-500/18 to-[#0B0F15]',
  },
  mers: {
    key: 'mers',
    accentText: 'text-blue-400',
    accentTextSoft: 'text-blue-300',
    accentBg: 'bg-blue-400',
    accentBgSoft: 'bg-blue-400/12',
    accentBorder: 'border-blue-400/25',
    accentGlow: 'bg-blue-400/14',
    accentShadow: 'shadow-[0_0_16px_rgba(96,165,250,0.24)]',
    badgeClassName: 'border border-blue-400/20 bg-blue-400/10',
    heroGradient: 'from-blue-500/18 to-[#0B0F15]',
  },
}

export const resolveFactionThemeKey = (
  faction: Faction | null | undefined,
): FactionThemeKey => {
  if (faction === 'Vie Sauvage') return 'pollinisateurs'
  if (faction === 'Terres & Forêts') return 'forets'
  if (faction === 'Gardiens des mers') return 'mers'
  return 'neutral'
}

export const getFactionTheme = (faction: Faction | null | undefined): FactionTheme => {
  return FACTION_THEMES[resolveFactionThemeKey(faction)]
}

export const getFactionThemeByKey = (themeKey: FactionThemeKey): FactionTheme => {
  return FACTION_THEMES[themeKey]
}
