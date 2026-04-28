import { getV2UnitsByChapter, listV2Units } from '@/lib/academy/content'
import { v2UnitToLegacy } from '@/lib/academy/runtime'
import {
  MAX_LIVES,
  SEEDS_COST,
  computeRegenLives,
  isUnlimitedLives,
  type LivesState,
} from '@/lib/lives'

export const ACADEMY_PROGRESS_STORAGE_KEY = 'mtc_academy_progress_v1'
export const MOCK_ACADEMY_VIEWER_ID = 'mock-viewer'

export type AcademyMascot = 'ondine' | 'sylva' | 'abeille-transparente'
export type AcademyUnitStatus = 'completed' | 'active' | 'locked'
export type AcademyChapterStatus = 'completed' | 'active' | 'locked'
export type AcademyExerciseType = 'STORY' | 'SWIPE' | 'DRAG_DROP' | 'QUIZ'
export type AcademyCursusId = 'living-mechanics' | 'nature-mysteries' | 'climate-solutions'
export type AcademyLessonKind = 'discovery' | 'practice' | 'mastery' | 'legendary'
export type AcademyUnitKind = 'foundation' | 'fauna' | 'flora' | 'training' | 'project' | 'boss'
export type AcademySponsorTier = 'trusted' | 'transition' | 'blocked'
export type AcademyVerificationStatus = 'verified' | 'pending' | 'self_reported'

export type AcademyCursus = {
  id: AcademyCursusId
  title: string
  subtitle: string
  tone: string
  accentClass: string
}

export type AcademyReward = {
  type: 'seeds'
  amount: number
  label: string
}

export type AcademyStoryExercise = {
  id: string
  type: 'STORY'
  conceptId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  variantOf?: string
  screens: Array<{
    text: string
    imageUrl?: string
    imagePrompt: string
  }>
}

export type AcademySwipeExercise = {
  id: string
  type: 'SWIPE'
  conceptId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  variantOf?: string
  question: string
  card: {
    title: string
    subtitle: string
    imageUrl?: string
  }
  correctDirection: 'right' | 'left'
  leftLabel: string
  rightLabel: string
  correctFeedback: string
  incorrectFeedback: string
}

export type AcademyDragDropExercise = {
  id: string
  type: 'DRAG_DROP'
  conceptId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  variantOf?: string
  instruction: string
  items: Array<{
    id: string
    text: string
    /** V2 schema: item à NE PAS placer (red herring). */
    isDistractor?: boolean
  }>
  /** V2 schema: 'horizontal' (défaut) ou 'vertical' (pyramide). */
  axis?: 'horizontal' | 'vertical'
  /** V2 schema: nombre d'emplacements (par défaut = nombre d'items non-distractors). */
  slotCount?: number
  /** V2 schema: feedback explicite en cas de réussite. */
  correctFeedback?: string
  /** V2 schema: feedback explicite en cas d'erreur (sert d'indice). */
  incorrectFeedback?: string
}

export type AcademyQuizExercise = {
  id: string
  type: 'QUIZ'
  conceptId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  variantOf?: string
  question: string
  options: Array<{
    text: string
    isCorrect: boolean
    /** V2 schema: feedback explicatif spécifique à l'option choisie. */
    feedback?: string
    /** V2 schema: id de la misconception ciblée par l'option (si applicable). */
    misconceptionId?: string
  }>
  successFeedback: string
  failureFeedback: string
  /** V2 schema: indice montré après une 1ère erreur. */
  hint?: string
  /** V2 schema: déclenche un slider métacognitif avant validation. */
  confidenceCheck?: boolean
}

export type AcademyExercise =
  | AcademyStoryExercise
  | AcademySwipeExercise
  | AcademyDragDropExercise
  | AcademyQuizExercise

export type AcademyQuestionPool = {
  conceptIds: string[]
  story: AcademyStoryExercise[]
  swipe: AcademySwipeExercise[]
  dragDrop: AcademyDragDropExercise[]
  quiz: AcademyQuizExercise[]
}

export type AcademyLesson = {
  id: string
  slug: string
  title: string
  kind: AcademyLessonKind
  order: number
  estimatedMinutes: string
  learningGoal: string
  reward?: AcademyReward
  exercises: AcademyExercise[]
}

export type AcademyUnit = {
  id: string
  slug: string
  chapterId: string
  title: string
  subtitle: string
  concept: string
  kind: AcademyUnitKind
  iconKey: string
  shortTitle: string
  pathLabel: string
  masteryGoal: string
  order: number
  durationMinutes: number
  estimatedMinutes?: string
  learningGoal?: string
  replayLabel?: string
  lockedHint?: string
  mascot: AcademyMascot
  reward: AcademyReward
  lessons: AcademyLesson[]
  questionPool: AcademyQuestionPool
  exercises: AcademyExercise[]
}

export type AcademyChapter = {
  id: string
  slug: string
  title: string
  subtitle: string
  level: string
  order: number
  durationMinutes: number
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  units: AcademyUnit[]
}

export type AcademyUnitResult = {
  unitId: string
  completedAt: string
  score: number
  mistakes: number
  rewardEarned: number
}

export type AcademyLessonResult = {
  lessonId: string
  unitId: string
  completedAt: string
  score: number
  mistakes: number
  missedConceptIds: string[]
}

export type AcademyMistakeQueueItem = {
  id: string
  unitId: string
  lessonId: string
  exerciseId: string
  conceptId: string
  missedAt: string
  resolved: boolean
}

export type AcademyProgress = {
  viewerId: string
  selectedCursusId: AcademyCursusId
  completedUnitIds: string[]
  completedEventIds: string[]
  completedLessonIds: string[]
  activeUnitId: string
  unitResults: Record<string, AcademyUnitResult>
  eventResults: Record<string, AcademyUnitResult>
  lessonResults: Record<string, AcademyLessonResult>
  mistakeQueue: AcademyMistakeQueueItem[]
  seedsBalance: number
  streak: {
    current: number
    best: number
    lastActivityDay: string | null
    completedDays: string[]
  }
  lives: {
    remaining: number
    updatedAt: string
  }
}

export type AcademyUnitWithStatus = AcademyUnit & {
  status: AcademyUnitStatus
  result: AcademyUnitResult | null
}

export type AcademyChapterWithStatus = Omit<AcademyChapter, 'units'> & {
  status: AcademyChapterStatus
  completedUnitsCount: number
  units: AcademyUnitWithStatus[]
}

export type AcademyRepository = {
  getCurriculum(): AcademyChapter[]
  getProgress(viewerId: string): AcademyProgress
  saveProgress(viewerId: string, progress: AcademyProgress): AcademyProgress
  setCursus(viewerId: string, cursusId: AcademyCursusId): AcademyProgress
  completeLesson(
    viewerId: string,
    unitId: string,
    lessonId: string,
    result: Pick<AcademyLessonResult, 'score' | 'mistakes' | 'missedConceptIds'>,
  ): AcademyProgress
  completeUnit(
    viewerId: string,
    unitId: string,
    result: Pick<AcademyUnitResult, 'score' | 'mistakes'>,
  ): AcademyProgress
  resetProgress(viewerId: string): AcademyProgress
  /** Spend 1 life and persist. Returns updated progress. */
  spendLife(viewerId: string): AcademyProgress
  /** Apply pending regen and persist. Returns updated progress. */
  regenerateLives(viewerId: string): AcademyProgress
  /** Spend SEEDS_COST graines to refill to MAX_LIVES. Returns null if insufficient balance. */
  spendSeedsForLives(viewerId: string): AcademyProgress | null
  /** Award +1 life (e.g. after training). Capped at MAX_LIVES. */
  awardTrainingLife(viewerId: string): AcademyProgress
}

