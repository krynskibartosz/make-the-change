import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle2, Circle } from 'lucide-react'
import type { WeeklyPlan } from '@/lib/domain'

export function WeekView({ plan }: { plan: WeeklyPlan | null }) {
  if (!plan) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Aucun plan pour cette semaine.</p>
  }

  const completedGoals = plan.goals?.filter(g => g.status === 'completed').length || 0
  const totalGoals = plan.goals?.length || 0
  const progressPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header Sprint */}
      <section className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-lg font-bold">Semaine du {format(new Date(plan.weekStart), 'd MMM', { locale: fr })}</h2>
        <p className="text-sm font-medium text-foreground/80">{plan.mainObjective}</p>
        
        {/* Progress Ring / Bar */}
        <div className="mt-2 flex items-center gap-4">
          <div className="relative size-14 shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" 
                strokeDasharray="100" strokeDashoffset={100 - progressPercent} strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {completedGoals}/{totalGoals}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Objectifs atteints</p>
            <p className="text-xs text-muted-foreground">Encore {totalGoals - completedGoals} à terminer</p>
          </div>
        </div>
      </section>

      {/* Liste des objectifs */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Objectifs</h3>
        <div className="flex flex-col divide-y divide-border rounded-[var(--radius-card)] border bg-surface">
          {plan.goals?.map(goal => (
            <div key={goal.id} className="flex items-center gap-3 p-4">
              {goal.status === 'completed' ? (
                <CheckCircle2 className="size-5 text-green-500" />
              ) : (
                <Circle className="size-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${goal.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {goal.title}
                </p>
                {goal.progress > 0 && goal.status !== 'completed' && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
