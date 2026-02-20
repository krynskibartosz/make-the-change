import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'

export type ProjectProducer = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  contact_website: string | null
  images: string[] | null
}

export type PublicProject = {
  id: string
  slug: string
  status: string | null
  type: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  long_description_default: string | null
  long_description_i18n?: Record<string, string> | null
  address_city: string | null
  address_country_code: string | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number | null
  target_budget: number | null
  hero_image_url: string | null
  images: string[] | null
  producer: ProjectProducer | null
}

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

const toNullableString = (value: unknown): string | null => {
  const parsed = asString(value)
  return parsed || null
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = asNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

const toProducer = (value: unknown): ProjectProducer | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const nameDefault = asString(value.name_default)
  if (!id || !nameDefault) {
    return null
  }

  return {
    id,
    slug: toNullableString(value.slug),
    name_default: nameDefault,
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    contact_website: toNullableString(value.contact_website),
    images: asStringArray(value.images),
  }
}

const toPublicProject = (value: unknown): PublicProject | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const slug = asString(value.slug)
  const nameDefault = asString(value.name_default)
  if (!id || !slug || !nameDefault) {
    return null
  }

  return {
    id,
    slug,
    status: toNullableString(value.status),
    type: toNullableString(value.type),
    name_default: nameDefault,
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    long_description_default: toNullableString(value.long_description_default),
    long_description_i18n: toLocalizedRecord(value.long_description_i18n),
    address_city: toNullableString(value.address_city),
    address_country_code: toNullableString(value.address_country_code),
    launch_date: toNullableString(value.launch_date),
    maturity_date: toNullableString(value.maturity_date),
    current_funding: toNullableNumber(value.current_funding),
    target_budget: toNullableNumber(value.target_budget),
    hero_image_url: toNullableString(value.hero_image_url),
    images: asStringArray(value.images),
    producer: toProducer(value.producer),
  }
}

export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('public_projects')
    .select(
      `
      *,
      producer:public_producers!producer_id(*)
    `,
    )
    .eq('slug', slug)
    .single()

  return toPublicProject(data)
}
