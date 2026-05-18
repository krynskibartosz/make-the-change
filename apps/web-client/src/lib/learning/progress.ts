import { learningProgressSchema, type LearningProgress } from './schema'

export const LEARNING_PROGRESS_STORAGE_KEY = 'mtc_learning_progress_v1'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const uniqueStrings = (value: unknown): string[] =>
  Array.isArray(value)
    ? Array.from(new Set(value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)))
    : []

export function createDefaultLearningProgress(viewerId: string): LearningProgress {
  return {
    viewerId,
    completedCourseIds: [],
    completedLessonIdsByCourse: {},
    lastCourseId: null,
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeLearningProgress(viewerId: string, value: unknown): LearningProgress {
  const defaults = createDefaultLearningProgress(viewerId)
  if (!isRecord(value)) {
    return defaults
  }

  const rawLessonMap = isRecord(value.completedLessonIdsByCourse)
    ? value.completedLessonIdsByCourse
    : {}
  const completedLessonIdsByCourse = Object.fromEntries(
    Object.entries(rawLessonMap)
      .filter(([courseId]) => courseId.length > 0)
      .map(([courseId, lessonIds]) => [courseId, uniqueStrings(lessonIds)]),
  )

  return learningProgressSchema.parse({
    viewerId,
    completedCourseIds: uniqueStrings(value.completedCourseIds),
    completedLessonIdsByCourse,
    lastCourseId: typeof value.lastCourseId === 'string' && value.lastCourseId ? value.lastCourseId : null,
    updatedAt: typeof value.updatedAt === 'string' && value.updatedAt ? value.updatedAt : defaults.updatedAt,
  })
}

function readStoredLearningProgressEntries(): Record<string, unknown> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY)
    if (!rawValue) {
      return {}
    }
    const parsed = JSON.parse(rawValue) as unknown
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function writeStoredLearningProgressEntries(entries: Record<string, LearningProgress>) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(entries))
}

export function readLearningProgress(viewerId: string): LearningProgress {
  const entries = readStoredLearningProgressEntries()
  return normalizeLearningProgress(viewerId, entries[viewerId])
}

export function writeLearningProgress(progress: LearningProgress): LearningProgress {
  const nextProgress = normalizeLearningProgress(progress.viewerId, progress)
  const rawEntries = readStoredLearningProgressEntries()
  const entries = Object.fromEntries(
    Object.entries(rawEntries).map(([viewerId, value]) => [
      viewerId,
      normalizeLearningProgress(viewerId, value),
    ]),
  )
  writeStoredLearningProgressEntries({
    ...entries,
    [nextProgress.viewerId]: nextProgress,
  })
  return nextProgress
}

export function markLearningCourseCompleted(
  progress: LearningProgress,
  courseId: string,
): LearningProgress {
  const completedCourseIds = progress.completedCourseIds.includes(courseId)
    ? progress.completedCourseIds
    : [...progress.completedCourseIds, courseId]

  return normalizeLearningProgress(progress.viewerId, {
    ...progress,
    completedCourseIds,
    lastCourseId: courseId,
    updatedAt: new Date().toISOString(),
  })
}

export function markLearningLessonCompleted(
  progress: LearningProgress,
  courseId: string,
  lessonId: string,
  courseLessonIds: string[] = [],
): LearningProgress {
  const existingLessonIds = progress.completedLessonIdsByCourse[courseId] ?? []
  const completedLessonIds = existingLessonIds.includes(lessonId)
    ? existingLessonIds
    : [...existingLessonIds, lessonId]
  const nextProgress = normalizeLearningProgress(progress.viewerId, {
    ...progress,
    completedLessonIdsByCourse: {
      ...progress.completedLessonIdsByCourse,
      [courseId]: completedLessonIds,
    },
    lastCourseId: courseId,
    updatedAt: new Date().toISOString(),
  })

  if (courseLessonIds.length > 0 && courseLessonIds.every((id) => completedLessonIds.includes(id))) {
    return markLearningCourseCompleted(nextProgress, courseId)
  }

  return nextProgress
}
