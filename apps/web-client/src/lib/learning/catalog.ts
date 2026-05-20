import { listV2Units } from '@/app/[locale]/(screens)/academy/_lib/content'
import type { AcademyUnitDefinition } from '@/app/[locale]/(screens)/academy/_lib/schema'
import {
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_SARDINIA_SLUG,
  MOCK_SPECIES_ACROPORA_ID,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_BLUE_DEMOISELLE_ID,
  MOCK_SPECIES_BUMBLEBEE_ID,
  MOCK_SPECIES_CHAMELEON_ID,
  MOCK_SPECIES_CLOWNFISH_ID,
  MOCK_SPECIES_CORAL_ID,
  MOCK_SPECIES_GREEN_TURTLE_ID,
  MOCK_SPECIES_HEDGEHOG_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_MEGACHILE_ID,
  MOCK_SPECIES_OLIVE_TREE_ID,
  MOCK_SPECIES_OSMIA_ID,
  MOCK_SPECIES_SYRPHID_ID,
  MOCK_SPECIES_VARI_ID,
  MOCK_SPECIES_WEEVIL_ID,
} from '@/lib/mock/mock-ids'

import {
  atlasDomainSchema,
  learningCourseSchema,
  learningPathSchema,
  type AtlasDomain,
  type LearningAccessPolicy,
  type LearningCourse,
  type LearningDomainId,
  type LearningLevel,
  type LearningPath,
} from './schema'

type UnitLearningMeta = {
  domain: LearningDomainId
  theme: string
  subject: string
  level: LearningLevel
  tags: string[]
  relatedProjectSlugs?: string[]
  relatedSpeciesIds?: string[]
  relatedEcosystemIds?: string[]
  relatedNodeIds?: string[]
  recommendedAfterUnitIds?: string[]
  accessPolicy?: LearningAccessPolicy
}

const CHAPTER_SLUG_BY_ID: Record<string, string> = {
  'chapter-1': 'alphabet-originel',
  'chapter-2': 'grammaire-especes',
  'chapter-3': 'economie-biosphere',
  'chapter-4': 'sanctuaires-sauvages',
  'chapter-5': 'eveil-gardiens',
}

export const LEARNING_ATLAS_DOMAINS: AtlasDomain[] = [
  {
    id: 'alphabet-du-vivant',
    title: "L'Alphabet du vivant",
    subtitle: 'Les forces de base qui font tourner un écosystème.',
    shortDescription: 'Découvrir les forces fondamentales des écosystèmes.',
    description: 'Soleil, eau, sols, photosynthèse et réflexes fondamentaux.',
    iconKey: 'sparkles',
    accentClass: 'emerald',
    order: 1,
  },
  {
    id: 'milieux-habitats',
    title: 'Milieux & habitats',
    subtitle: 'Forêts, récifs, îles, saisons et refuges du vivant.',
    shortDescription: 'Explorer les lieux où vivent et circulent les espèces.',
    description: 'Comprendre les lieux où les espèces vivent, circulent et se protègent.',
    iconKey: 'map',
    accentClass: 'teal',
    order: 2,
  },
  {
    id: 'relations-du-vivant',
    title: 'Relations du vivant',
    subtitle: 'Prédation, symbiose, pollinisation et évolution.',
    shortDescription: 'Comprendre comment les espèces interagissent entre elles.',
    description: 'Voir comment les espèces dépendent les unes des autres.',
    iconKey: 'network',
    accentClass: 'amber',
    order: 3,
  },
  {
    id: 'menaces',
    title: 'Menaces',
    subtitle: 'Extinctions, fragmentation, climat et pressions humaines.',
    shortDescription: 'Identifier ce qui fragilise les chaînes du vivant.',
    description: 'Identifier ce qui fragilise les chaînes du vivant.',
    iconKey: 'triangle-alert',
    accentClass: 'rose',
    order: 4,
  },
  {
    id: 'solutions',
    title: 'Solutions',
    subtitle: 'Restaurer, protéger, cultiver et soutenir le terrain.',
    shortDescription: 'Relier nos gestes concrets aux mécanismes écologiques.',
    description: 'Relier les gestes concrets aux mécanismes écologiques.',
    iconKey: 'sprout',
    accentClass: 'lime',
    order: 5,
  },
  {
    id: 'lire-impact',
    title: "Lire l'impact",
    subtitle: 'Faits, estimations, preuves et limites des métriques.',
    shortDescription: 'Savoir lire une promesse écologique sans se faire piéger.',
    description: 'Savoir lire une promesse écologique sans se faire piéger.',
    iconKey: 'scan-line',
    accentClass: 'sky',
    order: 6,
  },
].map((domain) => atlasDomainSchema.parse(domain))

