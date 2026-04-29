import { getLocale } from 'next-intl/server'
import type { PropsWithChildren } from 'react'
import { getUser } from '@/app/[locale]/(auth)/_features/auth-guards'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { redirect } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const user = await getUser()

  if (!user) {
    const locale = await getLocale()
    return redirect({ href: '/login', locale })
  }

  if (isMockDataSource) {

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background relative">
       
          <main className="flex-1 z-20 transition-all duration-300 bg-background/50 overflow-y-auto">
            {children}
          </main>

          <div className="lg:hidden" id="mobile-bottom-nav">
            <MobileBottomNav user={{ id: user.id, email: user.email || '' }} />
          </div>
        </div>
    )
  }

  // Fetch user profile (only fields needed for sidebar)
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, user_level, avatar_url, metadata')
    .eq('id', user.id)
    .single()

  return (
      <div className="flex flex-col lg:flex-row h-screen bg-background relative">

        <main className="flex-1 z-20 transition-all duration-300 bg-background/50 overflow-y-auto">
          {children}
        </main>

        <div className="lg:hidden" id="mobile-bottom-nav">
          <MobileBottomNav user={{ id: user.id, email: user.email || '' }} />
        </div>
      </div>
  )
}
