import { asString, asStringArray, isRecord } from '@/lib/type-guards'
import type { ConservationStatus, Species } from './types'

const CONSERVATION_STATUS_VALUES = [
  'NE',
  'DD',
  'LC',
  'NT',
  'VU',
  'EN',
  'CR',
  'EW',
  'EX',
] as const satisfies readonly ConservationStatus[]

const POPULATION_TREND_VALUES = [
  'increasing',
  'decreasing',
  'stable',
  'unknown',
] as const satisfies readonly NonNullable<Species['population_trend']>[]

const isConservationStatus = (value: unknown): value is ConservationStatus =>
  CONSERVATION_STATUS_VALUES.some((entry) => entry === value)

const isPopulationTrend = (value: unknown): value is NonNullable<Species['population_trend']> =>
  POPULATION_TREND_VALUES.some((entry) => entry === value)

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

const toUnknownRecord = (value: unknown): Record<string, unknown> | null =>
  isRecord(value) ? value : null

export const toSpecies = (value: unknown): Species | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  return {
    id,
    created_at: asString(value.created_at),
    updated_at: asString(value.updated_at),
    name_i18n: toLocalizedRecord(value.name_i18n),
    scientific_name: asString(value.scientific_name) || null,
    description_i18n: toLocalizedRecord(value.description_i18n),
    conservation_status: isConservationStatus(value.conservation_status)
      ? value.conservation_status
      : null,
    population_trend: isPopulationTrend(value.population_trend) ? value.population_trend : null,
    habitat: asStringArray(value.habitat),
    threats: asStringArray(value.threats),
    image_url: asString(value.image_url) || null,
    gallery_urls: asStringArray(value.gallery_urls),
    content_levels: toUnknownRecord(value.content_levels),
    metadata: toUnknownRecord(value.metadata),
  }
}
