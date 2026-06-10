import { Image as ImageIcon, Map, Plus } from 'lucide-react'
import Link from 'next/link'
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
        <TasksListClient />
      </section>

      {/* Bouton flottant Ajouter une tâche */}
      <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),0.75rem)+5.5rem)] inset-x-0 z-40 flex justify-center px-5 pointer-events-none">
        <Link 
          href="/ajouter-tache"
          className="pointer-events-auto flex items-center justify-center gap-2 h-14 w-full max-w-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-[0.98] bg-primary text-primary-foreground font-medium text-base"
        >
          <Plus className="size-5" />
          Ajouter une tâche
        </Link>
      </div>
    </TabScreen>
  )
}
