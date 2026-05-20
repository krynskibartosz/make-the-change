import {
  getAllLearningCourses,
  getAllLearningPaths,
  getLearningCourseById,
  LEARNING_ATLAS_DOMAINS,
} from './catalog'
import {
  generateHexSpiral,
  mapContentToHexCells,
  type MapHexCell,
  type HexCellStatus,
} from './hex-generation'
import type {
  AtlasDomainMapEdge,
  AtlasDomainMapNode,
  AtlasDomainMapNodeImportance,
  AtlasDomainMapView,
  AtlasDomainWithCourses,
  AtlasIslandNode,
  AtlasIslandView,
  AtlasKinnuMapView,
  AtlasSubdomainConfig,
  AtlasTerritoryConfig,
  AtlasThemeGroup,
  HexCell,
  LearningCourse,
  LearningDomainId,
  LearningHomeModel,
  LearningLevel,
  LearningPath,
  LearningProgress,
} from './schema'

export type LearningCourseSearchFilters = {
  query?: string
  domain?: LearningDomainId | 'all'
  level?: LearningLevel | 'all'
  maxDurationMinutes?: number
  projectSlug?: string
  speciesId?: string
  ecosystemId?: string
}

export type LearningHomeInput = {
  progress?: LearningProgress | null
  projectSlugs?: string[]
  speciesIds?: string[]
  limit?: number
}

const ATLAS_ISLAND_VISUALS: Record<LearningDomainId, AtlasIslandView['visual']> = {
  'alphabet-du-vivant': {
    shortTitle: 'Alphabet',
    iconKey: 'book-open',
    color: '#A7F36B',
    glow: 'rgba(167, 243, 107, 0.42)',
    labelColor: '#DDFCC3',
    x: 23,
    y: 24,
    size: 1.02,
    terrain: 'forest',
  },
  'milieux-habitats': {
    shortTitle: 'Milieux',
    iconKey: 'droplets',
    color: '#6AD7FF',
    glow: 'rgba(106, 215, 255, 0.38)',
    labelColor: '#BCEEFF',
    x: 70,
    y: 25,
    size: 0.98,
    terrain: 'water',
  },
  'relations-du-vivant': {
    shortTitle: 'Relations',
    iconKey: 'network',
    color: '#F6C75F',
    glow: 'rgba(246, 199, 95, 0.4)',
    labelColor: '#FFE3A3',
    x: 32,
    y: 52,
    size: 1.05,
    terrain: 'network',
  },
  menaces: {
    shortTitle: 'Menaces',
    iconKey: 'triangle-alert',
    color: '#FF8F7A',
    glow: 'rgba(255, 143, 122, 0.34)',
    labelColor: '#FFC6BA',
    x: 73,
    y: 53,
    size: 0.94,
    terrain: 'threat',
  },
  solutions: {
    shortTitle: 'Solutions',
    iconKey: 'sprout',
    color: '#8EEB72',
    glow: 'rgba(142, 235, 114, 0.44)',
    labelColor: '#CFF8C2',
    x: 41,
    y: 78,
    size: 1.12,
    terrain: 'solution',
  },
  'lire-impact': {
    shortTitle: 'Impact',
    iconKey: 'bar-chart-3',
    color: '#7DBDFF',
    glow: 'rgba(125, 189, 255, 0.34)',
    labelColor: '#C2DEFF',
    x: 77,
    y: 78,
    size: 0.93,
    terrain: 'proof',
  },
}

const ATLAS_NODE_POSITIONS: Array<Pick<AtlasIslandNode, 'x' | 'y' | 'size'>> = [
  { x: 50, y: 32, size: 'large' },
  { x: 34, y: 48, size: 'small' },
  { x: 63, y: 49, size: 'small' },
  { x: 45, y: 63, size: 'medium' },
  { x: 68, y: 68, size: 'small' },
  { x: 27, y: 68, size: 'small' },
  { x: 53, y: 78, size: 'small' },
]

const DEFAULT_ATLAS_NODE_POSITION: Pick<AtlasIslandNode, 'x' | 'y' | 'size'> = {
  x: 50,
  y: 50,
  size: 'small',
}

const ATLAS_DOMAIN_MAP_POSITIONS: Array<
  Pick<AtlasDomainMapNode, 'x' | 'y'> & { importance: AtlasDomainMapNodeImportance }
