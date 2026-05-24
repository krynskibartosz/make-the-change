export type ProjectGlowTone = 'yellow' | 'green' | 'blue'

export const PROJECT_GLOW_COLORS: Record<ProjectGlowTone, { r: number; g: number; b: number }> = {
  yellow: { r: 245, g: 158, b: 11  },
  green:  { r: 16,  g: 185, b: 129 },
  blue:   { r: 14,  g: 165, b: 233 },
}

export function getProjectGlowTone(type: string | null | undefined): ProjectGlowTone {
  const t = type?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef') || t.includes('ocean')) return 'blue'
  if (t.includes('agroforestry') || t.includes('orchard') || t.includes('olive') || t.includes('forest') || t.includes('tree')) return 'green'
  return 'yellow'
}

export function makeProjectGlowRgba(type: string | null | undefined): (alpha: number) => string {
  const { r, g, b } = PROJECT_GLOW_COLORS[getProjectGlowTone(type)]
  return (alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`
}
