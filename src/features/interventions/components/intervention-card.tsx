import Link from 'next/link'

import { Badge, StatusChip } from '@/components/ui'
import type { InterventionListItem } from '@/lib/domain'

type InterventionCardProps = Readonly<{
  intervention: InterventionListItem
}>

export function InterventionCard({ intervention }: InterventionCardProps) {
  const isBlocked = intervention.status === 'blocked'
  const isToCheck = intervention.verificationStatus === 'to_check'
  
  const cardStyle = isBlocked
    ? 'border-l-[3px] border-l-red-500 bg-red-500/5'
    : isToCheck
      ? 'border-l-[3px] border-l-yellow-500 bg-yellow-500/5'
      : 'border-l-[3px] border-l-transparent hover:bg-surface-elevated'

  return (
    <Link href={`/interventions/${intervention.id}`} className="block">
      <div className={`flex flex-col gap-3 py-4 px-3 active:opacity-70 transition-colors ${cardStyle} border-b border-border`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{intervention.title}</h3>
            <p className="truncate text-sm text-muted-foreground">{intervention.zoneName}</p>
          </div>
          {isBlocked ? (
            <Badge tone="danger">Bloquant</Badge>
          ) : isToCheck ? (
            <Badge tone="warning">Action requise</Badge>
          ) : (
            <Badge tone="success">Terminé</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral" className="text-[10px] uppercase">{intervention.type.replace('_', ' ')}</Badge>
          {intervention.isExtra === true && <Badge tone="info">Supplement</Badge>}
          {intervention.isExtra === 'to_check' && (
            <Badge tone="warning">Supplement a confirmer</Badge>
          )}
          {!isBlocked && !isToCheck && <StatusChip status={intervention.status} />}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{intervention.hours}h</span>
          <span className="font-medium text-foreground">{intervention.amount} €</span>
        </div>
      </div>
    </Link>
  )
}
