import { PlanningClient } from '@/features/planning/components/planning-client'
import { ProjectSwitcher } from '@/features/projects/components/project-switcher'
import { mockClarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'

export default async function PlanningPage() {
  const [tasks, phases] = await Promise.all([
    mockClarusRepository.getTasks(),
    mockClarusRepository.getProjectPhases('p1'), // Assuming p1 for now
  ])

  return (
    <TabScreen title="Planning" contentClassName="px-0 sm:px-4">
      <div className="flex justify-end px-4 -mt-2 mb-4 relative z-20">
        <ProjectSwitcher />
      </div>
      <PlanningClient initialTasks={tasks} initialPhases={phases} />
    </TabScreen>
  )
}
