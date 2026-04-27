import { z } from 'zod'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const exerciseTypeSchema = z.enum(['STORY', 'SWIPE', 'DRAG_DROP', 'QUIZ'])
export type AcademyExerciseType = z.infer<typeof exerciseTypeSchema>

export const difficultySchema = z.enum(['easy', 'medium', 'hard'])
export type AcademyDifficulty = z.infer<typeof difficultySchema>

export const cognitiveTagSchema = z.enum([
  'misconception',
  'pre-test',
  'generation',
  'interleaved',
  'worked-example',
  'metacognition',
  'hook',
  'reveal',
  'closure',
  'sprint',
])
export type CognitiveTag = z.infer<typeof cognitiveTagSchema>

export const lessonKindSchema = z.enum(['discovery', 'practice', 'mastery', 'legendary'])
export type AcademyLessonKind = z.infer<typeof lessonKindSchema>

export const unitKindSchema = z.enum(['foundation', 'fauna', 'flora', 'training', 'project', 'boss'])
export type AcademyUnitKind = z.infer<typeof unitKindSchema>

export const mascotSchema = z.enum(['ondine', 'sylva', 'abeille-transparente'])
export type AcademyMascot = z.infer<typeof mascotSchema>

export const cursusIdSchema = z.enum(['living-mechanics', 'nature-mysteries', 'climate-solutions'])
export type AcademyCursusId = z.infer<typeof cursusIdSchema>

export const dragDropAxisSchema = z.enum(['horizontal', 'vertical'])
export type DragDropAxis = z.infer<typeof dragDropAxisSchema>

export const storyScreenKindSchema = z.enum(['hook', 'build-up', 'reveal', 'closure'])
export type StoryScreenKind = z.infer<typeof storyScreenKindSchema>

// ─── Tone variants (cursus) ───────────────────────────────────────────────────

const toneVariantsSchema = z
  .object({
    'nature-mysteries': z.string().optional(),
    'climate-solutions': z.string().optional(),
  })
  .partial()
  .optional()
export type ToneVariants = z.infer<typeof toneVariantsSchema>

// ─── Reward ───────────────────────────────────────────────────────────────────

export const rewardSchema = z.object({
  type: z.literal('seeds'),
  amount: z.number().int().positive(),
  label: z.string().min(1),
})
export type AcademyReward = z.infer<typeof rewardSchema>

// ─── Common exercise base ─────────────────────────────────────────────────────

const exerciseBaseSchema = z.object({
  id: z.string().min(1),
  conceptId: z.string().min(1),
  difficulty: difficultySchema,
  cognitiveTags: z.array(cognitiveTagSchema).default([]),
  learningObjective: z.string().min(1).max(220),
  variantOf: z.string().optional(),
  interleavesConceptIds: z.array(z.string()).optional(),
})

// ─── STORY ────────────────────────────────────────────────────────────────────

export const storyScreenSchema = z.object({
  text: z.string().min(1).max(160, 'Story screen ≤ 140 caractères recommandé (max 160)'),
  imagePrompt: z.string().min(1),
  imageUrl: z.string().url().optional(),
  kind: storyScreenKindSchema.optional(),
  boldTokens: z.array(z.string()).max(2).optional(),
  toneVariants: toneVariantsSchema,
})
export type AcademyStoryScreen = z.infer<typeof storyScreenSchema>

export const storyExerciseSchema = exerciseBaseSchema.extend({
  type: z.literal('STORY'),
  screens: z.array(storyScreenSchema).min(1).max(5),
})
export type AcademyStoryExercise = z.infer<typeof storyExerciseSchema>

// ─── SWIPE ────────────────────────────────────────────────────────────────────

export const swipeExerciseSchema = exerciseBaseSchema.extend({
  type: z.literal('SWIPE'),
  question: z.string().min(1).max(110),
  card: z.object({
    title: z.string().min(1).max(70),
    subtitle: z.string().max(70).optional(),
    imageUrl: z.string().url().optional(),
    imagePrompt: z.string().optional(),
  }),
  correctDirection: z.enum(['left', 'right']),
  leftLabel: z.string().min(1).max(20),
  rightLabel: z.string().min(1).max(20),
  correctFeedback: z.string().min(1).max(140),
  incorrectFeedback: z.string().min(1).max(140),
  explanation: z.string().min(1).max(160),
  misconceptionId: z.string().optional(),
  toneVariants: toneVariantsSchema,
})
export type AcademySwipeExercise = z.infer<typeof swipeExerciseSchema>

// ─── DRAG_DROP ────────────────────────────────────────────────────────────────

export const dragDropItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(80),
  isDistractor: z.boolean().optional(),
})
export type AcademyDragDropItem = z.infer<typeof dragDropItemSchema>

export const dragDropExerciseSchema = exerciseBaseSchema.extend({
  type: z.literal('DRAG_DROP'),
  instruction: z.string().min(1).max(80),
  axis: dragDropAxisSchema,
  axisRationale: z.string().min(1).max(120),
  slotCount: z.number().int().min(2).max(7),
  items: z.array(dragDropItemSchema).min(2).max(8),
  feedbackPerSlot: z.record(z.string(), z.string()).optional(),
  correctFeedback: z.string().min(1).max(140),
  incorrectFeedback: z.string().min(1).max(140),
  toneVariants: toneVariantsSchema,
})
export type AcademyDragDropExercise = z.infer<typeof dragDropExerciseSchema>

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

