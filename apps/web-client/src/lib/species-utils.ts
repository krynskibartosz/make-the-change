export type Rarity = 'common' | 'rare' | 'legendary'

export function getRarity(status: string | null | undefined): Rarity {
  switch (status?.toUpperCase()) {
    case 'EN':
    case 'CR':
    case 'EW':
    case 'EX':
      return 'legendary'
    case 'VU':
    case 'NT':
      return 'rare'
    default:
      return 'common'
  }
}

export const RARITY_STYLES: Record<Rarity, { textColor: string; label: string; borderColor: string }> = {
  common: {
    textColor: 'text-white/40',
    label: 'Préoccupation mineure',
    borderColor: 'border-white/5',
  },
  rare: {
    textColor: 'text-amber-400/70',
    label: 'Menacée',
    borderColor: 'border-amber-400/20',
  },
  legendary: {
    textColor: 'text-orange-400/80',
    label: 'En danger',
    borderColor: 'border-orange-400/25',
  },
}

export function getSpeciesEmoji(status: string | null | undefined, name: string): string {
  const s = status?.toUpperCase()
  if (s === 'CR' || s === 'EW' || s === 'EX') return '🦁'
  if (s === 'EN') return '🐺'
  if (s === 'VU') return '🦉'
  if (s === 'NT') return '🦊'
  const n = name.toLowerCase()
  if (n.includes('abeille') || n.includes('bee') || n.includes('apis')) return '🐝'
  if (n.includes('bourdon')) return '🐝'
  if (n.includes('aigle') || n.includes('eagle') || n.includes('hawk')) return '🦅'
  if (n.includes('ours') || n.includes('bear')) return '🐻'
  if (n.includes('loup') || n.includes('wolf')) return '🐺'
  if (n.includes('renard') || n.includes('fox')) return '🦊'
  if (n.includes('cerf') || n.includes('deer')) return '🦌'
  if (n.includes('lynx') || n.includes('chat') || n.includes('cat')) return '🐱'
  if (n.includes('baleine') || n.includes('whale') || n.includes('dauphin')) return '🐋'
  if (n.includes('tortue') || n.includes('turtle')) return '🐢'
  if (n.includes('papillon') || n.includes('butterfly')) return '🦋'
  if (n.includes('coccinelle')) return '🐞'
  if (n.includes('corail') || n.includes('acropora')) return '🪸'
  if (n.includes('olivier')) return '🫒'
  if (n.includes('grenouille')) return '🐸'
  if (n.includes('caméléon')) return '🦎'
  if (n.includes('lémurien') || n.includes('indri') || n.includes('sifaka') || n.includes('vari')) return '🐒'
  return '🌿'
}
