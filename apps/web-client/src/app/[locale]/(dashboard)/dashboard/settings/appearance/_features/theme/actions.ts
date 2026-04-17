'use server'

import { THEMES, type ThemeConfig, type UserTheme } from '@make-the-change/core'
import { revalidatePath } from 'next/cache'
import { isMockDataSource } from '@/lib/mock/data-source'
import {
  getCurrentMockUserPreferences,
  setMockUserPreferences,
} from '@/lib/mock/mock-user-preferences-server'
import { createClient } from '@/lib/supabase/server'
import { parseThemeConfig } from '@/lib/theme-config'

export type ThemeState = {
  success?: string
  error?: string
  themeConfig?: ThemeConfig
}

const ensureThemeConfig = (value: unknown): ThemeConfig => {
  return parseThemeConfig(value) || {
    activeThemeId: 'default',
    customThemes: [],
  }
}

const applyThemeSelection = (
  currentConfig: ThemeConfig,
  themeId: string,
  name?: string,
  customVars: Record<string, string> = {},
): ThemeConfig => {
  let config = ensureThemeConfig(currentConfig)

  if (!config.customThemes) {
    config = {
      activeThemeId: config.activeThemeId || 'default',
      customThemes: [],
    }
  }

  const isPredefined = THEMES.some((t) => t.id === themeId && t.id !== 'custom')

  if (isPredefined) {
    config.activeThemeId = themeId
    return config
  }

  if (name) {
    const existingIndex = config.customThemes.findIndex((t) => t.id === themeId || t.name === name)
    const createNewTheme = (): UserTheme => ({
      id: crypto.randomUUID(),
      name,
      brand: 'custom',
      customVars,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (existingIndex >= 0) {
      const existingTheme = config.customThemes[existingIndex]
      if (existingTheme) {
        const updatedTheme: UserTheme = {
          ...existingTheme,
          name,
          customVars,
          updated_at: new Date().toISOString(),
        }
        config.customThemes[existingIndex] = updatedTheme
        config.activeThemeId = updatedTheme.id
      } else {
        const newTheme = createNewTheme()
        config.customThemes.push(newTheme)
        config.activeThemeId = newTheme.id
      }
    } else {
      const newTheme = createNewTheme()
      config.customThemes.push(newTheme)
      config.activeThemeId = newTheme.id
    }

    return config
  }

  if (themeId === 'custom') {
    config.activeThemeId = 'custom'
    return config
  }

  config.activeThemeId = themeId
  return config
}

export async function saveUserTheme(
  themeId: string,
  name?: string,
  customVars: Record<string, string> = {},
): Promise<ThemeState> {
  try {
    if (isMockDataSource) {
      const preferences = await getCurrentMockUserPreferences()
      if (!preferences) {
        return { error: 'Vous devez être connecté pour sauvegarder votre thème.' }
      }

      const config = applyThemeSelection(preferences.themeConfig, themeId, name, customVars)

      await setMockUserPreferences({
        ...preferences,
        themeConfig: config,
      })

      revalidatePath('/')
      return { success: 'Thème mis à jour.', themeConfig: config }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Vous devez être connecté pour sauvegarder votre thème.' }
    }

    // 1. Get existing config
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single()

    const config = applyThemeSelection(profile?.theme_config, themeId, name, customVars)

    const { error } = await supabase
      .from('profiles')
      .update({ theme_config: config })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/')
    return { success: 'Thème mis à jour.', themeConfig: config }
  } catch (error: unknown) {
    console.error('Error saving theme:', error)
    return { error: 'Une erreur est survenue lors de la sauvegarde du thème.' }
  }
}

export async function deleteUserTheme(themeId: string): Promise<ThemeState> {
  try {
    if (isMockDataSource) {
      const preferences = await getCurrentMockUserPreferences()
      if (!preferences) return { error: 'Non autorisé' }

      const config = ensureThemeConfig(preferences.themeConfig)
      config.customThemes = config.customThemes.filter((t) => t.id !== themeId)

      if (config.activeThemeId === themeId) {
        config.activeThemeId = 'default'
      }

      await setMockUserPreferences({
        ...preferences,
        themeConfig: config,
      })

      revalidatePath('/')
      return { success: 'Thème supprimé.', themeConfig: config }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Non autorisé' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single()

    const config = parseThemeConfig(profile?.theme_config)
    if (!config || !config.customThemes) return { error: 'Configuration introuvable' }

    config.customThemes = config.customThemes.filter((t) => t.id !== themeId)

    if (config.activeThemeId === themeId) {
      config.activeThemeId = 'default'
    }

    const { error } = await supabase
      .from('profiles')
      .update({ theme_config: config })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/')
    return { success: 'Thème supprimé.', themeConfig: config }
  } catch (_error) {
    return { error: 'Erreur lors de la suppression' }
  }
}
