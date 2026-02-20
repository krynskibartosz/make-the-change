'use server'

import { THEMES, type ThemeConfig, type UserTheme } from '@make-the-change/core'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ThemeState = {
  success?: string
  error?: string
  themeConfig?: ThemeConfig
}

type ProfileThemeRow = {
  theme_config: ThemeConfig | null
}

export async function saveUserTheme(
  themeId: string,
  name?: string,
  customVars: Record<string, string> = {},
): Promise<ThemeState> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Vous devez être connecté pour sauvegarder votre thème.' }
    }

    // 1. Get existing config
    const { data: profile } = (await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single()) as { data: ProfileThemeRow | null }

    let config: ThemeConfig = (profile?.theme_config as ThemeConfig | null) || {
      activeThemeId: 'default',
      customThemes: [],
    }

    // Ensure structure is correct if it was old format
    if (!config.customThemes) {
      config = {
        activeThemeId: config.activeThemeId || 'default',
        customThemes: [],
      }
    }

    // 2. Handle saving
    const isPredefined = THEMES.some((t) => t.id === themeId && t.id !== 'custom')

    if (isPredefined) {
      config.activeThemeId = themeId
    } else {
      // It's a custom theme
      if (name) {
        // Saving a new or updating an existing named theme
        const existingIndex = config.customThemes.findIndex(
          (t) => t.id === themeId || t.name === name,
        )

        if (existingIndex >= 0) {
          // Update
          config.customThemes[existingIndex] = {
            ...config.customThemes[existingIndex],
            name,
            customVars,
            updated_at: new Date().toISOString(),
          }
          config.activeThemeId = config.customThemes[existingIndex].id
        } else {
          // Create new
          const newTheme: UserTheme = {
            id: crypto.randomUUID(),
            name,
            brand: 'custom',
            customVars,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          config.customThemes.push(newTheme)
          config.activeThemeId = newTheme.id
        }
      } else if (themeId === 'custom') {
        // Just selecting the "generic" custom theme from the builder without naming it yet
        config.activeThemeId = 'custom'
        // We could also store these "temp" custom vars somewhere if we want
      } else {
        // Selecting an existing custom theme by ID
        config.activeThemeId = themeId
      }
    }

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
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Non autorisé' }

    const { data: profile } = (await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single()) as { data: ProfileThemeRow | null }

    const config = profile?.theme_config as ThemeConfig | null
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
