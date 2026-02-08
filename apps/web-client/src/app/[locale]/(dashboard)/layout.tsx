import { getLocale } from 'next-intl/server'
import type { PropsWithChildren } from 'react'
import { DashboardMobileHeader } from '@/components/layout/dashboard-mobile-header'
import { DashboardSidebarProvider } from '@/components/layout/dashboard-sidebar-context'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { redirect } from '@/i18n/navigation'
import { getUser } from '@/lib/auth-guards'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from './dashboard-sidebar'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const user = await getUser()

  if (!user) {
    const locale = await getLocale()
    return redirect({ href: '/login', locale })
  }

  // Fetch user profile (only fields needed for sidebar)
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, user_level, avatar_url, metadata')
    .eq('id', user.id)
    .single()

  return (
    <DashboardSidebarProvider>
      <div className="flex flex-col lg:flex-row h-screen bg-background relative">
        <DashboardMobileHeader />
        <DashboardSidebar user={{ id: user.id, email: user.email }} profile={profile} />
        
        <main className="flex-1 z-20 transition-all duration-300 bg-background/50 overflow-y-auto">
          {children}
        </main>
        
        <div className="lg:hidden">
          <MobileBottomNav user={{ id: user.id, email: user.email || '' }} />
        </div>
      </div>
    </DashboardSidebarProvider>
  )
}
