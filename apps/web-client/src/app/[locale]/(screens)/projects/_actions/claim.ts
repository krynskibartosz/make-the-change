'use server'

import { revalidatePath } from 'next/cache'
import { isMockDataSource } from '@/lib/mock/data-source'
import { setMockViewerSession } from '@/lib/mock/mock-session-server'
import { createMockRegisteredViewerSession } from '@/lib/mock/mock-viewer'
import { createClient } from '@/lib/supabase/server'

export async function claimGuestSupport(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Email invalide' }
  }

  if (isMockDataSource) {
    // Authentification silencieuse (Mock)
    const displayName = email.split('@')[0] || 'Nouveau membre'
    const session = createMockRegisteredViewerSession({
      displayName,
      email,
    })
    
    await setMockViewerSession(session)
    revalidatePath('/', 'layout')
    
    // On simule le temps d'envoi du magic link
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    return { success: true }
  }
  
  // Vraie implémentation Supabase (Magic Link)
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/profile/biodex`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
