// ─── Types ────────────────────────────────────────────────────────────────────

import {
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_WEEVIL_ID,
  MOCK_SPECIES_CHAMELEON_ID,
  MOCK_SPECIES_VARI_ID,
  MOCK_SPECIES_ACROPORA_ID,
  MOCK_SPECIES_CLOWNFISH_ID,
  MOCK_SPECIES_BLUE_DEMOISELLE_ID,
  MOCK_SPECIES_GREEN_TURTLE_ID,
  MOCK_SPECIES_BUMBLEBEE_ID,
  MOCK_SPECIES_OSMIA_ID,
  MOCK_SPECIES_SYRPHID_ID,
  MOCK_SPECIES_MEGACHILE_ID,
  MOCK_SPECIES_LADYBUG_ID,
} from '@/lib/mock/mock-ids'

export type KinnuNodeType = 'base' | 'flora' | 'fauna' | 'habitat' | 'project' | 'threat'
export type KinnuRelation = 'nourrit' | 'habitat' | 'proie' | 'symbiose' | 'protege' | 'menace'
export type KinnuTheme = 'forest' | 'marine' | 'pollinators'

export type KinnuNode = {
  id: string
  name: string
  type: KinnuNodeType
  /** 0 = sol/base, 4 = apex. Détermine Y dans le SVG. */
  trophicLevel: number
  /** Position X dans le SVG (0–100 %). */
  lane: number
  summary: string
  /** IDs des nœuds à maîtriser avant. Vide = toujours disponible. */
  requires: string[]
  focal?: boolean
  /** ID de l'espèce associée dans le BioDex (si applicable) */
  speciesId?: string
  /** URL de l'image directe (prioritaire sur speciesId) */
  imageUrl?: string
}

export type KinnuEdge = {
  source: string
  target: string
  relation: KinnuRelation
  explanation: string
}

export type KinnuWorld = {
  id: string
  name: string
  shortName: string
  location: string
  theme: KinnuTheme
  tagline: string
  nodes: KinnuNode[]
  edges: KinnuEdge[]
}

// ─── Y par niveau trophique ───────────────────────────────────────────────────

export const KINNU_LEVEL_Y: Record<number, number> = {
  4: 8,
  3: 28,
  2: 50,
  1: 72,
  0: 92,
}

// ─── Les 3 Mondes ─────────────────────────────────────────────────────────────

