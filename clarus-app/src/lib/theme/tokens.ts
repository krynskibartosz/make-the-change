export type ClarusSemanticToken =
  | 'background'
  | 'surface'
  | 'surfaceElevated'
  | 'foreground'
  | 'mutedForeground'
  | 'border'
  | 'primary'
  | 'primaryForeground'
  | 'warning'
  | 'success'
  | 'danger'
  | 'info'
  | 'blocked'
  | 'paid'
  | 'billable'

export type ClarusThemeTokenSet = Record<ClarusSemanticToken, string>

export const clarusThemeTokens = {
  dark: {
    background: '#080B0F',
    surface: '#11161D',
    surfaceElevated: '#171D26',
    foreground: '#F4F7FA',
    mutedForeground: 'rgba(244, 247, 250, 0.68)',
    border: 'rgba(255, 255, 255, 0.08)',
    primary: '#B6F255',
    primaryForeground: '#10140B',
    warning: '#FBBF24',
    success: '#22C55E',
    danger: '#EF4444',
    info: '#38BDF8',
    blocked: '#F97316',
    paid: '#34D399',
    billable: '#A3E635',
  },
  light: {
    background: '#F6F7F4',
    surface: '#FFFFFF',
    surfaceElevated: '#F0F3EE',
    foreground: '#111827',
    mutedForeground: '#64748B',
    border: 'rgba(15, 23, 42, 0.1)',
    primary: '#3F6212',
    primaryForeground: '#FFFFFF',
    warning: '#B45309',
    success: '#15803D',
    danger: '#DC2626',
    info: '#0369A1',
    blocked: '#C2410C',
    paid: '#047857',
    billable: '#4D7C0F',
  },
} as const satisfies Record<'dark' | 'light', ClarusThemeTokenSet>
