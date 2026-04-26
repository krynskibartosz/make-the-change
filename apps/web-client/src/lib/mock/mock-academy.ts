import { getV2UnitsByChapter, listV2Units } from '@/lib/academy/content'
import { v2UnitToLegacy } from '@/lib/academy/runtime'

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
  }>
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

const CHAPTER_ONE_UNITS: AcademyUnit[] = [
  makeUnit({
    id: 'chapter-1-sun', slug: 'le-pouvoir-du-soleil', chapterId: 'chapter-1',
    title: 'Le Pouvoir du Soleil', shortTitle: 'Le Soleil', pathLabel: 'Pouvoir solaire',
    subtitle: "Découvre l'énergie primaire qui allume presque toute la vie.",
    concept: 'Soleil, énergie, producteurs', kind: 'foundation', iconKey: 'sun',
    masteryGoal: "Expliquer pourquoi le Soleil est le premier moteur des écosystèmes.",
    order: 1, durationMinutes: 3, mascot: 'ondine', rewardAmount: 10,
    exercises: makeChapterOneExercises('c1u1', 'sprout', {
      theme: 'Énergie primaire',
      conceptA: { title: 'Le Soleil source', story: "Le Soleil envoie l'énergie qui démarre la plupart des chaînes du vivant.", trueStatement: 'Le Soleil alimente la majorité des écosystèmes terrestres.', falseStatement: 'La lumière solaire ne sert qu’à réchauffer les roches.', quizQuestion: "Quel rôle joue le Soleil dans la nature ?", quizCorrect: "Source d'énergie primaire", quizWrong: ['Simple décor du ciel', 'Réserve de minéraux'] },
      conceptB: { title: 'Les producteurs', story: 'Les producteurs capturent cette énergie avant tous les autres êtres vivants.', trueStatement: 'Les plantes sont des producteurs.', falseStatement: 'Les animaux produisent toute leur énergie à partir de rien.', quizQuestion: 'Qui capte d’abord la lumière ?', quizCorrect: 'Les producteurs', quizWrong: ['Les prédateurs', 'Les roches'] },
      conceptC: { title: 'La chaîne énergétique', story: "Quand une plante grandit, l'énergie solaire entre dans la chaîne alimentaire.", trueStatement: 'Un herbivore récupère indirectement de l’énergie solaire.', falseStatement: 'Un prédateur n’a jamais de lien avec le Soleil.', quizQuestion: "Que transmet une chaîne alimentaire ?", quizCorrect: "De l'énergie", quizWrong: ['Du plastique', 'Du hasard pur'] },
      dragOne: ['Soleil', 'Plante productrice', 'Herbivore'],
      dragTwo: ['Lumière captée', 'Sucre fabriqué', 'Énergie partagée'],
      finalQuestion: "Pourquoi le Soleil est-il le départ du chapitre ?",
      finalCorrect: 'Il alimente les producteurs',
      finalWrong: ['Il remplace l’eau', 'Il crée les animaux directement'],
    }),
  }),
  makeUnit({
    id: 'chapter-1-water', slug: 'le-voyage-de-leau', chapterId: 'chapter-1',
    title: "Le Voyage de l'Eau", shortTitle: "L'Eau", pathLabel: 'Cycle bleu',
    subtitle: "Suis l'eau qui circule entre ciel, sol et vivant.",
    concept: 'Évaporation, pluie, infiltration', kind: 'foundation', iconKey: 'water',
    masteryGoal: "Remettre le cycle de l'eau dans l'ordre et expliquer son rôle vivant.",
    order: 2, durationMinutes: 3, mascot: 'ondine', rewardAmount: 10,
    exercises: makeChapterOneExercises('c1u2', 'water', {
      theme: "Cycle de l'eau",
      conceptA: { title: 'Évaporation', story: "Le Soleil chauffe l'eau : elle s'évapore et monte vers l'atmosphère.", trueStatement: "L'évaporation transforme l'eau liquide en vapeur.", falseStatement: "L'évaporation enterre l'eau sous les roches.", quizQuestion: "Que devient l'eau qui s'évapore ?", quizCorrect: 'De la vapeur', quizWrong: ['Du sel', 'Du sable'] },
      conceptB: { title: 'Nuages et pluie', story: "La vapeur se condense en nuages, puis retombe en pluie.", trueStatement: 'Les nuages peuvent rendre l’eau aux sols.', falseStatement: 'La pluie ne participe pas au cycle de l’eau.', quizQuestion: "Que font les nuages dans le cycle ?", quizCorrect: "Ils préparent la pluie", quizWrong: ['Ils bloquent la gravité', 'Ils créent du pétrole'] },
      conceptC: { title: 'Infiltration', story: "Une partie de l'eau entre dans les sols et nourrit racines, nappes et rivières.", trueStatement: "Un sol vivant aide l'eau à s'infiltrer.", falseStatement: "Le béton aide toujours l'eau à entrer dans le sol.", quizQuestion: "Quel sol absorbe le mieux l'eau ?", quizCorrect: 'Un sol vivant', quizWrong: ['Du goudron', 'Du béton compact'] },
      dragOne: ['Évaporation', 'Condensation', 'Pluie'],
      dragTwo: ['Pluie', 'Infiltration', 'Racines nourries'],
      finalQuestion: "Pourquoi l'eau est-elle un moteur du vivant ?",
      finalCorrect: 'Elle transporte et permet les réactions',
      finalWrong: ['Elle bloque les cellules', 'Elle remplace la lumière'],
    }),
  }),
  makeUnit({
    id: 'chapter-1-soil', slug: 'la-magie-des-sols', chapterId: 'chapter-1',
    title: 'La Magie des Sols', shortTitle: 'Les Sols', pathLabel: 'Sols vivants',
    subtitle: 'Entre dans la fabrique souterraine des nutriments.',
    concept: 'Sols vivants, minéraux, racines', kind: 'foundation', iconKey: 'sprout',
    masteryGoal: 'Distinguer un sol vivant d’un support mort et comprendre les nutriments.',
    order: 3, durationMinutes: 3, mascot: 'sylva', rewardAmount: 10,
    exercises: makeChapterOneExercises('c1u3', 'field', {
      theme: 'Sols vivants',
      conceptA: { title: 'Minéraux', story: 'Les minéraux sont les briques invisibles qui aident les plantes à se construire.', trueStatement: 'Les minéraux aident les plantes à grandir.', falseStatement: 'Les minéraux sont inutiles aux racines.', quizQuestion: 'Que fournissent les minéraux ?', quizCorrect: 'Des briques de croissance', quizWrong: ['Des ailes', 'De la lumière'] },
      conceptB: { title: 'Sols vivants', story: 'Un sol vivant abrite microbes, champignons, racines et minuscules animaux.', trueStatement: 'Un sol vivant est rempli d’organismes.', falseStatement: 'Un bon sol est forcément stérile.', quizQuestion: 'Que trouve-t-on dans un sol vivant ?', quizCorrect: 'Des organismes utiles', quizWrong: ['Du vide', 'Uniquement du métal'] },
      conceptC: { title: 'Racines', story: 'Les racines explorent le sol pour boire, s’ancrer et échanger.', trueStatement: 'Les racines absorbent eau et minéraux.', falseStatement: 'Les racines ne servent qu’à décorer.', quizQuestion: 'À quoi servent les racines ?', quizCorrect: 'Absorber et ancrer', quizWrong: ['Voler', 'Produire des nuages'] },
      dragOne: ['Roche altérée', 'Minéraux disponibles', 'Racines nourries'],
      dragTwo: ['Sol vivant', 'Microbes actifs', 'Plante plus forte'],
      finalQuestion: 'Pourquoi le sol est-il une magie discrète ?',
      finalCorrect: 'Il transforme la matière en nourriture',
      finalWrong: ['Il bloque toute vie', 'Il remplace le Soleil'],
    }),
  }),
  makeUnit({
    id: 'chapter-1-plants-light', slug: 'les-plantes-mangent-la-lumiere', chapterId: 'chapter-1',
    title: 'Les Plantes Mangent la Lumière', shortTitle: 'Photosynthèse', pathLabel: 'Lumière verte',
    subtitle: 'Découvre comment une feuille fabrique du sucre avec le ciel.',
    concept: 'Photosynthèse, feuilles, sucre', kind: 'flora', iconKey: 'leaf',
    masteryGoal: 'Expliquer la photosynthèse sans jargon inutile.',
    order: 4, durationMinutes: 3, mascot: 'sylva', rewardAmount: 15,
    exercises: makeChapterOneExercises('c1u4', 'forest', {
      theme: 'Photosynthèse',
      conceptA: { title: 'Feuilles', story: 'Les feuilles sont des panneaux solaires vivants.', trueStatement: 'Les feuilles captent la lumière.', falseStatement: 'Les feuilles mangent de la terre avec des dents.', quizQuestion: 'Quel organe capte surtout la lumière ?', quizCorrect: 'La feuille', quizWrong: ['La griffe', 'La pierre'] },
      conceptB: { title: 'Sucre végétal', story: 'Avec lumière, eau et air, la plante fabrique du sucre.', trueStatement: 'La photosynthèse produit du sucre.', falseStatement: 'La photosynthèse produit du goudron.', quizQuestion: 'Que fabrique la plante ?', quizCorrect: 'Du sucre', quizWrong: ['Du verre', 'Du sel marin'] },
      conceptC: { title: 'Oxygène', story: 'La photosynthèse rejette aussi de l’oxygène dans l’air.', trueStatement: 'Les plantes libèrent de l’oxygène.', falseStatement: 'Les plantes détruisent tout l’oxygène.', quizQuestion: 'Quel gaz est libéré ?', quizCorrect: "De l'oxygène", quizWrong: ['Du mercure', 'Du sable'] },
      dragOne: ['Lumière', 'Eau + CO2', 'Sucre + oxygène'],
      dragTwo: ['Feuille active', 'Sucre fabriqué', 'Animal nourri'],
      finalQuestion: 'Pourquoi les plantes sont-elles au centre du vivant ?',
      finalCorrect: 'Elles fabriquent la base alimentaire',
      finalWrong: ['Elles chassent les prédateurs', 'Elles arrêtent le cycle de l’eau'],
    }),
  }),
  makeUnit({
    id: 'chapter-1-training', slug: 'reflexes-du-vivant', chapterId: 'chapter-1',
    title: 'Réflexes du Vivant', shortTitle: 'Réflexes', pathLabel: 'Entraînement',
    subtitle: 'Révise vite : soleil, eau, sols et plantes.',
    concept: 'Révision soleil eau sols plantes', kind: 'training', iconKey: 'zap',
    masteryGoal: 'Reconnaître rapidement les quatre forces de base.',
    order: 5, durationMinutes: 3, mascot: 'abeille-transparente', rewardAmount: 15,
    exercises: makeChapterOneExercises('c1u5', 'sprout', {
      theme: 'Sprint de révision',
      conceptA: { title: 'Soleil + plantes', story: 'Tu connais déjà le duo : lumière puis sucre.', trueStatement: 'La lumière aide les plantes à fabriquer du sucre.', falseStatement: 'Les plantes poussent mieux sans aucune énergie.', quizQuestion: 'Quel duo démarre la chaîne ?', quizCorrect: 'Soleil et plantes', quizWrong: ['Béton et plastique', 'Ombre et goudron'] },
      conceptB: { title: 'Eau + sols', story: 'L’eau circule mieux quand le sol reste vivant.', trueStatement: 'Un sol vivant aide l’eau à circuler.', falseStatement: 'Le béton nourrit mieux les racines qu’un sol vivant.', quizQuestion: 'Quel duo nourrit les racines ?', quizCorrect: 'Eau et sols', quizWrong: ['Vent et métal', 'Sel et goudron'] },
      conceptC: { title: 'Chaîne complète', story: 'Soleil, eau, sol et plantes forment la base de tout le reste.', trueStatement: 'Les animaux dépendent indirectement des plantes.', falseStatement: 'Les animaux n’ont aucun lien avec les producteurs.', quizQuestion: 'Que révises-tu ici ?', quizCorrect: 'La base du vivant', quizWrong: ['Une liste de villes', 'Une recette de béton'] },
      dragOne: ['Soleil', 'Plante', 'Animal'],
      dragTwo: ['Pluie', 'Sol vivant', 'Racines'],
      finalQuestion: 'Quel réflexe doit devenir automatique ?',
      finalCorrect: 'Relier énergie, eau, sol et plantes',
      finalWrong: ['Isoler chaque élément', 'Ignorer les producteurs'],
    }),
  }),
  makeUnit({
    id: 'chapter-1-life-factory', slug: 'la-fabrique-du-vivant', chapterId: 'chapter-1',
    title: 'La Fabrique du Vivant', shortTitle: 'Fabrique', pathLabel: 'Synthèse',
    subtitle: 'Assemble les forces invisibles en un système vivant.',
    concept: 'Énergie, matière, croissance', kind: 'foundation', iconKey: 'atom',
    masteryGoal: 'Construire une explication complète du vivant de base.',
    order: 6, durationMinutes: 3, mascot: 'ondine', rewardAmount: 15,
    exercises: makeChapterOneExercises('c1u6', 'forest', {
      theme: 'Synthèse du vivant',
      conceptA: { title: 'Énergie', story: 'L’énergie donne l’élan initial au système vivant.', trueStatement: 'Un écosystème a besoin d’un flux d’énergie.', falseStatement: 'Un écosystème fonctionne sans énergie.', quizQuestion: 'Que fournit l’énergie ?', quizCorrect: 'Un moteur de transformation', quizWrong: ['Un mur', 'Un cadenas'] },
      conceptB: { title: 'Matière', story: 'La matière circule : eau, carbone, minéraux, sucres.', trueStatement: 'La matière circule entre sol, plantes et animaux.', falseStatement: 'La matière disparaît à chaque repas.', quizQuestion: 'Que fait la matière ?', quizCorrect: 'Elle circule et se transforme', quizWrong: ['Elle disparaît toujours', 'Elle devient du vide'] },
      conceptC: { title: 'Croissance', story: 'Quand énergie et matière se rencontrent, le vivant peut grandir.', trueStatement: 'Grandir demande énergie et matière.', falseStatement: 'Grandir ne demande aucune ressource.', quizQuestion: 'De quoi dépend la croissance ?', quizCorrect: 'Énergie et matière', quizWrong: ['Silence et métal', 'Goudron et ombre'] },
      dragOne: ['Énergie solaire', 'Matière disponible', 'Croissance vivante'],
      dragTwo: ['Producteurs', 'Consommateurs', 'Décomposeurs'],
      finalQuestion: 'Qu’est-ce qu’un écosystème assemble ?',
      finalCorrect: 'Énergie, matière et relations',
      finalWrong: ['Des éléments isolés', 'Uniquement des animaux'],
    }),
  }),
  makeUnit({
    id: 'chapter-1-boss', slug: 'cree-ton-ecosysteme', chapterId: 'chapter-1',
    title: 'Crée Ton Écosystème', shortTitle: 'Boss final', pathLabel: 'Boss',
    subtitle: 'Le test final : fais naître un mini-monde cohérent.',
    concept: 'Écosystème, équilibre, synthèse', kind: 'boss', iconKey: 'crown',
    masteryGoal: 'Prouver que tu peux relier les bases en un écosystème.',
    order: 7, durationMinutes: 4, mascot: 'abeille-transparente', rewardAmount: 25,
    exercises: makeChapterOneExercises('c1u7', 'forest', {
      theme: 'Boss du chapitre',
      conceptA: { title: 'Producteurs', story: 'Un écosystème commence par des producteurs capables de capter l’énergie.', trueStatement: 'Sans producteurs, la chaîne alimentaire s’effondre.', falseStatement: 'Les producteurs sont optionnels dans un écosystème.', quizQuestion: 'Qui démarre la chaîne ?', quizCorrect: 'Les producteurs', quizWrong: ['Les déchets plastiques', 'Les prédateurs seuls'] },
      conceptB: { title: 'Cycles', story: 'L’eau et les nutriments doivent circuler pour éviter le blocage.', trueStatement: 'Un cycle garde les ressources disponibles.', falseStatement: 'Un cycle vivant doit toujours être bloqué.', quizQuestion: 'Pourquoi les cycles comptent-ils ?', quizCorrect: 'Ils remettent les ressources en circulation', quizWrong: ['Ils arrêtent la pluie', 'Ils suppriment les sols'] },
      conceptC: { title: 'Équilibre', story: 'Un mini-monde tient grâce aux liens entre énergie, matière et espèces.', trueStatement: 'Un écosystème est un réseau de relations.', falseStatement: 'Un écosystème est une pile d’êtres isolés.', quizQuestion: 'Qu’est-ce qui stabilise un écosystème ?', quizCorrect: 'Des relations équilibrées', quizWrong: ['Un seul prédateur', 'Aucun producteur'] },
      dragOne: ['Soleil', 'Plantes', 'Herbivores'],
      dragTwo: ['Pluie', 'Sol vivant', 'Forêt stable'],
      finalQuestion: 'Quel mini-monde est viable ?',
      finalCorrect: 'Soleil, eau, sol, plantes et relations',
      finalWrong: ['Prédateurs sans plantes', 'Béton sans cycle de l’eau'],
    }),
  }),
]

