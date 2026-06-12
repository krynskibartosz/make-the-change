import { AlertTriangle, ChevronRight, ClipboardList, Clock } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { getZoneStatus } from './zone-status'

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
  const status = getZoneStatus({ tasksCount, interventionsCount, isSensible })
  const hasActivity = tasksCount > 0 || interventionsCount > 0

  return (
    <Card className="group relative mb-3 flex cursor-pointer flex-col overflow-hidden border-border/50 bg-surface p-4 transition-colors hover:bg-surface-elevated">
      <div className="flex items-start justify-between w-full">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-foreground">
                {isTechnical && technicalCode ? `${technicalCode} — ` : ''}
                {name}
              </span>
              <Badge tone={status.tone} className="min-h-6 gap-1.5 px-2">
                <span className={`size-2 rounded-full ${status.dotClass}`} aria-hidden="true" />
                {status.label}
              </Badge>
              {isSensible && (
                <Badge tone="danger" className="h-6 px-2 text-xs uppercase gap-1">
                  <AlertTriangle className="size-3.5" />
                  Sensible
                </Badge>
              )}
            </div>

            {/* Activity Summary */}
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mt-0.5">
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
        <div className="ml-2 flex items-center self-center text-muted-foreground/50 transition-colors group-hover:text-foreground">
          <ChevronRight className="size-5" />
        </div>
      </div>
    </Card>
  )
}
