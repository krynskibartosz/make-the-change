'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MainMenuStructure, HomePageContent } from '../types'

export async function updateMenu(slug: string, structure: MainMenuStructure) {
  const supabase = await createClient()
  
  // Check permission (simple check for now, can be expanded)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('content')
    .from('menus')
    .update({ 
      structure,
      updated_at: new Date().toISOString(),
      updated_by: user.id
    })
    .eq('slug', slug)

  if (error) {
    console.error('Error updating menu:', error)
    throw new Error('Failed to update menu')
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updatePageContent(slug: string, sections: HomePageContent) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('content')
    .from('pages')
    .update({ 
      sections,
      updated_at: new Date().toISOString(),
      updated_by: user.id
    })
    .eq('slug', slug)

  if (error) {
    console.error('Error updating page:', error)
    throw new Error('Failed to update page content')
  }

  revalidatePath('/', 'page')
  return { success: true }
}
