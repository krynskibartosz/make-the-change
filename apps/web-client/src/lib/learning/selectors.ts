import {
  getAllLearningCourses,
  getLearningCourseById,
  LEARNING_ATLAS_DOMAINS,
} from './catalog'
import type {
  AtlasDomainWithCourses,
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
