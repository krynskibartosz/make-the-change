import type { FC, PropsWithChildren } from 'react'
import { requireAdminPage } from '@/lib/auth-guards'
import { AdminBackgroundDecoration } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-background-decoration'
import { AdminBackgroundGrid } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-background-grid'
import { AdminBottomNav } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-bottom-nav'
import { AdminMobileHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-mobile-header'
import {
  AdminMobileSidebar,
  AdminSidebar,
} from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar'
import { AdminSidebarProvider } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'
import { AdminUiPreferencesProvider } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-ui-preferences'
import { Toaster } from '@/app/[locale]/admin/(dashboard)/components/ui/toaster'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata = { robots: { index: false, follow: false } }

type AdminDashboardLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: string }>
}>

const AdminDashboardLayout = async ({ children, params }: AdminDashboardLayoutProps) => {
  const { locale } = await params
  await requireAdminPage(locale)

  return (
    <AdminUiPreferencesProvider>
      <AdminSidebarProvider>
        <Toaster>
          <div className="flex flex-col md:flex-row h-screen bg-background relative">
            <AdminMobileHeader />
            <AdminSidebar />
            <AdminBackgroundDecoration />
            <AdminBackgroundGrid />
            <main className="flex-1 z-20 transition-all duration-300 bg-gradient-to-br from-background via-muted/5 to-background">
              <div className="h-full">{children}</div>
            </main>
            <AdminBottomNav />
          </div>
          <AdminMobileSidebar />
        </Toaster>
      </AdminSidebarProvider>
    </AdminUiPreferencesProvider>
  )
}

export default AdminDashboardLayout
