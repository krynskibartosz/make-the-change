import type { HexCoord } from './hex-math'

export type PathwayStatus = 'locked' | 'available' | 'mastered'

export type IslandId =
  | 'foundations'
  | 'waters'
  | 'continents'
  | 'air'
  | 'anthropocene'
  | 'guardians'

export type Pathway = {
  id: string
  islandId: IslandId
  coord: HexCoord
  title: string
  shortLabel: string
  description: string
  /** Slug du chapitre Academy (ex: 'alphabet-originel') */
  academyChapterSlug?: string
  /** Slug de l'unité Academy (ex: 'la-fabrique-du-vivant') */
  academyUnitSlug?: string
  /** Prérequis (IDs de Pathways) — supporte les cross-links inter-îles */
  requires: string[]
}

/**
 * Mapping Pathway → Academy unit
 * (chapter slug, unit slug) — manquant = pas de cours en face pour le moment
 */
const ACADEMY_MAPPING: Record<string, { chapter: string; unit: string }> = {
  // ─── Foundations (Chapter 1 — L'Alphabet Originel) ────
  'foundations-0': { chapter: 'alphabet-originel', unit: 'la-fabrique-du-vivant' },
  'foundations-1': { chapter: 'alphabet-originel', unit: 'le-pouvoir-du-soleil' },
  'foundations-2': { chapter: 'alphabet-originel', unit: 'le-voyage-de-leau' },
  'foundations-3': { chapter: 'grammaire-especes', unit: 'le-festin-des-predateurs' },
  'foundations-4': { chapter: 'alphabet-originel', unit: 'la-magie-des-sols' },

  // ─── Waters (Chapter 4 — Sanctuaires Sauvages) ────────
  'waters-0': { chapter: 'sanctuaires-sauvages', unit: 'les-metropoles-englouties' },

  // ─── Continents (Chapters 2 & 3 & 4) ──────────────────
  'continents-1': { chapter: 'sanctuaires-sauvages', unit: 'lile-aux-lemuriens' },
  'continents-2': { chapter: 'grammaire-especes', unit: 'les-alliances-invisibles' },
  'continents-3': { chapter: 'grammaire-especes', unit: 'la-loterie-des-mutations' },
  'continents-4': { chapter: 'economie-biosphere', unit: 'les-coursiers-du-nectar' },

  // ─── Air (Chapter 3 — L'Économie de la Biosphère) ─────
  'air-0': { chapter: 'sanctuaires-sauvages', unit: 'le-bal-des-saisons' },
  'air-1': { chapter: 'economie-biosphere', unit: 'leternel-voyage-bleu' },
  'air-2': { chapter: 'alphabet-originel', unit: 'reflexes-du-vivant' },
  'air-3': { chapter: 'economie-biosphere', unit: 'le-coffre-fort-noir' },

  // ─── Anthropocene (Chapter 5 — L'Éveil des Gardiens) ──
  'anthropocene-0': { chapter: 'eveil-gardiens', unit: 'le-crepuscule-des-geants' },
  'anthropocene-1': { chapter: 'eveil-gardiens', unit: 'le-crepuscule-des-geants' },
  'anthropocene-2': { chapter: 'eveil-gardiens', unit: 'le-crepuscule-des-geants' },

  // ─── Guardians (Chapter 5 — solutions) ────────────────
  'guardians-0': { chapter: 'eveil-gardiens', unit: 'cultiver-lavenir' },
  'guardians-1': { chapter: 'eveil-gardiens', unit: 'larsenal-de-lespoir' },
  'guardians-2': { chapter: 'eveil-gardiens', unit: 'larsenal-de-lespoir' },
  'guardians-3': { chapter: 'eveil-gardiens', unit: 'cultiver-lavenir' },
  'guardians-4': { chapter: 'eveil-gardiens', unit: 'larsenal-de-lespoir' },
}

export type IslandTheme = {
  /** Couleur principale (hex sans #) */
  primary: string
  /** Couleur secondaire pour le glow */
  glow: string
  /** Couleur de label */
  label: string
}

export type Island = {
  id: IslandId
  order: number
  name: string
  tagline: string
  theme: IslandTheme
  /** Hex purement décoratifs (pas de Pathway) */
  decorativeHexes: HexCoord[]
  pathways: Pathway[]
}

// ───────────────────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────────────────

/**
 * Pattern de cluster en "fleur fragmentée" (5 hex connexes).
 * Centre + 4 voisins formant un arc.
 */