const UNIT_LEARNING_META: Record<string, UnitLearningMeta> = {
  'chapter-1-sun': {
    domain: 'alphabet-du-vivant',
    theme: 'Énergie',
    subject: 'Soleil',
    level: 'base',
    tags: ['soleil', 'énergie', 'base', 'écosystème'],
  },
  'chapter-1-water': {
    domain: 'alphabet-du-vivant',
    theme: 'Cycles',
    subject: 'Eau',
    level: 'base',
    tags: ['eau', 'cycle', 'base', 'milieu'],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: ['sol-manakara'],
    recommendedAfterUnitIds: ['chapter-1-sun'],
  },
  'chapter-1-soil': {
    domain: 'alphabet-du-vivant',
    theme: 'Sols',
    subject: 'Sols vivants',
    level: 'base',
    tags: ['sols', 'décomposition', 'microfaune', 'base'],
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_SARDINIA_SLUG],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: ['sol-manakara'],
    recommendedAfterUnitIds: ['chapter-1-water'],
  },
  'chapter-1-plants-light': {
    domain: 'alphabet-du-vivant',
    theme: 'Énergie',
    subject: 'Photosynthèse',
    level: 'base',
    tags: ['photosynthèse', 'plantes', 'lumière', 'carbone'],
    relatedEcosystemIds: ['foret-manakara', 'pollinisateurs-belgique'],
    relatedNodeIds: ['orchidee-manakara', 'haie-belgique'],
    recommendedAfterUnitIds: ['chapter-1-sun'],
  },
  'chapter-1-training': {
    domain: 'alphabet-du-vivant',
    theme: 'Réflexes',
    subject: 'Lire un écosystème',
    level: 'base',
    tags: ['révision', 'quiz', 'bases', 'écosystème'],
    recommendedAfterUnitIds: ['chapter-1-sun', 'chapter-1-water', 'chapter-1-soil'],
  },
  'chapter-1-life-factory': {
    domain: 'alphabet-du-vivant',
    theme: 'Vie',
    subject: 'Cellules et vivant',
    level: 'base',
    tags: ['vivant', 'cellule', 'organisme', 'base'],
    recommendedAfterUnitIds: ['chapter-1-plants-light'],
  },
  'chapter-1-boss': {
    domain: 'alphabet-du-vivant',
    theme: 'Synthèse',
    subject: 'Créer un écosystème',
    level: 'base',
    tags: ['synthèse', 'écosystème', 'défi'],
    relatedEcosystemIds: ['foret-manakara'],
    recommendedAfterUnitIds: ['chapter-1-life-factory', 'chapter-1-training'],
  },
  'unit-2-1': {
    domain: 'relations-du-vivant',
    theme: 'Chaînes alimentaires',
    subject: 'Prédation',
    level: 'base',
    tags: ['prédation', 'proie', 'chaîne alimentaire', 'cascade'],
    relatedSpeciesIds: [MOCK_SPECIES_CHAMELEON_ID, MOCK_SPECIES_WEEVIL_ID, MOCK_SPECIES_LADYBUG_ID],
    relatedEcosystemIds: ['foret-manakara', 'pollinisateurs-belgique'],
    relatedNodeIds: ['cameleon-manakara', 'charancon-manakara', 'coccinelle-belgique'],
    recommendedAfterUnitIds: ['chapter-1-boss'],
  },
  'unit-2-2': {
    domain: 'relations-du-vivant',
    theme: 'Coopérations',
    subject: 'Symbiose',
    level: 'base',
    tags: ['symbiose', 'coopération', 'corail', 'pollinisation'],
    relatedSpeciesIds: [MOCK_SPECIES_ACROPORA_ID, MOCK_SPECIES_CORAL_ID, MOCK_SPECIES_BLACK_BEE_ID],
    relatedEcosystemIds: ['foret-manakara', 'recif-karimunjawa'],
    relatedNodeIds: ['orchidee-manakara', 'abeille-noire-manakara', 'acropora-karimunjawa'],
    recommendedAfterUnitIds: ['unit-2-1'],
  },
  'unit-2-3': {
    domain: 'relations-du-vivant',
    theme: 'Évolution',
    subject: 'Mutations',
    level: 'intermediaire',
    tags: ['évolution', 'adaptation', 'mutation', 'espèces'],
    relatedSpeciesIds: [MOCK_SPECIES_VARI_ID, MOCK_SPECIES_ACROPORA_ID],
    relatedEcosystemIds: ['foret-manakara', 'recif-karimunjawa'],
    recommendedAfterUnitIds: ['unit-2-2'],
  },
  'unit-3-1': {
    domain: 'relations-du-vivant',
    theme: 'Pollinisation',
    subject: 'Pollinisateurs',
    level: 'base',
    tags: ['pollinisation', 'abeilles', 'fleurs', 'melli', 'alimentation'],
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_ANTSIRABE_SLUG, MOCK_PROJECT_HABEEBEE_SLUG],
    relatedSpeciesIds: [
      MOCK_SPECIES_BLACK_BEE_ID,
      MOCK_SPECIES_BUMBLEBEE_ID,
      MOCK_SPECIES_OSMIA_ID,
      MOCK_SPECIES_MEGACHILE_ID,
      MOCK_SPECIES_SYRPHID_ID,
    ],
    relatedEcosystemIds: ['foret-manakara', 'pollinisateurs-belgique'],
    relatedNodeIds: [
      'abeille-noire-manakara',
      'orchidee-manakara',
      'bourdon-belgique',
      'osmie-belgique',
      'megachile-belgique',
      'syrphe-belgique',
    ],
    recommendedAfterUnitIds: ['unit-2-2'],
  },
  'unit-3-2': {
    domain: 'milieux-habitats',
    theme: 'Cycles',
    subject: "Cycle de l'eau",
    level: 'intermediaire',
    tags: ['eau', 'cycle', 'forêt', 'climat'],
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_CORAL_SLUG],
    relatedEcosystemIds: ['foret-manakara', 'recif-karimunjawa'],
    relatedNodeIds: ['sol-manakara', 'eau-chaude-karimunjawa'],
    recommendedAfterUnitIds: ['chapter-1-water'],
  },
  'unit-3-3': {
    domain: 'lire-impact',
    theme: 'Métriques',
    subject: 'Carbone',
    level: 'intermediaire',
    tags: ['carbone', 'impact', 'stockage', 'preuve', 'estimation'],
    relatedProjectSlugs: [MOCK_PROJECT_SARDINIA_SLUG, MOCK_PROJECT_MANAKARA_SLUG],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: ['sol-manakara'],
    recommendedAfterUnitIds: ['unit-3-2'],
  },
  'unit-4-1': {
    domain: 'milieux-habitats',
    theme: 'Îles & endémisme',
    subject: 'Madagascar',
    level: 'intermediaire',
    tags: ['madagascar', 'endémisme', 'forêt humide', 'îles'],
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_ANTSIRABE_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_CHAMELEON_ID, MOCK_SPECIES_VARI_ID, MOCK_SPECIES_WEEVIL_ID],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: ['cameleon-manakara', 'vari-manakara', 'charancon-manakara'],
    recommendedAfterUnitIds: ['unit-2-3'],
  },
  'unit-4-2': {
    domain: 'milieux-habitats',
    theme: 'Océans & récifs',
    subject: 'Récifs coralliens',
    level: 'intermediaire',
    tags: ['corail', 'récif', 'océan', 'habitat'],
    relatedProjectSlugs: [MOCK_PROJECT_CORAL_SLUG],
    relatedSpeciesIds: [
      MOCK_SPECIES_ACROPORA_ID,
      MOCK_SPECIES_CORAL_ID,
      MOCK_SPECIES_CLOWNFISH_ID,
      MOCK_SPECIES_BLUE_DEMOISELLE_ID,
      MOCK_SPECIES_GREEN_TURTLE_ID,
    ],
    relatedEcosystemIds: ['recif-karimunjawa'],
    relatedNodeIds: ['acropora-karimunjawa', 'nurserie-recif', 'poisson-clown-karimunjawa'],
    recommendedAfterUnitIds: ['unit-2-2'],
  },
  'unit-4-3': {
    domain: 'milieux-habitats',
    theme: 'Rythmes du vivant',
    subject: 'Saisons',
    level: 'intermediaire',
    tags: ['saisons', 'migration', 'hibernation', 'rythmes'],
    relatedSpeciesIds: [MOCK_SPECIES_HEDGEHOG_ID],
    recommendedAfterUnitIds: ['unit-3-2'],
  },
  'unit-5-1': {
    domain: 'menaces',
    theme: 'Crises du vivant',
    subject: 'Extinctions',
    level: 'avance',
    tags: ['extinction', 'menace', 'biodiversité', 'fragmentation'],
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_CORAL_SLUG],
    relatedEcosystemIds: ['foret-manakara', 'recif-karimunjawa'],
    relatedNodeIds: ['tavy-manakara', 'eau-chaude-karimunjawa'],
    recommendedAfterUnitIds: ['unit-4-1', 'unit-4-2'],
  },
  'unit-5-2': {
    domain: 'solutions',
    theme: 'Restaurer',
    subject: 'Solutions biodiversité',
    level: 'avance',
    tags: ['solutions', 'restauration', 'protection', 'impact'],
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_CORAL_SLUG, MOCK_PROJECT_HABEEBEE_SLUG],
    relatedEcosystemIds: ['foret-manakara', 'recif-karimunjawa', 'pollinisateurs-belgique'],
    relatedNodeIds: ['rucher-manakara', 'projet-corail', 'projet-habeebee'],
    recommendedAfterUnitIds: ['unit-5-1'],
  },
  'unit-5-3': {
    domain: 'solutions',
    theme: 'Produire avec le vivant',
    subject: 'Permaculture',
    level: 'avance',
    tags: ['permaculture', 'agroforesterie', 'sols', 'production'],
    relatedProjectSlugs: [MOCK_PROJECT_SARDINIA_SLUG, MOCK_PROJECT_MANAKARA_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_OLIVE_TREE_ID],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: ['sol-manakara'],
    recommendedAfterUnitIds: ['chapter-1-soil', 'unit-5-2'],
  },
  'unit-5-4': {
    domain: 'solutions',
    theme: 'Projets terrain',
    subject: 'Ruchers',
    level: 'base',
    tags: ['ruche', 'abeilles', 'projet', 'pollinisation', 'antsirabe'],
    relatedProjectSlugs: [MOCK_PROJECT_ANTSIRABE_SLUG, MOCK_PROJECT_MANAKARA_SLUG, MOCK_PROJECT_HABEEBEE_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_BLACK_BEE_ID, MOCK_SPECIES_BUMBLEBEE_ID],
    relatedEcosystemIds: ['foret-manakara', 'pollinisateurs-belgique'],
    relatedNodeIds: ['abeille-noire-manakara', 'rucher-manakara', 'bourdon-belgique', 'projet-habeebee'],
    recommendedAfterUnitIds: ['unit-3-1'],
  },
}

