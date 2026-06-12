import { AlertTriangle, CheckCircle2, Clock, Edit2, ListFilter, ListTodo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BottomSheet } from '@/components/ui'
import type { Task, TaskStatus } from '@/lib/domain'
import { cn } from '@/lib/utils/cn'

type TaskStatusSheetProps = {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
}

const STATUS_OPTIONS = [
  {
    id: 'to_check',
    label: 'À trier',
    icon: ListFilter,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  { id: 'to_do', label: 'À faire', icon: ListTodo, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  {
    id: 'in_progress',
    label: 'En cours',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'blocked',
    label: 'Bloquant',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    id: 'done',
    label: 'Terminé',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
]

export function TaskStatusSheet({ task, isOpen, onClose, onStatusChange }: TaskStatusSheetProps) {
  const router = useRouter()

  if (!task) return null

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Changer le statut">
      <div className="flex flex-col gap-6 pt-2 pb-6">
        <div>
          <h3 className="text-lg font-bold leading-tight">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Nouveau statut
          </p>
          <div className="grid grid-cols-1 gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const isActive = task.status === opt.id
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    if (!isActive) {
                      onStatusChange(task.id, opt.id as TaskStatus)
                    }
                    onClose()
                  }}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98]',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-surface hover:bg-surface-elevated',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full',
                      opt.bg,
                    )}
                  >
                    <Icon className={cn('size-5', opt.color)} />
                  </div>
                  <span
                    className={cn(
                      'font-bold text-base',
                      isActive ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {opt.label}
                  </span>
                  {isActive && <CheckCircle2 className="size-5 ml-auto text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-border">
          <button
            type="button"
            onClick={() => {
              onClose()
              router.push(`/taches/${task.id}/editer`)
            }}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition-all font-bold text-base active:scale-[0.98]"
          >
            <Edit2 className="size-5 text-muted-foreground" />
            Modifier la tâche
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
