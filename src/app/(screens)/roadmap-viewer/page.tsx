'use client'

import { CalendarDays, CheckCircle2, ChevronLeft, Circle, Kanban, List } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Badge, Card } from '@/components/ui'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { KanbanBoard } from '@/features/board/components/kanban-board'
import { TaskStatusSheet } from '@/features/board/components/task-status-sheet'
import { ProjectRoadmap } from '@/features/projects/components/project-roadmap'
import type { Phase, Task, TaskStatus } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

export default function RoadmapViewerPage() {
  const router = useRouter()
  const [phases, setPhases] = useState<Phase[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('roadmap')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [ph, t] = await Promise.all([
        mockClarusRepository.getPhases(),
        mockClarusRepository.getTasks(),
      ])
      setPhases(ph)
      setTasks(t)
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
    setTasks((current) => current.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    try {
      await mockClarusRepository.updateTaskStatus(taskId, newStatus)
      await loadData()
    } catch (e) {
      console.error(e)
      await loadData()
    }
  }

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'to_do' : 'done'
    await updateTaskStatus(task.id, newStatus)
  }

  const handleTaskCreate = async (title: string, status: TaskStatus = 'to_do') => {
    try {
      await mockClarusRepository.createTask({
        projectId: 'proj-1', // Mock project
        title,
        status,
        priority: 'normal',
      })
      await loadData()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 flex flex-col border-b border-border/30 bg-background/80 backdrop-blur-xl pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-10 items-center justify-center rounded-full bg-surface hover:bg-surface-elevated active:scale-95 transition-all"
              aria-label="Retour"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="size-4" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">Planning & Tâches</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Vue globale du chantier</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <SegmentedControl
            ariaLabel="Vue de planification"
            options={[
              { label: 'Roadmap', value: 'roadmap' },
              { label: <List className="size-4" />, value: 'list' },
              { label: <Kanban className="size-4" />, value: 'board' },
            ]}
            value={viewMode}
            onValueChange={setViewMode}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        {isLoading && phases.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {viewMode === 'roadmap' && (
              <div className="flex-1 mt-4">
                <ProjectRoadmap phases={phases} />
              </div>
            )}

            {viewMode === 'list' && (
              <div className="flex flex-col gap-3 p-4">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune tâche.</p>
                ) : (
                  tasks.map((task) => {
                    const isDone = task.status === 'done'
                    const priorityTone =
                      task.priority === 'urgent'
                        ? 'danger'
                        : task.priority === 'high'
                          ? 'warning'
                          : 'primary'

                    return (
                      <Card
                        key={task.id}
                        className={`flex items-center gap-3 p-3 transition-all duration-300 cursor-pointer active:scale-[0.98] ${isDone ? 'opacity-60 bg-muted/50' : 'bg-surface'}`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStatus(task)
                          }}
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
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {task.description}
                            </span>
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

                {/* Quick Add List */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const input = e.currentTarget.elements.namedItem('title') as HTMLInputElement
                    if (input.value.trim()) {
                      const val = input.value.trim()
                      input.value = ''
                      await handleTaskCreate(val, 'to_do')
                    }
                  }}
                  className="mt-2"
                >
                  <input
                    name="title"
                    type="text"
                    placeholder="+ Ajouter une tâche..."
                    className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
                  />
                </form>
              </div>
            )}

            {viewMode === 'board' && (
              <div className="flex-1 w-full overflow-hidden mt-4">
                <KanbanBoard
                  initialTasks={tasks}
                  onStatusChange={updateTaskStatus}
                  onTaskClick={setSelectedTask}
                  onTaskCreate={handleTaskCreate}
                />
              </div>
            )}
          </>
        )}

        <TaskStatusSheet
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={updateTaskStatus}
        />
      </main>
    </div>
  )
}