const academyUnits = listV2Units()
const academyUnitById = new Map(academyUnits.map((unit) => [unit.id, unit]))

function getAcademyCourseId(unitId: string): string {
  const unit = academyUnitById.get(unitId)
  if (!unit) {
    throw new Error(`[learning] Unknown Academy unit "${unitId}" in Learning catalog.`)
  }
  return `academy-${unit.slug}`
}

function getAcademyHref(unit: AcademyUnitDefinition): string {
  const chapterSlug = CHAPTER_SLUG_BY_ID[unit.chapterId]
  if (!chapterSlug) {
    throw new Error(`[learning] Unknown Academy chapter "${unit.chapterId}" for unit "${unit.id}".`)
  }
  return `/academy/${chapterSlug}/${unit.slug}`
}

function toCourseIds(unitIds: string[] | undefined): string[] {
  return (unitIds ?? []).map(getAcademyCourseId)
}

function buildAcademyLearningCourse(unit: AcademyUnitDefinition): LearningCourse {
  const meta = UNIT_LEARNING_META[unit.id]
  if (!meta) {
    throw new Error(`[learning] Academy unit "${unit.id}" is missing a Learning catalog mapping.`)
  }

  const recommendedAfterCourseIds = toCourseIds(meta.recommendedAfterUnitIds)

  return learningCourseSchema.parse({
    id: getAcademyCourseId(unit.id),
    sourceId: unit.id,
    title: unit.shortTitle || unit.title,
    subtitle: unit.subtitle,
    domain: meta.domain,
    theme: meta.theme,
    subject: meta.subject,
    conceptIds: unit.conceptIds,
    level: meta.level,
    durationMinutes: unit.durationMinutes,
    tags: Array.from(new Set([...meta.tags, unit.concept, unit.title, unit.shortTitle])),
    entry: {
      kind: 'academy_unit',
      href: getAcademyHref(unit),
    },
    relatedProjectSlugs: meta.relatedProjectSlugs ?? [],
    relatedSpeciesIds: meta.relatedSpeciesIds ?? [],
    relatedEcosystemIds: meta.relatedEcosystemIds ?? [],
    relatedNodeIds: meta.relatedNodeIds ?? [],
    recommendedAfterCourseIds,
    accessPolicy: meta.accessPolicy ?? (recommendedAfterCourseIds.length > 0 ? 'recommended_after' : 'available'),
    lessonIds: unit.lessons.map((lesson) => lesson.id),
  })
}

