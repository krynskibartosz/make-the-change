'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Badge, Card } from '@/components/ui'
import type { Task } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { KanbanBoard } from '@/features/board/components/kanban-board'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Kanban, List } from 'lucide-react'
import type { TaskStatus } from '@/lib/domain'

export function TasksListClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await mockClarusRepository.getTasks()
      setTasks(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((current) => current.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))

    try {
      await mockClarusRepository.updateTaskStatus(taskId, newStatus)
      await loadData()
    } catch (e) {
      console.error(e)
      // Revert on error
      await loadData()
    }
  }

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'to_do' : 'done'
    await updateTaskStatus(task.id, newStatus)
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">Chargement des tâches...</div>
    )
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-foreground">Tâches</h2>
        <SegmentedControl
          ariaLabel="Vue des tâches"
          options={[
            { label: <List className="size-4" />, value: 'list' },
            { label: <Kanban className="size-4" />, value: 'board' },
          ]}
          value={viewMode}
          onValueChange={setViewMode}
        />
      </div>

      {viewMode === 'board' ? (
        <div className="-mx-4">
          <KanbanBoard initialTasks={tasks} onStatusChange={updateTaskStatus} />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune tâche.</p>
      ) : (
        tasks.map((task) => {
          const isDone = task.status === 'done'
          const priorityTone =
            task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'primary'

          return (
            <Card
              key={task.id}
              className={`flex items-center gap-3 p-3 transition-all duration-300 ${isDone ? 'opacity-60 bg-muted/50' : 'bg-surface'}`}
            >
              <button
                type="button"
                onClick={() => toggleStatus(task)}
                className="flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:text-primary focus:outline-none"
                aria-label={isDone ? 'Marquer comme à faire' : 'Marquer comme terminé'}
              >
                {isDone ? (
                  <CheckCircle2 className="size-6 text-primary" />
                ) : (
                  <Circle className="size-6 text-muted-foreground" />
                )}
              </button>

              <div
                className={`flex flex-1 flex-col transition-all duration-300 ${isDone ? 'line-through text-muted-foreground' : ''}`}
              >
                <span className="text-sm font-medium">{task.title}</span>
                {task.description && (
                  <span className="text-xs text-muted-foreground mt-0.5">{task.description}</span>
                )}
              </div>

              <Badge
                tone={isDone ? 'neutral' : priorityTone}
                className={isDone ? 'opacity-50' : ''}
              >
                {task.priority}
              </Badge>
            </Card>
          )
        })
      )}
    </div>
  )
}
