import {
  getAllLearningCourses,
  getAllLearningPaths,
  getLearningCourseById,
  LEARNING_ATLAS_DOMAINS,
} from './catalog'
import type {
  AtlasDomainWithCourses,
  AtlasIslandNode,
  AtlasIslandView,
  AtlasThemeGroup,
  LearningCourse,
  LearningDomainId,
  LearningHomeModel,
  LearningLevel,
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

export function getAtlasIslandViews(): AtlasIslandView[] {
  return getAtlasDomains().map((domain) => {
    const featuredPath =
      getAllLearningPaths()
        .filter((path) => path.domainIds.includes(domain.id))
        .sort(
          (a, b) =>
            Number(b.isAcademyPrimary) - Number(a.isAcademyPrimary) ||
            a.durationMinutes - b.durationMinutes,
        )[0] ?? null

    return {
      domain,
      visual: ATLAS_ISLAND_VISUALS[domain.id],
      nodes: getAtlasNodesForDomain(domain),
      featuredPathId: featuredPath?.id ?? null,
    }
  })
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