export type AcademyEventSponsor = {
  name: string
  tier: AcademySponsorTier
  disclosure: string
  fundedAmount: number
  fundedAt: string
  verificationStatus: AcademyVerificationStatus
  claimBasis: string
  logoUrl?: string
  projectUrl?: string
}

export type AcademyEvent = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  sponsor: AcademyEventSponsor
  expiresAt: string
  fundingGoal?: number
  fundingCurrent?: number
  location: string
  impactTarget: string
  proofUrl?: string
  transparencyNote: string
  mascot: AcademyMascot
  reward: AcademyReward
  archiveImageUrl?: string
  archiveCta?: string
  archiveImpact?: string
  exercises: AcademyExercise[]
}

const storyImages = {
  sprout:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop',
  forest:
    'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1000&auto=format&fit=crop',
  water:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
  reef:
    'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1000&auto=format&fit=crop',
  field:
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop',
} as const

const makeReward = (amount: number): AcademyReward => ({
  type: 'seeds',
  amount,
  label: `${amount} Graines`,
})

export const ACADEMY_CURSUS: AcademyCursus[] = [
  {
    id: 'living-mechanics',
    title: 'Mécanique du Vivant',
    subtitle: 'Comprendre les rouages des écosystèmes.',
    tone: 'Scientifique, précis, progressif.',
    accentClass: 'emerald',
  },
  {
    id: 'nature-mysteries',
    title: 'Mystères de la Nature',
    subtitle: 'Découvrir les super-pouvoirs du vivant.',
    tone: 'Fascinant, visuel, accessible.',
    accentClass: 'amber',
  },
  {
    id: 'climate-solutions',
    title: 'Défis Climat & Solutions',
    subtitle: 'Relier savoir, terrain et passage à l’action.',
    tone: 'Concret, lucide, orienté impact.',
    accentClass: 'sky',
  },
]

const normalizeConceptId = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const getUnitConceptId = (unitId: string, concept: string) =>
  `${unitId}-${normalizeConceptId(concept)}`

const tagExercise = <T extends AcademyExercise>(
  exercise: T,
  conceptId: string,
  difficulty: NonNullable<T['difficulty']>,
  suffix: string,
): T => ({
  ...exercise,
  id: `${exercise.id}-${suffix}`,
  conceptId: exercise.conceptId ?? conceptId,
  difficulty: exercise.difficulty ?? difficulty,
  variantOf: exercise.variantOf ?? exercise.id,
})

const buildQuestionPool = (
  unitId: string,
  concept: string,
  exercises: AcademyExercise[],
): AcademyQuestionPool => {
  const conceptId = getUnitConceptId(unitId, concept)
  const tagged = exercises.map((exercise, index) =>
    tagExercise(exercise, conceptId, index < 4 ? 'easy' : index < 9 ? 'medium' : 'hard', 'pool'),
  )

  return {
    conceptIds: [conceptId],
    story: tagged.filter((exercise): exercise is AcademyStoryExercise => exercise.type === 'STORY'),
    swipe: tagged.filter((exercise): exercise is AcademySwipeExercise => exercise.type === 'SWIPE'),
    dragDrop: tagged.filter((exercise): exercise is AcademyDragDropExercise => exercise.type === 'DRAG_DROP'),
    quiz: tagged.filter((exercise): exercise is AcademyQuizExercise => exercise.type === 'QUIZ'),
  }
}

const takeCycled = (
  items: AcademyExercise[],
  count: number,
  difficulty: NonNullable<AcademyExercise['difficulty']>,
  suffix: string,
): AcademyExercise[] => {
  if (items.length === 0) return []
  return Array.from({ length: count }, (_, index) => {
    const item = items[index % items.length]!
    return tagExercise(item, item.conceptId ?? 'general', difficulty, `${suffix}-${index + 1}`)
  })
}

const buildLessons = (
  unit: Pick<AcademyUnit, 'id' | 'title' | 'concept'> & { kind?: AcademyUnitKind; rewardAmount: number },
  exercises: AcademyExercise[],
  questionPool: AcademyQuestionPool,
): AcademyLesson[] => {
  const conceptId = questionPool.conceptIds[0] ?? 'general'
  const discoveryExercises = exercises.map((exercise, index) =>
    tagExercise(exercise, conceptId, index < 4 ? 'easy' : index < 9 ? 'medium' : 'hard', 'discovery'),
  )
  const practiceExercises = unit.kind === 'training'
    ? [
        ...takeCycled(questionPool.swipe, 7, 'medium', 'practice-sw'),
        ...takeCycled(questionPool.quiz, 3, 'medium', 'practice-qz'),
        ...takeCycled(questionPool.dragDrop, 1, 'medium', 'practice-dd'),
      ]
    : [
        ...takeCycled(questionPool.swipe, 6, 'medium', 'practice-sw'),
        ...takeCycled(questionPool.dragDrop, 2, 'medium', 'practice-dd'),
        ...takeCycled(questionPool.quiz, 4, 'medium', 'practice-qz'),
      ]
  const masteryExercises = unit.kind === 'boss'
    ? [
        ...takeCycled(questionPool.dragDrop, 4, 'hard', 'mastery-dd'),
        ...takeCycled(questionPool.quiz, 5, 'hard', 'mastery-qz'),
        ...takeCycled(questionPool.swipe, 2, 'hard', 'mastery-sw'),
      ]
    : [
        ...takeCycled(questionPool.swipe, 4, 'medium', 'mastery-sw'),
        ...takeCycled(questionPool.quiz, 4, 'hard', 'mastery-qz'),
        ...takeCycled(questionPool.dragDrop, 4, 'hard', 'mastery-dd'),
      ]
  const legendaryExercises = unit.kind === 'boss'
    ? [
        ...takeCycled(questionPool.dragDrop, 5, 'hard', 'legendary-dd'),
        ...takeCycled(questionPool.quiz, 5, 'hard', 'legendary-qz'),
        ...takeCycled(questionPool.swipe, 2, 'hard', 'legendary-sw'),
      ]
    : [
        ...takeCycled(questionPool.quiz, 5, 'hard', 'legendary-qz'),
        ...takeCycled(questionPool.dragDrop, 3, 'hard', 'legendary-dd'),
        ...takeCycled(questionPool.swipe, 4, 'hard', 'legendary-sw'),
      ]

  return [
    {
      id: `${unit.id}-lesson-1`,
      slug: 'decouverte',
      title: 'Découverte',
      kind: 'discovery',
      order: 1,
      estimatedMinutes: '3 min',
      learningGoal: `Découvrir les bases : ${unit.concept}.`,
      exercises: discoveryExercises,
    },
    {
      id: `${unit.id}-lesson-2`,
      slug: 'revision-active',
      title: 'Révision active',
      kind: 'practice',
      order: 2,
      estimatedMinutes: '3 min',
      learningGoal: `Retrouver ${unit.concept.toLowerCase()} sans relire la théorie.`,
      exercises: practiceExercises,
    },
    {
      id: `${unit.id}-lesson-3`,
      slug: 'maitrise',
      title: 'Maîtrise',
      kind: 'mastery',
      order: 3,
      estimatedMinutes: '3-4 min',
      learningGoal: `Utiliser ${unit.concept.toLowerCase()} dans des liens logiques.`,
      exercises: masteryExercises,
    },
    {
      id: `${unit.id}-lesson-4`,
      slug: 'couronne',
      title: 'Couronne',
      kind: 'legendary',
      order: 4,
      estimatedMinutes: '3-4 min',
      learningGoal: `Prouver que ${unit.concept.toLowerCase()} est vraiment acquis.`,
      reward: makeReward(unit.rewardAmount),
      exercises: legendaryExercises,
    },
  ]
}

