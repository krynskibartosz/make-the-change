import Link from 'next/link'

import { Badge, StatusChip } from '@/components/ui'
import type { InterventionListItem } from '@/lib/domain'

type InterventionCardProps = Readonly<{
  intervention: InterventionListItem
}>

export function InterventionCard({ intervention }: any) {
  const isToCheck = intervention.verificationStatus === 'to_check'

  return (
    <Link href={`/interventions/${intervention.id}`} className="block">
      <div className="flex flex-col gap-3 py-4 active:opacity-70 transition-opacity">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{intervention.title}</h3>
            <p className="truncate text-sm text-muted-foreground">{intervention.zoneName}</p>
          </div>
          {isToCheck ? (
            <Badge tone="warning">A verifier</Badge>
          ) : (
            <Badge tone="success">Complet</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {intervention.isExtra === true && <Badge tone="info">Supplement</Badge>}
          {intervention.isExtra === 'to_check' && (
            <Badge tone="warning">Supplement a confirmer</Badge>
          )}
          <StatusChip status={intervention.status} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{intervention.hours}h</span>
          <span className="font-medium text-foreground">{intervention.amount} €</span>
        </div>
      </div>
    </Link>
  )
}
