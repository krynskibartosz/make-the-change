import { describe, expect, it } from 'vitest'
import { listV2Units } from '@/app/[locale]/(screens)/academy/_lib/content'
import { getAllLearningCourses, LEARNING_ATLAS_DOMAINS } from './catalog'
import { createDefaultLearningProgress, markLearningCourseCompleted } from './progress'
import {
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
