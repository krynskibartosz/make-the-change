'use client'

import { TabScreen } from '../_components/tab-screen'
import { ChantierDashboardClient } from './chantier-dashboard-client'
import { WorkerCockpit } from '@/features/roles/components/worker-cockpit'
import { ClientPortal } from '@/features/roles/components/client-portal'
import { useRole } from '@/lib/role-context'

export default function ProjectPage() {
  const { role, isReady } = useRole()

  if (!isReady) return null

  if (role === 'client') {
    return <ClientPortal />
  }

  if (role === 'ouvrier') {
    // Mode Ouvrier : Pas de header standard, juste le cockpit
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground pt-10">
        <WorkerCockpit />
      </main>
    )
  }

  // Mode Admin par défaut
  return (
    <TabScreen title="Chantier" subtitle="Zones & références techniques">
      <ChantierDashboardClient />
    </TabScreen>
  )
}
