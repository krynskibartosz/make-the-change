import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import { TabScreen } from '../_components/tab-screen'
import { TasksListClient } from './tasks-list-client'

export default function ProjectPage() {
  return (
    <TabScreen title="Chantier">
      <section className="py-2 border-b border-border mb-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Shell pret pour zones, phases, personnes et blocs chantier.
        </p>
      </section>

      <section>
        <CreateTaskModal />
        <TasksListClient />
      </section>
    </TabScreen>
  )
}
