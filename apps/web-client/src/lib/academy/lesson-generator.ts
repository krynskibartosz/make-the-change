import type {
  AcademyDifficulty,
  AcademyExercise,
  AcademyLessonDefinition,
  AcademyLessonKind,
  AcademyUnitDefinition,
  LessonRules,
} from './schema'

/**
 * Génération de la liste d'exercices pour une leçon donnée.
 *
 * Stratégies :
 *  - 'authored-discovery'  → renvoie unit.authoredDiscovery tel quel
 *  - 'authored-legendary'  → renvoie unit.authoredLegendary tel quel
 *  - 'pool-practice'       → pioche dans unit.pool (medium) + entrelacement
 *                            depuis previousUnits + injection des concepts
 *                            ratés (mistakeQueue)
 *  - 'pool-mastery'        → pioche dans unit.pool (hard) + ratio
 *                            misconception/metacognition élevé
 *
 * Voir doc/writing-spec.md §1, §2, §3.
 */

export type GenerateLessonInput = {
  unit: AcademyUnitDefinition
  lesson: AcademyLessonDefinition
  previousUnits: AcademyUnitDefinition[]
  /** Concept IDs ratés récemment par le joueur (priorisés). */
  weakConceptIds?: string[]
  /**
   * Seed déterministe (par ex. lessonId + tentative). Permet d'avoir un
   * ordre stable au sein d'une session sans tomber dans la répétition
   * exacte d'une session à l'autre.
   */
  seed?: string
}

// ─── Hash & RNG déterministes ────────────────────────────────────────────────

function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const arr = items.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

// ─── Filtres & scoring ───────────────────────────────────────────────────────

function byDifficulty(exercises: AcademyExercise[], target: AcademyDifficulty): AcademyExercise[] {
  return exercises.filter((exercise) => exercise.difficulty === target)
}

function isMisconception(exercise: AcademyExercise): boolean {
  return exercise.cognitiveTags.includes('misconception')
}

function isMetacognition(exercise: AcademyExercise): boolean {
  return exercise.cognitiveTags.includes('metacognition')
}

function isInterleaved(exercise: AcademyExercise): boolean {
  return exercise.cognitiveTags.includes('interleaved')
}

function tagRetryVariant(exercise: AcademyExercise, suffix: string): AcademyExercise {
  return {
    ...exercise,
    id: `${exercise.id}-${suffix}`,
    variantOf: exercise.variantOf ?? exercise.id,
  }
}

// ─── Sélection avec budget ───────────────────────────────────────────────────

type Bucket = {
  label: string
  pool: AcademyExercise[]
  ratio?: number
}

function pickFromBuckets(
  buckets: Bucket[],
  totalCount: number,
  rng: () => number,
): AcademyExercise[] {
  const selected: AcademyExercise[] = []
  const usedIds = new Set<string>()

  // 1. respect des ratios (planchers)
  for (const bucket of buckets) {
    if (!bucket.ratio || bucket.pool.length === 0) continue
    const target = Math.floor(totalCount * bucket.ratio)
    const shuffled = shuffle(bucket.pool, rng)
    for (const exercise of shuffled) {
      if (selected.length >= totalCount) break
      if (usedIds.has(exercise.id)) continue
      const taken = selected.filter((existing) => bucket.pool.includes(existing)).length
      if (taken >= target) break
      selected.push(exercise)
      usedIds.add(exercise.id)
    }
  }

  // 2. complément avec le pool agrégé
  const allShuffled = shuffle(
    buckets.flatMap((bucket) => bucket.pool),
    rng,
  )
  for (const exercise of allShuffled) {
    if (selected.length >= totalCount) break
    if (usedIds.has(exercise.id)) continue
    selected.push(exercise)
    usedIds.add(exercise.id)
  }

  return selected.slice(0, totalCount)
}

// ─── Anti-répétition consécutive sur le même concept ─────────────────────────

function spreadByConcept(exercises: AcademyExercise[]): AcademyExercise[] {
  if (exercises.length <= 2) return exercises
  const result: AcademyExercise[] = []
  const remaining = exercises.slice()
  let lastConceptId: string | null = null
  while (remaining.length > 0) {
    const idx = remaining.findIndex((exercise) => exercise.conceptId !== lastConceptId)
    const pickIndex = idx >= 0 ? idx : 0
    const picked = remaining.splice(pickIndex, 1)[0]!
    result.push(picked)
    lastConceptId = picked.conceptId
  }
  return result
}

