'use client'

import { AlertTriangle, CheckCircle2, Clock, Inbox, ListTodo, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { Task, TaskStatus } from '@/lib/domain'
import { cn } from '@/lib/utils/cn'

type KanbanBoardProps = {
  initialTasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>
  onTaskClick?: (task: Task) => void
  onTaskCreate?: (title: string, status: TaskStatus) => Promise<void>
}

type ColumnDef = {
  id: TaskStatus
  label: string
  icon: React.ReactNode
  colorClass: string
  bgClass: string
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'to_check',
    label: 'Inbox',
    icon: <Inbox className="size-4" />,
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10',
  },
  {
    id: 'to_do',
    label: 'À faire',
    icon: <ListTodo className="size-4" />,
    colorClass: 'text-slate-500',
    bgClass: 'bg-slate-500/10',
  },
  {
    id: 'in_progress',
    label: 'En cours',
    icon: <Clock className="size-4" />,
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
  },
  {
    id: 'blocked',
    label: 'Bloquant',
    icon: <AlertTriangle className="size-4" />,
    colorClass: 'text-red-500',
    bgClass: 'bg-red-500/10',
  },
  {
    id: 'done',
    label: 'Terminé',
    icon: <CheckCircle2 className="size-4" />,
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10',
  },
]

export function KanbanBoard({
  initialTasks,
  onStatusChange,
  onTaskClick,
  onTaskCreate,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const _handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setLoadingId(taskId)
    try {
      await onStatusChange(taskId, newStatus)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory pb-8 pt-2 hide-scrollbar">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id)

        return (
          <div
            key={col.id}
            className="flex-none w-[85vw] max-w-[320px] snap-center shrink-0 px-3 flex flex-col gap-4 h-full"
          >
            {/* Column Header */}
            <div
              className={cn(
                'flex items-center gap-2 p-3 rounded-xl border border-border/50',
                col.bgClass,
              )}
            >
              <span className={cn(col.colorClass)}>{col.icon}</span>
              <h2 className={cn('font-bold text-sm tracking-wide', col.colorClass)}>{col.label}</h2>
              <div className="ml-auto bg-background/50 text-xs font-semibold px-2 py-0.5 rounded-full">
                {columnTasks.length}
              </div>
            </div>

            {/* Column Cards */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-24 no-scrollbar">
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-xl text-muted-foreground/50 text-sm font-medium">
                  Vide
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isBlocked = task.status === 'blocked'
                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={cn(
                        'relative bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm transition-all cursor-pointer active:scale-[0.98]',
                        loadingId === task.id ? 'opacity-50 scale-95' : 'hover:border-border/80',
                        isBlocked && 'border-red-500/30 bg-red-500/5',
                      )}
                    >
                      {/* Priority Tag */}
                      {task.priority === 'urgent' && (
                        <div className="absolute top-0 right-4 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">
                          Urgent
                        </div>
                      )}

                      <h3 className="font-semibold text-sm pr-4 leading-tight">{task.title}</h3>

                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="size-3.5" />
                          <span>Zone {task.zoneId?.slice(0, 4) || 'Générale'}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              {/* Quick Add Input */}
              {onTaskCreate && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const input = e.currentTarget.elements.namedItem('title') as HTMLInputElement
                    if (input.value.trim()) {
                      const val = input.value.trim()
                      input.value = ''
                      await onTaskCreate(val, col.id)
                    }
                  }}
                  className="mt-1"
                >
                  <input
                    name="title"
                    type="text"
                    placeholder="Nouvelle tâche..."
                    className="w-full bg-surface/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </form>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
