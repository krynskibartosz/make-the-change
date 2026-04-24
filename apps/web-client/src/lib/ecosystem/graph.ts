import {
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_SPECIES_ACROPORA_ID,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_BLUE_DEMOISELLE_ID,
  MOCK_SPECIES_BUMBLEBEE_ID,
  MOCK_SPECIES_CHAMELEON_ID,
  MOCK_SPECIES_CLOWNFISH_ID,
  MOCK_SPECIES_GREEN_TURTLE_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_MEGACHILE_ID,
  MOCK_SPECIES_OSMIA_ID,
  MOCK_SPECIES_SYRPHID_ID,
  MOCK_SPECIES_VARI_ID,
  MOCK_SPECIES_WEEVIL_ID,
} from '@/lib/mock/mock-ids'

export type EcosystemStatus = 'locked' | 'discovered' | 'threatened' | 'protected' | 'collapsed'

export type EcosystemNodeType = 'base' | 'flora' | 'fauna' | 'habitat' | 'project' | 'threat'

export type EcosystemRelation = 'nourrit' | 'habitat' | 'proie' | 'symbiose' | 'protege' | 'menace'

export type EcosystemPerspective = 'biome' | 'project' | 'species' | 'faction'

export type EcosystemTheme = 'forest' | 'marine' | 'pollinators'

export type EcosystemFactionKey = 'melli' | 'sylva' | 'ondine'

export type EcosystemAccess = 'available' | 'locked'

export type EcosystemNode = {
  id: string
  name: string
  type: EcosystemNodeType
  status: EcosystemStatus
  trophicLevel: number
  lane: number
  summary: string
  speciesId?: string
  unlockHint?: string
  projectProtected?: boolean
  focal?: boolean
  factionTags?: EcosystemFactionKey[]
}

export type EcosystemEdge = {
  source: string
  target: string
  relation: EcosystemRelation
}

export type EcosystemImpactProxy = {
  partnerName: string
  metric: string
  value: string
  ratioLabel: string
}

export type EcosystemDefinition = {
  id: string
  name: string
  shortName: string
  location: string
  theme: EcosystemTheme
  factionFocus: EcosystemFactionKey
  access: EcosystemAccess
  accessHint: string
  projectName: string
  projectSlug: string
  focusSpeciesId: string
  focusSpeciesName: string
  thesis: string
  impact: EcosystemImpactProxy
  nodes: EcosystemNode[]
  edges: EcosystemEdge[]
}

export const PERSPECTIVE_COPY: Record<
  EcosystemPerspective,
  { label: string; title: string; description: string }
> = {
  biome: {
    label: 'Biome',
    title: 'Lire le territoire',
    description: 'La vue complete du milieu : base, habitats, especes, menaces et liens utiles.',
  },
  project: {
    label: 'Projet',
    title: 'Voir ce que le projet protege',
    description:
      "Les noeuds lies au partenaire ressortent. C'est la lecture la plus utile apres un don ou un soutien.",
  },
  species: {
    label: 'Espece',
    title: "Comprendre la place d'une espece",
    description:
      "La toile se centre sur l'espece cle et montre ce dont elle depend, ce qu'elle influence et ce qui la menace.",
  },
  faction: {
    label: 'Faction',
    title: 'Explorer les priorites de faction',
    description:
      'Melli, Sylva et Ondine orientent vers des ecosystemes differents sans remplacer la localisation reelle.',
  },
}

export const FACTION_COPY: Record<
  EcosystemFactionKey,
  { name: string; mascot: string; title: string; description: string }
> = {
  melli: {
    name: 'Melli',
    mascot: 'Pollinisateurs',
    title: 'Proteger les chaines de pollinisation',
    description: 'Abeilles, fleurs, haies, insectes auxiliaires et petits predateurs.',
  },
  sylva: {
    name: 'Sylva',
    mascot: 'Terres & Forets',
    title: 'Renforcer les sols et la canopee',
    description: 'Sols vivants, plantes fondatrices, forets, especes arboricoles.',
  },
  ondine: {
    name: 'Ondine',
    mascot: 'Gardiens des mers',
    title: 'Stabiliser les milieux marins',
    description: 'Coraux, poissons de recif, tortues, temperature et refuges marins.',
  },
}