function clusterPattern(centerQ: number, centerR: number): HexCoord[] {
  return [
    { q: centerQ, r: centerR },         // 0 — centre
    { q: centerQ + 1, r: centerR },     // 1 — droite
    { q: centerQ + 1, r: centerR - 1 }, // 2 — haut-droite
    { q: centerQ, r: centerR - 1 },     // 3 — haut-gauche
    { q: centerQ - 1, r: centerR + 1 }, // 4 — bas-gauche
  ]
}

/** Hex décoratifs autour d'un cluster (donne du volume à l'île) */
function decorativeRing(centerQ: number, centerR: number): HexCoord[] {
  return [
    { q: centerQ - 1, r: centerR },
    { q: centerQ, r: centerR + 1 },
    { q: centerQ - 1, r: centerR - 1 },
    { q: centerQ + 2, r: centerR - 1 },
  ]
}

// ───────────────────────────────────────────────────────────────────────────
// ÎLES
// ───────────────────────────────────────────────────────────────────────────

const FOUNDATIONS_CENTER = { q: 0, r: 0 }
const CONTINENTS_CENTER = { q: -3, r: 5 }
const WATERS_CENTER = { q: 5, r: 1 }
const AIR_CENTER = { q: 4, r: -5 }
const ANTHROPOCENE_CENTER = { q: -5, r: -1 }
const GUARDIANS_CENTER = { q: 1, r: 4 }