const makeUnit = (
  unit: Omit<AcademyUnit, 'reward' | 'lessons' | 'questionPool' | 'kind' | 'iconKey' | 'shortTitle' | 'pathLabel' | 'masteryGoal'> &
    Partial<Pick<AcademyUnit, 'kind' | 'iconKey' | 'shortTitle' | 'pathLabel' | 'masteryGoal'>> &
    { rewardAmount: number; lessons?: AcademyLesson[] },
): AcademyUnit => {
  const questionPool = buildQuestionPool(unit.id, unit.concept, unit.exercises)
  const lessons = unit.lessons ?? buildLessons(unit, unit.exercises, questionPool)

  return {
  id: unit.id,
  slug: unit.slug,
  chapterId: unit.chapterId,
  title: unit.title,
  subtitle: unit.subtitle,
  concept: unit.concept,
  kind: unit.kind ?? 'foundation',
  iconKey: unit.iconKey ?? 'leaf',
  shortTitle: unit.shortTitle ?? unit.title,
  pathLabel: unit.pathLabel ?? unit.title,
  masteryGoal: unit.masteryGoal ?? `Maîtriser ${unit.concept.toLowerCase()} dans une mini-mission.`,
  order: unit.order,
  durationMinutes: unit.durationMinutes,
  estimatedMinutes: unit.estimatedMinutes ?? '3-4 min',
  learningGoal:
    unit.learningGoal ??
    `Maîtriser : ${unit.concept.toLowerCase()}.`,
  replayLabel: unit.replayLabel ?? 'Réviser sans regagner la récompense',
  lockedHint: unit.lockedHint ?? 'Termine ton unité active pour débloquer celle-ci.',
  mascot: unit.mascot,
  reward: makeReward(unit.rewardAmount),
  lessons,
  questionPool,
  exercises: lessons[0]?.exercises ?? unit.exercises,
  }
}

type ChapterOneConcept = {
  title: string
  story: string
  trueStatement: string
  falseStatement: string
  quizQuestion: string
  quizCorrect: string
  quizWrong: [string, string]
}

const makeChapterOneExercises = (
  prefix: string,
  imageKey: keyof typeof storyImages,
  config: {
    theme: string
    conceptA: ChapterOneConcept
    conceptB: ChapterOneConcept
    conceptC: ChapterOneConcept
    dragOne: [string, string, string]
    dragTwo: [string, string, string]
    finalQuestion: string
    finalCorrect: string
    finalWrong: [string, string]
  },
): AcademyExercise[] => {
  const concepts = [config.conceptA, config.conceptB, config.conceptC]
  const makeSwipe = (
    concept: ChapterOneConcept,
    index: number,
    statement: string,
    isTrue: boolean,
    subtitle = config.theme,
  ): AcademySwipeExercise => ({
    id: `${prefix}sw${index}`,
    type: 'SWIPE',
    question: 'Vrai ou faux ?',
    card: { title: statement, subtitle },
    correctDirection: isTrue ? 'right' : 'left',
    leftLabel: 'FAUX',
    rightLabel: 'VRAI',
    correctFeedback: `Exact ! ${concept.title} est bien compris.`,
    incorrectFeedback: `Presque. Reviens au concept : ${concept.title}.`,
  })

  return [
    { id: `${prefix}s1`, type: 'STORY', screens: [
      { text: config.conceptA.story, imageUrl: storyImages[imageKey], imagePrompt: config.conceptA.title },
      { text: config.conceptB.story, imageUrl: storyImages[imageKey], imagePrompt: config.conceptB.title },
    ]},
    makeSwipe(config.conceptA, 1, config.conceptA.trueStatement, true),
    { id: `${prefix}s2`, type: 'STORY', screens: [
      { text: config.conceptC.story, imageUrl: storyImages[imageKey], imagePrompt: config.conceptC.title },
    ]},
    makeSwipe(config.conceptB, 2, config.conceptB.falseStatement, false),
    { id: `${prefix}d1`, type: 'DRAG_DROP', instruction: 'Place les éléments dans le bon ordre :',
      items: config.dragOne.map((text, index) => ({ id: `${prefix}d1-${index + 1}`, text })) },
    makeSwipe(config.conceptC, 3, config.conceptC.trueStatement, true, 'Sprint 1'),
    makeSwipe(config.conceptA, 4, config.conceptA.falseStatement, false, 'Sprint 2'),
    makeSwipe(config.conceptB, 5, config.conceptB.trueStatement, true, 'Sprint 3'),
    { id: `${prefix}d2`, type: 'DRAG_DROP', instruction: 'Construis la logique complète :',
      items: config.dragTwo.map((text, index) => ({ id: `${prefix}d2-${index + 1}`, text })) },
    { id: `${prefix}q1`, type: 'QUIZ', question: config.conceptC.quizQuestion,
      options: [
        { text: config.conceptC.quizWrong[0], isCorrect: false },
        { text: config.conceptC.quizWrong[1], isCorrect: false },
        { text: config.conceptC.quizCorrect, isCorrect: true },
      ],
      successFeedback: `Parfait ! ${config.conceptC.title} est acquis.`,
      failureFeedback: `Pas encore. La bonne réponse était : ${config.conceptC.quizCorrect}.` },
    { id: `${prefix}q2`, type: 'QUIZ', question: config.finalQuestion,
      options: [
        { text: config.finalWrong[0], isCorrect: false },
        { text: config.finalCorrect, isCorrect: true },
        { text: config.finalWrong[1], isCorrect: false },
      ],
      successFeedback: 'Boss validé : tu relies les idées entre elles.',
      failureFeedback: `Le cœur de la leçon : ${config.finalCorrect}.` },
  ]
}

// ─── Coquilles de chapitres (V2 = source de vérité) ──────────────────────────
// Toutes les unités des chapitres 1-5 sont migrées dans `src/lib/academy/content`.
// Ce tableau ne conserve que la métadata des chapitres ; `applyV2OverridesToChapter`
// injecte les unités V2 à l'exécution via le runtime adapter.

const LEGACY_ACADEMY_CURRICULUM: AcademyChapter[] = [
  { id: 'chapter-1', slug: 'alphabet-originel', title: "L'Alphabet Originel", subtitle: 'Comprends les forces invisibles qui font tourner notre monde.', level: 'A1', order: 1, durationMinutes: 84, difficulty: 'debutant', units: [] },
  { id: 'chapter-2', slug: 'grammaire-especes', title: 'La Grammaire des Espèces', subtitle: "Comment les êtres vivants interagissent, s'allient et évoluent.", level: 'A2', order: 2, durationMinutes: 60, difficulty: 'debutant', units: [] },
  { id: 'chapter-3', slug: 'economie-biosphere', title: "L'Économie de la Biosphère", subtitle: 'Les grands cycles qui maintiennent le moteur de la planète.', level: 'B1', order: 3, durationMinutes: 75, difficulty: 'intermediaire', units: [] },
  { id: 'chapter-4', slug: 'sanctuaires-sauvages', title: 'Les Sanctuaires Sauvages', subtitle: 'Écosystèmes uniques, isolés et fragiles.', level: 'B2', order: 4, durationMinutes: 90, difficulty: 'intermediaire', units: [] },
  { id: 'chapter-5', slug: 'eveil-gardiens', title: "L'Éveil des Gardiens", subtitle: 'Comprendre les crises actuelles pour agir concrètement.', level: 'C1/C2', order: 5, durationMinutes: 120, difficulty: 'avance', units: [] },
]

