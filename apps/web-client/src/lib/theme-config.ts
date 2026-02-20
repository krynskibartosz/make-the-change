import { type Brand, THEMES, type ThemeConfig, type UserTheme } from '@make-the-change/core'
import { asString, isRecord } from '@/lib/type-guards'

const BRAND_SET = new Set<string>(THEMES.map((theme) => theme.id))

export const isBrand = (value: unknown): value is Brand =>
  typeof value === 'string' && BRAND_SET.has(value)

const parseCustomVars = (value: unknown): Record<string, string> => {
  if (!isRecord(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

const parseUserTheme = (value: unknown): UserTheme | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const name = asString(value.name)

  if (!id || !name) {
    return null
  }

  return {
    id,
    name,
    brand: isBrand(value.brand) ? value.brand : 'custom',
    customVars: parseCustomVars(value.customVars),
    created_at: asString(value.created_at),
    updated_at: asString(value.updated_at),
  }
}

export const parseThemeConfig = (value: unknown): ThemeConfig | null => {
  if (!isRecord(value)) {
    return null
  }

  const customThemes = Array.isArray(value.customThemes)
    ? value.customThemes
        .map((theme) => parseUserTheme(theme))
        .filter((theme): theme is UserTheme => theme !== null)
    : []

  const legacyBrand = isBrand(value.brand) ? value.brand : undefined
  const activeThemeId = asString(value.activeThemeId, legacyBrand ?? 'default')

  return {
    activeThemeId,
    customThemes,
    ...(legacyBrand ? { brand: legacyBrand } : {}),
    customVars: parseCustomVars(value.customVars),
  }
}