export const ISLANDS: Island[] = [
  {
    id: 'foundations',
    order: 1,
    name: "L'Alphabet de la Vie",
    tagline: 'Les fondations du vivant',
    theme: {
      primary: '#F5B842',
      glow: 'rgba(245, 184, 66, 0.45)',
      label: '#FCD9A0',
    },
    decorativeHexes: decorativeRing(FOUNDATIONS_CENTER.q, FOUNDATIONS_CENTER.r),
    pathways: clusterPattern(FOUNDATIONS_CENTER.q, FOUNDATIONS_CENTER.r).map((coord, i) => ({
      id: `foundations-${i}`,
      islandId: 'foundations',
      coord,
      title: [
        "L'Étincelle de Vie",
        "L'Énergie Solaire",
        'Le Grand Cycle de l\u2019Eau',
        'La Toile Trophique',
        'Le Pouvoir des Sols',
      ][i]!,
      shortLabel: ['Vie', 'Soleil', 'Eau', 'Toile', 'Sols'][i]!,
      description: [
        'Cellules, ADN, évolution : les briques de tout être vivant.',
        'La photosynthèse et le rôle central du soleil dans la vie.',
        'Évaporation, nuages, rivières : la circulation de l\u2019eau.',
        'Prédateurs, proies, décomposeurs : la chaîne alimentaire.',
        'Minéraux, bactéries, racines : le sol comme organisme vivant.',
      ][i]!,
      requires: i === 0 ? [] : [`foundations-${i - 1}`],
    })),
  },
  {
    id: 'waters',
    order: 2,
    name: 'Le Royaume des Eaux',
    tagline: 'Le berceau de la vie',
    theme: {
      primary: '#2D9CDB',
      glow: 'rgba(45, 156, 219, 0.45)',
      label: '#9FD8F2',
    },
    decorativeHexes: decorativeRing(WATERS_CENTER.q, WATERS_CENTER.r),
    pathways: clusterPattern(WATERS_CENTER.q, WATERS_CENTER.r).map((coord, i) => ({
      id: `waters-${i}`,
      islandId: 'waters',
      coord,
      title: [
        'Le Récif Corallien',
        'Les Forêts Inondées',
        "Le Peuple de l'Invisible",
        'Les Géants des Océans',
        'Le Monde des Abysses',
      ][i]!,
      shortLabel: ['Corail', 'Mangrove', 'Plancton', 'Baleines', 'Abysses'][i]!,
      description: [
        'Symbiose polype/algue, poissons de récif et biodiversité tropicale.',
        'Mangroves et palétuviers, pouponnières naturelles des poissons.',
        'Le plancton marin, premier producteur d\u2019oxygène de la planète.',
        'Migrations océaniques et chant des cétacés.',
        'Bioluminescence et sources hydrothermales des grands fonds.',
      ][i]!,
      requires: i === 0 ? ['foundations-0'] : [`waters-${i - 1}`],
    })),
  },
  {
    id: 'continents',
    order: 3,
    name: 'Les Continents Verts',
    tagline: 'La biosphère terrestre',
    theme: {
      primary: '#27AE60',
      glow: 'rgba(39, 174, 96, 0.45)',
      label: '#A8E6BF',
    },
    decorativeHexes: decorativeRing(CONTINENTS_CENTER.q, CONTINENTS_CENTER.r),
    pathways: clusterPattern(CONTINENTS_CENTER.q, CONTINENTS_CENTER.r).map((coord, i) => ({
      id: `continents-${i}`,
      islandId: 'continents',
      coord,
      title: [
        'Le Poumon Amazonien',
        "L'Île Rouge",
        "L'Intelligence Végétale",
        "Les Survivants de l'Extrême",
        "L'Armée des Pollinisateurs",
      ][i]!,
      shortLabel: ['Amazonie', 'Madagascar', 'Mycélium', 'Désert', 'Pollens'][i]!,
      description: [
        'Strates de la forêt, canopée, humidité et mégafaune.',
        'Madagascar : endémisme, lémuriens, baobabs, caméléons.',
        'Mycélium et communication chimique entre les arbres.',
        'Adaptations dans le désert, la taïga et la haute montagne.',
        'Abeilles, papillons et co-évolution fleur/insecte.',
      ][i]!,
      requires: i === 0 ? ['foundations-1'] : [`continents-${i - 1}`],
    })),
  },
  {
    id: 'air',
    order: 4,
    name: "Les Maîtres de l'Air",
    tagline: "L'écosystème aérien",
    theme: {
      primary: '#9B5DE5',
      glow: 'rgba(155, 93, 229, 0.45)',
      label: '#D5B8F5',
    },
    decorativeHexes: decorativeRing(AIR_CENTER.q, AIR_CENTER.r),
    pathways: clusterPattern(AIR_CENTER.q, AIR_CENTER.r)
      .slice(0, 4)
      .map((coord, i) => ({
        id: `air-${i}`,
        islandId: 'air',
        coord,
        title: [
          'Les Grands Migrateurs',
          'La Machine Climatique',
          'Les Chauves-souris',
          'La Danse du Carbone',
        ][i]!,
        shortLabel: ['Migration', 'Climat', 'Écholoc.', 'Carbone'][i]!,
        description: [
          'Oiseaux, corridors aériens et navigation magnétique.',
          'Courants atmosphériques, El Niño et grands cycles.',
          'Écholocation et rôle de dispersion des graines.',
          "Comment l'atmosphère régule la température planétaire.",
        ][i]!,
        requires: i === 0 ? ['foundations-2'] : [`air-${i - 1}`],
      })),
  },
  {
    id: 'anthropocene',
    order: 5,
    name: "L'Âge de l'Homme",
    tagline: 'La zone des menaces',
    theme: {
      primary: '#E84855',
      glow: 'rgba(232, 72, 85, 0.45)',
      label: '#F5A8AE',
    },
    decorativeHexes: decorativeRing(ANTHROPOCENE_CENTER.q, ANTHROPOCENE_CENTER.r),
    pathways: clusterPattern(ANTHROPOCENE_CENTER.q, ANTHROPOCENE_CENTER.r).map((coord, i) => ({
      id: `anthropocene-${i}`,
      islandId: 'anthropocene',
      coord,
      title: [
        'La Fièvre Planétaire',
        'Le Feu et la Cendre',
        'La Menace Plastique',
        "L'Invasion Silencieuse",
        "L'Assèchement",
      ][i]!,
      shortLabel: ['Climat', 'Brûlis', 'Plastique', 'Invasif', 'Sécher.'][i]!,
      description: [
        'Acidification des océans et réchauffement climatique.',
        'Tavy, brûlis, agriculture intensive et déforestation.',
        'Microplastiques et vortex océaniques.',
        'Espèces invasives et rupture des équilibres locaux.',
        'Barrages et disparition des zones humides.',
      ][i]!,
      requires:
        i === 0
          ? ['foundations-3']
          : i === 2
            ? ['anthropocene-1', 'waters-0']
            : [`anthropocene-${i - 1}`],
    })),
  },
  {
    id: 'guardians',
    order: 6,
    name: 'Les Gardiens',
    tagline: "Les solutions et projets d'impact",
    theme: {
      primary: '#F2D16B',
      glow: 'rgba(242, 209, 107, 0.55)',
      label: '#FBEAB1',
    },
    decorativeHexes: decorativeRing(GUARDIANS_CENTER.q, GUARDIANS_CENTER.r),
    pathways: clusterPattern(GUARDIANS_CENTER.q, GUARDIANS_CENTER.r).map((coord, i) => ({
      id: `guardians-${i}`,
      islandId: 'guardians',
      coord,
      title: [
        "L'Agroforesterie",
        'La Renaissance des Coraux',
        'Les Sanctuaires Sauvages',
        'Le Retour des Abeilles',
        "L'Économie Circulaire",
      ][i]!,
      shortLabel: ['Agro', 'Coraux', 'Parcs', 'Ruches', 'Cycle'][i]!,
      description: [
        'Cultiver avec la forêt : cacao, vanille, cycles courts.',
        'Bouturage de coraux et récifs artificiels.',
        'Création et gestion des parcs nationaux.',
        'Projet Rucher de Manakara et apiculture durable.',
        'Recyclage, biomimétisme et design durable.',
      ][i]!,
      requires:
        i === 0
          ? ['continents-0', 'continents-4']
          : i === 1
            ? ['waters-0', 'anthropocene-0']
            : i === 3
              ? ['continents-4', 'foundations-1']
              : [`guardians-${i - 1}`],
    })),
  },
]

