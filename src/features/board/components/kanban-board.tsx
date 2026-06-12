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
import { useEffect, useRef, useState } from 'react'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const handleTabClick = (status: TaskStatus) => {
    setActiveStatus(status)
    const element = document.getElementById(`board-col-${status}`)
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const offset = element.offsetLeft - container.offsetLeft
      const isMobile = window.innerWidth < 768
      const scrollLeft = isMobile ? offset - (container.clientWidth - element.clientWidth) / 2 : offset
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollCenter = container.scrollLeft + container.clientWidth / 2

    let closestStatus = activeStatus
    let minDistance = Infinity

    COLUMNS.forEach((column) => {
      const el = document.getElementById(`board-col-${column.id}`)
      if (el) {
        const elCenter = el.offsetLeft - container.offsetLeft + el.clientWidth / 2
        const distance = Math.abs(scrollCenter - elCenter)
        if (distance < minDistance) {
          minDistance = distance
          closestStatus = column.id
        }
      }
    })

    if (closestStatus !== activeStatus) {
      setActiveStatus(closestStatus)
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Tablist pour la navigation rapide */}
      <div className={cn("px-4 pb-4 shrink-0", forceBoardView ? "hidden" : "block")}>
        <div
          role="tablist"
          aria-label="Statut des tâches"
          className="flex gap-1 overflow-x-auto rounded-[var(--radius-control)] border border-border bg-surface/50 backdrop-blur-md p-1 hide-scrollbar"
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
                onClick={() => handleTabClick(column.id)}
                className={cn(
                  'flex min-h-10 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface-elevated',
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
      </div>

      {/* Swipeable Columns Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar px-4 pb-8 flex gap-4 md:gap-6 items-stretch"
      >
        {COLUMNS.map((column) => {
          const Icon = column.icon
          const columnTasks = tasks.filter((task) => task.status === column.id)

          return (
            <section 
              id={`board-col-${column.id}`}
              key={column.id} 
              className={cn(
                "flex flex-col gap-3 h-full overflow-y-auto hide-scrollbar pb-8 shrink-0 snap-center md:snap-start",
                forceBoardView ? "w-[320px]" : "w-[85vw] md:w-[320px]"
              )}
            >
              <div
                className={cn(
                  'sticky top-0 z-10 flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-border/40 backdrop-blur-md px-3 shadow-sm',
                  column.bgClass,
                  column.colorClass,
                )}
              >
                <Icon className="size-4" />
                <h2 className="text-sm font-bold">{column.label}</h2>
                <span className="ml-auto text-xs font-semibold bg-background/50 px-1.5 py-0.5 rounded-sm">{columnTasks.length}</span>
              </div>

              <div className="flex flex-col gap-2">
                {columnTasks.length === 0 ? (
                  <div className="flex min-h-24 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border/50 bg-surface/30 text-xs text-muted-foreground">
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
  )
}
