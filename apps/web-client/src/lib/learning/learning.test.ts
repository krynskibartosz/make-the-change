import { describe, expect, it } from 'vitest'
import { listV2Units } from '@/app/[locale]/(screens)/academy/_lib/content'
import { getAllLearningCourses, getAllLearningPaths, LEARNING_ATLAS_DOMAINS } from './catalog'
import { createDefaultLearningProgress, markLearningCourseCompleted } from './progress'
import {
  getAtlasDomainMap,
  getAtlasDomainMaps,
  getAtlasDomains,
  getAtlasIslandViews,
  getCoursesForEcosystemNode,
  getCoursesForProject,
  getCoursesForSpecies,
  searchLearningCourses,
} from './selectors'

describe('learning catalog', () => {
  it('maps every Academy V2 unit to one Learning course and one Atlas domain', () => {
    const courses = getAllLearningCourses()
    const courseSourceIds = new Set(
      courses
        .filter((course) => course.entry.kind === 'academy_unit')
        .map((course) => course.sourceId),
    )
    const atlasDomainIds = new Set(LEARNING_ATLAS_DOMAINS.map((domain) => domain.id))

    for (const unit of listV2Units()) {
      expect(courseSourceIds.has(unit.id)).toBe(true)
    }

    for (const course of courses) {
      expect(atlasDomainIds.has(course.domain)).toBe(true)
    }
  })

  it('returns Atlas domains with their courses grouped by theme', () => {
    const domains = getAtlasDomains()
    const alphabet = domains.find((domain) => domain.id === 'alphabet-du-vivant')

    expect(domains.length).toBe(6)
    expect(Boolean(alphabet)).toBe(true)
    expect((alphabet?.themeGroups.length ?? 0) > 0).toBe(true)
    expect((alphabet?.courseCount ?? 0) > 0).toBe(true)
  })

  it('builds visual Atlas islands for every domain', () => {
    const domains = getAtlasDomains()
    const islands = getAtlasIslandViews()

    expect(islands.map((island) => island.domain.id)).toEqual(domains.map((domain) => domain.id))

    for (const island of islands) {
      expect(island.visual.shortTitle.length > 0).toBe(true)
      expect(/^#[0-9A-F]{6}$/i.test(island.visual.color)).toBe(true)
      expect(island.visual.glow.includes('rgba(')).toBe(true)
      expect(island.visual.x >= 0 && island.visual.x <= 100).toBe(true)
      expect(island.visual.y >= 0 && island.visual.y <= 100).toBe(true)
      expect(island.nodes.length > 0).toBe(true)
    }
  })

  it('builds Atlas nodes with valid route targets', () => {
    const islands = getAtlasIslandViews()

    for (const island of islands) {
      for (const node of island.nodes) {
        expect(['chapter', 'course', 'toile'].includes(node.kind)).toBe(true)
        if (node.kind === 'chapter') {
          expect(/^\/learn\/parcours\//.test(node.href)).toBe(true)
        }
        if (node.kind === 'course') {
          expect(/^\/learn\/courses\//.test(node.href)).toBe(true)
        }
        if (node.kind === 'toile') {
          expect(/^\/ecosysteme\//.test(node.href)).toBe(true)
        }
      }
    }
  })

  it('builds immersive Atlas domain maps with valid educational nodes and edges', () => {
    const domains = getAtlasDomains()
    const maps = getAtlasDomainMaps()
    const courseIds = new Set(getAllLearningCourses().map((course) => course.id))
    const pathIds = new Set(getAllLearningPaths().map((path) => path.id))

    expect(maps.map((map) => map.domain.id)).toEqual(domains.map((domain) => domain.id))

    for (const map of maps) {
      const nodeIds = new Set(map.nodes.map((node) => node.id))

      expect(getAtlasDomainMap(map.domain.id)?.domain.id).toBe(map.domain.id)
      expect(map.nodes.length > 0).toBe(true)
      expect(map.edges.length > 0).toBe(true)

      for (const node of map.nodes) {
        expect(['chapter', 'course', 'micro_course', 'living_web'].includes(node.kind)).toBe(true)
        expect(['primary', 'secondary', 'micro', 'special'].includes(node.importance)).toBe(true)
        expect(['available', 'recommended', 'completed'].includes(node.status)).toBe(true)
        expect(node.x >= 0 && node.x <= 100).toBe(true)
        expect(node.y >= 0 && node.y <= 100).toBe(true)
        expect(node.shortLabel.length > 0).toBe(true)

        if (node.kind === 'chapter') {
          const pathId = node.href.replace('/learn/parcours/', '')

          expect(node.importance).toBe('primary')
          expect(/^\/learn\/parcours\//.test(node.href)).toBe(true)
          expect(pathIds.has(pathId)).toBe(true)
        }

        if (node.kind === 'course' || node.kind === 'micro_course') {
          expect(/^\/learn\/courses\//.test(node.href)).toBe(true)
          expect(node.courseIds.length > 0).toBe(true)
          expect(node.courseIds.every((courseId) => courseIds.has(courseId))).toBe(true)
        }

        if (node.kind === 'living_web') {
          expect(node.importance).toBe('special')
          expect(/^\/ecosysteme\//.test(node.href)).toBe(true)
          expect(
            node.courseIds.some((courseId) => {
              const course = getAllLearningCourses().find((entry) => entry.id === courseId)

              return course?.entry.kind === 'living_web'
            }),
          ).toBe(true)
        }
      }

      for (const edge of map.edges) {
        expect(['recommended_path', 'related_link'].includes(edge.kind)).toBe(true)
        expect(nodeIds.has(edge.fromNodeId)).toBe(true)
        expect(nodeIds.has(edge.toNodeId)).toBe(true)
        expect(edge.fromNodeId === edge.toNodeId).toBe(false)
      }
    }
  })

  it('searches and filters Learning courses', () => {
    const pollination = searchLearningCourses({ query: 'pollinisation' })
    const shortCourses = searchLearningCourses({ maxDurationMinutes: 5 })
    const domainCourses = searchLearningCourses({ domain: 'relations-du-vivant' })

    expect(pollination.some((course) => course.title.toLowerCase().includes('pollin'))).toBe(true)
    expect(shortCourses.every((course) => course.durationMinutes <= 5)).toBe(true)
    expect(domainCourses.every((course) => course.domain === 'relations-du-vivant')).toBe(true)
  })

  it('finds courses linked to projects, BioDex species and living web nodes', () => {
    expect(getCoursesForProject('miellerie-manakara-ilanga-nature').length > 0).toBe(true)
    expect(getCoursesForSpecies('species-abeille-noire').length > 0).toBe(true)
    expect(getCoursesForEcosystemNode('abeille-noire-manakara').length > 0).toBe(true)
  })
})

describe('learning progress', () => {
  it('tracks free-course completion separately from Academy progress fields', () => {
    const initial = createDefaultLearningProgress('viewer-1')
    const next = markLearningCourseCompleted(initial, 'course-pollination')

    expect(next.completedCourseIds).toEqual(['course-pollination'])
    expect(next.viewerId).toBe('viewer-1')
    expect('completedUnitIds' in next).toBe(false)
    expect('seedsBalance' in next).toBe(false)
  })
})