const LEGACY_ACADEMY_CURRICULUM: AcademyChapter[] = [
  {
    id: 'chapter-1', slug: 'alphabet-originel', title: "L'Alphabet Originel",
    subtitle: 'Comprends les forces invisibles qui font tourner notre monde.',
    level: 'A1', order: 1, durationMinutes: 84, difficulty: 'debutant',
    units: CHAPTER_ONE_UNITS,
  },
  {
    id: 'chapter-2', slug: 'grammaire-especes', title: 'La Grammaire des Espèces',
    subtitle: "Comment les êtres vivants interagissent, s'allient et évoluent.",
    level: 'A2', order: 2, durationMinutes: 60, difficulty: 'debutant',
    units: [
      makeUnit({
        id: 'unit-2-1', slug: 'le-festin-des-predateurs', chapterId: 'chapter-2',
        title: 'Le Festin des Prédateurs', subtitle: 'Proies, prédateurs et équilibre vivant.',
        concept: 'Proies, Prédateurs, Équilibre', order: 1, durationMinutes: 3,
        mascot: 'abeille-transparente', rewardAmount: 20,
        exercises: [
          { id: 'u21s1', type: 'STORY', screens: [
            { text: 'Dans la nature, tout le monde mange ou est mangé.', imageUrl: storyImages.forest, imagePrompt: 'Prédateur chassant sa proie' },
            { text: "C'est le cycle vital de la chaîne alimentaire — un équilibre fragile mais parfait.", imageUrl: storyImages.field, imagePrompt: 'Chaîne alimentaire illustrée' },
          ]},
          { id: 'u21sw1', type: 'SWIPE', question: "Est-ce le rôle utile d'un grand prédateur ?",
            card: { title: 'Réguler les populations de proies', subtitle: 'Gardien des équilibres' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Bien joué ! Sans prédateurs, les herbivores mangeraient toute la forêt.",
            incorrectFeedback: "Si ! Les prédateurs régulent les proies — c'est leur rôle clé." },
          { id: 'u21s2', type: 'STORY', screens: [
            { text: "À la base de toute chaîne alimentaire se trouvent les producteurs : les plantes.", imageUrl: storyImages.sprout, imagePrompt: 'Plante au bas de la chaîne' },
            { text: "Ensuite viennent les herbivores, puis les carnivores, et enfin les décomposeurs.", imageUrl: storyImages.field, imagePrompt: 'Niveaux trophiques illustrés' },
          ]},
          { id: 'u21sw2', type: 'SWIPE', question: "Les plantes vertes sont-elles à la base de toute chaîne alimentaire terrestre ?",
            card: { title: 'Les plantes vertes', subtitle: 'Productrices primaires' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Elles produisent leur énergie et nourrissent tous les autres.",
            incorrectFeedback: "Si ! Les plantes sont toujours à la base — elles produisent l'énergie." },
          { id: 'u21d1', type: 'DRAG_DROP', instruction: 'Reconstitue cette chaîne alimentaire dans le bon ordre :',
            items: [{ id: 'u21d1a', text: '🌿 La feuille (Producteur)' }, { id: 'u21d1b', text: '🐛 La chenille (Herbivore)' }, { id: 'u21d1c', text: '🐦 L\'oiseau (Carnivore)' }] },
          { id: 'u21s3', type: 'STORY', screens: [
            { text: "Les décomposeurs (champignons, bactéries) recyclient la matière morte en nutriments pour le sol.", imageUrl: storyImages.forest, imagePrompt: 'Champignons sur bois mort' },
          ]},
          { id: 'u21sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Un prédateur affaiblit son écosystème en chassant.', subtitle: '⚡ Sprint 1' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Le prédateur stabilise son écosystème en régulant les proies.",
            incorrectFeedback: "Non ! Le prédateur est un régulateur essentiel, pas un destructeur." },
          { id: 'u21sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Les champignons jouent un rôle dans la décomposition de la matière organique.', subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Parfait ! Les décomposeurs recyclent tout ce qui est mort.",
            incorrectFeedback: "Si ! Les champignons et bactéries recyclent la matière morte." },
          { id: 'u21sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Supprimer un prédateur peut déséquilibrer tout un écosystème.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! La réintroduction du loup a transformé les rivières du Yellowstone !",
            incorrectFeedback: "Si ! Supprimer un prédateur crée un effet domino dans tout l'écosystème." },
          { id: 'u21d2', type: 'DRAG_DROP', instruction: "Ordonne ces niveaux trophiques du producteur au consommateur final :",
            items: [{ id: 'u21d2a', text: '🌱 Plantes (Producteurs)' }, { id: 'u21d2b', text: '🐇 Herbivores (C1)' }, { id: 'u21d2c', text: '🦅 Super-prédateurs (C3)' }] },
          { id: 'u21q1', type: 'QUIZ', question: "Qui se trouve tout à la base d'une chaîne alimentaire terrestre ?",
            options: [{ text: 'Le super-prédateur', isCorrect: false }, { text: 'Le champignon géant', isCorrect: false }, { text: 'La plante verte', isCorrect: true }],
            successFeedback: "Bravo ! Elle produit sa propre énergie pour nourrir tous les autres.",
            failureFeedback: "Pas tout à fait... La plante verte est toujours à la base — elle produit l'énergie." },
          { id: 'u21q2', type: 'QUIZ', question: "Quel groupe d'êtres vivants recycle la matière morte en nutriments pour le sol ?",
            options: [{ text: 'Les herbivores', isCorrect: false }, { text: 'Les super-prédateurs', isCorrect: false }, { text: 'Les décomposeurs (champignons, bactéries)', isCorrect: true }],
            successFeedback: "Exact ! Les décomposeurs ferment la boucle du vivant.",
            failureFeedback: "Raté ! Ce sont les décomposeurs qui recyclent la matière morte." },
        ],
      }),
      makeUnit({
        id: 'unit-2-2', slug: 'les-alliances-invisibles', chapterId: 'chapter-2',
        title: 'Les Alliances Invisibles', subtitle: "Les pactes secrets qui relient les espèces.",
        concept: 'Mutualisme, Parasitisme, Coévolution', order: 2, durationMinutes: 3,
        mascot: 'sylva', rewardAmount: 20,
        exercises: [
          { id: 'u22s1', type: 'STORY', screens: [
            { text: "Dans la nature, s'entraider est souvent vital pour survivre.", imageUrl: storyImages.reef, imagePrompt: 'Poisson-clown dans anémone' },
            { text: "Ces pactes secrets entre espèces s'appellent la symbiose.", imageUrl: storyImages.forest, imagePrompt: 'Champignon et arbre en symbiose' },
          ]},
          { id: 'u22sw1', type: 'SWIPE', question: "L'abeille et la fleur sont-elles un exemple de relation mutuellement bénéfique ?",
            card: { title: "L'abeille et la fleur", subtitle: 'Alliance Gagnant-Gagnant' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Génial ! L'une prend le nectar, l'autre voyage pour se reproduire.",
            incorrectFeedback: "Si ! C'est le mutualisme parfait — les deux bénéficient de l'échange." },
          { id: 'u22s2', type: 'STORY', screens: [
            { text: "Le parasitisme, c'est quand une espèce profite d'une autre en lui causant du tort.", imageUrl: storyImages.forest, imagePrompt: 'Parasite sur hôte dans forêt' },
            { text: "Le moustique est un parasite : il prend sans rien donner en retour.", imageUrl: storyImages.field, imagePrompt: 'Moustique piquant' },
          ]},
          { id: 'u22sw2', type: 'SWIPE', question: "Le moustique est-il un parasite pour l'humain ?",
            card: { title: 'Le moustique', subtitle: 'Prend sans rien donner' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Aïe ! Oui — il prend du sang sans aucun bénéfice pour l'hôte.",
            incorrectFeedback: "Si ! Le moustique est bien un parasite — il nuit sans apporter rien." },
          { id: 'u22d1', type: 'DRAG_DROP', instruction: 'Classe ces relations de la plus amicale à la pire :',
            items: [{ id: 'u22d1a', text: '🤝 Mutualisme (Gagnant-Gagnant)' }, { id: 'u22d1b', text: '😐 Commensalisme (Un bénéficie, l\'autre neutre)' }, { id: 'u22d1c', text: '😡 Parasitisme (Un gagne, l\'autre perd)' }] },
          { id: 'u22s3', type: 'STORY', screens: [
            { text: "Le commensalisme : une espèce bénéficie sans affecter l'autre. Ex: les bernacles sur les baleines.", imageUrl: storyImages.water, imagePrompt: 'Bernacles sur baleine' },
          ]},
          { id: 'u22sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Dans le mutualisme, les deux espèces bénéficient de la relation.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Mutualisme = Gagnant-Gagnant, c'est l'alliance parfaite.",
            incorrectFeedback: "Si ! Le mutualisme bénéficie aux deux — c'est sa définition." },
          { id: 'u22sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Le poisson-clown et l\'anémone de mer forment une alliance gagnant-gagnant.', subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! L'un est protégé, l'autre est nettoyé — mutualisme parfait.",
            incorrectFeedback: "Si ! Le poisson-clown protège l'anémone et vice-versa." },
          { id: 'u22sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Le lichen est une alliance entre un champignon et une algue.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Bravo ! Ils fusionnent pour créer un super-organisme vivant sur la roche nue.",
            incorrectFeedback: "Si ! Le lichen = champignon + algue en symbiose parfaite." },
          { id: 'u22d2', type: 'DRAG_DROP', instruction: 'Ordonne les types de symbiose selon leur bénéfice :',
            items: [{ id: 'u22d2a', text: '🌟 Mutualisme (++/++)' }, { id: 'u22d2b', text: '😐 Commensalisme (+/0)' }, { id: 'u22d2c', text: '⚠️ Parasitisme (+/-)' }] },
          { id: 'u22q1', type: 'QUIZ', question: "Comment s'appelle l'alliance vitale entre un champignon et une algue ?",
            options: [{ text: 'Une moisissure', isCorrect: false }, { text: 'Un fossile', isCorrect: false }, { text: 'Le lichen', isCorrect: true }],
            successFeedback: "Bravo ! Ils fusionnent pour créer un super-organisme capable de vivre sur la roche.",
            failureFeedback: "Raté... C'est le lichen — champignon + algue en symbiose parfaite." },
          { id: 'u22q2', type: 'QUIZ', question: "Quelle relation profite à une espèce en nuisant à l'autre ?",
            options: [{ text: 'Le mutualisme', isCorrect: false }, { text: 'Le commensalisme', isCorrect: false }, { text: 'Le parasitisme', isCorrect: true }],
            successFeedback: "Exact ! Le parasite profite de son hôte sans rien lui donner en retour.",
            failureFeedback: "Non... Le parasitisme est la relation Gagnant-Perdant." },
        ],
      }),
      makeUnit({
        id: 'unit-2-3', slug: 'la-loterie-des-mutations', chapterId: 'chapter-2',
        title: 'La Loterie des Mutations', subtitle: 'Adaptation, hasard et survie dans le temps.',
        concept: 'Adaptation, Sélection, Survie', order: 3, durationMinutes: 3,
        mascot: 'ondine', rewardAmount: 25,
        exercises: [
          { id: 'u23s1', type: 'STORY', screens: [
            { text: 'La nature teste en permanence de nouvelles formes et caractéristiques.', imageUrl: storyImages.field, imagePrompt: 'Papillons de différentes couleurs' },
            { text: "C'est l'évolution : les mieux adaptés survivent et transmettent leurs gènes.", imageUrl: storyImages.forest, imagePrompt: 'Papillon camouflé sur feuille' },
          ]},
          { id: 'u23sw1', type: 'SWIPE', question: "Une mutation génétique peut-elle aider une espèce à mieux survivre ?",
            card: { title: 'Une mutation utile', subtitle: 'Avantage transmis aux descendants' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Un long cou pour atteindre les feuilles hautes — c'est un avantage transmis.",
            incorrectFeedback: "Si ! Les mutations utiles donnent un avantage de survie." },
          { id: 'u23s2', type: 'STORY', screens: [
            { text: "La sélection naturelle : seuls les individus les mieux adaptés à leur milieu survivent et se reproduisent.", imageUrl: storyImages.forest, imagePrompt: 'Darwin aux Galápagos' },
            { text: "Au fil des générations, l'espèce change — c'est l'évolution en action.", imageUrl: storyImages.field, imagePrompt: 'Série d\'animaux qui évoluent' },
          ]},
          { id: 'u23sw2', type: 'SWIPE', question: "Rester identique génération après génération aide-t-il une espèce à survivre longtemps ?",
            card: { title: 'Rester exactement pareil', subtitle: 'Zéro adaptation' }, correctDirection: 'left',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Si le climat change, l'espèce doit s'adapter ou disparaître.",
            incorrectFeedback: "Non ! L'immobilisme génétique est dangereux face aux changements." },
          { id: 'u23d1', type: 'DRAG_DROP', instruction: "Remets les étapes de l'évolution par sélection naturelle dans le bon ordre :",
            items: [{ id: 'u23d1a', text: '🎲 Mutation au hasard' }, { id: 'u23d1b', text: '🏆 Survie du mieux adapté' }, { id: 'u23d1c', text: '🧬 Transmission aux descendants' }] },
          { id: 'u23s3', type: 'STORY', screens: [
            { text: "Charles Darwin a observé l'évolution aux îles Galápagos — des pinsons adaptés à chaque niche écologique.", imageUrl: storyImages.field, imagePrompt: 'Pinsons de Darwin sur les Galápagos' },
          ]},
          { id: 'u23sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Charles Darwin a expliqué l\'évolution par la sélection naturelle.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Son voyage aux Galápagos a changé la science pour toujours.",
            incorrectFeedback: "Si ! Darwin a bien formulé la théorie de la sélection naturelle." },
          { id: 'u23sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Une espèce parfaitement adaptée à un environnement est protégée à jamais.', subtitle: '⚡ Sprint 2' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Si l'environnement change, même l'espèce adaptée peut disparaître.",
            incorrectFeedback: "Non ! L'adaptation est relative — l'environnement peut changer." },
          { id: 'u23sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Les mutations génétiques sont toujours aléatoires au départ.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! La mutation est un hasard — la sélection est logique.",
            incorrectFeedback: "Si ! Les mutations sont aléatoires, c'est la sélection qui les filtre." },
          { id: 'u23d2', type: 'DRAG_DROP', instruction: "Ordonne ces espèces de la moins adaptée à la plus rapide au galop :",
            items: [{ id: 'u23d2a', text: '🐢 La tortue (Lente et blindée)' }, { id: 'u23d2b', text: '🐆 Le guépard (Rapide)' }, { id: 'u23d2c', text: '🦅 Le faucon pèlerin (Ultra-rapide en piqué)' }] },
          { id: 'u23q1', type: 'QUIZ', question: "Qu'est-ce qui aide une espèce à survivre dans le temps ?",
            options: [{ text: 'Rester identique à ses ancêtres', isCorrect: false }, { text: 'Vivre le plus longtemps possible', isCorrect: false }, { text: "S'adapter à son environnement changeant", isCorrect: true }],
            successFeedback: "Exact ! L'adaptation est la clé de la survie à long terme.",
            failureFeedback: "Pas tout à fait... C'est l'adaptation à l'environnement qui assure la survie." },
          { id: 'u23q2', type: 'QUIZ', question: "Quel célèbre scientifique a expliqué l'évolution par la sélection naturelle ?",
            options: [{ text: 'Albert Einstein', isCorrect: false }, { text: 'Marie Curie', isCorrect: false }, { text: 'Charles Darwin', isCorrect: true }],
            successFeedback: "Bingo ! Son voyage aux îles Galápagos a révolutionné notre compréhension du vivant.",
            failureFeedback: "Pas tout à fait... C'est Charles Darwin qui a formulé la théorie de la sélection naturelle." },
        ],
      }),
    ],
  },
  {
    id: 'chapter-3', slug: 'economie-biosphere', title: "L'Économie de la Biosphère",
    subtitle: 'Les grands cycles qui maintiennent le moteur de la planète.',
    level: 'B1', order: 3, durationMinutes: 75, difficulty: 'intermediaire',
    units: [
      makeUnit({
        id: 'unit-3-1', slug: 'les-coursiers-du-nectar', chapterId: 'chapter-3',
        title: 'Les Coursiers du Nectar', subtitle: 'Pollinisation et reproduction des fleurs.',
        concept: 'Fleurs, Insectes, Reproduction', order: 1, durationMinutes: 3,
        mascot: 'abeille-transparente', rewardAmount: 30,
        exercises: [
          { id: 'u31s1', type: 'STORY', screens: [
            { text: 'Pour se reproduire, les fleurs engagent des livreurs volants contre du nectar sucré.', imageUrl: storyImages.field, imagePrompt: 'Abeille sur fleur colorée' },
            { text: "En échange, les insectes transportent involontairement le pollen d'une fleur à l'autre.", imageUrl: storyImages.sprout, imagePrompt: 'Abeille couverte de pollen' },
          ]},
          { id: 'u31sw1', type: 'SWIPE', question: "Le papillon est-il un bon pollinisateur ?",
            card: { title: 'Le papillon', subtitle: 'De fleur en fleur' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Vrai ! En butinant, il transporte le pollen et aide les plantes à se reproduire.",
            incorrectFeedback: "Si ! Le papillon est bien un pollinisateur — il visite les fleurs." },
          { id: 'u31s2', type: 'STORY', screens: [
            { text: "Sans pollinisation, la plupart des fruits et légumes n'existeraient pas dans nos assiettes.", imageUrl: storyImages.field, imagePrompt: 'Étalage de fruits colorés' },
            { text: "Un tiers de notre alimentation dépend directement des insectes pollinisateurs.", imageUrl: storyImages.sprout, imagePrompt: 'Ruche et abeilles actives' },
          ]},
          { id: 'u31sw2', type: 'SWIPE', question: "Le loup est-il un bon pollinisateur des fleurs ?",
            card: { title: 'Le loup', subtitle: 'Prédateur des forêts' }, correctDirection: 'left',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Les loups chassent — ils ne butinent pas les pâquerettes !",
            incorrectFeedback: "Non ! Le loup est un prédateur, pas un pollinisateur." },
          { id: 'u31d1', type: 'DRAG_DROP', instruction: 'Remets les étapes de la pollinisation dans le bon ordre :',
            items: [{ id: 'u31d1a', text: "🦋 L'insecte boit le nectar" }, { id: 'u31d1b', text: '🟡 Le pollen colle à ses poils' }, { id: 'u31d1c', text: '🌸 Il féconde une autre fleur' }] },
          { id: 'u31s3', type: 'STORY', screens: [
            { text: "Les abeilles sont nos championnes de la pollinisation — et elles sont en danger critique à cause des pesticides.", imageUrl: storyImages.field, imagePrompt: 'Abeille solitaire au travail' },
          ]},
          { id: 'u31sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Sans pollinisateurs, nous perdrions un tiers de nos aliments.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Adieu les fraises, pommes, chocolat... sans pollinisateurs.",
            incorrectFeedback: "Si ! 1/3 de notre alimentation dépend des insectes pollinisateurs." },
          { id: 'u31sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Le vent peut aussi polliniser certaines plantes.', subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Les céréales et les conifères sont pollinisés par le vent.",
            incorrectFeedback: "Si ! Le vent pollinise les graminées, les céréales et les pins." },
          { id: 'u31sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Les abeilles sont menacées par les pesticides chimiques.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Malheureusement vrai ! Les néonicotinoïdes déciment les colonies d'abeilles.",
            incorrectFeedback: "Si ! Les pesticides sont l'une des causes majeures du déclin des abeilles." },
          { id: 'u31d2', type: 'DRAG_DROP', instruction: "Ordonne ces pollinisateurs du plus commun au plus inattendu :",
            items: [{ id: 'u31d2a', text: '🐝 L\'abeille (Pollinisateur n°1)' }, { id: 'u31d2b', text: '🦇 La chauve-souris (Pollinise la nuit)' }, { id: 'u31d2c', text: '🦎 Certains lézards (Rare mais réel)' }] },
          { id: 'u31q1', type: 'QUIZ', question: "Sans la pollinisation, que manquerait-il dans nos assiettes ?",
            options: [{ text: "L'eau minérale", isCorrect: false }, { text: 'Le sel marin', isCorrect: false }, { text: 'Les fruits et légumes', isCorrect: true }],
            successFeedback: "Exact ! Sans pollinisateurs, adieu les fraises, les pommes et le chocolat.",
            failureFeedback: "Raté ! Ce sont les fruits et légumes qui disparaîtraient sans pollinisateurs." },
          { id: 'u31q2', type: 'QUIZ', question: "Quel pollinisateur assure à lui seul la plus grande part de pollinisation mondiale ?",
            options: [{ text: 'Le papillon monarque', isCorrect: false }, { text: 'La mouche à viande', isCorrect: false }, { text: "L'abeille domestique", isCorrect: true }],
            successFeedback: "Exact ! L'abeille est notre pollinisatrice n°1 en termes d'impact agricole.",
            failureFeedback: "Pas tout à fait... C'est l'abeille domestique qui domine la pollinisation mondiale." },
        ],
      }),
      makeUnit({
        id: 'unit-3-2', slug: 'leternel-voyage-bleu', chapterId: 'chapter-3',
        title: "L'Éternel Voyage Bleu", subtitle: "Le voyage infini de l'eau sur notre planète.",
        concept: "Évaporation, Précipitations, Infiltration", order: 2, durationMinutes: 3,
        mascot: 'ondine', rewardAmount: 30,
        exercises: [
          { id: 'u32s1', type: 'STORY', screens: [
            { text: "L'eau de la Terre ne disparaît jamais — elle voyage en boucle permanente.", imageUrl: storyImages.water, imagePrompt: 'Cycle de l\'eau illustré' },
            { text: "Elle passe entre l'océan, le ciel et la terre dans un cycle éternel.", imageUrl: storyImages.reef, imagePrompt: 'Ondine surfant une vague' },
          ]},
          { id: 'u32sw1', type: 'SWIPE', question: "La chaleur du soleil est-elle à l'origine de l'évaporation des océans ?",
            card: { title: 'La chaleur du soleil', subtitle: "Moteur de l'évaporation" }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Parfait ! Le soleil chauffe l'eau qui se transforme en vapeur invisible.",
            incorrectFeedback: "Si ! C'est bien la chaleur solaire qui propulse le cycle de l'eau." },
          { id: 'u32s2', type: 'STORY', screens: [
            { text: "La vapeur monte, se refroidit, forme des nuages (condensation), puis retombe en pluie (précipitation).", imageUrl: storyImages.water, imagePrompt: 'Formation de nuages' },
            { text: "Une partie de cette eau s'infiltre dans le sol et alimente les nappes phréatiques.", imageUrl: storyImages.field, imagePrompt: 'Eau s\'infiltrant dans la terre' },
          ]},
          { id: 'u32sw2', type: 'SWIPE', question: "La gravité fait-elle tomber la pluie vers le sol ?",
            card: { title: 'La gravité terrestre', subtitle: 'Force qui attire les masses' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! La gravité ramène l'eau vers le sol sous forme de pluie.",
            incorrectFeedback: "Si ! C'est bien la gravité qui fait tomber la pluie." },
          { id: 'u32d1', type: 'DRAG_DROP', instruction: "Remets les étapes du cycle de l'eau dans le bon ordre :",
            items: [{ id: 'u32d1a', text: '💨 Évaporation (Océan → Vapeur)' }, { id: 'u32d1b', text: '☁️ Condensation (Vapeur → Nuages)' }, { id: 'u32d1c', text: '🌧️ Précipitations (Nuages → Pluie)' }] },
          { id: 'u32s3', type: 'STORY', screens: [
            { text: "Les nappes phréatiques sont des réservoirs souterrains secrets — notre eau potable pour demain.", imageUrl: storyImages.water, imagePrompt: 'Nappe phréatique souterraine' },
          ]},
          { id: 'u32sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "L'eau évaporée de l'océan tombe toujours exactement au même endroit.", subtitle: '⚡ Sprint 1' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Les vents transportent les nuages très loin — l'eau voyage !",
            incorrectFeedback: "Non ! Les vents déplacent les nuages — l'eau peut retomber à des milliers de km." },
          { id: 'u32sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Les arbres contribuent au cycle de l'eau par transpiration.", subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Les forêts libèrent des tonnes de vapeur d'eau chaque jour.",
            incorrectFeedback: "Si ! Les arbres transpirent et participent activement au cycle de l'eau." },
          { id: 'u32sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "La déforestation perturbe le cycle local de l'eau.", subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Hélas vrai ! Sans arbres, moins d'évaporation, moins de pluie.",
            incorrectFeedback: "Si ! Raser les forêts perturbe directement le cycle de l'eau." },
          { id: 'u32d2', type: 'DRAG_DROP', instruction: "Ordonne le parcours d'une goutte d'eau depuis l'océan :",
            items: [{ id: 'u32d2a', text: '🌊 Départ de l\'océan (Évaporation)' }, { id: 'u32d2b', text: '☁️ Voyage dans les nuages (Condensation)' }, { id: 'u32d2c', text: '🌱 Retour au sol (Infiltration)' }] },
          { id: 'u32q1', type: 'QUIZ', question: "Où va une grande partie de l'eau qui tombe sur terre sous forme de pluie ?",
            options: [{ text: "Dans l'espace intersidéral", isCorrect: false }, { text: 'Elle brûle au contact du sol', isCorrect: false }, { text: "Elle s'infiltre dans le sol", isCorrect: true }],
            successFeedback: "Génial ! Elle remplit les nappes phréatiques, nos réserves d'eau secrètes.",
            failureFeedback: "Raté... L'eau de pluie s'infiltre dans le sol et alimente les nappes phréatiques." },
          { id: 'u32q2', type: 'QUIZ', question: "Qu'est-ce qui déclenche le processus d'évaporation des océans ?",
            options: [{ text: 'La gravité lunaire', isCorrect: false }, { text: 'Le vent du nord', isCorrect: false }, { text: 'La chaleur du soleil', isCorrect: true }],
            successFeedback: "Exact ! Le soleil est le moteur du cycle de l'eau.",
            failureFeedback: "Pas tout à fait... C'est la chaleur du soleil qui évapore l'eau des océans." },
        ],
      }),
      makeUnit({
        id: 'unit-3-3', slug: 'le-coffre-fort-noir', chapterId: 'chapter-3',
        title: 'Le Coffre-Fort Noir', subtitle: 'Carbone, forêts et grands puits naturels.',
        concept: 'Absorption, Stockage, Émissions', order: 3, durationMinutes: 3,
        mascot: 'sylva', rewardAmount: 35,
        exercises: [
          { id: 'u33s1', type: 'STORY', screens: [
            { text: 'Le carbone est la brique fondamentale de tout être vivant.', imageUrl: storyImages.forest, imagePrompt: 'Atome de carbone en forêt' },
            { text: 'Les forêts le stockent dans leur bois comme un immense coffre-fort naturel.', imageUrl: storyImages.sprout, imagePrompt: 'Sylva fermant un coffre-fort vert' },
          ]},
          { id: 'u33sw1', type: 'SWIPE', question: "Un arbre qui grandit aide-t-il à stocker le CO2 de l'atmosphère ?",
            card: { title: 'Un arbre qui grandit', subtitle: 'Stocke le carbone dans son bois' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Super ! En poussant, le bois emprisonne le carbone pour des décennies.",
            incorrectFeedback: "Si ! Chaque kilo de bois contient du carbone absorbé de l'air." },
          { id: 'u33s2', type: 'STORY', screens: [
            { text: "Un feu de forêt libère en quelques heures le carbone stocké pendant des siècles.", imageUrl: storyImages.forest, imagePrompt: 'Incendie de forêt' },
            { text: "L'océan profond est notre second grand puits de carbone — ses algues absorbent des tonnes de CO2.", imageUrl: storyImages.reef, imagePrompt: 'Algues marines profondes' },
          ]},
          { id: 'u33sw2', type: 'SWIPE', question: "Un feu de forêt libère-t-il massivement du CO2 dans l'atmosphère ?",
            card: { title: 'Un feu de forêt', subtitle: 'Libération brutale du carbone' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Aïe ! Oui — brûler du bois libère d'un coup tout le carbone enfoui.",
            incorrectFeedback: "Si ! Le feu libère instantanément le carbone stocké sur des siècles." },
          { id: 'u33d1', type: 'DRAG_DROP', instruction: 'Ordonne le cycle naturel du carbone :',
            items: [{ id: 'u33d1a', text: '💨 CO2 dans l\'atmosphère' }, { id: 'u33d1b', text: "🌳 L'arbre l'absorbe (Photosynthèse)" }, { id: 'u33d1c', text: '🍂 La feuille tombe et nourrit le sol' }] },
          { id: 'u33s3', type: 'STORY', screens: [
            { text: "Le phytoplancton océanique absorbe autant de CO2 que toutes les forêts terrestres réunies.", imageUrl: storyImages.reef, imagePrompt: 'Phytoplancton microscopique' },
          ]},
          { id: 'u33sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "L'océan est un puits de carbone majeur pour notre planète.", subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! L'océan absorbe 25% des émissions humaines de CO2.",
            incorrectFeedback: "Si ! L'océan est un énorme puits de carbone — 25% de nos émissions." },
          { id: 'u33sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Les tourbières et mangroves stockent beaucoup de carbone.', subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Ces milieux humides stockent des centaines d'années de carbone.",
            incorrectFeedback: "Si ! Tourbières et mangroves sont parmi les meilleurs puits de carbone." },
          { id: 'u33sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Reboiser les forêts détruites aide à lutter contre le changement climatique.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Absolument ! Chaque arbre planté est un nouveau coffre-fort à carbone.",
            incorrectFeedback: "Si ! Le reboisement est une des solutions naturelles au changement climatique." },
          { id: 'u33d2', type: 'DRAG_DROP', instruction: "Ordonne ces milieux naturels du plus faible au plus puissant stockeur de carbone :",
            items: [{ id: 'u33d2a', text: '🏜️ Le désert (Peu de carbone)' }, { id: 'u33d2b', text: '🌳 La forêt tropicale (Riche en carbone)' }, { id: 'u33d2c', text: '🌿 La tourbière (Champion du carbone)' }] },
          { id: 'u33q1', type: 'QUIZ', question: "Quel autre milieu naturel est un immense puits de carbone après les forêts ?",
            options: [{ text: 'Le désert brûlant', isCorrect: false }, { text: 'La haute montagne', isCorrect: false }, { text: "L'océan profond", isCorrect: true }],
            successFeedback: "Bingo ! L'océan et ses algues microscopiques absorbent des tonnes de carbone.",
            failureFeedback: "Raté... C'est l'océan profond — il absorbe 25% de nos émissions de CO2." },
          { id: 'u33q2', type: 'QUIZ', question: "Que se passe-t-il au carbone stocké dans un arbre quand il est brûlé ?",
            options: [{ text: "Il reste enfermé dans les cendres", isCorrect: false }, { text: "Il s'évapore lentement en eau", isCorrect: false }, { text: "Il est libéré en CO2 dans l'atmosphère", isCorrect: true }],
            successFeedback: "Exact ! La combustion libère instantanément des siècles de carbone stocké.",
            failureFeedback: "Non... Brûler du bois libère le carbone en CO2 — c'est pourquoi les feux sont si dommageables." },
        ],
      }),
    ],
  },
  {
    id: 'chapter-4', slug: 'sanctuaires-sauvages', title: 'Les Sanctuaires Sauvages',
    subtitle: 'Écosystèmes uniques, isolés et fragiles.',
    level: 'B2', order: 4, durationMinutes: 90, difficulty: 'intermediaire',
    units: [
      makeUnit({
        id: 'unit-4-1', slug: 'lile-aux-lemuriens', chapterId: 'chapter-4',
        title: "L'Île aux Lémuriens", subtitle: 'Madagascar, laboratoire secret de la nature.',
        concept: 'Endémisme, Isolement, Biodiversité', order: 1, durationMinutes: 3,
        mascot: 'sylva', rewardAmount: 40,
        exercises: [
          { id: 'u41s1', type: 'STORY', screens: [
            { text: 'Une île isolée devient le laboratoire secret de la nature.', imageUrl: storyImages.water, imagePrompt: 'Madagascar vue du ciel' },
            { text: "À Madagascar, 90% des espèces animales et végétales ne vivent nulle part ailleurs sur Terre.", imageUrl: storyImages.forest, imagePrompt: 'Lémur dans un baobab' },
          ]},
          { id: 'u41sw1', type: 'SWIPE', question: "Vivre uniquement à Madagascar décrit-il une espèce endémique ?",
            card: { title: "Vivre uniquement à Madagascar", subtitle: 'Unique au monde entier' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Isolée de tout, l'espèce a évolué de façon unique et irremplaçable.",
            incorrectFeedback: "Si ! Une espèce endémique est exclusive à un territoire donné." },
          { id: 'u41s2', type: 'STORY', screens: [
            { text: "Les lémuriens ont drifté sur des radeaux de végétation depuis l'Afrique il y a 60 millions d'années.", imageUrl: storyImages.forest, imagePrompt: 'Lémuriens sur radeaux de bois' },
            { text: "Isolés sur l'île, ils ont évolué en 100+ espèces différentes — dont aucune ne vit ailleurs.", imageUrl: storyImages.water, imagePrompt: '100 espèces de lémuriens illustrées' },
          ]},
          { id: 'u41sw2', type: 'SWIPE', question: "L'isolement géographique favorise-t-il l'apparition d'espèces uniques ?",
            card: { title: "L'isolement géographique", subtitle: "Barrière naturelle à l'échange génétique" }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Séparées du reste du monde, les espèces évoluent de manière indépendante.",
            incorrectFeedback: "Si ! L'isolement est le moteur de la spéciation — la création d'espèces uniques." },
          { id: 'u41d1', type: 'DRAG_DROP', instruction: "Retrace l'arrivée des lémuriens sur l'île de Madagascar :",
            items: [{ id: 'u41d1a', text: "🌊 Dérive depuis l'Afrique sur des radeaux" }, { id: 'u41d1b', text: "🏝️ Arrivée sur l'île isolée" }, { id: 'u41d1c', text: '🐒 Évolution en 100+ espèces uniques' }] },
          { id: 'u41s3', type: 'STORY', screens: [
            { text: "Le baobab, emblème de Madagascar, stocke jusqu'à 100 000 litres d'eau dans son tronc en bouteille.", imageUrl: storyImages.forest, imagePrompt: 'Allée des baobabs au coucher du soleil' },
          ]},
          { id: 'u41sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Madagascar concentre plus de 90% d'espèces endémiques.", subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! C'est l'une des plus grandes concentrations de biodiversité unique au monde.",
            incorrectFeedback: "Si ! 90% des espèces de Madagascar ne vivent nulle part ailleurs." },
          { id: 'u41sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Les lémuriens sont des espèces endémiques de Madagascar.", subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Les lémuriens n'existent à l'état sauvage qu'à Madagascar.",
            incorrectFeedback: "Si ! Les lémuriens sont 100% endémiques à Madagascar." },
          { id: 'u41sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Le baobab stocke de l'eau dans ses branches.", subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! C'est dans son énorme TRONC que le baobab stocke jusqu'à 100 000 L d'eau.",
            incorrectFeedback: "Non ! C'est bien dans son tronc, pas ses branches." },
          { id: 'u41d2', type: 'DRAG_DROP', instruction: "Ordonne ces niveaux de menace pour une espèce endémique d'île :",
            items: [{ id: 'u41d2a', text: '⚠️ Introduction d\'espèces invasives' }, { id: 'u41d2b', text: '🔥 Destruction de son habitat unique' }, { id: 'u41d2c', text: '💀 Extinction (Sans retour possible)' }] },
          { id: 'u41q1', type: 'QUIZ', question: "Quel arbre géant au tronc en forme de bouteille est l'emblème de Madagascar ?",
            options: [{ text: 'Le chêne centenaire', isCorrect: false }, { text: 'Le pin parasol', isCorrect: false }, { text: 'Le baobab', isCorrect: true }],
            successFeedback: "Bravo ! Son tronc en bouteille stocke l'eau pour survivre aux longues sécheresses.",
            failureFeedback: "Raté... C'est le baobab — son tronc massif stocke des milliers de litres d'eau." },
          { id: 'u41q2', type: 'QUIZ', question: "Comment appelle-t-on une espèce qui ne vit que dans une région précise du monde ?",
            options: [{ text: 'Une espèce invasive', isCorrect: false }, { text: 'Une espèce migratrice', isCorrect: false }, { text: 'Une espèce endémique', isCorrect: true }],
            successFeedback: "Exact ! Endémique = exclusif à un territoire. Si ce territoire disparaît, l'espèce aussi.",
            failureFeedback: "Pas tout à fait... Une espèce endémique est exclusive à un territoire précis." },
        ],
      }),
      makeUnit({
        id: 'unit-4-2', slug: 'les-metropoles-englouties', chapterId: 'chapter-4',
        title: 'Les Métropoles Englouties', subtitle: 'Récifs, polypes et blanchissement.',
        concept: 'Récifs, Polypes, Blanchissement', order: 2, durationMinutes: 3,
        mascot: 'ondine', rewardAmount: 40,
        exercises: [
          { id: 'u42s1', type: 'STORY', screens: [
            { text: "Les récifs coralliens sont les villes géantes de l'océan — bâties par de minuscules animaux.", imageUrl: storyImages.reef, imagePrompt: 'Récif corallien coloré et animé' },
            { text: "Ils couvrent 0,1% de l'océan mais abritent 25% de toutes les espèces marines.", imageUrl: storyImages.water, imagePrompt: 'Biodiversité marine autour d\'un récif' },
          ]},
          { id: 'u42sw1', type: 'SWIPE', question: "Un corail est-il un animal invertébré ?",
            card: { title: 'Le corail', subtitle: 'Constructeur des récifs' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Bingo ! Ces petits bâtisseurs animaux créent des structures gigantesques.",
            incorrectFeedback: "Si ! Le corail est bien un animal — les polypes sont des animaux invertébrés." },
          { id: 'u42s2', type: 'STORY', screens: [
            { text: "Le blanchissement corallien survient quand l'eau est trop chaude : le polype expulse son algue symbiotique.", imageUrl: storyImages.reef, imagePrompt: 'Corail blanchi contrastant avec corail vivant' },
            { text: "Sans cette algue, le corail blanchit et meurt lentement — et tout l'écosystème s'effondre.", imageUrl: storyImages.water, imagePrompt: 'Récif mort blanc et désertique' },
          ]},
          { id: 'u42sw2', type: 'SWIPE', question: "Le réchauffement de l'eau est-il un danger mortel pour les récifs coralliens ?",
            card: { title: "Le réchauffement de l'eau", subtitle: 'Stress thermique fatal' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Vrai ! L'eau trop chaude stresse le corail et provoque son blanchissement.",
            incorrectFeedback: "Si ! Le réchauffement est l'ennemi n°1 des récifs coralliens." },
          { id: 'u42d1', type: 'DRAG_DROP', instruction: 'Ordonne les étapes du blanchissement corallien :',
            items: [{ id: 'u42d1a', text: "🌡️ L'eau devient trop chaude" }, { id: 'u42d1b', text: "😰 Le polype expulse son algue" }, { id: 'u42d1c', text: "💀 Le corail blanchit et s'affaiblit" }] },
          { id: 'u42s3', type: 'STORY', screens: [
            { text: "50% des récifs coralliens ont déjà disparu. La Grande Barrière de corail a perdu 50% de ses coraux depuis 1980.", imageUrl: storyImages.reef, imagePrompt: 'Carte mondiale des récifs disparus' },
          ]},
          { id: 'u42sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Les récifs coralliens abritent 25% de toutes les espèces marines.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Ces 0,1% de l'océan sont d'une richesse extraordinaire.",
            incorrectFeedback: "Si ! Les récifs sont l'une des zones les plus denses en biodiversité." },
          { id: 'u42sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Les poissons-clowns protègent l'anémone de mer en échange de refuge.", subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Le poisson-clown éloigne les prédateurs de l'anémone.",
            incorrectFeedback: "Si ! Nemo et son anémone illustrent le mutualisme du récif." },
          { id: 'u42sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'La Grande Barrière de corail est visible depuis l\'espace.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! C'est la plus grande structure vivante visible depuis l'espace !",
            incorrectFeedback: "Si ! La Grande Barrière de corail mesure 2 300 km de long." },
          { id: 'u42d2', type: 'DRAG_DROP', instruction: "Ordonne ces menaces pour les récifs de la plus ancienne à la plus nouvelle :",
            items: [{ id: 'u42d2a', text: '🎣 Surpêche (Depuis le XXe siècle)' }, { id: 'u42d2b', text: '🌡️ Réchauffement climatique (Depuis 1980)' }, { id: 'u42d2c', text: '🌊 Acidification des océans (Accélère depuis 2000)' }] },
          { id: 'u42q1', type: 'QUIZ', question: "Quelle est la véritable nature biologique d'un corail ?",
            options: [{ text: 'Un rocher marin', isCorrect: false }, { text: 'Une plante aquatique', isCorrect: false }, { text: 'Un animal invertébré', isCorrect: true }],
            successFeedback: "Bingo ! Ces petits bâtisseurs animaux créent des structures gigantesques.",
            failureFeedback: "Raté... Le corail est un animal invertébré — les polypes construisent les récifs." },
          { id: 'u42q2', type: 'QUIZ', question: "Que se passe-t-il quand l'eau de mer devient trop chaude pour les coraux ?",
            options: [{ text: 'Le corail pousse plus vite', isCorrect: false }, { text: 'Le corail change de couleur en rouge', isCorrect: false }, { text: "Le corail blanchit et peut mourir", isCorrect: true }],
            successFeedback: "Exact ! Le stress thermique provoque le blanchissement — et souvent la mort du corail.",
            failureFeedback: "Pas tout à fait... Une eau trop chaude provoque le blanchissement et la mort du corail." },
        ],
      }),
      makeUnit({
        id: 'unit-4-3', slug: 'le-bal-des-saisons', chapterId: 'chapter-4',
        title: 'Le Bal des Saisons', subtitle: 'Forêts tempérées et adaptation au rythme annuel.',
        concept: 'Saisons, Humus, Hibernation', order: 3, durationMinutes: 3,
        mascot: 'abeille-transparente', rewardAmount: 45,
        exercises: [
          { id: 'u43s1', type: 'STORY', screens: [
            { text: 'Les forêts tempérées changent de visage quatre fois par an selon les saisons.', imageUrl: storyImages.forest, imagePrompt: 'Même arbre aux 4 saisons' },
            { text: "Printemps, été, automne, hiver — chaque saison déclenche des adaptations vitales chez les êtres vivants.", imageUrl: storyImages.field, imagePrompt: 'Calendrier naturel des saisons' },
          ]},
          { id: 'u43sw1', type: 'SWIPE', question: "Les arbres feuillus perdent-ils leurs feuilles en hiver pour économiser l'eau ?",
            card: { title: 'Perdre ses feuilles en hiver', subtitle: "Économiser l'eau et l'énergie" }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! C'est vital pour survivre au froid sans gaspiller d'énergie.",
            incorrectFeedback: "Si ! La chute des feuilles est une stratégie de survie hivernale." },
          { id: 'u43s2', type: 'STORY', screens: [
            { text: "L'automne transforme les forêts en or : les arbres récupèrent les nutriments des feuilles avant de les lâcher.", imageUrl: storyImages.forest, imagePrompt: 'Forêt en automne aux couleurs chaudes' },
            { text: "Ces feuilles mortes sont dévorées par insectes et champignons, créant l'humus fertile.", imageUrl: storyImages.field, imagePrompt: 'Sol forestier recouvert de feuilles' },
          ]},
          { id: 'u43sw2', type: 'SWIPE', question: "L'humus se forme-t-il à partir de la décomposition des matières organiques ?",
            card: { title: "L'humus", subtitle: 'Or noir du sol forestier' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Feuilles, branches, animaux morts... tout finit en humus nourricier.",
            incorrectFeedback: "Si ! L'humus est le résultat de la décomposition de la matière organique." },
          { id: 'u43d1', type: 'DRAG_DROP', instruction: 'Ordonne le cycle du sol de la forêt en automne :',
            items: [{ id: 'u43d1a', text: '🍂 Les feuilles mortes tombent' }, { id: 'u43d1b', text: '🍄 Champignons et insectes les décomposent' }, { id: 'u43d1c', text: '🌱 Création d\'humus fertile' }] },
          { id: 'u43s3', type: 'STORY', screens: [
            { text: "L'hibernation est un sommeil profond adaptatif : rythme cardiaque ralenti, température corporelle basse, zéro alimentation.", imageUrl: storyImages.forest, imagePrompt: 'Hérisson endormi dans les feuilles' },
          ]},
          { id: 'u43sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Les sapins conservent leurs aiguilles en hiver.", subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Les conifères gardent leurs aiguilles — une stratégie différente des feuillus.",
            incorrectFeedback: "Si ! Les sapins/pins gardent leurs aiguilles — c'est pour ça qu'ils sont verts en hiver." },
          { id: 'u43sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "L'ours brun hiberne complètement en hiver sans se réveiller.", subtitle: '⚡ Sprint 2' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! L'ours se réveille parfois — c'est une semi-hibernation.",
            incorrectFeedback: "En fait non ! L'ours est en semi-hibernation et peut se réveiller." },
          { id: 'u43sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "L'humus rend le sol plus fertile et retient mieux l'eau.", subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Un sol riche en humus est 10x plus fertile et retient l'eau.",
            incorrectFeedback: "Si ! L'humus améliore la fertilité et la rétention d'eau du sol." },
          { id: 'u43d2', type: 'DRAG_DROP', instruction: "Ordonne les saisons dans l'ordre d'un calendrier naturel forestier :",
            items: [{ id: 'u43d2a', text: '🌸 Printemps (Réveil et floraison)' }, { id: 'u43d2b', text: '🍂 Automne (Stockage et préparation)' }, { id: 'u43d2c', text: '❄️ Hiver (Repos et hibernation)' }] },
          { id: 'u43q1', type: 'QUIZ', question: "Comment appelle-t-on le sommeil profond des animaux pendant l'hiver ?",
            options: [{ text: 'La migration', isCorrect: false }, { text: 'La métamorphose', isCorrect: false }, { text: "L'hibernation", isCorrect: true }],
            successFeedback: "Parfait ! En hibernation, ils consomment très peu d'énergie jusqu'au printemps.",
            failureFeedback: "Raté... C'est l'hibernation — un sommeil profond et économique." },
          { id: 'u43q2', type: 'QUIZ', question: "Qu'est-ce que l'humus et comment se forme-t-il ?",
            options: [{ text: "Un champignon parasite du sol", isCorrect: false }, { text: "Une roche calcaire compressée", isCorrect: false }, { text: "Un sol fertile issu de la décomposition de matières organiques", isCorrect: true }],
            successFeedback: "Exact ! L'humus est l'or noir de la forêt — il nourrit tout ce qui y pousse.",
            failureFeedback: "Non... L'humus est le résultat de la décomposition de feuilles, branches et animaux." },
        ],
      }),
    ],
  },
  {
    id: 'chapter-5', slug: 'eveil-gardiens', title: "L'Éveil des Gardiens",
    subtitle: 'Comprendre les crises actuelles pour agir concrètement.',
    level: 'C1/C2', order: 5, durationMinutes: 120, difficulty: 'avance',
    units: [
      makeUnit({
        id: 'unit-5-1', slug: 'le-crepuscule-des-geants', chapterId: 'chapter-5',
        title: 'Le Crépuscule des Géants', subtitle: 'Déclin, menaces et sixième extinction.',
        concept: 'Déclin, Menaces, Anthropocène', order: 1, durationMinutes: 3,
        mascot: 'ondine', rewardAmount: 50,
        exercises: [
          { id: 'u51s1', type: 'STORY', screens: [
            { text: "De nombreuses espèces disparaissent à une vitesse mille fois supérieure au taux naturel d'extinction.", imageUrl: storyImages.forest, imagePrompt: 'Silhouettes d\'animaux menacés s\'effaçant' },
            { text: "C'est la sixième extinction de masse — la première causée par une seule espèce : l'humain.", imageUrl: storyImages.water, imagePrompt: 'Sablier avec sable qui s\'écoule' },
          ]},
          { id: 'u51sw1', type: 'SWIPE', question: "La destruction des habitats est-elle la principale cause de la perte de biodiversité actuelle ?",
            card: { title: "La destruction des habitats", subtitle: 'Raser les forêts, assécher les zones humides' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Vrai ! Raser les forêts détruit la maison de millions d'espèces.",
            incorrectFeedback: "Si ! La perte d'habitat est la cause n°1 d'extinction d'espèces." },
          { id: 'u51s2', type: 'STORY', screens: [
            { text: "L'Anthropocène : l'époque géologique actuelle, où l'humain est la force principale qui transforme la Terre.", imageUrl: storyImages.field, imagePrompt: 'Contraste nature vs industrie' },
            { text: "Pour la première fois dans l'histoire, une espèce vivante modifie le climat et l'atmosphère de toute une planète.", imageUrl: storyImages.water, imagePrompt: 'Globe terrestre avec impact humain' },
          ]},
          { id: 'u51sw2', type: 'SWIPE', question: "L'humain est-il responsable de la sixième extinction de masse en cours ?",
            card: { title: "L'impact humain", subtitle: "Déforestation, pollution, changement climatique" }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Hélas oui ! Nos activités sont la cause directe de cette extinction.",
            incorrectFeedback: "Si ! La science est formelle : c'est bien l'humain qui cause cette extinction." },
          { id: 'u51d1', type: 'DRAG_DROP', instruction: "Ordonne la ligne de temps du déclin d'une espèce menacée :",
            items: [{ id: 'u51d1a', text: "🏗️ Perte progressive de son habitat" }, { id: 'u51d1b', text: "📉 Population en chute libre" }, { id: 'u51d1c', text: "💀 Extinction totale et irréversible" }] },
          { id: 'u51s3', type: 'STORY', screens: [
            { text: "68% des populations de vertébrés sauvages ont été perdues entre 1970 et 2016. En 46 ans.", imageUrl: storyImages.field, imagePrompt: 'Graphique de déclin de la faune' },
          ]},
          { id: 'u51sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Le taux d'extinction actuel est mille fois supérieur au taux naturel.", subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Là où la nature perdait 1 espèce, on en perd maintenant 1 000.",
            incorrectFeedback: "Si ! Le taux d'extinction actuel est 1 000x supérieur au taux naturel." },
          { id: 'u51sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "La disparition d'une espèce peut déclencher un effet domino dans son écosystème.", subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Chaque extinction fragilise les espèces qui en dépendaient.",
            incorrectFeedback: "Si ! Les espèces sont interdépendantes — la perte de l'une affecte les autres." },
          { id: 'u51sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "L'extinction est réversible si on agit à temps.", subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! L'extinction est DÉFINITIVE et IRRÉVERSIBLE. Il faut agir avant.",
            incorrectFeedback: "Non ! L'extinction est définitive — impossible de ressusciter une espèce disparue." },
          { id: 'u51d2', type: 'DRAG_DROP', instruction: "Ordonne ces causes d'extinction par leur impact global actuel :",
            items: [{ id: 'u51d2a', text: '🏗️ Perte d\'habitat (Cause n°1)' }, { id: 'u51d2b', text: '🌡️ Changement climatique (Cause n°2)' }, { id: 'u51d2c', text: '🐟 Surexploitation (Cause n°3)' }] },
          { id: 'u51q1', type: 'QUIZ', question: "Quel nom scientifique donne-t-on à notre époque marquée par l'impact humain sur la Terre ?",
            options: [{ text: 'Le Jurassique', isCorrect: false }, { text: "L'Âge de Glace", isCorrect: false }, { text: "L'Anthropocène", isCorrect: true }],
            successFeedback: "Bingo ! L'Anthropocène : l'époque où l'humain transforme toute la biosphère.",
            failureFeedback: "Raté... C'est l'Anthropocène — l'époque géologique de l'impact humain." },
          { id: 'u51q2', type: 'QUIZ', question: "Combien d'extinctions de masse la Terre a-t-elle connues avant celle en cours ?",
            options: [{ text: '2 extinctions de masse', isCorrect: false }, { text: '10 extinctions de masse', isCorrect: false }, { text: '5 extinctions de masse', isCorrect: true }],
            successFeedback: "Exact ! La sixième est la première causée par une seule espèce vivante.",
            failureFeedback: "Raté... Il y a eu 5 extinctions de masse avant — la 6e est en cours, causée par l'humain." },
        ],
      }),
      makeUnit({
        id: 'unit-5-2', slug: 'larsenal-de-lespoir', chapterId: 'chapter-5',
        title: "L'Arsenal de l'Espoir", subtitle: 'Conservation, restauration et solutions.',
        concept: 'Conservation, Restauration, Innovation', order: 2, durationMinutes: 3,
        mascot: 'abeille-transparente', rewardAmount: 50,
        exercises: [
          { id: 'u52s1', type: 'STORY', screens: [
            { text: "Il n'est pas trop tard. La nature est résiliente — si on lui donne l'espace pour se rétablir.", imageUrl: storyImages.sprout, imagePrompt: 'Mains humaines plantant un arbre' },
            { text: "Conservation et restauration des écosystèmes sont nos boucliers les plus efficaces.", imageUrl: storyImages.forest, imagePrompt: 'Forêt en cours de restauration' },
          ]},
          { id: 'u52sw1', type: 'SWIPE', question: "Créer des réserves naturelles est-il une solution efficace pour protéger la biodiversité ?",
            card: { title: 'Créer des réserves naturelles', subtitle: 'Des sanctuaires pour la faune et la flore' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Génial ! Ces zones offrent un refuge sûr aux espèces menacées.",
            incorrectFeedback: "Si ! Les réserves naturelles sont parmi les outils les plus efficaces." },
          { id: 'u52s2', type: 'STORY', screens: [
            { text: "Les corridors écologiques sont des passages verts qui relient des habitats isolés entre eux.", imageUrl: storyImages.forest, imagePrompt: 'Pont végétal au-dessus d\'une autoroute' },
            { text: "Sans eux, les animaux sont piégés dans des îlots et ne peuvent plus se reproduire ni migrer.", imageUrl: storyImages.field, imagePrompt: 'Connexion entre deux forêts isolées' },
          ]},
          { id: 'u52sw2', type: 'SWIPE', question: "Bétonner les rivières aide-t-il les écosystèmes aquatiques ?",
            card: { title: 'Bétonner les rivières', subtitle: 'Chenalisation des cours d\'eau' }, correctDirection: 'left',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Les rivières naturelles sont des autoroutes de vie — le béton les tue.",
            incorrectFeedback: "Non ! Bétonner les rivières détruit les habitats aquatiques." },
          { id: 'u52d1', type: 'DRAG_DROP', instruction: 'Ordonne les étapes pour restaurer une forêt détruite :',
            items: [{ id: 'u52d1a', text: '🛡️ Protéger le sol nu de l\'érosion' }, { id: 'u52d1b', text: '🌱 Replanter des espèces locales natives' }, { id: 'u52d1c', text: '🐦 Laisser la faune revenir naturellement' }] },
          { id: 'u52s3', type: 'STORY', screens: [
            { text: "Le rewilding : réintroduire des espèces disparues pour laisser la nature se réorganiser seule. Le loup à Yellowstone a recréé des rivières.", imageUrl: storyImages.forest, imagePrompt: 'Loup dans le parc de Yellowstone' },
          ]},
          { id: 'u52sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Les corridors écologiques aident les animaux à se déplacer entre les habitats.', subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! Ils permettent aux espèces de voyager et de se reproduire en sécurité.",
            incorrectFeedback: "Si ! Les corridors sont des ponts verts vitaux pour la faune." },
          { id: 'u52sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'La réintroduction du loup à Yellowstone a modifié le cours des rivières.', subtitle: '⚡ Sprint 2' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Incroyable mais vrai ! L'effet domino du prédateur a transformé tout l'écosystème.",
            incorrectFeedback: "Si ! Le loup a changé le comportement des cerfs, permettant aux rivières de se revégétaliser." },
          { id: 'u52sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: 'Protéger 30% des terres et mers mondiales suffirait à stopper la perte de biodiversité.', subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "C'est l'objectif 30x30 des Nations Unies — ambitieux mais scientifiquement validé !",
            incorrectFeedback: "Si ! L'objectif 30x30 est la cible internationale pour stopper la perte de biodiversité." },
          { id: 'u52d2', type: 'DRAG_DROP', instruction: "Ordonne ces approches de conservation par leur niveau d'intervention :",
            items: [{ id: 'u52d2a', text: '🏞️ Protection (Réserves naturelles)' }, { id: 'u52d2b', text: '🌳 Restauration (Replantation)' }, { id: 'u52d2c', text: '🐺 Rewilding (Réintroduction d\'espèces)' }] },
          { id: 'u52q1', type: 'QUIZ', question: "Comment appelle-t-on les passages verts qui relient les habitats naturels fragmentés ?",
            options: [{ text: 'Les autoroutes express', isCorrect: false }, { text: 'Les frontières invisibles', isCorrect: false }, { text: 'Les corridors écologiques', isCorrect: true }],
            successFeedback: "Super ! Ils permettent aux animaux de voyager et de se reproduire en sécurité.",
            failureFeedback: "Raté... Ce sont les corridors écologiques — des ponts verts entre habitats." },
          { id: 'u52q2', type: 'QUIZ', question: "Quelle approche consiste à réintroduire des espèces disparues pour laisser la nature se réorganiser ?",
            options: [{ text: "La sylviculture intensive", isCorrect: false }, { text: "L'élevage intensif", isCorrect: false }, { text: "Le rewilding", isCorrect: true }],
            successFeedback: "Exact ! Le rewilding donne à la nature les clés pour se réparer elle-même.",
            failureFeedback: "Pas tout à fait... C'est le rewilding — réintroduire des espèces pour relancer la nature." },
        ],
      }),
      makeUnit({
        id: 'unit-5-3', slug: 'cultiver-lavenir', chapterId: 'chapter-5',
        title: "Cultiver l'Avenir", subtitle: 'Agroécologie, diversité et résilience.',
        concept: 'Permaculture, Synergie, Résilience', order: 3, durationMinutes: 3,
        mascot: 'sylva', rewardAmount: 100,
        exercises: [
          { id: 'u53s1', type: 'STORY', screens: [
            { text: "L'agriculture de demain imite la sagesse de la forêt — diversité, synergie, résilience.", imageUrl: storyImages.field, imagePrompt: 'Jardin en permaculture foisonnant' },
            { text: "C'est l'agroécologie : cultiver avec la nature comme alliée plutôt qu'ennemi à combattre.", imageUrl: storyImages.sprout, imagePrompt: 'Légumes et fleurs cultivés ensemble' },
          ]},
          { id: 'u53sw1', type: 'SWIPE', question: "Mélanger plusieurs espèces végétales est-il un bon principe pour cultiver durablement ?",
            card: { title: "Mélanger plusieurs espèces", subtitle: 'La diversité protège' }, correctDirection: 'right',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Génial ! Les plantes s'entraident et nourrissent le sol ensemble.",
            incorrectFeedback: "Si ! La polyculture est bien plus résiliente que la monoculture." },
          { id: 'u53s2', type: 'STORY', screens: [
            { text: "La monoculture (un seul type de plante à perte de vue) est vulnérable aux maladies et épuise les sols.", imageUrl: storyImages.field, imagePrompt: 'Champ de blé en monoculture' },
            { text: "La permaculture associe intelligemment plantes, animaux et humains pour un système durable et productif.", imageUrl: storyImages.sprout, imagePrompt: 'Ferme en permaculture diversifiée' },
          ]},
          { id: 'u53sw2', type: 'SWIPE', question: "Les pesticides chimiques aident-ils à préserver la biodiversité des sols ?",
            card: { title: 'Les pesticides chimiques', subtitle: 'Poison pour les sols et les insectes' }, correctDirection: 'left',
            leftLabel: 'NON', rightLabel: 'OUI',
            correctFeedback: "Exact ! Ces produits empoisonnent la terre, l'eau et les insectes utiles.",
            incorrectFeedback: "Non ! Les pesticides détruisent la faune du sol et contaminent l'eau." },
          { id: 'u53d1', type: 'DRAG_DROP', instruction: "Ordonne les étapes de création d'un jardin en permaculture :",
            items: [{ id: 'u53d1a', text: "🔍 Observer le terrain et l'environnement naturel" }, { id: 'u53d1b', text: "🌱 Planter des espèces variées et complémentaires" }, { id: 'u53d1c', text: "🌾 Récolter en enrichissant le sol pour demain" }] },
          { id: 'u53s3', type: 'STORY', screens: [
            { text: "Le ver de terre est le meilleur ami de la terre fertile : il l'aère, la fertilise et la structure.", imageUrl: storyImages.field, imagePrompt: 'Ver de terre dans un sol riche et sombre' },
          ]},
          { id: 'u53sw3', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Un sol vivant contient plus d'organismes qu'il y a d'humains sur Terre.", subtitle: '⚡ Sprint 1' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Incroyable mais vrai ! 1 cuillère de sol sain = des milliards d'organismes.",
            incorrectFeedback: "Si ! 1 cuillère de sol sain contient plus de micro-organismes que d'humains sur Terre." },
          { id: 'u53sw4', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "La monoculture intensive est plus résiliente que la polyculture diversifiée.", subtitle: '⚡ Sprint 2' }, correctDirection: 'left',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Exact ! La monoculture est fragile : une maladie peut tout dévaster.",
            incorrectFeedback: "Non ! C'est l'inverse — la diversité crée la résilience." },
          { id: 'u53sw5', type: 'SWIPE', question: 'VRAI ou FAUX ?',
            card: { title: "Le ver de terre améliore la structure et la fertilité du sol.", subtitle: '🔥 Sprint 3 — Combo !' }, correctDirection: 'right',
            leftLabel: 'FAUX', rightLabel: 'VRAI',
            correctFeedback: "Bravo ! Ce laboureur infatigable aère le sol et crée un engrais naturel.",
            incorrectFeedback: "Si ! Le ver de terre est un des êtres vivants les plus utiles pour l'agriculture." },
          { id: 'u53d2', type: 'DRAG_DROP', instruction: "Ordonne ces pratiques agricoles de la plus destructrice à la plus durable :",
            items: [{ id: 'u53d2a', text: "⚠️ Agriculture intensive aux pesticides" }, { id: 'u53d2b', text: "🌿 Agriculture biologique (sans pesticides)" }, { id: 'u53d2c', text: "♻️ Permaculture régénératrice (enrichit le sol)" }] },
          { id: 'u53q1', type: 'QUIZ', question: "Quel petit animal souterrain est le meilleur ami de la terre fertile ?",
            options: [{ text: 'La taupe géante', isCorrect: false }, { text: 'La cigale bruyante', isCorrect: false }, { text: 'Le ver de terre', isCorrect: true }],
            successFeedback: "Bravo ! Ce laboureur infatigable aère le sol et crée un engrais naturel.",
            failureFeedback: "Raté... C'est le ver de terre — le champion invisible de la fertilité des sols." },
          { id: 'u53q2', type: 'QUIZ', question: "Qu'est-ce que la permaculture ?",
            options: [{ text: "Une technique de culture intensive en serre chauffée", isCorrect: false }, { text: "Un système qui imite la forêt pour cultiver durablement", isCorrect: true }, { text: "Une méthode d'élevage industriel intensif", isCorrect: false }],
            successFeedback: "Exact ! La permaculture s'inspire de la nature pour créer des systèmes agricoles durables.",
            failureFeedback: "Pas tout à fait... La permaculture imite la forêt pour cultiver durablement et régénérer les sols." },
        ],
      }),
    ],
  },
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
      lives: {
        remaining: 5,
        updatedAt: timestamp,
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
      lives: {
        remaining: 5,
        updatedAt: timestamp,
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