> = [
  { x: 70, y: 74, importance: 'primary' },
  { x: 28, y: 36, importance: 'secondary' },
  { x: 58, y: 28, importance: 'secondary' },
  { x: 36, y: 61, importance: 'secondary' },
  { x: 71, y: 45, importance: 'secondary' },
  { x: 47, y: 78, importance: 'micro' },
  { x: 19, y: 70, importance: 'micro' },
  { x: 82, y: 30, importance: 'micro' },
  { x: 82, y: 60, importance: 'special' },
]

const DEFAULT_ATLAS_DOMAIN_MAP_POSITION: Pick<AtlasDomainMapNode, 'x' | 'y'> & {
  importance: AtlasDomainMapNodeImportance
} = {
  x: 50,
  y: 50,
  importance: 'micro',
}

const HEX_BLOB_CELLS: HexCell[] = [
  { q: -2, r: 0 },
  { q: -2, r: 1 },
  { q: -1, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: -1, r: 2 },
  { q: 0, r: -2 },
  { q: 0, r: -1 },
  { q: 0, r: 0 },
  { q: 0, r: 1 },
  { q: 0, r: 2 },
  { q: 1, r: -2 },
  { q: 1, r: -1 },
  { q: 1, r: 0 },
  { q: 1, r: 1 },
  { q: 2, r: -2 },
  { q: 2, r: -1 },
  { q: 2, r: 0 },
  { q: 3, r: -2 },
]

const HEX_WIDE_BLOB_CELLS: HexCell[] = [
  ...HEX_BLOB_CELLS,
  { q: -3, r: 1 },
  { q: -3, r: 2 },
  { q: 3, r: -1 },
  { q: 3, r: 0 },
  { q: 4, r: -2 },
]

const HEX_TEXTURE_CELLS: HexCell[] = [
  { q: -2, r: 1 },
  { q: -1, r: -1 },
  { q: -1, r: 1 },
  { q: 0, r: -2 },
  { q: 0, r: 0 },
  { q: 1, r: -1 },
  { q: 1, r: 1 },
  { q: 2, r: -2 },
  { q: 2, r: 0 },
]

const HEX_SMALL_BLOB_CELLS: HexCell[] = [
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: -1 },
  { q: 0, r: 0 },
  { q: 0, r: 1 },
  { q: 1, r: -1 },
  { q: 1, r: 0 },
]

/** Minimum number of hex cells for a subdomain to maintain visual presence. */
const MIN_SUBDOMAIN_CELLS = 3

const ATLAS_KINNU_TERRITORY_CONFIG: Record<
  LearningDomainId,
  Omit<AtlasTerritoryConfig, 'domain' | 'cells' | 'textureCells'>
