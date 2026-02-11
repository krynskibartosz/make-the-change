import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { SettingsNav } from './settings-nav'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full bg-background z-10">
        <SettingsNav />
      </div>
      <DashboardPageContainer className="max-w-screen-2xl pt-6">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Paramètres</h1>
          </div>
          {children}
        </div>
      </DashboardPageContainer>
    </div>
  )
}
