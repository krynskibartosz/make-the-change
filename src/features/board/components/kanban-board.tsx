'use client'

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  Inbox,
  ListTodo,
  MapPin,
} from 'lucide-react'
import { useState } from 'react'
import type { Task, TaskStatus } from '@/lib/domain'
import { cn } from '@/lib/utils/cn'

type KanbanBoardProps = {
  initialTasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>
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

export function KanbanBoard({ initialTasks, onStatusChange }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setLoadingId(taskId)
    try {
      await onStatusChange(taskId, newStatus)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    } finally {
      setLoadingId(null)
    }
  }

  // Quick next status logic for simple mobile interaction
  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'to_check':
        return 'to_do'
      case 'to_do':
        return 'in_progress'
      case 'in_progress':
        return 'done'
      default:
        return null
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
                  const nextStatus = getNextStatus(task.status)

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'relative bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm transition-all',
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

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border/50">
                        {/* Dropdown-like statuts for mobile prototype */}
                        <select
                          className="flex-1 bg-surface-elevated text-xs font-medium border-none rounded-lg p-2 focus:ring-0 appearance-none"
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value as TaskStatus)
                          }
                          disabled={loadingId === task.id}
                        >
                          <option value="to_check">Inbox</option>
                          <option value="to_do">À faire</option>
                          <option value="in_progress">En cours</option>
                          <option value="blocked">Bloquant</option>
                          <option value="done">Terminé</option>
                        </select>

                        {nextStatus && (
                          <button
                            onClick={() => handleStatusChange(task.id, nextStatus)}
                            disabled={loadingId === task.id}
                            className="bg-primary/10 text-primary hover:bg-primary/20 p-2 rounded-lg transition-colors"
                            aria-label="Avancer"
                          >
                            <ChevronRight className="size-4" />
                          </button>
                        )}
                        {!isBlocked && task.status !== 'done' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'blocked')}
                            disabled={loadingId === task.id}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                            aria-label="Signaler un blocage"
                          >
                            <AlertTriangle className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