export const quizOptionSchema = z.object({
  text: z.string().min(1).max(80),
  isCorrect: z.boolean(),
  feedback: z.string().min(1).max(160),
  misconceptionId: z.string().optional(),
})
export type AcademyQuizOption = z.infer<typeof quizOptionSchema>

export const quizExerciseSchema = exerciseBaseSchema.extend({
  type: z.literal('QUIZ'),
  question: z.string().min(1).max(110),
  options: z.array(quizOptionSchema).min(2).max(4),
  hint: z.string().max(120).optional(),
  confidenceCheck: z.boolean().optional(),
  toneVariants: toneVariantsSchema,
})
export type AcademyQuizExercise = z.infer<typeof quizExerciseSchema>

// ─── Union ────────────────────────────────────────────────────────────────────

export const exerciseUnionSchema = z.discriminatedUnion('type', [
  storyExerciseSchema,
  swipeExerciseSchema,
  dragDropExerciseSchema,
  quizExerciseSchema,
])

export const exerciseSchema = exerciseUnionSchema.superRefine((data, ctx) => {
  if (data.type === 'QUIZ') {
    const correctCount = data.options.filter((option) => option.isCorrect).length
    if (correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: 'Un Quiz doit avoir exactement une option correcte',
      })
    }
  }
  if (data.type === 'DRAG_DROP') {
    const realItems = data.items.filter((item) => !item.isDistractor)
    if (realItems.length !== data.slotCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items'],
        message: 'Le nombre d\'items non-distractors doit égaler slotCount',
      })
    }
  }
})
export type AcademyExercise = z.infer<typeof exerciseUnionSchema>

// ─── Misconception ────────────────────────────────────────────────────────────

export const misconceptionPrevalenceSchema = z.enum(['common', 'very-common', 'expert-trap'])
export type MisconceptionPrevalence = z.infer<typeof misconceptionPrevalenceSchema>

export const misconceptionSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1).max(180),
  reality: z.string().min(1).max(220),
  prevalence: misconceptionPrevalenceSchema,
  conceptIds: z.array(z.string()).min(1),
  source: z.string().min(1).max(220).optional(),
})
export type Misconception = z.infer<typeof misconceptionSchema>

// ─── Lesson ───────────────────────────────────────────────────────────────────

export const lessonGenerationStrategySchema = z.enum([
  'authored-discovery',
  'authored-legendary',
  'pool-practice',
  'pool-mastery',
])
export type LessonGenerationStrategy = z.infer<typeof lessonGenerationStrategySchema>

export const lessonRulesSchema = z.object({
  exerciseCount: z.number().int().min(6).max(20),
  interleaveFromPreviousUnits: z.number().int().min(0).max(8).optional(),
  misconceptionRatio: z.number().min(0).max(1).optional(),
  hardRatio: z.number().min(0).max(1).optional(),
  metacognitionRatio: z.number().min(0).max(1).optional(),
})
export type LessonRules = z.infer<typeof lessonRulesSchema>

export const lessonDefinitionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  kind: lessonKindSchema,
  order: z.number().int().min(1).max(4),
  estimatedMinutes: z.string().min(1),
  learningGoal: z.string().min(1).max(220),
  generation: lessonGenerationStrategySchema,
  rules: lessonRulesSchema,
  reward: rewardSchema.optional(),
  authoredExercises: z.array(exerciseSchema).optional(),
})
export type AcademyLessonDefinition = z.infer<typeof lessonDefinitionSchema>

// ─── Unit ─────────────────────────────────────────────────────────────────────

export const unitDefinitionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  chapterId: z.string().min(1),
  schemaVersion: z.literal(2),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  pathLabel: z.string().min(1),
  subtitle: z.string().min(1),
  concept: z.string().min(1),
  conceptIds: z.array(z.string()).min(1),
  kind: unitKindSchema,
  iconKey: z.string().min(1),
  masteryGoal: z.string().min(1),
  order: z.number().int().min(1),
  durationMinutes: z.number().int().min(1).max(20),
  estimatedMinutes: z.string().optional(),
  learningGoal: z.string().min(1),
  replayLabel: z.string().optional(),
  lockedHint: z.string().optional(),
  mascot: mascotSchema,
  rewardAmount: z.number().int().positive(),
  authoredDiscovery: z.array(exerciseSchema).min(8),
  pool: z.array(exerciseSchema).min(8),
  authoredLegendary: z.array(exerciseSchema).min(8),
  lessons: z.array(lessonDefinitionSchema).length(4),
})
export type AcademyUnitDefinition = z.infer<typeof unitDefinitionSchema>

// ─── Chapter ──────────────────────────────────────────────────────────────────

export const chapterDefinitionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  level: z.string().min(1),
  order: z.number().int().min(1),
  durationMinutes: z.number().int().positive(),
  difficulty: z.enum(['debutant', 'intermediaire', 'avance']),
  units: z.array(unitDefinitionSchema).min(1),
})
export type AcademyChapterDefinition = z.infer<typeof chapterDefinitionSchema>

// ─── Cursus ───────────────────────────────────────────────────────────────────

export const cursusSchema = z.object({
  id: cursusIdSchema,
  title: z.string().min(1),
  subtitle: z.string().min(1),
  tone: z.string().min(1),
  accentClass: z.string().min(1),
})
export type AcademyCursus = z.infer<typeof cursusSchema>

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function parseUnit(input: unknown): AcademyUnitDefinition {
  return unitDefinitionSchema.parse(input)
}

export function parseChapter(input: unknown): AcademyChapterDefinition {
  return chapterDefinitionSchema.parse(input)
}

export function parseMisconception(input: unknown): Misconception {
  return misconceptionSchema.parse(input)
}
