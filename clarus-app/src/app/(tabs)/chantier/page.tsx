import { TabScreen } from '../_components/tab-screen'
import { ChantierDashboardClient } from './chantier-dashboard-client'

export default function ProjectPage() {
  return (
    <TabScreen title="Chantier" subtitle="Zones & références techniques">
      <ChantierDashboardClient />
    </TabScreen>
  )
}