// ─── Generator principal ─────────────────────────────────────────────────────

export function generateLessonExercises(input: GenerateLessonInput): AcademyExercise[] {
  const { unit, lesson, previousUnits, weakConceptIds = [], seed } = input
  const rng = mulberry32(hashString(seed ?? `${unit.id}:${lesson.id}`))

  if (lesson.generation === 'authored-discovery') {
    return unit.authoredDiscovery
  }

  if (lesson.generation === 'authored-legendary') {
    return unit.authoredLegendary
  }

  return generateFromPool(unit, lesson.rules, lesson.generation, previousUnits, weakConceptIds, rng)
}

function generateFromPool(
  unit: AcademyUnitDefinition,
  rules: LessonRules,
  strategy: 'pool-practice' | 'pool-mastery',
  previousUnits: AcademyUnitDefinition[],
  weakConceptIds: string[],
  rng: () => number,
): AcademyExercise[] {
  const totalCount = rules.exerciseCount
  const targetDifficulty: AcademyDifficulty = strategy === 'pool-mastery' ? 'hard' : 'medium'

  // Pool principal de l'unité, filtré par difficulté
  const corePool = byDifficulty(unit.pool, targetDifficulty)
  // Fallback : pool tous niveaux si la cible est trop maigre
  const broadenedCore = corePool.length >= totalCount * 0.6 ? corePool : unit.pool

  // Pool d'entrelacement : exercices des unités précédentes du même chapitre
  const interleavePool: AcademyExercise[] = previousUnits
    .filter((previousUnit) => previousUnit.chapterId === unit.chapterId)
    .flatMap((previousUnit) => previousUnit.pool)
    .filter((exercise) => exercise.difficulty !== 'easy')
    .filter((exercise) => isInterleaved(exercise) || rng() < 0.4)

  // Buckets prioritaires
  const interleaveCount = rules.interleaveFromPreviousUnits ?? 0
  const misconceptionRatio = rules.misconceptionRatio ?? 0
  const metacognitionRatio = rules.metacognitionRatio ?? 0

  const buckets: Bucket[] = [
    {
      label: 'misconception',
      pool: broadenedCore.filter(isMisconception),
      ratio: misconceptionRatio,
    },
    {
      label: 'metacognition',
      pool: broadenedCore.filter(isMetacognition),
      ratio: metacognitionRatio,
    },
    {
      label: 'core',
      pool: broadenedCore,
    },
  ]

  const baseSelection = pickFromBuckets(buckets, Math.max(totalCount - interleaveCount, 0), rng)

  // Entrelacement : on remplace ou on insère les exos d'unités précédentes
  const interleaveSelection = shuffle(interleavePool, rng).slice(0, interleaveCount)

  // Boost des concepts ratés (mistake queue)
  const weakBoost = broadenedCore
    .filter((exercise) => weakConceptIds.includes(exercise.conceptId))
    .filter((exercise) => !baseSelection.some((selected) => selected.id === exercise.id))
    .slice(0, Math.min(2, weakConceptIds.length))

  // Fusion : on prend baseSelection, on remplace les derniers items par les boost et l'entrelacement
  const merged = [...baseSelection]
  for (const exercise of [...interleaveSelection, ...weakBoost]) {
    if (merged.length < totalCount) {
      merged.push(exercise)
    } else if (!merged.some((existing) => existing.id === exercise.id)) {
      merged.pop()
      merged.push(exercise)
    }
  }

  // Si le pool est trop pauvre, on duplique en taggant variantOf
  if (merged.length < totalCount) {
    const fallback = shuffle(broadenedCore, rng)
    let i = 0
    while (merged.length < totalCount && fallback.length > 0) {
      const exercise = fallback[i % fallback.length]!
      merged.push(tagRetryVariant(exercise, `repeat-${merged.length}`))
      i++
      if (i > totalCount * 4) break // safety
    }
  }

  // Diffusion par concept (anti-répétition consécutive)
  return spreadByConcept(merged.slice(0, totalCount))
}

// ─── Exposed helper for tests / inspection ───────────────────────────────────

export const __internals = {
  hashString,
  mulberry32,
  shuffle,
  spreadByConcept,
  pickFromBuckets,
}