// ─── Événements temporaires (sponsorisés) ────────────────────────────────────

export const ACTIVE_EVENTS: AcademyEvent[] = [
  {
    id: 'event-coraux-loccitane-2026',
    slug: 'bouturage-corail-loccitane',
    title: 'Comment bouture-t-on un corail ?',
    subtitle: "Le projet de L'Occitane en Polynésie française.",
    description:
      "L'Occitane finance 1 000 boutures de corail dans le lagon de Moorea. Apprends les gestes exacts de leurs biologistes marins.",
    imageUrl:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1200&auto=format&fit=crop',
    sponsor: {
      name: "L'Occitane en Provence",
      tier: 'transition',
      disclosure:
        "Marque en transition : le contenu pédagogique reste éditorialement contrôlé par Biolingo, le sponsor finance le projet et sa visibilité.",
      fundedAmount: 3240,
      fundedAt: '2026-04-12',
      verificationStatus: 'self_reported',
      claimBasis: 'Montant déclaré pour le prototype, à remplacer par une preuve partenaire avant production.',
      projectUrl: 'https://loccitane.com',
    },
    expiresAt: '2026-05-15T23:59:59Z',
    fundingGoal: 5000,
    fundingCurrent: 3240,
    location: 'Moorea, Polynésie française',
    impactTarget: '1 000 boutures de corail fixées sur socles artificiels',
    proofUrl: 'https://loccitane.com',
    transparencyNote:
      "Ce prototype n'affirme pas que la marque est verte : il affiche un financement précis pour un projet précis.",
    mascot: 'ondine',
    reward: { type: 'seeds', amount: 40, label: '40 Graines' },
    exercises: [
      { id: 'ev1s1', type: 'STORY', screens: [
        { text: "L'Occitane finance 1 000 boutures de corail dans le lagon de Moorea, Polynésie.", imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1000', imagePrompt: 'Récif de Moorea' },
        { text: "Une bouture, c'est comme une bouture de plante — un fragment qui régénère un récif entier.", imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1000', imagePrompt: 'Biologiste et fragment corallien' },
      ]},
      { id: 'ev1sw1', type: 'SWIPE', question: 'Un corail est-il un animal ?',
        card: { title: 'Le polype corallien', subtitle: 'Constructeur de récifs' }, correctDirection: 'right',
        leftLabel: 'NON', rightLabel: 'OUI',
        correctFeedback: "Exact ! Les coraux sont des animaux invertébrés — pas des plantes.",
        incorrectFeedback: "Si ! Le corail est bien un animal — les polypes construisent les récifs." },
      { id: 'ev1s2', type: 'STORY', screens: [
        { text: "Étape 1 : choisir un fragment sain de 5 cm, coupé proprement pour éviter l'infection.", imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000', imagePrompt: 'Biologiste découpant un fragment corallien' },
        { text: 'Étape 2 : fixer le fragment sur un socle artificiel en céramique à exactement 5 m de profondeur.', imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1000', imagePrompt: 'Fragment corallien sur socle en mer' },
      ]},
      { id: 'ev1sw2', type: 'SWIPE', question: "Le réchauffement de l'eau menace-t-il les boutures de corail ?",
        card: { title: 'Eau trop chaude (> 29°C)', subtitle: 'Stress thermique fatal' }, correctDirection: 'right',
        leftLabel: 'NON', rightLabel: 'OUI',
        correctFeedback: "Vrai ! Au-delà de 29°C, le corail blanchit et peut mourir.",
        incorrectFeedback: "Si ! La chaleur est l'ennemi n°1 des boutures de corail." },
      { id: 'ev1d1', type: 'DRAG_DROP', instruction: 'Ordonne les étapes du bouturage corallien :',
        items: [{ id: 'ev1d1a', text: '✂️ Couper un fragment sain de 5 cm' }, { id: 'ev1d1b', text: '🪸 Fixer sur un socle artificiel' }, { id: 'ev1d1c', text: '📅 Surveiller pendant 6 mois' }] },
      { id: 'ev1s3', type: 'STORY', screens: [
        { text: 'La température idéale pour une bouture est entre 24°C et 28°C. Chaque degré compte.', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000', imagePrompt: 'Thermomètre sous-marin sur récif' },
      ]},
      { id: 'ev1sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
        card: { title: 'Un corail peut se régénérer depuis un fragment de 5 cm.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right', leftLabel: 'FAUX', rightLabel: 'VRAI',
        correctFeedback: "Exact ! C'est tout le principe du bouturage.",
        incorrectFeedback: "Si ! La régénération depuis un fragment est bien réelle." },
      { id: 'ev1sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
        card: { title: "Les récifs coralliens abritent 25% des espèces marines.", subtitle: '⚡ Sprint 2' }, correctDirection: 'right', leftLabel: 'FAUX', rightLabel: 'VRAI',
        correctFeedback: "Exact ! 0,1% de l'océan mais 25% de la biodiversité marine.",
        incorrectFeedback: "Si ! Les récifs sont d'une richesse extraordinaire." },
      { id: 'ev1sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
        card: { title: 'Le bouturage peut remplacer un récif naturel à 100%.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'left', leftLabel: 'FAUX', rightLabel: 'VRAI',
        correctFeedback: "Exact ! Le bouturage aide mais ne remplace pas la protection.",
        incorrectFeedback: "Non ! Le bouturage est un complément, pas un remplacement." },
      { id: 'ev1d2', type: 'DRAG_DROP', instruction: 'Ordonne ces menaces pour un récif de la moins grave à la plus destructrice :',
        items: [{ id: 'ev1d2a', text: '🐟 Surpêche locale' }, { id: 'ev1d2b', text: '🌡️ Réchauffement climatique' }, { id: 'ev1d2c', text: '🌊 Acidification des océans' }] },
      { id: 'ev1q1', type: 'QUIZ', question: "À quelle profondeur les biologistes fixent-ils leurs boutures ?",
        options: [{ text: '1 mètre (trop superficiel)', isCorrect: false }, { text: '5 mètres (idéal)', isCorrect: true }, { text: '20 mètres (trop sombre)', isCorrect: false }],
        successFeedback: "Exact ! À 5 m, lumière et température sont optimales.", failureFeedback: "Pas tout à fait... 5 m est la profondeur idéale." },
      { id: 'ev1q2', type: 'QUIZ', question: 'Quelle est la température max tolérable par un corail avant blanchissement ?',
        options: [{ text: '20°C', isCorrect: false }, { text: '29°C', isCorrect: true }, { text: '35°C', isCorrect: false }],
        successFeedback: "Exact ! Au-delà de 29°C, le blanchissement commence.", failureFeedback: "Raté... Le seuil critique est 29°C." },
    ],
  },
]

export const ARCHIVED_EVENTS: AcademyEvent[] = [
  {
    id: 'event-mangrove-2025',
    slug: 'plantation-mangrove-2025',
    title: 'Comment plante-t-on une mangrove ?',
    subtitle: 'Patagonia au Sénégal — 2 000 propagules plantées.',
    description:
      "Patagonia a financé 2 000 propagules de mangrove sur la côte sénégalaise. Mission accomplie — voici le bilan.",
    imageUrl:
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop',
    sponsor: {
      name: 'Patagonia',
      tier: 'trusted',
      disclosure:
        'Partenaire à forte cohérence nature/outdoor. Archive conservée comme preuve de projet terminé.',
      fundedAmount: 8000,
      fundedAt: '2025-12-31',
      verificationStatus: 'verified',
      claimBasis: 'Bilan de prototype : 2 000 propagules, 12 ha restaurés.',
      projectUrl: 'https://patagonia.com',
    },
    expiresAt: '2025-12-31T23:59:59Z',
    fundingGoal: 8000,
    fundingCurrent: 8000,
    location: 'Côte sénégalaise',
    impactTarget: '2 000 propagules de mangrove plantées',
    proofUrl: 'https://patagonia.com',
    transparencyNote:
      'Archive pédagogique : le financement est terminé, la leçon reste jouable et renvoie vers le bilan.',
    mascot: 'sylva',
    reward: { type: 'seeds', amount: 35, label: '35 Graines' },
    archiveImageUrl:
      'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1200&auto=format&fit=crop',
    archiveCta: 'Voir les 2 000 mangroves plantées',
    archiveImpact: '2 000 propagules · 12 ha restaurés · ~480 t CO₂/an',
    exercises: [
      { id: 'arc1s1', type: 'STORY', screens: [
        { text: "Les mangroves sont les forêts des côtes tropicales — racines dans l'eau, branches dans le ciel.", imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000', imagePrompt: 'Mangrove côtière' },
        { text: "Elles protègent les côtes ET séquestrent 5× plus de carbone qu'une forêt tropicale.", imageUrl: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1000', imagePrompt: 'Racines de mangrove' },
      ]},
      { id: 'arc1sw1', type: 'SWIPE', question: 'Les mangroves protègent-elles les côtes des tempêtes ?',
        card: { title: 'La mangrove-bouclier', subtitle: 'Barrière naturelle côtière' }, correctDirection: 'right', leftLabel: 'NON', rightLabel: 'OUI',
        correctFeedback: "Exact ! Leurs racines absorbent l'énergie des vagues.", incorrectFeedback: "Si ! Les mangroves protègent les populations côtières." },
      { id: 'arc1s2', type: 'STORY', screens: [
        { text: "Une 'propagule' est la graine-plantule de la mangrove — elle tombe et s'enracine directement dans la vase.", imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000', imagePrompt: 'Propagule de mangrove' },
      ]},
      { id: 'arc1sw2', type: 'SWIPE', question: "Une mangrove séquestre-t-elle plus de carbone qu'une forêt tropicale ?",
        card: { title: 'La mangrove carbonique', subtitle: '5× plus efficace' }, correctDirection: 'right', leftLabel: 'NON', rightLabel: 'OUI',
        correctFeedback: "Exact ! Elle stocke dans ses racines ET les sédiments marins.", incorrectFeedback: "Si ! La mangrove est championne du stockage carbone." },
      { id: 'arc1d1', type: 'DRAG_DROP', instruction: "Ordonne les étapes de plantation d'une propagule :",
        items: [{ id: 'a1', text: '🌱 Récolter les propagules mûres' }, { id: 'a2', text: '🌊 Planter dans la vase à marée basse' }, { id: 'a3', text: "📅 Surveiller 3 mois jusqu'à enracinement" }] },
      { id: 'arc1s3', type: 'STORY', screens: [
        { text: 'Résultat : 2 000 propagules plantées, 12 hectares restaurés sur la côte sénégalaise.', imageUrl: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1000', imagePrompt: 'Forêt de mangroves restaurée' },
      ]},
      { id: 'arc1sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?', card: { title: 'Les mangroves abritent des nurseries pour de nombreux poissons.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right', leftLabel: 'FAUX', rightLabel: 'VRAI', correctFeedback: "Exact ! 75% des poissons commerciaux passent par les mangroves.", incorrectFeedback: "Si ! Les mangroves sont des crèches marines." },
      { id: 'arc1sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?', card: { title: 'Détruire une mangrove libère le carbone stocké dans ses sédiments.', subtitle: '⚡ Sprint 2' }, correctDirection: 'right', leftLabel: 'FAUX', rightLabel: 'VRAI', correctFeedback: "Exact ! Des siècles de carbone libérés d'un coup.", incorrectFeedback: "Si ! Les sédiments stockent du carbone depuis des millénaires." },
      { id: 'arc1sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?', card: { title: 'La propagule flotte pour coloniser de nouvelles zones côtières.', subtitle: '🔥 Sprint 3' }, correctDirection: 'right', leftLabel: 'FAUX', rightLabel: 'VRAI', correctFeedback: "Exact ! Une stratégie de dispersion parfaite.", incorrectFeedback: "Si ! Les propagules flottent — elles colonisent naturellement." },
      { id: 'arc1d2', type: 'DRAG_DROP', instruction: 'Ordonne les bénéfices de la mangrove par importance :',
        items: [{ id: 'b1', text: '🐟 Nurserie pour les poissons' }, { id: 'b2', text: '🛡️ Protection des côtes' }, { id: 'b3', text: '💨 Stockage massif du carbone' }] },
      { id: 'arc1q1', type: 'QUIZ', question: "Combien de fois plus de carbone une mangrove stocke-t-elle vs une forêt tropicale ?",
        options: [{ text: '2 fois plus', isCorrect: false }, { text: '5 fois plus', isCorrect: true }, { text: '10 fois plus', isCorrect: false }],
        successFeedback: "Exact ! 5× plus efficace grâce aux sédiments marins.", failureFeedback: "Pas tout à fait... C'est 5× plus efficace." },
      { id: 'arc1q2', type: 'QUIZ', question: "Comment s'appelle la graine-plantule de la mangrove ?",
        options: [{ text: 'Une spore', isCorrect: false }, { text: 'Une propagule', isCorrect: true }, { text: 'Un rhizome', isCorrect: false }],
        successFeedback: "Exact ! La propagule s'enracine directement dans la vase.", failureFeedback: "Raté... C'est une propagule — stratégie unique de reproduction." },
    ],
  },
]

// ─── V2 overrides ────────────────────────────────────────────────────────────
// Pour chaque chapitre, on calcule un curriculum « effectif » : chaque unité
// présente dans le registre V2 (`src/lib/academy/content`) remplace son
// équivalent legacy. Les unités legacy non migrées restent inchangées.
// Cela permet une migration progressive sans casser l'app.

const applyV2OverridesToChapter = (chapter: AcademyChapter): AcademyChapter => {
  const v2Units = getV2UnitsByChapter(chapter.id)
  if (v2Units.length === 0) return chapter

  const v2ById = new Map(v2Units.map((unit) => [unit.id, unit]))
  const v2Slugs = new Set(v2Units.map((unit) => unit.slug))

  const orderedV2 = v2Units.slice().sort((a, b) => a.order - b.order)
  const mergedUnits = chapter.units.map((legacyUnit) => {
    const override = v2ById.get(legacyUnit.id) ?? (v2Slugs.has(legacyUnit.slug) ? v2Units.find((unit) => unit.slug === legacyUnit.slug) : null)
    if (!override) return legacyUnit
    const previousV2InChapter = orderedV2.filter((unit) => unit.order < override.order)
    return v2UnitToLegacy(override, previousV2InChapter)
  })

  // Si une unité V2 n'a pas d'équivalent legacy (nouvelle unité ajoutée), on
  // l'ajoute en respectant son order.
  const legacyIds = new Set(chapter.units.map((unit) => unit.id))
  const newUnits = orderedV2
    .filter((unit) => !legacyIds.has(unit.id))
    .map((unit) => {
      const previousV2InChapter = orderedV2.filter((other) => other.order < unit.order)
      return v2UnitToLegacy(unit, previousV2InChapter)
    })

  const allUnits = [...mergedUnits, ...newUnits].sort((a, b) => a.order - b.order)
  return { ...chapter, units: allUnits }
}

const ACADEMY_CURRICULUM: AcademyChapter[] = LEGACY_ACADEMY_CURRICULUM.map(applyV2OverridesToChapter)

if (process.env.NODE_ENV !== 'production') {
  const v2Count = listV2Units().length
  if (v2Count > 0) {
    // eslint-disable-next-line no-console
    console.info(`[academy] ${v2Count} unité(s) V2 active(s) dans le curriculum effectif.`)
  }
}

export function getActiveEvents(): AcademyEvent[] {
  const now = new Date()
  return ACTIVE_EVENTS.filter((event) => new Date(event.expiresAt) > now)
}

export function getArchivedEvents(): AcademyEvent[] {
  const now = new Date()
  return [
    ...ACTIVE_EVENTS.filter((event) => new Date(event.expiresAt) <= now),
    ...ARCHIVED_EVENTS,
  ]
}

export function getEventUnitBySlug(slug: string): AcademyUnit | null {
  const allEvents = [...ACTIVE_EVENTS, ...ARCHIVED_EVENTS]
  const event = allEvents.find((e) => e.slug === slug || e.id === slug)
  if (!event) return null
  const questionPool = buildQuestionPool(event.id, event.title, event.exercises)
  const lessons = buildLessons(
    { id: event.id, title: event.title, concept: event.title, kind: 'project', rewardAmount: event.reward.amount },
    event.exercises,
    questionPool,
  )

  return {
    id: event.id,
    slug: event.slug,
    chapterId: 'events',
    title: event.title,
    subtitle: event.subtitle,
    concept: 'Mission Spéciale',
    kind: 'project',
    iconKey: 'globe',
    shortTitle: 'Projet terrain',
    pathLabel: 'Nœud projet',
    masteryGoal: event.impactTarget,
    order: 0,
    durationMinutes: 5,
    estimatedMinutes: '5 min',
    learningGoal: event.description,
    replayLabel: event.archiveCta ?? "REJOUER L'ÉVÉNEMENT",
    lockedHint: '',
    mascot: event.mascot,
    reward: event.reward,
    lessons,
    questionPool,
    exercises: lessons[0]?.exercises ?? event.exercises,
  }
}

const flattenUnits = (chapters: AcademyChapter[] = ACADEMY_CURRICULUM): AcademyUnit[] =>
  chapters.flatMap((chapter) => chapter.units)

const getLocalDayKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getYesterdayDayKey = (dayKey: string) => {
  const [year, month, day] = dayKey.split('-').map(Number)
  if (!year || !month || !day) {
    return ''
  }

  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return getLocalDayKey(date)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getDefaultProgress = (viewerId: string): AcademyProgress => {
  const firstUnit = flattenUnits()[0]
  if (!firstUnit) {
    throw new Error('Academy curriculum must contain at least one unit.')
  }

  return {
    viewerId,
    selectedCursusId: 'living-mechanics',
    completedUnitIds: [],
    completedEventIds: [],
    completedLessonIds: [],
    activeUnitId: firstUnit.id,
    unitResults: {},
    eventResults: {},
    lessonResults: {},
    mistakeQueue: [],
    seedsBalance: 0,
    streak: {
      current: 0,
      best: 0,
      lastActivityDay: null,
      completedDays: [],
    },
    lives: {
      remaining: 5,
      updatedAt: new Date().toISOString(),
    },
  }
}

export const getDefaultAcademyProgress = (viewerId: string): AcademyProgress =>
  getDefaultProgress(viewerId)

const getNextActiveUnitId = (completedUnitIds: string[]) => {
  const completed = new Set(completedUnitIds)
  const nextUnit = flattenUnits().find((unit) => !completed.has(unit.id))
  return nextUnit?.id ?? flattenUnits().at(-1)?.id ?? ''
}

const normalizeProgress = (viewerId: string, value: unknown): AcademyProgress => {
  const defaults = getDefaultProgress(viewerId)
  if (!isRecord(value)) {
    return defaults
  }

  const allUnitIds = new Set(flattenUnits().map((unit) => unit.id))
  const allEventIds = new Set([...ACTIVE_EVENTS, ...ARCHIVED_EVENTS].map((event) => event.id))
  const allLessonIds = new Set([
    ...flattenUnits().flatMap((unit) => unit.lessons.map((lesson) => lesson.id)),
    ...[...ACTIVE_EVENTS, ...ARCHIVED_EVENTS].flatMap((event) =>
      getEventUnitBySlug(event.slug)?.lessons.map((lesson) => lesson.id) ?? [],
    ),
  ])
  const completedUnitIds = Array.isArray(value.completedUnitIds)
    ? value.completedUnitIds.filter((id): id is string => typeof id === 'string' && allUnitIds.has(id))
    : defaults.completedUnitIds
  const completedEventIds = Array.isArray(value.completedEventIds)
    ? value.completedEventIds.filter((id): id is string => typeof id === 'string' && allEventIds.has(id))
    : defaults.completedEventIds
  const completedLessonIds = Array.isArray(value.completedLessonIds)
    ? value.completedLessonIds.filter((id): id is string => typeof id === 'string' && allLessonIds.has(id))
    : defaults.completedLessonIds

  const unitResults = isRecord(value.unitResults)
    ? Object.fromEntries(
        Object.entries(value.unitResults).filter(
          ([unitId, result]) => allUnitIds.has(unitId) && isRecord(result),
        ),
      ) as Record<string, AcademyUnitResult>
    : defaults.unitResults
  const eventResults = isRecord(value.eventResults)
    ? Object.fromEntries(
        Object.entries(value.eventResults).filter(
          ([unitId, result]) => allEventIds.has(unitId) && isRecord(result),
        ),
      ) as Record<string, AcademyUnitResult>
    : defaults.eventResults
  const lessonResults = isRecord(value.lessonResults)
    ? Object.fromEntries(
        Object.entries(value.lessonResults).filter(
          ([lessonId, result]) => allLessonIds.has(lessonId) && isRecord(result),
        ),
      ) as Record<string, AcademyLessonResult>
    : defaults.lessonResults

  const streak = isRecord(value.streak) ? value.streak : {}
  const lives = isRecord(value.lives) ? value.lives : {}
  const selectedCursusId =
    typeof value.selectedCursusId === 'string' &&
    ACADEMY_CURSUS.some((cursus) => cursus.id === value.selectedCursusId)
      ? (value.selectedCursusId as AcademyCursusId)
      : defaults.selectedCursusId

  return {
    viewerId,
    selectedCursusId,
    completedUnitIds,
    completedEventIds,
    completedLessonIds,
    activeUnitId: getNextActiveUnitId(completedUnitIds),
    unitResults,
    eventResults,
    lessonResults,
    mistakeQueue: Array.isArray(value.mistakeQueue)
      ? value.mistakeQueue.filter((entry): entry is AcademyMistakeQueueItem => isRecord(entry) && typeof entry.id === 'string')
      : [],
    seedsBalance:
      typeof value.seedsBalance === 'number' && Number.isFinite(value.seedsBalance)
        ? Math.max(0, Math.floor(value.seedsBalance))
        : defaults.seedsBalance,
    streak: {
      current:
        typeof streak.current === 'number' && Number.isFinite(streak.current)
          ? Math.max(0, Math.floor(streak.current))
          : defaults.streak.current,
      best:
        typeof streak.best === 'number' && Number.isFinite(streak.best)
          ? Math.max(0, Math.floor(streak.best))
          : defaults.streak.best,
      lastActivityDay:
        typeof streak.lastActivityDay === 'string' && streak.lastActivityDay
          ? streak.lastActivityDay
          : null,
      completedDays: Array.isArray(streak.completedDays)
        ? streak.completedDays.filter((day): day is string => typeof day === 'string')
        : [],
    },
    lives: {
      remaining:
        typeof lives.remaining === 'number' && Number.isFinite(lives.remaining)
          ? Math.max(0, Math.min(5, Math.floor(lives.remaining)))
          : defaults.lives.remaining,
      updatedAt:
        typeof lives.updatedAt === 'string' && lives.updatedAt
          ? lives.updatedAt
          : defaults.lives.updatedAt,
    },
  }
}

const readStoredProgress = (): Record<string, unknown> => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(ACADEMY_PROGRESS_STORAGE_KEY)
    if (!rawValue) {
      return {}
    }

    const parsed = JSON.parse(rawValue) as unknown
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

const writeStoredProgress = (entries: Record<string, AcademyProgress>) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ACADEMY_PROGRESS_STORAGE_KEY, JSON.stringify(entries))
}

const getUnitById = (unitId: string): AcademyUnit | null =>
  flattenUnits().find((unit) => unit.id === unitId) ??
  getEventUnitBySlug(unitId)

const getStoredProgressEntries = (): Record<string, AcademyProgress> => {
  const rawEntries = readStoredProgress()
  return Object.fromEntries(
    Object.entries(rawEntries).map(([viewerId, progress]) => [
      viewerId,
      normalizeProgress(viewerId, progress),
    ]),
  )
}

export const localAcademyRepository: AcademyRepository = {
  getCurriculum() {
    return ACADEMY_CURRICULUM
  },

  getProgress(viewerId) {
    const entries = getStoredProgressEntries()
    return entries[viewerId] ?? getDefaultProgress(viewerId)
  },

  saveProgress(viewerId, progress) {
    const nextProgress = normalizeProgress(viewerId, progress)
    const entries = getStoredProgressEntries()
    writeStoredProgress({
      ...entries,
      [viewerId]: nextProgress,
    })
    return nextProgress
  },

  setCursus(viewerId, cursusId) {
    const current = this.getProgress(viewerId)
    return this.saveProgress(viewerId, {
      ...current,
      selectedCursusId: cursusId,
    })
  },

  completeLesson(viewerId, unitId, lessonId, result) {
    const unit = getUnitById(unitId)
    const lesson = unit?.lessons.find((entry) => entry.id === lessonId)
    if (!unit || !lesson) {
      return this.getProgress(viewerId)
    }

    const current = this.getProgress(viewerId)
    const timestamp = new Date().toISOString()
    const today = getLocalDayKey()
    const yesterday = getYesterdayDayKey(today)
    const completedDays = current.streak.completedDays.includes(today)
      ? current.streak.completedDays
      : [...current.streak.completedDays, today].sort()
    const nextCurrentStreak =
      current.streak.lastActivityDay === today
        ? current.streak.current || 1
        : current.streak.lastActivityDay === yesterday
          ? current.streak.current + 1
          : 1
    const isEvent = unit.chapterId === 'events'
    const wasRewardAlreadyEarned = isEvent
      ? Boolean(current.eventResults[unitId]?.rewardEarned)
      : Boolean(current.unitResults[unitId]?.rewardEarned)
    const completedLessonIds = current.completedLessonIds.includes(lessonId)
      ? current.completedLessonIds
      : [...current.completedLessonIds, lessonId]
    const unitLessonIds = unit.lessons.map((entry) => entry.id)
    const hasCompletedAllLessons = unitLessonIds.every((id) => completedLessonIds.includes(id))
    const completedUnitIds = isEvent || !hasCompletedAllLessons || current.completedUnitIds.includes(unitId)
      ? current.completedUnitIds
      : [...current.completedUnitIds, unitId]
    const completedEventIds = !isEvent || !hasCompletedAllLessons || current.completedEventIds.includes(unitId)
      ? current.completedEventIds
      : [...current.completedEventIds, unitId]
    const resultRecord: AcademyUnitResult = {
      unitId,
      completedAt: (isEvent ? current.eventResults[unitId] : current.unitResults[unitId])?.completedAt ?? timestamp,
      score: Math.max((isEvent ? current.eventResults[unitId] : current.unitResults[unitId])?.score ?? 0, result.score),
      mistakes: Math.min((isEvent ? current.eventResults[unitId] : current.unitResults[unitId])?.mistakes ?? result.mistakes, result.mistakes),
      rewardEarned: (isEvent ? current.eventResults[unitId] : current.unitResults[unitId])?.rewardEarned ?? unit.reward.amount,
    }
    const mistakeQueueAdditions = result.missedConceptIds.map((conceptId, index): AcademyMistakeQueueItem => ({
      id: `${lessonId}-${conceptId}-${timestamp}-${index}`,
      unitId,
      lessonId,
      exerciseId: lesson.exercises.find((exercise) => exercise.conceptId === conceptId)?.id ?? lesson.id,
      conceptId,
      missedAt: timestamp,
      resolved: false,
    }))

    return this.saveProgress(viewerId, {
      ...current,
      completedLessonIds,
      completedUnitIds,
      completedEventIds,
      activeUnitId: getNextActiveUnitId(completedUnitIds),
      unitResults: isEvent
        ? current.unitResults
        : {
            ...current.unitResults,
            [unitId]: resultRecord,
          },
      eventResults: isEvent
        ? {
            ...current.eventResults,
            [unitId]: resultRecord,
          }
        : current.eventResults,
      lessonResults: {
        ...current.lessonResults,
        [lessonId]: {
          lessonId,
          unitId,
          completedAt: current.lessonResults[lessonId]?.completedAt ?? timestamp,
          score: Math.max(current.lessonResults[lessonId]?.score ?? 0, result.score),
          mistakes: Math.min(current.lessonResults[lessonId]?.mistakes ?? result.mistakes, result.mistakes),
          missedConceptIds: Array.from(new Set([
            ...(current.lessonResults[lessonId]?.missedConceptIds ?? []),
            ...result.missedConceptIds,
          ])),
        },
      },
      mistakeQueue: [...current.mistakeQueue, ...mistakeQueueAdditions],
      seedsBalance: wasRewardAlreadyEarned || !hasCompletedAllLessons
        ? current.seedsBalance
        : current.seedsBalance + unit.reward.amount,
      streak: {
        current: nextCurrentStreak,
        best: Math.max(current.streak.best, nextCurrentStreak),
        lastActivityDay: today,
        completedDays,
      },
    })
  },

  completeUnit(viewerId, unitId, result) {
    const unit = getUnitById(unitId)
    if (!unit) {
      return this.getProgress(viewerId)
    }

    const current = this.getProgress(viewerId)
    const wasAlreadyCompleted = current.completedUnitIds.includes(unitId)
    const completedUnitIds = wasAlreadyCompleted
      ? current.completedUnitIds
      : [...current.completedUnitIds, unitId]

    const timestamp = new Date().toISOString()
    const today = getLocalDayKey()
    const yesterday = getYesterdayDayKey(today)
    const completedDays = current.streak.completedDays.includes(today)
      ? current.streak.completedDays
      : [...current.streak.completedDays, today].sort()
    const nextCurrentStreak =
      current.streak.lastActivityDay === today
        ? current.streak.current || 1
        : current.streak.lastActivityDay === yesterday
          ? current.streak.current + 1
          : 1

    return this.saveProgress(viewerId, {
      ...current,
      completedUnitIds,
      activeUnitId: getNextActiveUnitId(completedUnitIds),
      unitResults: {
        ...current.unitResults,
        [unitId]: {
          unitId,
          completedAt: current.unitResults[unitId]?.completedAt ?? timestamp,
          score: Math.max(current.unitResults[unitId]?.score ?? 0, result.score),
          mistakes: Math.min(current.unitResults[unitId]?.mistakes ?? result.mistakes, result.mistakes),
          rewardEarned: current.unitResults[unitId]?.rewardEarned ?? unit.reward.amount,
        },
      },
      seedsBalance: wasAlreadyCompleted ? current.seedsBalance : current.seedsBalance + unit.reward.amount,
      streak: {
        current: nextCurrentStreak,
        best: Math.max(current.streak.best, nextCurrentStreak),
        lastActivityDay: today,
        completedDays,
      },
    })
  },

  resetProgress(viewerId) {
    const entries = getStoredProgressEntries()
    const nextProgress = getDefaultProgress(viewerId)
    writeStoredProgress({
      ...entries,
      [viewerId]: nextProgress,
    })
    return nextProgress
  },

  spendLife(viewerId) {
    const current = this.getProgress(viewerId)
    if (current.lives.remaining <= 0) return current
    const wasAtMax = current.lives.remaining === MAX_LIVES
    const nextLives: LivesState = {
      remaining: current.lives.remaining - 1,
      updatedAt: wasAtMax ? new Date().toISOString() : current.lives.updatedAt,
    }
    return this.saveProgress(viewerId, { ...current, lives: nextLives })
  },

  regenerateLives(viewerId) {
    const current = this.getProgress(viewerId)
    const unlimited = isUnlimitedLives(current.seedsBalance)
    const regenLives = computeRegenLives(current.lives, unlimited)
    if (
      regenLives.remaining === current.lives.remaining &&
      regenLives.updatedAt === current.lives.updatedAt
    ) {
      return current
    }
    return this.saveProgress(viewerId, { ...current, lives: regenLives })
  },

  spendSeedsForLives(viewerId) {
    const current = this.getProgress(viewerId)
    if (current.seedsBalance < SEEDS_COST) return null
    return this.saveProgress(viewerId, {
      ...current,
      seedsBalance: current.seedsBalance - SEEDS_COST,
      lives: { remaining: MAX_LIVES, updatedAt: new Date().toISOString() },
    })
  },

  awardTrainingLife(viewerId) {
    const current = this.getProgress(viewerId)
    const unlimited = isUnlimitedLives(current.seedsBalance)
    const nextRemaining = unlimited ? MAX_LIVES : Math.min(MAX_LIVES, current.lives.remaining + 1)
    return this.saveProgress(viewerId, {
      ...current,
      lives: { remaining: nextRemaining, updatedAt: new Date().toISOString() },
    })
  },
}

export const academyRepository: AcademyRepository = localAcademyRepository

export function getAllChapters(): AcademyChapter[] {
  return academyRepository.getCurriculum()
}

export function getAllUnits(): AcademyUnit[] {
  return flattenUnits()
}

export function getChapterBySlug(slug: string): AcademyChapter | null {
  return ACADEMY_CURRICULUM.find((chapter) => chapter.slug === slug || chapter.id === slug) ?? null
}

export function getUnitBySlug(chapterSlug: string, unitSlug: string): AcademyUnit | null {
  const chapter = getChapterBySlug(chapterSlug)
  return (
    chapter?.units.find((unit) => unit.slug === unitSlug || unit.id === unitSlug) ??
    null
  )
}

export function getNextUnit(unitId: string): AcademyUnit | null {
  const units = flattenUnits()
  const currentIndex = units.findIndex((unit) => unit.id === unitId)
  return currentIndex >= 0 ? units[currentIndex + 1] ?? null : null
}

export function getCursusOptions(): AcademyCursus[] {
  return ACADEMY_CURSUS
}

export function getCursusById(cursusId: AcademyCursusId): AcademyCursus {
  return ACADEMY_CURSUS.find((cursus) => cursus.id === cursusId) ?? ACADEMY_CURSUS[0]!
}

export function getNextLessonForUnit(
  unit: AcademyUnit,
  progress: AcademyProgress,
): AcademyLesson {
  return (
    unit.lessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ??
    unit.lessons[unit.lessons.length - 1] ??
    {
      id: `${unit.id}-legacy-lesson`,
      slug: 'legacy',
      title: 'Leçon',
      kind: 'discovery',
      order: 1,
      estimatedMinutes: unit.estimatedMinutes ?? '3 min',
      learningGoal: unit.learningGoal ?? unit.concept,
      exercises: unit.exercises,
    }
  )
}

export function getCompletedLessonCountForUnit(
  unit: AcademyUnit,
  progress: AcademyProgress,
): number {
  return unit.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length
}

export function getActiveUnit(
  chapters: AcademyChapter[] = academyRepository.getCurriculum(),
  progress: AcademyProgress,
): AcademyUnit | null {
  return flattenUnits(chapters).find((unit) => unit.id === progress.activeUnitId) ?? null
}

export function getUnitPrerequisite(
  unitId: string,
  progress: AcademyProgress,
): AcademyUnit | null {
  if (progress.completedUnitIds.includes(unitId) || unitId === progress.activeUnitId) {
    return null
  }

  return getUnitById(progress.activeUnitId)
}

export function isRewardAlreadyEarned(
  progress: AcademyProgress,
  unitId: string,
): boolean {
  return Boolean(progress.unitResults[unitId]?.rewardEarned || progress.eventResults[unitId]?.rewardEarned)
}

export function decorateAcademyWithProgress(
  chapters: AcademyChapter[],
  progress: AcademyProgress,
): AcademyChapterWithStatus[] {
  const completed = new Set(progress.completedUnitIds)

  return chapters.map((chapter) => {
    const units = chapter.units.map((unit) => {
      const status: AcademyUnitStatus = completed.has(unit.id)
        ? 'completed'
        : unit.id === progress.activeUnitId
          ? 'active'
          : 'locked'

      return {
        ...unit,
        status,
        result: progress.unitResults[unit.id] ?? null,
      }
    })
    const completedUnitsCount = units.filter((unit) => unit.status === 'completed').length
    const status: AcademyChapterStatus =
      completedUnitsCount === units.length
        ? 'completed'
        : units.some((unit) => unit.status === 'active')
          ? 'active'
          : 'locked'

    return {
      ...chapter,
      status,
      completedUnitsCount,
      units,
    }
  })
}

export function getCurrentChapter(
  chapters: AcademyChapterWithStatus[],
): AcademyChapterWithStatus {
  const currentChapter =
    chapters.find((chapter) => chapter.status === 'active') ??
    chapters.find((chapter) => chapter.status === 'locked') ??
    chapters[chapters.length - 1]

  if (!currentChapter) {
    throw new Error('Academy surface requires at least one chapter.')
  }

  return currentChapter
}

export function getNextChapter(
  chapters: AcademyChapterWithStatus[],
  currentChapterId: string,
): AcademyChapterWithStatus | null {
  const currentIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId)
  return currentIndex >= 0 ? chapters[currentIndex + 1] ?? null : null
}

export function getMonthActivityDays(progress: AcademyProgress, date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const completed = new Set(progress.streak.completedDays)

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const dayKey = getLocalDayKey(new Date(year, month, day))
    return {
      day,
      dayKey,
      isCompleted: completed.has(dayKey),
      isToday: dayKey === getLocalDayKey(date),
    }
  })
}

export function getAcademyMonthLabel(date = new Date(), locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date)
}
