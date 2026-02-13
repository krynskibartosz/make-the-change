'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Brand, THEMES, type UserTheme, type ThemeConfig } from '@make-the-change/core'

export type ThemeState = {
  success?: string
  error?: string
  themeConfig?: ThemeConfig
}

export async function saveUserTheme(
  themeId: string, 
  name?: string, 
  customVars: Record<string, string> = {}
): Promise<ThemeState> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Vous devez être connecté pour sauvegarder votre thème.' }
    }

    // 1. Get existing config
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single<{ theme_config: unknown | null }>()

    let config: ThemeConfig = (profile?.theme_config as ThemeConfig) || {
      activeThemeId: 'default',
      customThemes: []
    }

    // Ensure structure is correct if it was old format
    if (!config.customThemes) {
      config = {
        activeThemeId: config.activeThemeId || 'default',
        customThemes: []
      }
    }

    // 2. Handle saving
    const isPredefined = THEMES.some(t => t.id === themeId && t.id !== 'custom')
    
    if (isPredefined) {
      config.activeThemeId = themeId
    } else {
      // It's a custom theme
      if (name) {
        // Saving a new or updating an existing named theme
        const existingIndex = config.customThemes.findIndex(t => t.id === themeId || t.name === name)
        
        if (existingIndex >= 0) {
          // Update existing custom theme
          const existingTheme = config.customThemes[existingIndex]!
          existingTheme.name = name
          existingTheme.customVars = customVars
          existingTheme.updated_at = new Date().toISOString()
          config.customThemes[existingIndex] = existingTheme
          config.activeThemeId = existingTheme.id
        } else {
          // Create new
          const newTheme: UserTheme = {
            id: crypto.randomUUID(),
            name,
            brand: 'custom',
            customVars,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          config.customThemes.push(newTheme)
          config.activeThemeId = newTheme.id
        }
      } else if (themeId === 'custom') {
        config.activeThemeId = 'custom'
      } else {
        config.activeThemeId = themeId
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ theme_config: config as any })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/')
    return { success: 'Thème mis à jour.', themeConfig: config }
  } catch (error: any) {
    console.error('Error saving theme:', error)
    return { error: 'Une erreur est survenue lors de la sauvegarde du thème.' }
  }
}

export async function deleteUserTheme(themeId: string): Promise<ThemeState> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Non autorisé' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single<{ theme_config: unknown | null }>()

    const config = profile?.theme_config as ThemeConfig
    if (!config || !config.customThemes) return { error: 'Configuration introuvable' }

    config.customThemes = config.customThemes.filter(t => t.id !== themeId)
    
    if (config.activeThemeId === themeId) {
      config.activeThemeId = 'default'
    }

    const { error } = await supabase
      .from('profiles')
      .update({ theme_config: config as any })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/')
    return { success: 'Thème supprimé.', themeConfig: config }
  } catch (error) {
    return { error: 'Erreur lors de la suppression' }
  }
}
