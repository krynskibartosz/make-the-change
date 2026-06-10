'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui'
import type { Task } from '@/lib/domain'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

export function TasksListClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'to_do' : 'done'

    // Optimistic update
    setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))

    try {
      await mockClarusRepository.updateTaskStatus(task.id, newStatus)
      toast({
        title: newStatus === 'done' ? 'Tâche terminée ✓' : 'Tâche réouverte',
        description: task.title,
        variant: newStatus === 'done' ? 'success' : 'info',
      })
      await loadData()
    } catch (e) {
      console.error(e)
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour la tâche.', variant: 'error' })
      await loadData()
    }
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">Chargement des tâches...</div>
    )
  }

  return (
    <div className="flex flex-col mt-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Tâches à faire</h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune tâche.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border -mx-4 px-4 sm:mx-0 sm:px-0">
          {tasks.map((task) => {
            const isDone = task.status === 'done'
            const priorityTone =
              task.priority === 'urgent'
                ? 'danger'
                : task.priority === 'high'
                  ? 'warning'
                  : 'primary'

            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 py-3 transition-all duration-300 active:scale-[0.98] ${isDone ? 'opacity-60' : ''}`}
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
