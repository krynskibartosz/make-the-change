'use client'

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Circle,
  Clock,
  ClipboardList,
  Loader2,
  PlusCircle,
} from 'lucide-react'
import { useState } from 'react'
import type { Intervention, Task, Zone } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

type ZoneWithStats = Zone & {
  urgentTaskCount: number
  openTaskCount: number
  interventionCount: number
}

const STATUS_LABEL: Record<string, string> = {
  to_do: 'À faire',
  in_progress: 'En cours',
  blocked: 'Bloqué',
  done: 'Fait',
  to_check: 'À vérifier',
}

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  normal: 'text-muted-foreground bg-surface-elevated border-border/40',
  low: 'text-muted-foreground/60 bg-surface-elevated border-border/30',
}

const INTERVENTION_STATUS_COLOR: Record<string, string> = {
  done: 'bg-emerald-500/20 text-emerald-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  to_check: 'bg-amber-500/20 text-amber-400',
  draft: 'bg-muted text-muted-foreground',
  blocked: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-muted text-muted-foreground/50',
}

const INTERVENTION_STATUS_LABEL: Record<string, string> = {
  done: 'Terminé',
  in_progress: 'En cours',
  to_check: 'À vérifier',
  draft: 'Brouillon',
  blocked: 'Bloqué',
  cancelled: 'Annulé',
}

function TaskItem({
  task,
  onToggle,
}: {
  task: Task
  onToggle: () => void
}) {
  const [loading, setLoading] = useState(false)
  const isDone = task.status === 'done'

  async function handleToggle() {
    setLoading(true)
    try {
      await mockClarusRepository.updateTaskStatus(
        task.id,
        isDone ? 'to_do' : 'done',
      )
      onToggle()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`flex items-start gap-3 py-3 px-4 ${isDone ? 'opacity-50' : ''}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="mt-0.5 shrink-0 transition-transform active:scale-90"
        aria-label={isDone ? 'Marquer à faire' : 'Marquer fait'}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        ) : isDone ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/40" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}
        >
          {task.title}
        </p>
        {task.description && !isDone && (
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          {task.priority && task.priority !== 'normal' && (
            <span
              className={`inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${PRIORITY_COLOR[task.priority] ?? ''}`}
            >
              {task.priority === 'urgent'
                ? '🔴 Urgent'
                : task.priority === 'high'
                  ? '🟡 Élevé'
                  : task.priority}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/50">
            {STATUS_LABEL[task.status] ?? task.status}
          </span>
        </div>
      </div>
    </div>
  )
}

function InterventionItem({ intervention }: { intervention: Intervention }) {
  const statusColor =
    INTERVENTION_STATUS_COLOR[intervention.status] ?? 'bg-muted text-muted-foreground'
  const statusLabel =
    INTERVENTION_STATUS_LABEL[intervention.status] ?? intervention.status

  return (
    <div className="flex items-start gap-3 py-3 px-4">
      <div className="mt-0.5 shrink-0">
        <Clock className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground leading-snug">
          {intervention.title}
        </p>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground">
            {intervention.date}
          </span>
          <span
            className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>
          {intervention.isExtra === true && (
            <span className="inline-block rounded-full bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400">
              Supplément
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ZoneDetailClient({
  zone,
  tasks,
  interventions,
  onTaskUpdated,
}: {
  zone: ZoneWithStats
  tasks: Task[]
  interventions: Intervention[]
  onTaskUpdated: () => void
}) {
  const openTasks = tasks.filter((t) => t.status !== 'done')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  return (
    <div className="flex flex-col pb-16">
      {/* Zone header info */}
      <div className="px-5 pt-4 pb-5">
        {zone.isSensitive && (
          <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-300">
                Zone sensible
              </p>
              <p className="text-[11px] text-red-400/70 mt-0.5 leading-snug">
                Photo preuve obligatoire · Validation requise avant fermeture
              </p>
            </div>
          </div>
        )}

        {zone.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {zone.description}
          </p>
        )}

        {zone.technicalCode && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 font-mono text-xs text-blue-400">
              {zone.technicalCode}
            </span>
            {zone.planReference && (
              <span className="inline-flex items-center rounded-lg bg-surface-elevated border border-border/40 px-3 py-1.5 text-xs text-muted-foreground">
                {zone.planReference}
              </span>
            )}
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface border border-border/50 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                Tâches
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {openTasks.length}
            </p>
            <p className="text-[11px] text-muted-foreground/60">
              {doneTasks.length} terminée{doneTasks.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="rounded-xl bg-surface border border-border/50 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                Interventions
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {interventions.length}
            </p>
            <p className="text-[11px] text-muted-foreground/60">
              enregistrée{interventions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks section */}
      {tasks.length > 0 && (
        <section className="mt-1">
          <h3 className="ml-5 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Tâches
          </h3>
          <div className="mx-4 overflow-hidden rounded-xl bg-surface border border-border/50">
            {openTasks.map((task, idx) => (
              <div key={task.id}>
                <TaskItem task={task} onToggle={onTaskUpdated} />
                {idx < openTasks.length - 1 && (
                  <div className="ml-[3.25rem] border-b border-border/40" />
                )}
              </div>
            ))}
            {doneTasks.length > 0 && openTasks.length > 0 && (
              <div className="ml-[3.25rem] border-b border-border/40" />
            )}
            {doneTasks.map((task, idx) => (
              <div key={task.id}>
                <TaskItem task={task} onToggle={onTaskUpdated} />
                {idx < doneTasks.length - 1 && (
                  <div className="ml-[3.25rem] border-b border-border/40" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {tasks.length === 0 && (
        <div className="mx-4 rounded-xl bg-surface border border-border/50 px-4 py-5 flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-muted-foreground/30 shrink-0" />
          <p className="text-sm text-muted-foreground/50">
            Aucune tâche pour cette zone
          </p>
        </div>
      )}

      {/* Interventions section */}
      {interventions.length > 0 && (
        <section className="mt-5">
          <h3 className="ml-5 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Interventions
          </h3>
          <div className="mx-4 overflow-hidden rounded-xl bg-surface border border-border/50">
            {interventions.map((intervention, idx) => (
              <div key={intervention.id}>
                <InterventionItem intervention={intervention} />
                {idx < interventions.length - 1 && (
                  <div className="ml-[2.75rem] border-b border-border/40" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section className="mt-5 px-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-surface border border-border/50 px-4 py-3 text-sm font-medium text-foreground transition-colors active:bg-surface-elevated"
          >
            <PlusCircle className="h-4 w-4 text-primary shrink-0" />
            Ajouter tâche
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-surface border border-border/50 px-4 py-3 text-sm font-medium text-foreground transition-colors active:bg-surface-elevated"
          >
            <Camera className="h-4 w-4 text-primary shrink-0" />
            Prendre photo
          </button>
        </div>
      </section>
    </div>
  )
}