export const ECOSYSTEMS: EcosystemDefinition[] = [
  {
    id: 'foret-manakara',
    name: 'Foret de Manakara',
    shortName: 'Manakara',
    location: 'Madagascar',
    theme: 'forest',
    factionFocus: 'sylva',
    access: 'available',
    accessHint: 'Zone prototype ouverte',
    projectName: 'Rucher de Manakara',
    projectSlug: MOCK_PROJECT_MANAKARA_SLUG,
    focusSpeciesId: MOCK_SPECIES_CHAMELEON_ID,
    focusSpeciesName: 'Cameleon de Parson',
    thesis:
      'Un rucher ne protege pas seulement des abeilles : il rend visible toute une chaine de foret humide.',
    impact: {
      partnerName: 'Rucher de Manakara',
      metric: 'abeilles protegees estimees',
      value: '120 000',
      ratioLabel: '3 ruches suivies x 40 000 abeilles protegees estimees.',
    },
    nodes: [
      {
        id: 'sol-manakara',
        name: 'Sols vivants',
        type: 'base',
        status: 'protected',
        trophicLevel: 0,
        lane: 48,
        summary: 'La base invisible : humidite, matiere organique et microfaune.',
        projectProtected: true,
        factionTags: ['sylva'],
      },
      {
        id: 'orchidee-manakara',
        name: 'Orchidees',
        type: 'flora',
        status: 'discovered',
        trophicLevel: 1,
        lane: 30,
        summary: 'Plantes sensibles, dependantes des pollinisateurs et du couvert forestier.',
        projectProtected: true,
        factionTags: ['melli', 'sylva'],
      },
      {
        id: 'abeille-noire-manakara',
        name: 'Abeille noire',
        type: 'fauna',
        status: 'protected',
        trophicLevel: 2,
        lane: 18,
        speciesId: MOCK_SPECIES_BLACK_BEE_ID,
        summary: 'Pollinisateur cle et lien direct avec le partenaire local.',
        projectProtected: true,
        factionTags: ['melli'],
      },
      {
        id: 'charancon-manakara',
        name: 'Charancon girafe',
        type: 'fauna',
        status: 'threatened',
        trophicLevel: 2,
        lane: 49,
        speciesId: MOCK_SPECIES_WEEVIL_ID,
        summary: 'Insecte spectaculaire, indicateur de micro-habitats forestiers.',
        factionTags: ['melli', 'sylva'],
      },
      {
        id: 'cameleon-manakara',
        name: 'Cameleon de Parson',
        type: 'fauna',
        status: 'discovered',
        trophicLevel: 3,
        lane: 40,
        speciesId: MOCK_SPECIES_CHAMELEON_ID,
        summary: 'Predateur de canopee. Sa presence raconte la stabilite de la foret.',
        focal: true,
        factionTags: ['sylva'],
      },
      {
        id: 'vari-manakara',
        name: 'Vari noir et blanc',
        type: 'fauna',
        status: 'locked',
        trophicLevel: 4,
        lane: 68,
        speciesId: MOCK_SPECIES_VARI_ID,
        summary: 'Grand lemurien frugivore, cache tant que la zone haute canopee reste voilee.',
        unlockHint: 'Debloquer la canopee',
        factionTags: ['sylva'],
      },
      {
        id: 'tavy-manakara',
        name: 'Tavy',
        type: 'threat',
        status: 'threatened',
        trophicLevel: 1,
        lane: 78,
        summary: 'Agriculture sur brulis : menace directe sur les sols et la canopee.',
        factionTags: ['sylva'],
      },
      {
        id: 'rucher-manakara',
        name: 'Projet rucher',
        type: 'project',
        status: 'protected',
        trophicLevel: 3,
        lane: 77,
        summary: 'Point d_action concret : soutien apicole, suivi local, proxy d_impact.',
        projectProtected: true,
        factionTags: ['melli', 'sylva'],
      },
    ],
    edges: [
      { source: 'sol-manakara', target: 'orchidee-manakara', relation: 'nourrit' },
      { source: 'orchidee-manakara', target: 'abeille-noire-manakara', relation: 'symbiose' },
      { source: 'orchidee-manakara', target: 'charancon-manakara', relation: 'habitat' },
      { source: 'charancon-manakara', target: 'cameleon-manakara', relation: 'proie' },
      { source: 'orchidee-manakara', target: 'vari-manakara', relation: 'habitat' },
      { source: 'rucher-manakara', target: 'abeille-noire-manakara', relation: 'protege' },
      { source: 'rucher-manakara', target: 'orchidee-manakara', relation: 'protege' },
      { source: 'tavy-manakara', target: 'sol-manakara', relation: 'menace' },
      { source: 'tavy-manakara', target: 'vari-manakara', relation: 'menace' },
    ],
  },
  {
    id: 'recif-karimunjawa',
    name: 'Recif de Karimunjawa',
    shortName: 'Recif',
    location: 'Indonesie',
    theme: 'marine',
    factionFocus: 'ondine',
    access: 'locked',
    accessHint: 'Zone marine a debloquer dans le prototype',
    projectName: 'Restauration des recifs Karimunjawa',
    projectSlug: MOCK_PROJECT_CORAL_SLUG,
    focusSpeciesId: MOCK_SPECIES_ACROPORA_ID,
    focusSpeciesName: 'Acropora corne de cerf',
    thesis:
      'Le corail est une architecture vivante : quand il casse, les poissons perdent leur ville.',
    impact: {
      partnerName: 'Projet recifs coralliens',
      metric: 'fragments de corail suivis',
      value: '18',
      ratioLabel:
        'Chaque fragment est une unite de restauration estimee, pas un comptage temps reel.',
    },
    nodes: [
      {
        id: 'eau-chaude-karimunjawa',
        name: 'Stress thermique',
        type: 'threat',
        status: 'threatened',
        trophicLevel: 0,
        lane: 24,
        summary: 'La hausse de temperature declenche le blanchissement.',
        factionTags: ['ondine'],
      },
      {
        id: 'acropora-karimunjawa',
        name: 'Acropora',
        type: 'fauna',
        status: 'threatened',
        trophicLevel: 1,
        lane: 48,
        speciesId: MOCK_SPECIES_ACROPORA_ID,
        summary: 'Corail constructeur : il forme la structure du recif.',
        focal: true,
        projectProtected: true,
        factionTags: ['ondine'],
      },
      {
        id: 'poisson-clown-karimunjawa',
        name: 'Poisson clown',
        type: 'fauna',
        status: 'discovered',
        trophicLevel: 2,
        lane: 28,
        speciesId: MOCK_SPECIES_CLOWNFISH_ID,
        summary: 'Espece visible qui depend de refuges et de relations stables.',
        factionTags: ['ondine'],
      },
      {
        id: 'demoiselle-karimunjawa',
        name: 'Demoiselle bleue',
        type: 'fauna',
        status: 'locked',
        trophicLevel: 2,
        lane: 62,
        speciesId: MOCK_SPECIES_BLUE_DEMOISELLE_ID,
        summary: 'Petit poisson de recif, cache tant que la zone reste partiellement voilee.',
        unlockHint: 'Explorer le recif',
        factionTags: ['ondine'],
      },
      {
        id: 'tortue-karimunjawa',
        name: 'Tortue verte',
        type: 'fauna',
        status: 'locked',
        trophicLevel: 3,
        lane: 76,
        speciesId: MOCK_SPECIES_GREEN_TURTLE_ID,
        summary: 'Grande espece ambassadrice, liee a la sante generale du milieu marin.',
        unlockHint: 'Debloquer la zone large',
        factionTags: ['ondine'],
      },
      {
        id: 'nurserie-recif',
        name: 'Nurserie du recif',
        type: 'habitat',
        status: 'discovered',
        trophicLevel: 3,
        lane: 43,
        summary: 'Zone refuge pour juveniles et petites especes.',
        factionTags: ['ondine'],
      },
      {
        id: 'projet-corail',
        name: 'Projet corail',
        type: 'project',
        status: 'protected',
        trophicLevel: 4,
        lane: 55,
        summary: 'Action locale de restauration, utile pour rendre le projet concret.',
        projectProtected: true,
        factionTags: ['ondine'],
      },
    ],
    edges: [
      { source: 'eau-chaude-karimunjawa', target: 'acropora-karimunjawa', relation: 'menace' },
      { source: 'acropora-karimunjawa', target: 'poisson-clown-karimunjawa', relation: 'habitat' },
      { source: 'acropora-karimunjawa', target: 'demoiselle-karimunjawa', relation: 'habitat' },
      { source: 'acropora-karimunjawa', target: 'nurserie-recif', relation: 'habitat' },
      { source: 'nurserie-recif', target: 'tortue-karimunjawa', relation: 'habitat' },
      { source: 'projet-corail', target: 'acropora-karimunjawa', relation: 'protege' },
      { source: 'projet-corail', target: 'nurserie-recif', relation: 'protege' },
    ],
  },
  {
    id: 'pollinisateurs-belgique',
    name: 'Pollinisateurs de Belgique',
    shortName: 'Pollinisateurs',
    location: 'Belgique',
    theme: 'pollinators',
    factionFocus: 'melli',
    access: 'available',
    accessHint: 'Zone accessible pour comparer avec Madagascar',
    projectName: 'Habeebee Belgique',
    projectSlug: MOCK_PROJECT_HABEEBEE_SLUG,
    focusSpeciesId: MOCK_SPECIES_BUMBLEBEE_ID,
    focusSpeciesName: 'Bourdon terrestre',
    thesis:
      'Une zone locale simple pour comprendre comment fleurs, insectes et auxiliaires se soutiennent.',
    impact: {
      partnerName: 'Habeebee Belgique',
      metric: 'micro-habitats suivis',
      value: '7',
      ratioLabel: 'Les micro-habitats sont une estimation pedagogique pour le prototype.',
    },
    nodes: [
      {
        id: 'haie-belgique',
        name: 'Haies fleuries',
        type: 'flora',
        status: 'protected',
        trophicLevel: 0,
        lane: 50,
        summary: 'Structure de base : nourriture, abri, corridor.',
        projectProtected: true,
        factionTags: ['melli', 'sylva'],
      },
      {
        id: 'bourdon-belgique',
        name: 'Bourdon terrestre',
        type: 'fauna',
        status: 'discovered',
        trophicLevel: 1,
        lane: 28,
        speciesId: MOCK_SPECIES_BUMBLEBEE_ID,
        summary: 'Pollinisateur robuste, bon point d_entree pour la faction Melli.',
        focal: true,
        factionTags: ['melli'],
      },
      {
        id: 'osmie-belgique',
        name: 'Osmie rousse',
        type: 'fauna',
        status: 'discovered',
        trophicLevel: 1,
        lane: 56,
        speciesId: MOCK_SPECIES_OSMIA_ID,
        summary: 'Abeille solitaire, dependante de sites de nidification.',
        factionTags: ['melli'],
      },
      {
        id: 'megachile-belgique',
        name: 'Megachile',
        type: 'fauna',
        status: 'locked',
        trophicLevel: 2,
        lane: 72,
        speciesId: MOCK_SPECIES_MEGACHILE_ID,
        summary: 'Abeille coupeuse de feuilles, interessante mais gardee en decouverte avancee.',
        unlockHint: 'Explorer les nids',
        factionTags: ['melli'],
      },
      {
        id: 'syrphe-belgique',
        name: 'Syrphe ceinture',
        type: 'fauna',
        status: 'threatened',
        trophicLevel: 2,
        lane: 38,
        speciesId: MOCK_SPECIES_SYRPHID_ID,
        summary: 'Adulte pollinisateur, larve auxiliaire contre les pucerons.',
        factionTags: ['melli'],
      },
      {
        id: 'coccinelle-belgique',
        name: 'Coccinelle',
        type: 'fauna',
        status: 'discovered',
        trophicLevel: 3,
        lane: 48,
        speciesId: MOCK_SPECIES_LADYBUG_ID,
        summary: 'Auxiliaire visible qui rend la lutte biologique facile a comprendre.',
        factionTags: ['melli', 'sylva'],
      },
      {
        id: 'projet-habeebee',
        name: 'Projet Habeebee',
        type: 'project',
        status: 'protected',
        trophicLevel: 4,
        lane: 62,
        summary: 'Projet local pour relier produit, education et biodiversite de proximite.',
        projectProtected: true,
        factionTags: ['melli'],
      },
    ],
    edges: [
      { source: 'haie-belgique', target: 'bourdon-belgique', relation: 'habitat' },
      { source: 'haie-belgique', target: 'osmie-belgique', relation: 'habitat' },
      { source: 'haie-belgique', target: 'megachile-belgique', relation: 'habitat' },
      { source: 'haie-belgique', target: 'syrphe-belgique', relation: 'habitat' },
      { source: 'syrphe-belgique', target: 'coccinelle-belgique', relation: 'symbiose' },
      { source: 'projet-habeebee', target: 'haie-belgique', relation: 'protege' },
      { source: 'projet-habeebee', target: 'bourdon-belgique', relation: 'protege' },
      { source: 'projet-habeebee', target: 'osmie-belgique', relation: 'protege' },
    ],
  },
]

export const DEFAULT_ECOSYSTEM_ID = 'foret-manakara'

export function getEcosystemById(ecosystemId: string): EcosystemDefinition {
  const ecosystem = ECOSYSTEMS.find((entry) => entry.id === ecosystemId) ?? ECOSYSTEMS[0]
  if (!ecosystem) {
    throw new Error('No ecosystem definitions are available.')
  }

  return ecosystem
}

export function findCascadeNodeIds(nodeId: string, edges: readonly EcosystemEdge[]): Set<string> {
  const impactedNodeIds = new Set<string>()

  function visit(currentNodeId: string) {
    if (impactedNodeIds.has(currentNodeId)) {
      return
    }

    impactedNodeIds.add(currentNodeId)

    for (const edge of edges) {
      if (edge.source === currentNodeId && edge.relation !== 'protege') {
        visit(edge.target)
      }
    }
  }

  visit(nodeId)
  return impactedNodeIds
}
