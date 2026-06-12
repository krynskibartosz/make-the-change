'use client'

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListFilter,
  ListTodo,
  type LucideIcon,
  MapPin,
  RotateCcw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Task, TaskStatus } from '@/lib/domain'
import { cn } from '@/lib/utils/cn'

type KanbanBoardProps = {
  initialTasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>
  onTaskClick?: (task: Task) => void
  onTaskCreate?: (title: string, status: TaskStatus) => Promise<void>
  forceBoardView?: boolean
}

type ColumnDef = {
  id: TaskStatus
  label: string
  icon: LucideIcon
  colorClass: string
  bgClass: string
}

const COLUMNS = [
  {
    id: 'to_check',
    label: 'À trier',
    icon: ListFilter,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
  },
  {
    id: 'to_do',
    label: 'À faire',
    icon: ListTodo,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-surface-elevated',
  },
  {
    id: 'in_progress',
    label: 'En cours',
    icon: Clock,
    colorClass: 'text-info',
    bgClass: 'bg-info/10',
  },
  {
    id: 'blocked',
    label: 'Bloquant',
    icon: AlertTriangle,
    colorClass: 'text-danger',
    bgClass: 'bg-danger/10',
  },
  {
    id: 'done',
    label: 'Terminé',
    icon: CheckCircle2,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
  },
] as const satisfies readonly ColumnDef[]

function TaskCard({
  task,
  isLoading,
  onClick,
  onToggle,
}: {
  task: Task
  isLoading: boolean
  onClick?: (task: Task) => void
  onToggle: (task: Task) => void
}) {
  const isBlocked = task.status === 'blocked'
  const isDone = task.status === 'done'

  return (
    <div
      className={cn(
        'relative flex min-h-24 flex-col gap-2 rounded-[var(--radius-card)] border border-border bg-surface p-3 text-left shadow-sm transition-all',
        isLoading ? 'opacity-50' : 'hover:border-primary/30',
        isBlocked && 'border-danger/40 bg-danger/5',
        isDone && 'opacity-70',
      )}
    >
      <button
        type="button"
        onClick={() => onClick?.(task)}
        className="flex flex-1 cursor-pointer flex-col gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex items-start gap-2">
          <span
            className={cn(
              'min-w-0 flex-1 text-sm font-semibold leading-snug',
              isDone && 'line-through',
            )}
          >
            {task.title}
          </span>
          {task.priority === 'urgent' ? (
            <span className="shrink-0 rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Urgent
            </span>
          ) : null}
        </span>

        {task.description ? (
          <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {task.description}
          </span>
        ) : null}
      </button>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">Zone {task.zoneId?.slice(0, 4) || 'générale'}</span>
        </div>
        <button
          type="button"
          title={isDone ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
          aria-label={isDone ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
          disabled={isLoading}
          onClick={() => onToggle(task)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-primary disabled:pointer-events-none"
        >
          {isDone ? <RotateCcw className="size-4" /> : <CheckCircle2 className="size-4" />}
        </button>
      </div>
    </div>
  )
}

function QuickAdd({
  status,
  onTaskCreate,
}: {
  status: TaskStatus
  onTaskCreate?: (title: string, status: TaskStatus) => Promise<void>
}) {
  if (!onTaskCreate) return null

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const input = event.currentTarget.elements.namedItem('title') as HTMLInputElement
        const title = input.value.trim()
        if (!title) return
        input.value = ''
        await onTaskCreate(title, status)
      }}
    >
      <input
        name="title"
        type="text"
        placeholder="Ajouter une tâche…"
        className="min-h-11 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm font-medium placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </form>
  )
}

export function KanbanBoard({
  initialTasks,
  onStatusChange,
  onTaskClick,
  onTaskCreate,
  forceBoardView = false,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeStatus, setActiveStatus] = useState<TaskStatus>('to_check')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const handleToggle = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'to_do' : 'done'
    setLoadingId(task.id)
    try {
      await onStatusChange(task.id, newStatus)
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? { ...item, status: newStatus } : item)),
      )
    } finally {
      setLoadingId(null)
    }
  }

  const activeColumn = COLUMNS.find((column) => column.id === activeStatus) ?? COLUMNS[0]
  const activeTasks = tasks.filter((task) => task.status === activeColumn.id)
  const ActiveIcon = activeColumn.icon

  return (
    <div className="w-full">
      <div className={cn("flex flex-col gap-4", forceBoardView ? "hidden" : "md:hidden")}>
        <div
          role="tablist"
          aria-label="Statut des tâches"
          className="flex gap-1 overflow-x-auto rounded-[var(--radius-control)] border border-border bg-surface p-1"
        >
          {COLUMNS.map((column) => {
            const Icon = column.icon
            const count = tasks.filter((task) => task.status === column.id).length
            const isActive = activeStatus === column.id

            return (
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                key={column.id}
                onClick={() => setActiveStatus(column.id)}
                className={cn(
                  'flex min-h-10 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-4" />
                {column.label}
                <span className={cn('text-[10px]', isActive ? 'opacity-80' : 'opacity-60')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <section className="flex flex-col gap-3 px-4">
          <div className={cn('flex items-center gap-2', activeColumn.colorClass)}>
            <ActiveIcon className="size-4" />
            <h2 className="text-sm font-bold">{activeColumn.label}</h2>
            <span className="text-xs font-semibold opacity-70">{activeTasks.length}</span>
          </div>

          {activeTasks.length === 0 ? (
            <div className="flex min-h-24 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border text-sm text-muted-foreground">
              Aucune tâche dans ce statut
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isLoading={loadingId === task.id}
                  onClick={onTaskClick}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}

          <QuickAdd status={activeColumn.id} onTaskCreate={onTaskCreate} />
        </section>
      </div>

      <div className={cn("overflow-x-auto px-4 pb-8", forceBoardView ? "block" : "hidden md:block")}>
        <div className="grid min-w-[1120px] grid-cols-5 gap-3">
          {COLUMNS.map((column) => {
            const Icon = column.icon
            const columnTasks = tasks.filter((task) => task.status === column.id)

            return (
              <section key={column.id} className="flex min-w-0 flex-col gap-3">
                <div
                  className={cn(
                    'flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-border/60 px-3',
                    column.bgClass,
                    column.colorClass,
                  )}
                >
                  <Icon className="size-4" />
                  <h2 className="text-sm font-bold">{column.label}</h2>
                  <span className="ml-auto text-xs font-semibold">{columnTasks.length}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {columnTasks.length === 0 ? (
                    <div className="flex min-h-24 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border text-xs text-muted-foreground">
                      Vide
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isLoading={loadingId === task.id}
                        onClick={onTaskClick}
                        onToggle={handleToggle}
                      />
                    ))
                  )}
                  <QuickAdd status={column.id} onTaskCreate={onTaskCreate} />
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