const PROJECT_AND_WEB_COURSES: LearningCourse[] = [
  {
    id: 'project-rucher-manakara-comprendre',
    sourceId: MOCK_PROJECT_MANAKARA_SLUG,
    title: 'Rucher de Manakara',
    subtitle: 'Lire le projet par ses liens : abeilles, forêt humide, sols et impact estimé.',
    domain: 'solutions',
    theme: 'Projets terrain',
    subject: 'Rucher de Manakara',
    conceptIds: ['project-rucher-manakara', 'pollination-agents', 'impact-proxy'],
    level: 'base',
    durationMinutes: 4,
    tags: ['projet', 'rucher', 'manakara', 'abeille noire', 'impact'],
    entry: {
      kind: 'project_experience',
      href: `/projects/${MOCK_PROJECT_MANAKARA_SLUG}`,
    },
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_BLACK_BEE_ID, MOCK_SPECIES_CHAMELEON_ID],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: ['rucher-manakara', 'abeille-noire-manakara', 'sol-manakara'],
    recommendedAfterCourseIds: [getAcademyCourseId('unit-3-1')],
    accessPolicy: 'recommended_after',
    lessonIds: [],
  },
  {
    id: 'project-recif-karimunjawa-comprendre',
    sourceId: MOCK_PROJECT_CORAL_SLUG,
    title: 'Récif de Karimunjawa',
    subtitle: 'Comprendre comment un fragment de corail devient un proxy de restauration.',
    domain: 'lire-impact',
    theme: 'Projets terrain',
    subject: 'Récif corallien',
    conceptIds: ['coral-restoration', 'impact-proxy', 'habitat-refuge'],
    level: 'intermediaire',
    durationMinutes: 4,
    tags: ['projet', 'corail', 'récif', 'impact', 'restauration'],
    entry: {
      kind: 'project_experience',
      href: `/projects/${MOCK_PROJECT_CORAL_SLUG}`,
    },
    relatedProjectSlugs: [MOCK_PROJECT_CORAL_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_ACROPORA_ID, MOCK_SPECIES_CORAL_ID],
    relatedEcosystemIds: ['recif-karimunjawa'],
    relatedNodeIds: ['projet-corail', 'acropora-karimunjawa', 'nurserie-recif'],
    recommendedAfterCourseIds: [getAcademyCourseId('unit-4-2')],
    accessPolicy: 'recommended_after',
    lessonIds: [],
  },
  {
    id: 'living-web-foret-manakara',
    sourceId: 'foret-manakara',
    title: 'Toile vivante de Manakara',
    subtitle: 'Explorer les liens entre sols, orchidées, abeilles, caméléons et rucher.',
    domain: 'relations-du-vivant',
    theme: 'Toile vivante',
    subject: 'Forêt humide',
    conceptIds: ['living-web', 'pollination-agents', 'habitat-network'],
    level: 'intermediaire',
    durationMinutes: 5,
    tags: ['toile vivante', 'manakara', 'relations', 'abeille noire'],
    entry: {
      kind: 'living_web',
      href: '/ecosysteme/foret-manakara?node=abeille-noire-manakara',
    },
    relatedProjectSlugs: [MOCK_PROJECT_MANAKARA_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_BLACK_BEE_ID, MOCK_SPECIES_CHAMELEON_ID, MOCK_SPECIES_VARI_ID],
    relatedEcosystemIds: ['foret-manakara'],
    relatedNodeIds: [
      'sol-manakara',
      'orchidee-manakara',
      'abeille-noire-manakara',
      'cameleon-manakara',
      'rucher-manakara',
    ],
    recommendedAfterCourseIds: [getAcademyCourseId('chapter-1-boss')],
    accessPolicy: 'available',
    lessonIds: [],
  },
  {
    id: 'living-web-recif-karimunjawa',
    sourceId: 'recif-karimunjawa',
    title: 'Toile vivante du récif',
    subtitle: 'Voir comment le corail construit un refuge, puis comment le projet agit.',
    domain: 'milieux-habitats',
    theme: 'Toile vivante',
    subject: 'Récif corallien',
    conceptIds: ['living-web', 'coral-restoration', 'habitat-refuge'],
    level: 'intermediaire',
    durationMinutes: 5,
    tags: ['toile vivante', 'corail', 'récif', 'habitat'],
    entry: {
      kind: 'living_web',
      href: '/ecosysteme/recif-karimunjawa?node=acropora-karimunjawa',
    },
    relatedProjectSlugs: [MOCK_PROJECT_CORAL_SLUG],
    relatedSpeciesIds: [MOCK_SPECIES_ACROPORA_ID, MOCK_SPECIES_CLOWNFISH_ID, MOCK_SPECIES_GREEN_TURTLE_ID],
    relatedEcosystemIds: ['recif-karimunjawa'],
    relatedNodeIds: ['acropora-karimunjawa', 'nurserie-recif', 'projet-corail'],
    recommendedAfterCourseIds: [getAcademyCourseId('unit-4-2')],
    accessPolicy: 'available',
    lessonIds: [],
  },
  {
    id: 'living-web-pollinisateurs-belgique',
    sourceId: 'pollinisateurs-belgique',
    title: 'Toile des pollinisateurs',
    subtitle: 'Comparer haies, bourdons, osmies, syrphes et auxiliaires de Belgique.',
    domain: 'relations-du-vivant',
    theme: 'Toile vivante',
    subject: 'Pollinisateurs',
    conceptIds: ['living-web', 'pollination-agents', 'pest-regulation'],
    level: 'base',
    durationMinutes: 4,
    tags: ['toile vivante', 'pollinisateurs', 'belgique', 'melli'],
    entry: {
      kind: 'living_web',
      href: '/ecosysteme/pollinisateurs-belgique?node=bourdon-belgique',
    },
    relatedProjectSlugs: [MOCK_PROJECT_HABEEBEE_SLUG],
    relatedSpeciesIds: [
      MOCK_SPECIES_BUMBLEBEE_ID,
      MOCK_SPECIES_OSMIA_ID,
      MOCK_SPECIES_MEGACHILE_ID,
      MOCK_SPECIES_SYRPHID_ID,
    ],
    relatedEcosystemIds: ['pollinisateurs-belgique'],
    relatedNodeIds: ['bourdon-belgique', 'osmie-belgique', 'syrphe-belgique', 'projet-habeebee'],
    recommendedAfterCourseIds: [getAcademyCourseId('unit-3-1')],
    accessPolicy: 'available',
    lessonIds: [],
  },
].map((course) => learningCourseSchema.parse(course))

