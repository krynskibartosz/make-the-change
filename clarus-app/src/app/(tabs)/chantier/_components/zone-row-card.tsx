import { AlertTriangle, ChevronRight, ClipboardList, Clock } from 'lucide-react'
import { Badge, Card } from '@/components/ui'

export type ZoneRowProps = {
  id: string
  name: string
  tasksCount: number
  interventionsCount: number
  isTechnical?: boolean
  technicalCode?: string | null
  planReference?: string | null
  isSensible?: boolean | null
}

export function ZoneRowCard({
  name,
  tasksCount,
  interventionsCount,
  isTechnical,
  technicalCode,
  planReference,
  isSensible,
}: ZoneRowProps) {
  // Determine dot color
  let dotColor = 'bg-success'
  if (tasksCount > 0 || interventionsCount > 0) dotColor = 'bg-warning'
  if (isSensible || tasksCount > 2) dotColor = 'bg-danger' // Just a heuristic for the red dot

  const hasActivity = tasksCount > 0 || interventionsCount > 0

  return (
    <Card className="group relative overflow-hidden flex flex-col p-4 bg-surface hover:bg-surface-elevated transition-colors mb-2 cursor-pointer border-border/50">
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-3">
          {/* Dot Status */}
          <div className="mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full">
            <span
              className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-[0_0_8px_rgba(var(--color-${dotColor.split('-')[1]}),0.5)]`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">
                {isTechnical && technicalCode ? `${technicalCode} — ` : ''}
                {name}
              </span>
              {isSensible && (
                <Badge tone="danger" className="h-5 px-1.5 text-[10px] uppercase gap-1">
                  <AlertTriangle className="size-3" />
                  Sensible
                </Badge>
              )}
            </div>

            {/* Activity Summary */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              {!hasActivity ? (
                <span>Aucune activité</span>
              ) : (
                <>
                  {tasksCount > 0 && (
                    <span className="flex items-center gap-1">
                      <ClipboardList className="size-3.5" />
                      {tasksCount} {tasksCount > 1 ? 'tâches' : 'tâche'}
                    </span>
                  )}
                  {interventionsCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {interventionsCount}{' '}
                      {interventionsCount > 1 ? 'interventions' : 'intervention'}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Tags / Plan Reference */}
            {isTechnical && planReference && (
              <div className="mt-2 flex">
                <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {technicalCode} · {planReference}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow */}
        <div className="flex items-center h-full text-muted-foreground/50 group-hover:text-foreground transition-colors">
          <ChevronRight className="size-5" />
        </div>
      </div>
    </Card>
  )
}