> = {
  'alphabet-du-vivant': {
    label: 'Alphabet',
    color: '#9DDB54',
    darkColor: '#314821',
    textColor: '#F5FFD4',
    x: 25,
    y: 29,
    camera: { x: -190, y: -150, scale: 2.08 },
    subdomains: [
      {
        id: 'notions',
        label: 'Notions de base',
        x: 23,
        y: 24,
        color: '#84C86F',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Énergie', 'Cycles', 'Sols'],
      },
      {
        id: 'questions',
        label: 'Questions simples',
        x: 35,
        y: 36,
        color: '#52B9A8',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Vie'],
      },
      {
        id: 'mini-cours',
        label: 'Mini-cours',
        x: 27,
        y: 53,
        color: '#E5B947',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Réflexes'],
      },
      {
        id: 'modules',
        label: 'Modules guidés',
        x: 43,
        y: 56,
        color: '#7BCF5B',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Synthèse'],
      },
    ],
  },
  'milieux-habitats': {
    label: 'Milieux',
    color: '#38B7E8',
    darkColor: '#1E4C5A',
    textColor: '#D9F7FF',
    x: 63,
    y: 21,
    camera: { x: -520, y: -90, scale: 2.1 },
    subdomains: [
      {
        id: 'habitats',
        label: 'Habitats',
        x: 59,
        y: 18,
        color: '#37B8DF',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Îles & endémisme', 'Rythmes du vivant'],
      },
      {
        id: 'eau',
        label: 'Eau & cycles',
        x: 75,
        y: 22,
        color: '#69D7FF',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Cycles'],
      },
      {
        id: 'forets',
        label: 'Forêts',
        x: 62,
        y: 36,
        color: '#62C76A',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
      {
        id: 'oceans',
        label: 'Océans',
        x: 78,
        y: 38,
        color: '#4C98F0',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Océans & récifs', 'Toile vivante'],
      },
    ],
  },
  'relations-du-vivant': {
    label: 'Relations',
    color: '#EAB928',
    darkColor: '#5A4C19',
    textColor: '#FFF3B7',
    x: 41,
    y: 45,
    camera: { x: -330, y: -430, scale: 2.05 },
    subdomains: [
      {
        id: 'pollinisation',
        label: 'Pollinisation',
        x: 34,
        y: 39,
        color: '#F1C84B',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Pollinisation', 'Toile vivante'],
      },
      {
        id: 'symbiose',
        label: 'Symbiose',
        x: 48,
        y: 42,
        color: '#59BE83',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Coopérations', 'Évolution'],
      },
      {
        id: 'chaines',
        label: 'Chaînes alimentaires',
        x: 37,
        y: 56,
        color: '#D58B4B',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Chaînes alimentaires'],
      },
      {
        id: 'decomposition',
        label: 'Décomposition',
        x: 53,
        y: 58,
        color: '#A78655',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
    ],
  },
  menaces: {
    label: 'Menaces',
    color: '#E94E67',
    darkColor: '#5A2532',
    textColor: '#FFD4DC',
    x: 71,
    y: 43,
    camera: { x: -650, y: -405, scale: 2.08 },
    subdomains: [
      {
        id: 'climat',
        label: 'Climat',
        x: 72,
        y: 37,
        color: '#EF6D57',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Crises du vivant'],
      },
      {
        id: 'pollution',
        label: 'Pollution',
        x: 86,
        y: 41,
        color: '#C95BE8',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
      {
        id: 'fragmentation',
        label: 'Fragmentation',
        x: 72,
        y: 55,
        color: '#D94969',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
      {
        id: 'invasives',
        label: 'Invasives',
        x: 88,
        y: 58,
        color: '#B34D6E',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
    ],
  },
  solutions: {
    label: 'Solutions',
    color: '#6FCB2A',
    darkColor: '#31551F',
    textColor: '#E7FFD2',
    x: 45,
    y: 67,
    camera: { x: -510, y: -710, scale: 2.08 },
    subdomains: [
      {
        id: 'restaurer',
        label: 'Restaurer',
        x: 50,
        y: 62,
        color: '#6FD15D',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Restaurer'],
      },
      {
        id: 'suivre',
        label: 'Suivre',
        x: 67,
        y: 63,
        color: '#4AC4A0',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
      {
        id: 'produire',
        label: 'Produire avec le vivant',
        x: 51,
        y: 78,
        color: '#9DCA45',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Produire avec le vivant'],
      },
      {
        id: 'agir',
        label: 'Agir localement',
        x: 70,
        y: 80,
        color: '#F06D3A',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Projets terrain'],
      },
    ],
  },
  'lire-impact': {
    label: 'Impact',
    color: '#8D9B8F',
    darkColor: '#3F433D',
    textColor: '#F2F1E9',
    x: 68,
    y: 76,
    camera: { x: -710, y: -820, scale: 2.08 },
    subdomains: [
      {
        id: 'preuves',
        label: 'Preuves',
        x: 77,
        y: 70,
        color: '#9FA9A0',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Métriques'],
      },
      {
        id: 'estimer',
        label: 'Estimer',
        x: 91,
        y: 74,
        color: '#7DBDFF',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: ['Projets terrain'],
      },
      {
        id: 'suivi',
        label: 'Suivi terrain',
        x: 78,
        y: 88,
        color: '#5FC7A7',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
      {
        id: 'prudence',
        label: 'Prudence',
        x: 93,
        y: 91,
        color: '#D0BA75',
        cells: HEX_SMALL_BLOB_CELLS,
        themeKeys: [],
      },
    ],
  },
}

const byDurationThenTitle = (a: LearningCourse, b: LearningCourse) =>
  a.durationMinutes - b.durationMinutes || a.title.localeCompare(b.title, 'fr')

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const courseSearchBlob = (course: LearningCourse) =>
  normalizeSearchText(
    [
      course.title,
      course.subtitle,
      course.domain,
      course.theme,
      course.subject,
      ...course.conceptIds,
      ...course.tags,
    ].join(' '),
  )

function uniqueCourses(courses: LearningCourse[]): LearningCourse[] {
  const seen = new Set<string>()
  return courses.filter((course) => {
    if (seen.has(course.id)) {
      return false
    }
    seen.add(course.id)
    return true
  })
}

export function searchLearningCourses(filters: LearningCourseSearchFilters = {}): LearningCourse[] {
  const query = filters.query?.trim()
  const normalizedQuery = query ? normalizeSearchText(query) : null

  return getAllLearningCourses()
    .filter((course) => {
      if (filters.domain && filters.domain !== 'all' && course.domain !== filters.domain) {
        return false
      }
      if (filters.level && filters.level !== 'all' && course.level !== filters.level) {
        return false
      }
      if (
        typeof filters.maxDurationMinutes === 'number' &&
        course.durationMinutes > filters.maxDurationMinutes
      ) {
        return false
      }
      if (filters.projectSlug && !course.relatedProjectSlugs.includes(filters.projectSlug)) {
        return false
      }
      if (filters.speciesId && !course.relatedSpeciesIds.includes(filters.speciesId)) {
        return false
      }
      if (filters.ecosystemId && !course.relatedEcosystemIds.includes(filters.ecosystemId)) {
        return false
      }
      if (normalizedQuery && !courseSearchBlob(course).includes(normalizedQuery)) {
        return false
      }
      return true
    })
    .sort(byDurationThenTitle)
}

export function getCoursesForProject(projectSlug: string, limit = 6): LearningCourse[] {
  return searchLearningCourses({ projectSlug }).slice(0, limit)
}

export function getCoursesForSpecies(speciesId: string, limit = 6): LearningCourse[] {
  return searchLearningCourses({ speciesId }).slice(0, limit)
}

export function getCoursesForEcosystemNode(nodeId: string, limit = 6): LearningCourse[] {
  return getAllLearningCourses()
    .filter((course) => course.relatedNodeIds.includes(nodeId))
    .sort(byDurationThenTitle)
    .slice(0, limit)
}

export function getCoursesForEcosystem(ecosystemId: string, limit = 6): LearningCourse[] {
  return searchLearningCourses({ ecosystemId }).slice(0, limit)
}

export function getAtlasDomains(): AtlasDomainWithCourses[] {
  const courses = getAllLearningCourses()

  return LEARNING_ATLAS_DOMAINS.slice()
    .sort((a, b) => a.order - b.order)
    .map((domain) => {
      const domainCourses = courses
        .filter((course) => course.domain === domain.id)
        .sort(byDurationThenTitle)
      const grouped = new Map<string, LearningCourse[]>()

      for (const course of domainCourses) {
        const themeCourses = grouped.get(course.theme) ?? []
        themeCourses.push(course)
        grouped.set(course.theme, themeCourses)
      }

      const themeGroups: AtlasThemeGroup[] = Array.from(grouped.entries()).map(
        ([theme, themeCourses]) => ({
          theme,
          courses: themeCourses,
        }),
      )

      return {
        ...domain,
        courseCount: domainCourses.length,
        themeGroups,
      }
    })
}

function toAtlasNode(
  node: Omit<AtlasIslandNode, 'x' | 'y' | 'size'>,
  index: number,
): AtlasIslandNode {
  const position =
    ATLAS_NODE_POSITIONS[index % ATLAS_NODE_POSITIONS.length] ?? DEFAULT_ATLAS_NODE_POSITION
  return {
    ...node,
    ...position,
  }
}

function getRepresentativeCourse(courses: LearningCourse[]): LearningCourse | null {
  return (
    courses.slice().sort((a, b) => {
      const kindScore = (course: LearningCourse) => {
        if (course.entry.kind === 'academy_unit') return 0
        if (course.entry.kind === 'living_web') return 2
        return 1
      }
      return kindScore(a) - kindScore(b) || byDurationThenTitle(a, b)
    })[0] ?? null
  )
}

function getAtlasNodesForDomain(domain: AtlasDomainWithCourses): AtlasIslandNode[] {
  const paths = getAllLearningPaths()
    .filter((path) => path.domainIds.includes(domain.id))
    .sort(
      (a, b) =>
        Number(b.isAcademyPrimary) - Number(a.isAcademyPrimary) ||
        a.durationMinutes - b.durationMinutes,
    )
  const nodes: Array<Omit<AtlasIslandNode, 'x' | 'y' | 'size'>> = []
  const usedCourseIds = new Set<string>()

  const featuredPath = paths[0]
  if (featuredPath) {
    for (const courseId of featuredPath.courseIds) {
      usedCourseIds.add(courseId)
    }
    nodes.push({
      id: `chapter-${featuredPath.id}`,
      kind: 'chapter',
      title: featuredPath.title,
      subtitle: `${featuredPath.courseIds.length} étapes guidées`,
      href: `/learn/parcours/${featuredPath.id}`,
      courseIds: featuredPath.courseIds,
    })
  }

  for (const group of domain.themeGroups) {
    const livingWebCourse = group.courses.find((course) => course.entry.kind === 'living_web')
    if (livingWebCourse && !usedCourseIds.has(livingWebCourse.id)) {
      usedCourseIds.add(livingWebCourse.id)
      nodes.push({
        id: `toile-${livingWebCourse.id}`,
        kind: 'toile',
        title: livingWebCourse.subject,
        subtitle: 'Voir les liens',
        href: livingWebCourse.entry.href,
        courseIds: [livingWebCourse.id],
      })
    }

    const course = getRepresentativeCourse(
      group.courses.filter((entry) => !usedCourseIds.has(entry.id)),
    )
    if (course) {
      usedCourseIds.add(course.id)
      nodes.push({
        id: `course-${course.id}`,
        kind: 'course',
        title: course.subject,
        subtitle: course.durationMinutes <= 5 ? 'Cours court' : course.theme,
        href: `/learn/courses/${course.id}`,
        courseIds: [course.id],
      })
    }
  }

  return nodes.slice(0, ATLAS_NODE_POSITIONS.length).map(toAtlasNode)
}

function getFeaturedPathForDomain(domainId: LearningDomainId) {
  return (
    getAllLearningPaths()
      .filter((path) => path.domainIds.includes(domainId))
      .sort(
        (a, b) =>
          Number(b.isAcademyPrimary) - Number(a.isAcademyPrimary) ||
          a.durationMinutes - b.durationMinutes,
      )[0] ?? null
  )
}

export function getAtlasIslandViews(): AtlasIslandView[] {
  return getAtlasDomains().map((domain) => {
    const featuredPath = getFeaturedPathForDomain(domain.id)

    return {
      domain,
      visual: ATLAS_ISLAND_VISUALS[domain.id],
      nodes: getAtlasNodesForDomain(domain),
      featuredPathId: featuredPath?.id ?? null,
    }
  })
}

/**
 * Returns the number of courses linked to a subdomain config via its themeKeys.
 */
function getSubdomainCourseCount(
  domainId: LearningDomainId,
  subdomain: Omit<AtlasSubdomainConfig, 'cells'> & { themeKeys: string[] },
): number {
  if (subdomain.themeKeys.length === 0) return 0
  const allCourses = getAllLearningCourses()
  return allCourses.filter(
    (c) => c.domain === domainId && subdomain.themeKeys.includes(c.theme),
  ).length
}

export function getAtlasKinnuMapView(): AtlasKinnuMapView {
  return {
    worldCamera: { x: 0, y: 0, scale: 1 },
    territories: getAtlasDomains().map((domain) => {
      const config = ATLAS_KINNU_TERRITORY_CONFIG[domain.id]

      // Generate dynamic cells for each subdomain based on course count
      const subdomainsWithDynamicCells = config.subdomains.map((sd) => {
        const courseCount = getSubdomainCourseCount(domain.id, sd)
        const cellCount = Math.max(courseCount, MIN_SUBDOMAIN_CELLS)
        return {
          ...sd,
          cells: generateHexSpiral(cellCount),
        }
      })

      return {
        ...config,
        subdomains: subdomainsWithDynamicCells,
        domain,
        cells:
          domain.id === 'relations-du-vivant' || domain.id === 'solutions'
            ? HEX_WIDE_BLOB_CELLS
            : HEX_BLOB_CELLS,
        textureCells: HEX_TEXTURE_CELLS,
      }
    }),
  }
}

function getDomainMapPosition(index: number, importance?: AtlasDomainMapNodeImportance) {
  if (importance === 'special') {
    return (
      ATLAS_DOMAIN_MAP_POSITIONS.find((position) => position.importance === 'special') ??
      DEFAULT_ATLAS_DOMAIN_MAP_POSITION
    )
  }

  const position =
    ATLAS_DOMAIN_MAP_POSITIONS[index % ATLAS_DOMAIN_MAP_POSITIONS.length] ??
    DEFAULT_ATLAS_DOMAIN_MAP_POSITION

  return importance
    ? {
        ...position,
        importance,
      }
    : position
}

function shortenLabel(value: string, maxLength = 18): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trim()}…`
}

function getCourseStatus(course: LearningCourse): AtlasDomainMapNode['status'] {
  return course.accessPolicy === 'recommended_after' ? 'recommended' : 'available'
}

function buildDomainMapNode(
  node: Omit<AtlasDomainMapNode, 'x' | 'y' | 'importance' | 'status'> & {
    importance?: AtlasDomainMapNodeImportance
    status?: AtlasDomainMapNode['status']
  },
  index: number,
): AtlasDomainMapNode {
  const position = getDomainMapPosition(index, node.importance)

  return {
    ...node,
    x: position.x,
    y: position.y,
    importance: node.importance ?? position.importance,
    status: node.status ?? 'available',
  }
}

function buildDomainMapEdges(nodes: AtlasDomainMapNode[]): AtlasDomainMapEdge[] {
  const visibleNodes = nodes.filter((node) => node.importance !== 'micro')
  const edges: AtlasDomainMapEdge[] = []

  for (let index = 0; index < visibleNodes.length - 1; index += 1) {
    const fromNode = visibleNodes[index]
    const toNode = visibleNodes[index + 1]

    if (!fromNode || !toNode) {
      continue
    }

    edges.push({
      id: `related-${fromNode.id}-${toNode.id}`,
      fromNodeId: fromNode.id,
      toNodeId: toNode.id,
      kind: 'related_link',
    })
  }

  const anchor =
    nodes.find((node) => node.kind === 'chapter') ??
    nodes.find((node) => node.kind === 'course') ??
    nodes[0]
  if (!anchor) {
    return edges
  }

  for (const node of nodes) {
    if (node.id === anchor.id || visibleNodes.includes(node)) {
      continue
    }

    edges.push({
      id: `related-${anchor.id}-${node.id}`,
      fromNodeId: anchor.id,
      toNodeId: node.id,
      kind: 'related_link',
    })
  }

  if (edges.length === 0 && nodes.length > 1) {
    const fromNode = nodes[0]
    const toNode = nodes[1]

    if (!fromNode || !toNode) {
      return edges
    }

    edges.push({
      id: `related-${fromNode.id}-${toNode.id}`,
      fromNodeId: fromNode.id,
      toNodeId: toNode.id,
      kind: 'related_link',
    })
  }

  return edges
}

function getAtlasDomainMapNodes(domain: AtlasDomainWithCourses): AtlasDomainMapNode[] {
  const featuredPath = getFeaturedPathForDomain(domain.id)
  const nodes: AtlasDomainMapNode[] = []
  const usedNodeIds = new Set<string>()

  if (featuredPath) {
    const node = buildDomainMapNode(
      {
        id: `chapter-${featuredPath.id}`,
        kind: 'chapter',
        title: featuredPath.title,
        shortLabel: shortenLabel(featuredPath.title, 17),
        subtitle: `${featuredPath.courseIds.length} étapes - module guidé`,
        href: `/learn/parcours/${featuredPath.id}`,
        courseIds: featuredPath.courseIds,
        importance: 'primary',
        status: 'available',
      },
      nodes.length,
    )

    nodes.push(node)
    usedNodeIds.add(node.id)
  }

  const livingWebCourses = domain.themeGroups.flatMap((group) =>
    group.courses.filter((course) => course.entry.kind === 'living_web'),
  )

  const representativeCourses = domain.themeGroups
    .map((group) => getRepresentativeCourse(group.courses))
    .filter((course): course is LearningCourse => Boolean(course))

  const courseCandidates = uniqueCourses([
    ...representativeCourses,
    ...domain.themeGroups.flatMap((group) => group.courses),
  ])

  let courseNodeCount = 0
  for (const course of courseCandidates) {
    const isLivingWeb = course.entry.kind === 'living_web'
    const isSpecialLivingWeb =
      isLivingWeb && livingWebCourses.some((livingWebCourse) => livingWebCourse.id === course.id)
    const kind: AtlasDomainMapNode['kind'] = isSpecialLivingWeb
      ? 'living_web'
      : courseNodeCount < 3
        ? 'course'
        : 'micro_course'
    const id =
      kind === 'living_web'
        ? `living-web-${course.id}`
        : kind === 'micro_course'
          ? `micro-${course.id}`
          : `course-${course.id}`

    if (usedNodeIds.has(id)) {
      continue
    }

    const node = buildDomainMapNode(
      {
        id,
        kind,
        title: course.subject,
        shortLabel: shortenLabel(course.subject, kind === 'micro_course' ? 12 : 16),
        subtitle:
          kind === 'living_web'
            ? 'Carte de liens pédagogique'
            : kind === 'micro_course'
              ? `${course.durationMinutes} min - question courte`
              : course.durationMinutes <= 5
                ? `${course.durationMinutes} min - mini-cours`
                : `${course.durationMinutes} min - notion`,
        href:
          kind === 'living_web'
            ? course.entry.href
            : getLearningCoursePlayHref(course, `/learn/atlas/${domain.id}`),
        courseIds: [course.id],
        importance:
          kind === 'living_web' ? 'special' : kind === 'micro_course' ? 'micro' : 'secondary',
        status: getCourseStatus(course),
      },
      nodes.length,
    )

    nodes.push(node)
    usedNodeIds.add(node.id)

    if (kind !== 'living_web') {
      courseNodeCount += 1
    }

    if (nodes.length >= ATLAS_DOMAIN_MAP_POSITIONS.length) {
      break
    }
  }

  return nodes
}

export function getAtlasDomainMaps(): AtlasDomainMapView[] {
  return getAtlasDomains().map((domain) => {
    const featuredPath = getFeaturedPathForDomain(domain.id)
    const nodes = getAtlasDomainMapNodes(domain)

    return {
      domain,
      visual: ATLAS_ISLAND_VISUALS[domain.id],
      nodes,
      edges: buildDomainMapEdges(nodes),
      featuredPathId: featuredPath?.id ?? null,
    }
  })
}

export function getAtlasDomainMap(domainId: LearningDomainId): AtlasDomainMapView | null {
  return getAtlasDomainMaps().find((map) => map.domain.id === domainId) ?? null
}

export function getRecommendedAfterCourses(course: LearningCourse): LearningCourse[] {
  return course.recommendedAfterCourseIds
    .map((courseId) => getLearningCourseById(courseId))
    .filter((entry): entry is LearningCourse => Boolean(entry))
}

export function getLearningCoursePlayHref(
  course: LearningCourse,
  returnTo = `/learn/courses/${course.id}`,
): string {
  if (course.entry.kind !== 'academy_unit') {
    return course.entry.href
  }

  const params = new URLSearchParams({
    mode: 'course',
    courseId: course.id,
    returnTo,
  })

  return `${course.entry.href}?${params.toString()}`
}

export function getLearningHome(input: LearningHomeInput = {}): LearningHomeModel {
  const limit = input.limit ?? 4
  const courses = getAllLearningCourses()
  const completed = new Set(input.progress?.completedCourseIds ?? [])
  const lastCourse = input.progress?.lastCourseId
    ? getLearningCourseById(input.progress.lastCourseId)
    : null
  const today = courses
    .filter((course) => !completed.has(course.id))
    .filter((course) => course.level === 'base' || course.relatedProjectSlugs.length > 0)
    .sort(byDurationThenTitle)
    .slice(0, limit)
  const projectGroups = (input.projectSlugs ?? [])
    .map((projectSlug) => ({
      projectSlug,
      courses: getCoursesForProject(projectSlug, 3),
    }))
    .filter((group) => group.courses.length > 0)
  const biodexCourses = uniqueCourses(
    (input.speciesIds ?? []).flatMap((speciesId) => getCoursesForSpecies(speciesId, 3)),
  ).slice(0, limit)

  return {
    continueCourse: lastCourse,
    today,
    projectGroups,
    atlasDomains: getAtlasDomains(),
    livingWebCourses: courses
      .filter((course) => course.entry.kind === 'living_web')
      .sort(byDurationThenTitle)
      .slice(0, limit),
    biodexCourses,
    allCourses: courses.slice().sort(byDurationThenTitle),
  }
}

export type SubdomainContent = {
  subdomain: AtlasSubdomainConfig
  territory: AtlasTerritoryConfig
  modules: LearningPath[]           // Modules guidés liés à ce subdomain
  courses: LearningCourse[]         // Cours libres
  totalCourses: number
  completedCount: number            // Basé sur la progress
}

export function getSubdomainContent(
  domainId: LearningDomainId,
  subdomainId: string,
  progress?: LearningProgress | null,
): SubdomainContent | null {
  const map = getAtlasKinnuMapView()
  const territory = map.territories.find((t) => t.domain.id === domainId)
  if (!territory) return null

  const subdomain = territory.subdomains.find((s) => s.id === subdomainId)
  if (!subdomain) return null

  const allCourses = getAllLearningCourses()
  const subdomainCourses = allCourses.filter(
    (course) => course.domain === domainId && subdomain.themeKeys.includes(course.theme),
  )

  const modules = getAllLearningPaths().filter((path) =>
    path.courseIds.some((cid) => subdomainCourses.some((c) => c.id === cid)),
  )

  const moduleCourseIds = new Set(modules.flatMap((path) => path.courseIds))
  const freeCourses = subdomainCourses.filter((course) => !moduleCourseIds.has(course.id))

  const completed = new Set(progress?.completedCourseIds ?? [])
  const completedCount = subdomainCourses.filter((c) => completed.has(c.id)).length

  return {
    subdomain,
    territory,
    modules,
    courses: freeCourses,
    totalCourses: subdomainCourses.length,
    completedCount,
  }
}

export function getSubdomainProgress(
  domainId: LearningDomainId,
  subdomainId: string,
  progress: LearningProgress | null,
): number {
  const map = getAtlasKinnuMapView()
  const territory = map.territories.find((t) => t.domain.id === domainId)
  if (!territory) return 0

  const subdomain = territory.subdomains.find((s) => s.id === subdomainId)
  if (!subdomain) return 0

  const allCourses = getAllLearningCourses()
  const subdomainCourses = allCourses.filter(
    (course) => course.domain === domainId && subdomain.themeKeys.includes(course.theme),
  )

  if (subdomainCourses.length === 0) return 0

  const completed = new Set(progress?.completedCourseIds ?? [])
  const completedCount = subdomainCourses.filter((c) => completed.has(c.id)).length

  return completedCount / subdomainCourses.length
}

/**
 * Returns enriched hex cells for a subdomain, where each cell maps to
 * a specific course or module with its completion status and navigation href.
 * Used by the SVG renderer at deep zoom levels to show per-cell detail.
 */
export function getSubdomainMapCells(
  domainId: LearningDomainId,
  subdomainId: string,
  progress: LearningProgress | null,
): MapHexCell[] {
  const content = getSubdomainContent(domainId, subdomainId, progress)
  if (!content) return []

  const completed = new Set(progress?.completedCourseIds ?? [])
  const lessonsByCourse = progress?.completedLessonIdsByCourse ?? {}

  const items: Array<{
    id: string
    title: string
    kind: 'module' | 'course'
    status: HexCellStatus
    href: string
    progressCount?: number
    progressTotal?: number
  }> = []

  // Add guided modules as center cells
  for (const mod of content.modules) {
    const moduleCompleted = mod.courseIds.every((cid) => completed.has(cid))
    const moduleStarted = mod.courseIds.some(
      (cid) => completed.has(cid) || (lessonsByCourse[cid]?.length ?? 0) > 0,
    )
    items.push({
      id: mod.id,
      title: mod.title,
      kind: 'module',
      status: moduleCompleted ? 'completed' : moduleStarted ? 'in-progress' : 'not-started',
      href: `/learn/parcours/${mod.id}`,
      progressCount: mod.courseIds.filter((cid) => completed.has(cid)).length,
      progressTotal: mod.courseIds.length,
    })
  }

  // Add free courses as peripheral cells
  for (const course of content.courses) {
    const courseCompleted = completed.has(course.id)
    const courseStarted = (lessonsByCourse[course.id]?.length ?? 0) > 0
    items.push({
      id: course.id,
      title: course.subject,
      kind: 'course',
      status: courseCompleted ? 'completed' : courseStarted ? 'in-progress' : 'not-started',
      href: `/learn/courses/${course.id}`,
    })
  }

  return mapContentToHexCells(items)
}
