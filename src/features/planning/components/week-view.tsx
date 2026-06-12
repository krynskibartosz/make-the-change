import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, CheckCircle2, Circle, Loader2, Target, XCircle } from 'lucide-react'
import type { WeeklyPlan } from '@/lib/domain'

function GoalStatusBadge({ status }: { status: string }) {
  if (status === 'completed') {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
        <CheckCircle2 className="size-3" />
        Terminé
      </span>
    )
  }
  if (status === 'in_progress') {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
        <Loader2 className="size-3 animate-spin" />
        En cours
      </span>
    )
  }
  if (status === 'blocked') {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
        <XCircle className="size-3" />
        Bloqué
      </span>
    )
  }
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
      <Circle className="size-3" />
      Pas commencé
    </span>
  )
}

export function WeekView({ plan }: { plan: WeeklyPlan | null }) {
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-2 border border-dashed border-border rounded-[var(--radius-card)] mt-4">
        <Target className="size-8 text-muted-foreground opacity-50" />
        <p className="font-semibold text-foreground">Aucun objectif défini</p>
        <p className="text-sm text-muted-foreground">
          Crée une priorité de semaine pour suivre l'avancement.
        </p>
      </div>
    )
  }

  const completedGoals = plan.goals?.filter((g) => g.status === 'completed').length || 0
  const totalGoals = plan.goals?.length || 0
  const progressPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Priorité de la semaine */}
      <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-primary">
          <Target className="size-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Priorité de la semaine</span>
        </div>
        <p className="text-base font-bold text-foreground">{plan.mainObjective}</p>
      </section>

      {/* Header Sprint */}
      <section className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-lg font-bold">
          Semaine du {format(new Date(plan.weekStart), 'd MMM', { locale: fr })}
        </h2>

        {/* Progress Ring / Bar */}
        <div className="mt-2 flex items-center gap-4">
          <div className="relative size-14 shrink-0">
            <svg
              className="size-full -rotate-90"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-primary"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - progressPercent}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {completedGoals}/{totalGoals}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Objectifs atteints</p>
            <p className="text-xs text-muted-foreground">
              Encore {totalGoals - completedGoals} à terminer
            </p>
            <div className="mt-2 text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded w-fit">
              Rythme : léger retard
            </div>
          </div>
        </div>
      </section>

      {/* À surveiller cette semaine */}
      <section className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <AlertTriangle className="size-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            À surveiller cette semaine
          </span>
        </div>
        <ul className="list-disc list-inside text-sm font-medium text-foreground space-y-1">
          <li>Conteneur presque plein</li>
          <li>P1.7 en attente de validation</li>
          <li>Évacuation gravats pas commencée</li>
        </ul>
      </section>

      {/* Liste des objectifs */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Objectifs</h3>
        <div className="flex flex-col divide-y divide-border rounded-[var(--radius-card)] border bg-surface">
          {plan.goals?.map((goal) => (
            <div key={goal.id} className="flex items-center gap-3 p-4">
              {goal.status === 'completed' ? (
                <CheckCircle2 className="size-5 shrink-0 text-green-500" />
              ) : goal.status === 'blocked' ? (
                <XCircle className="size-5 shrink-0 text-red-500" />
              ) : goal.status === 'in_progress' ? (
                <Loader2 className="size-5 shrink-0 animate-spin text-blue-500" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${goal.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                >
                  {goal.title}
                </p>
                {goal.progress > 0 && goal.status !== 'completed' && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                  </div>
                )}
              </div>
              <GoalStatusBadge status={goal.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
