'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { KanbanBoard } from '@/features/board/components/kanban-board'
import { ProjectRoadmap } from '@/features/projects/components/project-roadmap'
import type { Phase, Task } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

type TabValue = 'kanban' | 'roadmap'

export function PlanningClient({
  initialTasks,
  initialPhases,
}: {
  initialTasks: Task[]
  initialPhases: Phase[]
}) {
  const [activeTab, setActiveTab] = useState<TabValue>('kanban')

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await mockClarusRepository.updateTaskStatus(taskId, newStatus)
  }

  const handleTaskCreate = async (title: string, status: Task['status']) => {
    await mockClarusRepository.createTask({
      title,
      status,
      projectId: 'p1',
      zoneId: 'z1',
      priority: 'normal',
    })
    // For a real app, we would invalidate a query here.
  }

  return (
    <div className="flex flex-col h-full relative pb-20">
      {/* Segmented Control */}
      <div className="sticky top-0 z-30 px-4 sm:px-0 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex p-1 bg-surface border rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'kanban'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'roadmap'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Roadmap
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-0 pt-2 flex flex-col h-[calc(100vh-12rem)]">
        {activeTab === 'kanban' && (
          <KanbanBoard 
            initialTasks={initialTasks} 
            onStatusChange={handleStatusChange}
            onTaskCreate={handleTaskCreate}
          />
        )}
        {activeTab === 'roadmap' && <ProjectRoadmap phases={initialPhases} />}
      </div>

      {/* Floating Action Button */}
      {activeTab === 'kanban' && (
        <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),0.75rem)+5.5rem)] inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <Link
            className="pointer-events-auto flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-[0.98]"
            href="/ajouter-tache"
          >
            <Plus className="size-6" />
            Nouvelle Tâche
          </Link>
        </div>
      )}
    </div>
  )
}
