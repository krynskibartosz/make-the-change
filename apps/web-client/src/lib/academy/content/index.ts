import type { AcademyUnitDefinition } from '../schema'
import { unitDefinitionSchema } from '../schema'
import { bossUnit } from './units/chapter-1/boss'
import { lifeFactoryUnit } from './units/chapter-1/life-factory'
import { photosynthesisUnit } from './units/chapter-1/photosynthesis'
import { reflexesUnit } from './units/chapter-1/reflexes'
import { soilUnit } from './units/chapter-1/soil'
import { sunUnit } from './units/chapter-1/sun'
import { waterUnit } from './units/chapter-1/water'
import { alliancesUnit } from './units/chapter-2/alliances'
import { mutationsUnit } from './units/chapter-2/mutations'
import { predatorsUnit } from './units/chapter-2/predators'

/**
 * Registre central des unités V2 (schéma riche, validé Zod).
 *
 * Quand une unité y est listée, elle remplace automatiquement la version
 * legacy correspondante dans `mock-academy.ts` (cf. runtime adapter).
 *
 * Les unités legacy non encore migrées continuent de fonctionner sans
 * modification.
 */

const RAW_UNITS: AcademyUnitDefinition[] = [
  // Chapitre 1
  sunUnit,
  waterUnit,
  soilUnit,
  photosynthesisUnit,
  reflexesUnit,
  lifeFactoryUnit,
  bossUnit,
  // Chapitre 2
  predatorsUnit,
  alliancesUnit,
  mutationsUnit,
]

// Validation Zod au chargement : toute unité incohérente fait crasher tôt.
const VALIDATED_UNITS: AcademyUnitDefinition[] = RAW_UNITS.map((unit) => {
  const result = unitDefinitionSchema.safeParse(unit)
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n')
    throw new Error(`[academy] Unit "${unit.id}" failed schema validation:\n${issues}`)
  }
  return result.data
})

// Index par chapterId puis par unitId pour lookups O(1).
const v2UnitById = new Map<string, AcademyUnitDefinition>()
const v2UnitsByChapter = new Map<string, AcademyUnitDefinition[]>()

for (const unit of VALIDATED_UNITS) {
  v2UnitById.set(unit.id, unit)
  v2UnitById.set(unit.slug, unit)
  const chapterUnits = v2UnitsByChapter.get(unit.chapterId) ?? []
  chapterUnits.push(unit)
  v2UnitsByChapter.set(unit.chapterId, chapterUnits)
}

// Tri par order au sein d'un chapitre (utile pour l'entrelacement).
for (const [chapterId, units] of v2UnitsByChapter.entries()) {
  v2UnitsByChapter.set(chapterId, units.slice().sort((a, b) => a.order - b.order))
}

export function getV2UnitById(idOrSlug: string): AcademyUnitDefinition | null {
  return v2UnitById.get(idOrSlug) ?? null
}

export function getV2UnitsByChapter(chapterId: string): AcademyUnitDefinition[] {
  return v2UnitsByChapter.get(chapterId) ?? []
}

export function listV2Units(): AcademyUnitDefinition[] {
  return VALIDATED_UNITS
}

export function isV2UnitId(idOrSlug: string): boolean {
  return v2UnitById.has(idOrSlug)
}
