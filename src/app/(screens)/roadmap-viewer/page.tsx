'use client'

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock3,
  ListChecks,
  Route,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Badge, Card } from '@/components/ui'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { TaskStatusSheet } from '@/features/board/components/task-status-sheet'
import { KanbanBoard } from '@/features/board/components/kanban-board'
import { ProjectRoadmap } from '@/features/projects/components/project-roadmap'
import type { Phase, Task, TaskStatus } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

type ViewMode = 'kanban' | 'tasks' | 'roadmap'

const phaseTone: Record<
  NonNullable<Phase['status']> | 'not_started',
  'neutral' | 'primary' | 'success' | 'danger'
> = {
  not_started: 'neutral',
  in_progress: 'primary',
  completed: 'success',
  delayed: 'danger',
}

const taskStatusLabels: Record<TaskStatus, string> = {
  to_check: 'À trier',
  to_do: 'À faire',
  in_progress: 'En cours',
  blocked: 'Bloquant',
  done: 'Terminé',
}

const taskPriorityLabels: Record<Task['priority'], string> = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
  urgent: 'Urgente',
}

export default function RoadmapViewerPage() {
  const router = useRouter()
  const [phases, setPhases] = useState<Phase[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [nextPhases, nextTasks] = await Promise.all([
        mockClarusRepository.getPhases(),
        mockClarusRepository.getTasks(),
      ])
      setPhases(nextPhases)
      setTasks(nextTasks)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
    )
    try {
      await mockClarusRepository.updateTaskStatus(taskId, newStatus)
      await loadData()
    } catch (error) {
      console.error(error)
      await loadData()
    }
  }

  const toggleStatus = async (task: Task) => {
    await updateTaskStatus(task.id, task.status === 'done' ? 'to_do' : 'done')
  }

  const handleTaskCreate = async (title: string, status: TaskStatus = 'to_do') => {
    try {
      await mockClarusRepository.createTask({
        projectId: 'proj-1',
        title,
        status,
        priority: 'normal',
      })
      await loadData()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-20 text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/90 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface transition-all active:scale-95"
            aria-label="Retour"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold leading-tight">Planning et tâches</h1>
              <p className="truncate text-xs text-muted-foreground">Vue globale du chantier</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
            <SegmentedControl
              ariaLabel="Vue de planification"
              className="[&_[role=tab]]:flex-1 [&_[role=tab]]:px-3"
              options={[
                { label: 'Kanban', value: 'kanban' },
                { label: 'Liste', value: 'tasks' },
                { label: 'Timeline', value: 'roadmap' },
              ]}
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
            />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {isLoading && phases.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-b-primary" />
          </div>
        ) : null}

        {!isLoading || phases.length > 0 ? (
          <>
            {viewMode === 'kanban' ? (
              <section className="flex flex-col gap-4 py-5 w-full overflow-hidden">
                <div className="px-4">
                  <h2 className="text-base font-bold">Kanban d'exécution</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Une grille complète avec scroll horizontal et vertical.
                  </p>
                </div>
                <div className="w-full">
                  <KanbanBoard
                    initialTasks={tasks}
                    onStatusChange={updateTaskStatus}
                    onTaskClick={setSelectedTask}
                    onTaskCreate={handleTaskCreate}
                    forceBoardView={true}
                  />
                </div>
              </section>
            ) : null}

            {viewMode === 'tasks' ? (
              <section className="flex flex-col gap-3 px-4 py-5">
                <div>
                  <h2 className="text-base font-bold">Tâches du chantier</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Une liste verticale pour décider et agir rapidement.
                  </p>
                </div>

                {tasks.length === 0 ? (
                  <p className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucune tâche.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {tasks.map((task) => {
                      const isDone = task.status === 'done'
                      const priorityTone =
                        task.priority === 'urgent'
                          ? 'danger'
                          : task.priority === 'high'
                            ? 'warning'
                            : 'neutral'

                      return (
                        <Card
                          key={task.id}
                          className={`flex min-h-20 cursor-pointer items-center gap-3 p-3 transition-all active:scale-[0.99] ${
                            isDone ? 'bg-muted/40 opacity-70' : 'bg-surface'
                          }`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleStatus(task)
                            }}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label={isDone ? 'Marquer comme à faire' : 'Marquer comme terminée'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="size-6 text-success" />
                            ) : (
                              <Circle className="size-6 text-muted-foreground" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold ${
                                isDone ? 'line-through text-muted-foreground' : ''
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              <Badge
                                tone={task.status === 'blocked' ? 'danger' : 'neutral'}
                                className="min-h-6 px-2"
                              >
                                {taskStatusLabels[task.status]}
                              </Badge>
                              {task.priority !== 'normal' ? (
                                <Badge tone={priorityTone} className="min-h-6 px-2">
                                  Priorité {taskPriorityLabels[task.priority].toLowerCase()}
                                </Badge>
                              ) : null}
                            </div>
                          </div>

                          <ListChecks className="size-5 shrink-0 text-muted-foreground" />
                        </Card>
                      )
                    })}
                  </div>
                )}

                <form
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const input = event.currentTarget.elements.namedItem(
                      'title',
                    ) as HTMLInputElement
                    const title = input.value.trim()
                    if (!title) return
                    input.value = ''
                    await handleTaskCreate(title)
                  }}
                >
                  <input
                    name="title"
                    type="text"
                    placeholder="Ajouter une tâche…"
                    className="min-h-12 w-full rounded-[var(--radius-control)] border border-border bg-surface px-4 text-sm font-medium placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </form>
              </section>
            ) : null}

            {viewMode === 'roadmap' ? (
              <section className="flex flex-col gap-3 py-5">
                <div className="flex items-start gap-3 px-4">
                  <Route className="mt-0.5 size-5 text-primary" />
                  <div>
                    <h2 className="text-base font-bold">Roadmap avancée</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Dépendances, dates et ajustements détaillés.
                    </p>
                  </div>
                </div>
                <ProjectRoadmap phases={phases} />
              </section>
            ) : null}
          </>
        ) : null}

        <TaskStatusSheet
          task={selectedTask}
          isOpen={selectedTask !== null}
          onClose={() => setSelectedTask(null)}
          onStatusChange={updateTaskStatus}
        />
      </main>
    </div>
  )
}