// ───────────────────────────────────────────────────────────────────────────
// POST-PROCESSING : inject Academy slugs into each Pathway
// ───────────────────────────────────────────────────────────────────────────

for (const island of ISLANDS) {
  for (const pathway of island.pathways) {
    const mapping = ACADEMY_MAPPING[pathway.id]
    if (mapping) {
      pathway.academyChapterSlug = mapping.chapter
      pathway.academyUnitSlug = mapping.unit
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// LOOKUPS
// ───────────────────────────────────────────────────────────────────────────

export function getAllPathways(): Pathway[] {
  return ISLANDS.flatMap((island) => island.pathways)
}

/** Renvoie l'URL Academy d'un Pathway, ou null si pas mappé */
export function getAcademyUrl(pathway: Pathway): string | null {
  if (!pathway.academyChapterSlug || !pathway.academyUnitSlug) return null
  return `/academy/${pathway.academyChapterSlug}/${pathway.academyUnitSlug}`
}

/** Tous les cross-links (paires de Pathways d'îles différentes) */
export function getCrossIslandLinks(): Array<{ from: Pathway; to: Pathway }> {
  const all = getAllPathways()
  const byId = new Map(all.map((p) => [p.id, p]))
  const links: Array<{ from: Pathway; to: Pathway }> = []

  for (const pathway of all) {
    for (const requiredId of pathway.requires) {
      const required = byId.get(requiredId)
      if (!required) continue
      // Seuls les liens INTER-îles sont des cross-links
      if (required.islandId !== pathway.islandId) {
        links.push({ from: required, to: pathway })
      }
    }
  }
  return links
}

// ───────────────────────────────────────────────────────────────────────────
// FOG OF WAR
// ───────────────────────────────────────────────────────────────────────────

export type FogLevel = 'visible' | 'discovered' | 'fogged'

/**
 * Niveau de brouillard d'un Pathway :
 * - `visible` : non-locked (available ou mastered)
 * - `discovered` : locked mais au moins un prérequis est mastered (entrevu)
 * - `fogged` : locked et aucun prérequis mastered (inconnu)
 */
export function computeFogLevel(
  pathway: Pathway,
  masteredIds: ReadonlySet<string>,
): FogLevel {
  const status = computePathwayStatus(pathway, masteredIds)
  if (status !== 'locked') return 'visible'
  if (pathway.requires.length === 0) return 'discovered'
  const someRequireMastered = pathway.requires.some((id) => masteredIds.has(id))
  return someRequireMastered ? 'discovered' : 'fogged'
}

export function getIslandById(id: IslandId): Island {
  const island = ISLANDS.find((i) => i.id === id)
  if (!island) throw new Error(`Island not found: ${id}`)
  return island
}

export function getPathwayById(id: string): Pathway | undefined {
  return getAllPathways().find((p) => p.id === id)
}

/** Calcule le statut d'un Pathway en fonction des masterisations */
export function computePathwayStatus(
  pathway: Pathway,
  masteredIds: ReadonlySet<string>,
): PathwayStatus {
  if (masteredIds.has(pathway.id)) return 'mastered'
  if (pathway.requires.length === 0) return 'available'
  const allRequiresMet = pathway.requires.every((id) => masteredIds.has(id))
  return allRequiresMet ? 'available' : 'locked'
}
