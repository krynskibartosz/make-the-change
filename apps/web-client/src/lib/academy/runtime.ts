import type {
  AcademyChapter as LegacyChapter,
  AcademyExercise as LegacyExercise,
  AcademyLesson as LegacyLesson,
  AcademyQuestionPool as LegacyQuestionPool,
  AcademyUnit as LegacyUnit,
} from '@/lib/mock/mock-academy'
import { generateLessonExercises } from './lesson-generator'
import type {
  AcademyChapterDefinition,
  AcademyExercise as V2Exercise,
  AcademyLessonDefinition,
  AcademyUnitDefinition,
  AcademyDragDropExercise as V2DragDrop,
  AcademyQuizExercise as V2Quiz,
  AcademyStoryExercise as V2Story,
  AcademySwipeExercise as V2Swipe,
} from './schema'

/**
 * Runtime adapter : convertit le schéma V2 (riche, validé Zod) vers les
 * structures consommées par l'UI existante (legacy `AcademyUnit`, `AcademyChapter`).
 *
 * Les champs supplémentaires V2 (cognitiveTags, learningObjective, axis,
 * options[].feedback, …) sont **conservés** (TypeScript le permet via
 * intersection) pour que les composants UI puissent les lire quand ils
 * sont mis à jour, tout en restant rétro-compatibles.
 *
 * Ce fichier garantit qu'aucune unité V2 ne casse l'app pendant la
 * migration progressive : à tout moment, mock-academy.ts peut mélanger
 * unités legacy et unités V2.
 */

// ─── Conversion des exercices ────────────────────────────────────────────────

function v2QuizToLegacy(exercise: V2Quiz): LegacyExercise {
  const correctOption = exercise.options.find((option) => option.isCorrect)
  const incorrectOption = exercise.options.find((option) => !option.isCorrect)
  return {
    ...exercise,
    type: 'QUIZ',
    successFeedback: correctOption?.feedback ?? 'Bonne réponse !',
    failureFeedback:
      incorrectOption?.feedback ??
      `La bonne réponse était : ${correctOption?.text ?? ''}`,
  } as unknown as LegacyExercise
}

function v2SwipeToLegacy(exercise: V2Swipe): LegacyExercise {
  return {
    ...exercise,
    type: 'SWIPE',
  } as unknown as LegacyExercise
}

function v2DragDropToLegacy(exercise: V2DragDrop): LegacyExercise {
  return {
    ...exercise,
    type: 'DRAG_DROP',
  } as unknown as LegacyExercise
}

function v2StoryToLegacy(exercise: V2Story): LegacyExercise {
  return {
    ...exercise,
    type: 'STORY',
  } as unknown as LegacyExercise
}

export function v2ExerciseToLegacy(exercise: V2Exercise): LegacyExercise {
  switch (exercise.type) {
    case 'QUIZ':
      return v2QuizToLegacy(exercise)
    case 'SWIPE':
      return v2SwipeToLegacy(exercise)
    case 'DRAG_DROP':
      return v2DragDropToLegacy(exercise)
    case 'STORY':
      return v2StoryToLegacy(exercise)
  }
}

// ─── Question pool legacy à partir du pool V2 ────────────────────────────────

function buildLegacyPool(unit: AcademyUnitDefinition): LegacyQuestionPool {
  const tagged = unit.pool.map((exercise) => v2ExerciseToLegacy(exercise))
  return {
    conceptIds: unit.conceptIds,
    story: tagged.filter((exercise) => exercise.type === 'STORY') as LegacyQuestionPool['story'],
    swipe: tagged.filter((exercise) => exercise.type === 'SWIPE') as LegacyQuestionPool['swipe'],
    dragDrop: tagged.filter((exercise) => exercise.type === 'DRAG_DROP') as LegacyQuestionPool['dragDrop'],
    quiz: tagged.filter((exercise) => exercise.type === 'QUIZ') as LegacyQuestionPool['quiz'],
  }
}

// ─── Conversion des leçons ───────────────────────────────────────────────────

function v2LessonToLegacy(
  lesson: AcademyLessonDefinition,
  unit: AcademyUnitDefinition,
  previousUnits: AcademyUnitDefinition[],
): LegacyLesson {
  const exercises = generateLessonExercises({
    unit,
    lesson,
    previousUnits,
  }).map(v2ExerciseToLegacy)

  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    kind: lesson.kind,
    order: lesson.order,
    estimatedMinutes: lesson.estimatedMinutes,
    learningGoal: lesson.learningGoal,
    reward: lesson.reward,
    exercises,
  }
}

// ─── Conversion d'une unité V2 → legacy ──────────────────────────────────────

export function v2UnitToLegacy(
  unit: AcademyUnitDefinition,
  previousUnits: AcademyUnitDefinition[],
): LegacyUnit {
  const lessons = unit.lessons
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((lesson) => v2LessonToLegacy(lesson, unit, previousUnits))

  const questionPool = buildLegacyPool(unit)
  const discoveryExercises = lessons[0]?.exercises ?? unit.authoredDiscovery.map(v2ExerciseToLegacy)

  return {
    id: unit.id,
    slug: unit.slug,
    chapterId: unit.chapterId,
    title: unit.title,
    subtitle: unit.subtitle,
    concept: unit.concept,
    kind: unit.kind,
    iconKey: unit.iconKey,
    shortTitle: unit.shortTitle,
    pathLabel: unit.pathLabel,
    masteryGoal: unit.masteryGoal,
    order: unit.order,
    durationMinutes: unit.durationMinutes,
    estimatedMinutes: unit.estimatedMinutes ?? '3-4 min',
    learningGoal: unit.learningGoal,
    replayLabel: unit.replayLabel ?? 'Réviser sans regagner la récompense',
    lockedHint: unit.lockedHint ?? 'Termine ton unité active pour débloquer celle-ci.',
    mascot: unit.mascot,
    reward: {
      type: 'seeds',
      amount: unit.rewardAmount,
      label: `${unit.rewardAmount} Graines`,
    },
    lessons,
    questionPool,
    exercises: discoveryExercises,
  }
}

// ─── Conversion d'un chapitre V2 → legacy ────────────────────────────────────

export function v2ChapterToLegacy(chapter: AcademyChapterDefinition): LegacyChapter {
  const orderedUnits = chapter.units.slice().sort((a, b) => a.order - b.order)
  return {
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    subtitle: chapter.subtitle,
    level: chapter.level,
    order: chapter.order,
    durationMinutes: chapter.durationMinutes,
    difficulty: chapter.difficulty,
    units: orderedUnits.map((unit, index) => v2UnitToLegacy(unit, orderedUnits.slice(0, index))),
  }
}
