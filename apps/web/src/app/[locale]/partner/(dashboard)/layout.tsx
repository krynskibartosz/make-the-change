import type { FC, PropsWithChildren } from 'react'
import { AdminSidebarProvider } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'
import { Toaster } from '@/app/[locale]/admin/(dashboard)/components/ui/toaster'
import { PartnerBottomNav } from './components/partner-bottom-nav'
import { PartnerMobileHeader } from './components/partner-mobile-header'
import { PartnerMobileSidebar, PartnerSidebar } from './sidebar'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata = { robots: { index: false, follow: false } }

const PartnerDashboardLayout: FC<PropsWithChildren> = ({ children }) => (
  <AdminSidebarProvider>
    <div className="flex flex-col md:flex-row h-screen bg-background relative">
      <PartnerMobileHeader />
      <PartnerSidebar />
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
      <main className="flex-1 z-10 transition-all duration-300 bg-gradient-to-br from-background via-muted/5 to-background overflow-hidden">
        <div className="h-full">{children}</div>
      </main>
      <PartnerBottomNav />
    </div>
    <PartnerMobileSidebar />
    <Toaster />
  </AdminSidebarProvider>
)

export default PartnerDashboardLayout