const LEARNING_COURSES: LearningCourse[] = [
  ...academyUnits.map(buildAcademyLearningCourse),
  ...PROJECT_AND_WEB_COURSES,
]

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'bases-du-vivant',
    title: 'Les bases du vivant',
    subtitle: 'Le chemin principal pour comprendre soleil, eau, sols, plantes et écosystèmes.',
    description: 'Une progression guidée courte, idéale avant de lire les projets ou le BioDex.',
    courseIds: [
      getAcademyCourseId('chapter-1-sun'),
      getAcademyCourseId('chapter-1-water'),
      getAcademyCourseId('chapter-1-soil'),
      getAcademyCourseId('chapter-1-plants-light'),
      getAcademyCourseId('chapter-1-life-factory'),
      getAcademyCourseId('chapter-1-boss'),
    ],
    domainIds: ['alphabet-du-vivant'],
    level: 'base',
    durationMinutes: 24,
    primaryHref: '/academy',
    isAcademyPrimary: true,
  },
  {
    id: 'pollinisateurs',
    title: 'Comprendre les pollinisateurs',
    subtitle: 'Fleurs, insectes, abeilles et projets apicoles.',
    description: 'Le parcours le plus utile pour Manakara, Antsirabe et Habeebee.',
    courseIds: [
      getAcademyCourseId('unit-2-2'),
      getAcademyCourseId('unit-3-1'),
      getAcademyCourseId('unit-5-4'),
      'living-web-pollinisateurs-belgique',
    ],
    domainIds: ['relations-du-vivant', 'solutions'],
    level: 'base',
    durationMinutes: 15,
    primaryHref: '/learn/parcours/pollinisateurs',
    isAcademyPrimary: false,
  },
  {
    id: 'forets-sols',
    title: 'Forêts & sols',
    subtitle: 'Sols vivants, eau, Madagascar et chaînes de forêt humide.',
    description: 'Un chemin pour relier les bases du vivant au projet de Manakara.',
    courseIds: [
      getAcademyCourseId('chapter-1-soil'),
      getAcademyCourseId('unit-3-2'),
      getAcademyCourseId('unit-4-1'),
      getAcademyCourseId('unit-5-3'),
      'living-web-foret-manakara',
    ],
    domainIds: ['alphabet-du-vivant', 'milieux-habitats', 'solutions'],
    level: 'intermediaire',
    durationMinutes: 21,
    primaryHref: '/learn/parcours/forets-sols',
    isAcademyPrimary: false,
  },
  {
    id: 'recifs-oceans',
    title: 'Récifs & océans',
    subtitle: 'Coraux, refuges marins, stress thermique et restauration.',
    description: 'Un parcours pour comprendre ce que protège une restauration corallienne.',
    courseIds: [
      getAcademyCourseId('unit-2-2'),
      getAcademyCourseId('unit-4-2'),
      getAcademyCourseId('unit-5-1'),
      'project-recif-karimunjawa-comprendre',
      'living-web-recif-karimunjawa',
    ],
    domainIds: ['milieux-habitats', 'menaces', 'lire-impact'],
    level: 'intermediaire',
    durationMinutes: 21,
    primaryHref: '/learn/parcours/recifs-oceans',
    isAcademyPrimary: false,
  },
  {
    id: 'lire-impact',
    title: "Lire l'impact",
    subtitle: 'Distinguer fait, estimation, proxy, preuve et greenwashing.',
    description: 'Le parcours pour soutenir un projet sans perdre le fil des limites.',
    courseIds: [
      getAcademyCourseId('unit-3-3'),
      getAcademyCourseId('unit-5-1'),
      getAcademyCourseId('unit-5-2'),
      'project-rucher-manakara-comprendre',
      'project-recif-karimunjawa-comprendre',
    ],
    domainIds: ['lire-impact', 'menaces', 'solutions'],
    level: 'intermediaire',
    durationMinutes: 19,
    primaryHref: '/learn/parcours/lire-impact',
    isAcademyPrimary: false,
  },
].map((path) => learningPathSchema.parse(path))

export function getAllLearningCourses(): LearningCourse[] {
  return LEARNING_COURSES
}

export function getLearningCourseById(courseId: string): LearningCourse | null {
  return LEARNING_COURSES.find((course) => course.id === courseId) ?? null
}

export function getAllLearningPaths(): LearningPath[] {
  return LEARNING_PATHS
}

export function getLearningPathById(pathId: string): LearningPath | null {
  return LEARNING_PATHS.find((path) => path.id === pathId) ?? null
}

export function getLearningCourseIdsForAcademyUnitIds(unitIds: string[]): string[] {
  return toCourseIds(unitIds)
}
