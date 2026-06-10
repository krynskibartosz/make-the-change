import { Image as ImageIcon, Map } from 'lucide-react'
import Link from 'next/link'
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import { TabScreen } from '../_components/tab-screen'
import { TasksListClient } from './tasks-list-client'

export default function ProjectPage() {
  return (
    <TabScreen title="Chantier">
      <section className="grid grid-cols-2 gap-3 mb-6 mt-2">
        <Link
          href="/plans"
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-surface p-5 transition-transform duration-200 active:scale-[0.98] active:bg-surface-elevated"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
            <Map className="size-6" />
          </div>
          <span className="text-sm font-semibold text-foreground">Plans</span>
        </Link>

        <Link
          href="/photos"
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-surface p-5 transition-transform duration-200 active:scale-[0.98] active:bg-surface-elevated"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <ImageIcon className="size-6" />
          </div>
          <span className="text-sm font-semibold text-foreground">Photos</span>
        </Link>
      </section>

      <section>
        <CreateTaskModal />
        <TasksListClient />
      </section>
    </TabScreen>
  )
}