export const KINNU_WORLDS: KinnuWorld[] = [
  {
    id: 'foret-manakara',
    name: 'Forêt de Manakara',
    shortName: 'Manakara',
    location: 'Madagascar',
    theme: 'forest',
    tagline: 'Un rucher révèle toute une forêt humide.',
    nodes: [
      { id: 'sol-manakara', name: 'Sols vivants', type: 'base', trophicLevel: 0, lane: 48, summary: 'La base invisible : humidité, matière organique et microfaune. Sans sol vivant, rien ne pousse au-dessus.', requires: [], focal: true },
      { id: 'orchidee-manakara', name: 'Orchidées', type: 'flora', trophicLevel: 1, lane: 28, summary: 'Plantes sensibles dépendantes des pollinisateurs. Indicatrices directes de la santé du sol forestier.', requires: ['sol-manakara'] },
      { id: 'tavy-manakara', name: 'Tavy (brûlis)', type: 'threat', trophicLevel: 1, lane: 74, summary: 'Agriculture sur brûlis : défriche des hectares chaque année et détruit directement les sols vivants.', requires: ['sol-manakara'] },
      { id: 'abeille-noire-manakara', name: 'Abeille noire', type: 'fauna', trophicLevel: 2, lane: 16, summary: 'Pollinisateur clé de la forêt humide malgache. Directement soutenue par le Rucher de Manakara.', requires: ['orchidee-manakara'], speciesId: MOCK_SPECIES_BLACK_BEE_ID, imageUrl: '/images/diaromas/Abeilles pollinisatrices.png' },
      { id: 'charancon-manakara', name: 'Charançon girafe', type: 'fauna', trophicLevel: 2, lane: 52, summary: 'Insecte spectaculaire. Le mâle a un "cou" 3× plus long que la femelle pour construire ses nids de feuilles.', requires: ['orchidee-manakara'], speciesId: MOCK_SPECIES_WEEVIL_ID, imageUrl: '/images/diaromas/Charançon girafe.png' },
      { id: 'cameleon-manakara', name: 'Caméléon de Parson', type: 'fauna', trophicLevel: 3, lane: 38, summary: "L'un des plus grands caméléons du monde. Prédateur de canopée — sa présence indique une forêt intacte.", requires: ['charancon-manakara'], speciesId: MOCK_SPECIES_CHAMELEON_ID, imageUrl: '/images/diaromas/Caméléon de Parson.png' },
      { id: 'rucher-manakara', name: 'Rucher Manakara', type: 'project', trophicLevel: 3, lane: 74, summary: "Action concrète : suivi apicole et éducation locale. Proxy pour 120 000 abeilles protégées estimées.", requires: ['abeille-noire-manakara'] },
      { id: 'vari-manakara', name: 'Vari noir et blanc', type: 'fauna', trophicLevel: 4, lane: 52, summary: 'Grand lémur frugivore en danger critique. Sa présence dans la canopée haute révèle une forêt intacte.', requires: ['cameleon-manakara'], speciesId: MOCK_SPECIES_VARI_ID, imageUrl: '/images/diaromas/Vari noir et blanc.png' },
    ],
    edges: [
      { source: 'sol-manakara', target: 'orchidee-manakara', relation: 'nourrit', explanation: 'Les orchidées dépendent du substrat, de l\'humidité et des micro-habitats forestiers.' },
      { source: 'sol-manakara', target: 'tavy-manakara', relation: 'menace', explanation: 'Le brûlis détruit directement les sols vivants.' },
      { source: 'orchidee-manakara', target: 'abeille-noire-manakara', relation: 'symbiose', explanation: 'Les orchidées nourrissent l\'abeille, l\'abeille les féconde.' },
      { source: 'orchidee-manakara', target: 'charancon-manakara', relation: 'habitat', explanation: 'Le charançon dépend de plantes hôtes forestières pour se reproduire.' },
      { source: 'tavy-manakara', target: 'orchidee-manakara', relation: 'menace', explanation: 'Le brûlis détruit le couvert forestier dont dépendent les orchidées.' },
      { source: 'charancon-manakara', target: 'cameleon-manakara', relation: 'proie', explanation: 'Le caméléon est insectivore et consomme de grands insectes comme le charançon.' },
      { source: 'abeille-noire-manakara', target: 'rucher-manakara', relation: 'protege', explanation: 'Le projet rucher soutient directement le suivi des abeilles noires.' },
      { source: 'cameleon-manakara', target: 'vari-manakara', relation: 'habitat', explanation: 'Ils cohabitent dans la canopée haute — leur présence simultanée indique une forêt saine.' },
    ],
  },
  {
    id: 'recif-karimunjawa',
    name: 'Récif de Karimunjawa',
    shortName: 'Récif',
    location: 'Indonésie',
    theme: 'marine',
    tagline: 'Le corail est une architecture vivante.',
    nodes: [
      { id: 'acropora-karimunjawa', name: 'Acropora', type: 'fauna', trophicLevel: 1, lane: 48, summary: 'Corail constructeur : forme la structure du récif. Sans lui, pas d\'habitat pour les autres espèces marines.', requires: [], focal: true, speciesId: MOCK_SPECIES_ACROPORA_ID, imageUrl: '/images/diaromas/Acropora  Corail corne de cerf.png' },
      { id: 'eau-chaude-karimunjawa', name: 'Stress thermique', type: 'threat', trophicLevel: 0, lane: 22, summary: 'Au-delà de 29 °C, le corail expulse ses algues symbiotiques et blanchit. La mort survient rapidement.', requires: ['acropora-karimunjawa'] },
      { id: 'poisson-clown-karimunjawa', name: 'Poisson clown', type: 'fauna', trophicLevel: 2, lane: 24, summary: 'Vit en symbiose avec les anémones. Dépend de la structure corallienne pour son habitat et sa survie.', requires: ['acropora-karimunjawa'], speciesId: MOCK_SPECIES_CLOWNFISH_ID, imageUrl: '/images/diaromas/Poisson clown.png' },
      { id: 'nurserie-recif', name: 'Nurserie du récif', type: 'habitat', trophicLevel: 2, lane: 68, summary: '25 % des espèces marines y passent une partie de leur vie. Sans récif corallien, pas de nurserie.', requires: ['acropora-karimunjawa'] },
      { id: 'demoiselle-karimunjawa', name: 'Demoiselle bleue', type: 'fauna', trophicLevel: 3, lane: 34, summary: 'Petit poisson territorial qui protège son patch d\'algues, entretenant indirectement la santé du corail.', requires: ['poisson-clown-karimunjawa'], speciesId: MOCK_SPECIES_BLUE_DEMOISELLE_ID, imageUrl: '/images/diaromas/Demoiselle bleue.png' },
      { id: 'tortue-karimunjawa', name: 'Tortue verte', type: 'fauna', trophicLevel: 3, lane: 72, summary: 'Grande espèce ambassadrice. Broute les herbiers et maintient l\'équilibre de la nurserie récifale.', requires: ['nurserie-recif'], speciesId: MOCK_SPECIES_GREEN_TURTLE_ID, imageUrl: '/images/diaromas/Tortue verte.png' },
      { id: 'projet-corail', name: 'Projet Corail', type: 'project', trophicLevel: 4, lane: 50, summary: 'Restauration active : 18 fragments d\'Acropora suivis. Chaque fragment est une unité de régénération du récif.', requires: ['demoiselle-karimunjawa', 'tortue-karimunjawa'] },
    ],
    edges: [
      { source: 'acropora-karimunjawa', target: 'poisson-clown-karimunjawa', relation: 'habitat', explanation: 'Le récif corallien fournit refuges et structure aux poissons.' },
      { source: 'acropora-karimunjawa', target: 'nurserie-recif', relation: 'habitat', explanation: 'Les coraux branchus créent une structure 3D servant de zone de croissance.' },
      { source: 'eau-chaude-karimunjawa', target: 'acropora-karimunjawa', relation: 'menace', explanation: 'Au-delà de 29 °C, l\'Acropora blanchit — menace n°1 des récifs.' },
      { source: 'poisson-clown-karimunjawa', target: 'demoiselle-karimunjawa', relation: 'habitat', explanation: 'Les deux espèces partagent la même zone de récif peu profond.' },
      { source: 'nurserie-recif', target: 'tortue-karimunjawa', relation: 'habitat', explanation: 'La tortue verte fréquente les milieux récifaux pour s\'alimenter.' },
      { source: 'projet-corail', target: 'acropora-karimunjawa', relation: 'protege', explanation: 'La restauration active de fragments d\'Acropora régénère la structure du récif.' },
    ],
  },
  {
    id: 'pollinisateurs-belgique',
    name: 'Pollinisateurs de Belgique',
    shortName: 'Pollinisateurs',
    location: 'Belgique',
    theme: 'pollinators',
    tagline: 'Une haie fleurie cache tout un réseau invisible.',
    nodes: [
      { id: 'haie-belgique', name: 'Haies fleuries', type: 'flora', trophicLevel: 0, lane: 48, summary: 'Structure de base : nourriture, abri, corridor. Une haie peut abriter des centaines d\'espèces différentes.', requires: [], focal: true },
      { id: 'bourdon-belgique', name: 'Bourdon terrestre', type: 'fauna', trophicLevel: 1, lane: 24, summary: 'Pollinisateur robuste, actif même par temps frais. Essentiel pour de nombreuses cultures locales.', requires: ['haie-belgique'], speciesId: MOCK_SPECIES_BUMBLEBEE_ID, imageUrl: '/images/diaromas/Bourdon terrestre.png' },
      { id: 'osmie-belgique', name: 'Osmie rousse', type: 'fauna', trophicLevel: 1, lane: 52, summary: 'Abeille solitaire 300× plus efficace que l\'abeille domestique. Dépend de tiges creuses pour nidifier.', requires: ['haie-belgique'], speciesId: MOCK_SPECIES_OSMIA_ID, imageUrl: '/images/diaromas/Osmie rousse.png' },
      { id: 'syrphe-belgique', name: 'Syrphe ceinturé', type: 'fauna', trophicLevel: 1, lane: 76, summary: 'Adulte pollinisateur, larve auxiliaire contre les pucerons. Imite les guêpes pour se protéger.', requires: ['haie-belgique'], speciesId: MOCK_SPECIES_SYRPHID_ID, imageUrl: '/images/diaromas/Syrphe ceinturé.png' },
      { id: 'megachile-belgique', name: 'Mégachile', type: 'fauna', trophicLevel: 2, lane: 34, summary: 'Abeille coupeuse de feuilles : découpe des rondelles précises pour construire ses alvéoles.', requires: ['bourdon-belgique'], speciesId: MOCK_SPECIES_MEGACHILE_ID, imageUrl: '/images/diaromas/Mégachile.png' },
      { id: 'coccinelle-belgique', name: 'Coccinelle', type: 'fauna', trophicLevel: 2, lane: 64, summary: 'Une coccinelle consomme jusqu\'à 150 pucerons par jour. Alliée naturelle de tous les pollinisateurs.', requires: ['syrphe-belgique'], speciesId: MOCK_SPECIES_LADYBUG_ID, imageUrl: '/images/diaromas/Coccinelle.png' },
      { id: 'projet-habeebee', name: 'Projet Habeebee', type: 'project', trophicLevel: 3, lane: 48, summary: '7 micro-habitats suivis en Belgique. Relie produit, éducation et biodiversité de proximité.', requires: ['megachile-belgique', 'coccinelle-belgique'] },
    ],
    edges: [
      { source: 'haie-belgique', target: 'bourdon-belgique', relation: 'habitat', explanation: 'Les haies fleuries fournissent nourriture et corridors aux pollinisateurs.' },
      { source: 'haie-belgique', target: 'osmie-belgique', relation: 'habitat', explanation: 'Les abeilles solitaires utilisent les ressources florales des haies.' },
      { source: 'haie-belgique', target: 'syrphe-belgique', relation: 'habitat', explanation: 'Les syrphes adultes se nourrissent du pollen et du nectar des haies.' },
      { source: 'bourdon-belgique', target: 'megachile-belgique', relation: 'symbiose', explanation: 'Les deux espèces se complètent : bourdon pour fleurs profondes, mégachile pour fleurs plates.' },
      { source: 'syrphe-belgique', target: 'coccinelle-belgique', relation: 'symbiose', explanation: 'Syrphes et coccinelles sont des auxiliaires complémentaires contre les pucerons.' },
      { source: 'projet-habeebee', target: 'haie-belgique', relation: 'protege', explanation: 'Le projet crée et entretient des micro-habitats favorables à la biodiversité locale.' },
    ],
  },
]

export function getKinnuWorldById(id: string): KinnuWorld {
  return KINNU_WORLDS.find((w) => w.id === id) ?? KINNU_WORLDS[0]!
}
