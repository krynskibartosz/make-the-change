'use client'

import { useEffect, useState } from 'react'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { createClient } from '@/lib/supabase/client'

type AppUser = {
  id: string
  email: string
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (isMockDataSource) {
      const syncFromCookie = () => {
        const session = getClientMockViewerSession()
        setUser(
          session
            ? {
                id: session.viewerId,
                email: session.email,
              }
            : null,
        )
        setLoading(false)
      }

      syncFromCookie()
      window.addEventListener('focus', syncFromCookie)

      return () => {
        window.removeEventListener('focus', syncFromCookie)
      }
    }

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? { id: user.id, email: user.email || '' } : null)
      setLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading }
}
