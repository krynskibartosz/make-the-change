'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { KanbanBoard } from '@/features/board/components/kanban-board'
import type { Task, TaskStatus } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const loadTasks = async () => {
    const data = await mockClarusRepository.getTasks()
    setTasks(data)
    setLoading(false)
  }

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await mockClarusRepository.updateTaskStatus(taskId, newStatus)
    // Ne pas recharger la page pour garder l'UX fluide, le composant interne met à jour son état
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4.5rem)] text-foreground bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-none flex flex-col gap-4 p-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Site Board</h1>
            <p className="text-sm text-muted-foreground">Kanban d'exécution</p>
          </div>
          <Link
            href="/ajouter-tache"
            className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors"
          >
            <Plus className="size-5" />
          </Link>
        </div>
      </header>

      {/* Board Content */}
      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full text-muted-foreground text-sm">
            Chargement du tableau...
          </div>
        ) : (
          <KanbanBoard initialTasks={tasks} onStatusChange={handleStatusChange} />
        )}
      </main>
    </div>
  )
}
