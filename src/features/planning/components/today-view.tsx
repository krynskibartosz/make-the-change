'use client'

import { AlertTriangle, Camera, Circle, Clock, Euro, ListTodo, Package } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { InterventionListItem, Task, TodaySummary } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

function PriorityIcon({ priority }: { priority: Task['priority'] }) {
  if (priority === 'urgent') return <span className="text-red-500">🔴</span>
  if (priority === 'high') return <span className="text-yellow-500">🟡</span>
  return <Circle className="size-3 text-muted-foreground" />
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const labels: Record<Task['status'], string> = {
    to_do: 'À faire',
    in_progress: 'En cours',
    done: 'Terminé',
    to_check: 'À vérifier',
    blocked: 'Bloquant',
  }

  const colors: Record<Task['status'], string> = {
    to_do: 'bg-primary/10 text-primary',
    in_progress: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
    done: 'bg-success/15 text-success',
    to_check: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
    blocked: 'bg-red-500/15 text-red-700 dark:text-red-400',
  }

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors[status]}`}
    >
      {labels[status]}
    </span>
  )
}

export function TodayView({ summary }: { summary: TodaySummary }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [toCheckItems, setToCheckItems] = useState<InterventionListItem[]>([])

  useEffect(() => {
    mockClarusRepository.getTasks().then((allTasks) => {
      const pending = allTasks.filter((t) => t.status === 'to_do' || t.status === 'to_check')
      setTasks(pending)
    })

    // Simulate fetching items to verify
    mockClarusRepository.getInterventions().then((allInterventions) => {
      // In a real app we'd fetch actual AI review items or to_check items
      // We map Intervention to InterventionListItem for the UI
      const toCheck = allInterventions
        .filter((i) => i.status === 'to_check')
        .map((i) => ({
          id: i.id,
          title: i.title,
          date: i.date,
          type: i.type,
          status: i.status,
          verificationStatus: 'to_check' as const,
          isExtra: i.isExtra,
          zoneName: 'Zone inconnue',
          phaseName: 'Phase inconnue',
          hours: 0,
          amount: 0,
          updatedAt: i.updatedAt || new Date().toISOString(),
        }))
      setToCheckItems(toCheck)
    })
  }, [])

  const topTasks = tasks.slice(0, 4)
  const { interventionCount, hours, estimatedAmount } = summary.metrics

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 0. À vérifier maintenant */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-yellow-500" />
          <h2 className="text-sm font-bold text-foreground">À vérifier maintenant</h2>
          {toCheckItems.length > 0 && (
            <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {toCheckItems.length}
            </span>
          )}
        </div>

        {toCheckItems.length === 0 ? (
          <p className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-5 text-center text-sm text-muted-foreground">
            Rien à vérifier pour le moment.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {toCheckItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[var(--radius-card)] border border-yellow-500/30 bg-yellow-500/10 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Note terrain ou IA à valider
                  </p>
                </div>
                <Link
                  href="/a-verifier"
                  className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary border border-border"
                >
                  Voir
                </Link>
              </div>
            ))}
            {toCheckItems.length > 2 && (
              <Link
                href="/a-verifier"
                className="text-center text-xs font-semibold text-primary pt-1"
              >
                Voir les {toCheckItems.length} éléments à vérifier
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 1. À faire aujourd'hui */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ListTodo className="size-4 text-foreground" />
          <h2 className="text-sm font-bold text-foreground">À faire</h2>
        </div>

        {topTasks.length === 0 ? (
          <p className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-5 text-center text-sm text-muted-foreground">
            Aucune tâche en attente — bonne journée !
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-[var(--radius-card)] border border-border bg-surface">
            {topTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                <PriorityIcon priority={task.priority} />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {task.title}
                </p>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Déjà encodé */}
      <section className="flex items-center justify-around rounded-xl bg-surface p-3 gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-foreground">{interventionCount}</span>
          <span className="text-xs text-muted-foreground">travail(s)</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-foreground">{hours.toFixed(1)}h</span>
          <span className="text-xs text-muted-foreground">heures</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {estimatedAmount.toFixed(0)}€
          </span>
          <span className="text-xs text-muted-foreground">Coût encodé du jour</span>
        </div>
      </section>

      {/* 3. Points bloquants */}
      {summary.alerts.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-500" />
            <h2 className="text-sm font-bold text-foreground">Points bloquants</h2>
          </div>
          {summary.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-3 text-sm ${
                alert.severity === 'warning'
                  ? 'border-yellow-500/30 bg-yellow-500/8 text-yellow-700 dark:text-yellow-400'
                  : 'border-primary/30 bg-primary/8 text-primary'
              }`}
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="opacity-80">{alert.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 4. Actions rapides */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-foreground">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/photos/ajouter"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-surface text-sm font-semibold text-foreground active:bg-surface-elevated transition-colors"
          >
            <Camera className="size-5 text-primary" />
            Photo
          </Link>
          <Link
            href="/ajouter-materiau"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-surface text-sm font-semibold text-foreground active:bg-surface-elevated transition-colors"
          >
            <Package className="size-5 text-primary" />
            Matériau
          </Link>
          <Link
            href="/ajouter-depense"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-surface text-sm font-semibold text-foreground active:bg-surface-elevated transition-colors"
          >
            <Euro className="size-5 text-primary" />
            Dépense
          </Link>
          <Link
            href="/ajouter-tache?priority=urgent"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-surface text-sm font-semibold text-foreground active:bg-surface-elevated transition-colors"
          >
            <AlertTriangle className="size-5 text-red-500" />
            Signaler
          </Link>
        </div>
      </section>

      {/* 5. Dernière activité */}
      {summary.latestInterventions.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Dernière activité</h2>
            <Link href="/historique" className="text-xs font-medium text-primary">
              Tout voir
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {summary.latestInterventions.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/interventions/${item.id}`}
                className="flex items-center justify-between gap-3 py-3 active:scale-[0.98] transition-transform duration-200"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.zoneName} · {item.phaseName}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {item.hours.toFixed(1)}h
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {summary.latestInterventions.length === 0 && (
        <p className="rounded-[var(--radius-card)] border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Aucun travail enregistré aujourd'hui.
          <br />
          <span className="mt-2 block text-xs">
            Ajoute un travail réalisé ou valide une note terrain.
          </span>
        </p>
      )}
    </div>
  )
}
