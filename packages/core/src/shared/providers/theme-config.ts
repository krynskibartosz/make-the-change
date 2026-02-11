export interface ThemeMetadata {
  id: string
  name: string
  description: string
  category: 'Classic' | 'Nature' | 'Cyber' | 'Special'
}

export const THEMES: ThemeMetadata[] = [
  {
    id: 'default',
    name: 'Défaut',
    description: 'Le style classique de l\'application',
    category: 'Classic',
  },
  {
    id: 'ocean',
    name: 'Océan',
    description: 'Inspiré par la profondeur des mers',
    category: 'Nature',
  },
  {
    id: 'forest',
    name: 'Forêt',
    description: 'Des tons naturels et apaisants',
    category: 'Nature',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Épuré, simple et efficace',
    category: 'Classic',
  },
  {
    id: 'nostalgic',
    name: 'Nostalgique',
    description: 'Chaleureux et authentique',
    category: 'Classic',
  },
  {
    id: 'neon',
    name: 'Néon',
    description: 'Futuriste et énergique',
    category: 'Cyber',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Sophistiqué et naturel',
    category: 'Classic',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Confiance et autorité',
    category: 'Classic',
  },
  {
    id: 'eco',
    name: 'Éco-Luxe',
    description: 'Connecté à la nature',
    category: 'Nature',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Doux et calmant',
    category: 'Special',
  },
  {
    id: 'luxury',
    name: 'Luxe',
    description: 'Élégance et prestige',
    category: 'Special',
  },
  {
    id: 'retro',
    name: 'Rétro Pop',
    description: 'Ludique et nostalgique',
    category: 'Cyber',
  },
  {
    id: 'neuro',
    name: 'Neuro-Inclusif',
    description: 'Confort visuel optimal',
    category: 'Special',
  },
  {
    id: 'biolum',
    name: 'Bioluminescent',
    description: 'Profondeur organique',
    category: 'Cyber',
  },
  {
    id: 'heritage',
    name: 'Héritage',
    description: 'Fusion passé-futur',
    category: 'Cyber',
  },
  {
    id: 'custom',
    name: 'Personnalisé',
    description: 'Créez votre propre style à la volée',
    category: 'Special',
  },
]
