import Link from 'next/link'

import { Badge, Card, StatusChip } from '@/components/ui'
import type { InterventionListItem } from '@/lib/domain'

type InterventionCardProps = Readonly<{
  intervention: InterventionListItem
}>

export function InterventionCard({ intervention }: InterventionCardProps) {
  const isToCheck = intervention.verificationStatus === 'to_check'

  return (
    <Link href={`/interventions/${intervention.id}`} className="block">
      <Card className="flex flex-col gap-3 active:scale-[0.98] transition-transform">
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

        <div className="mt-1 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="font-medium text-foreground">{intervention.hours}h</span>
          <span className="font-medium text-foreground">{intervention.amount} €</span>
        </div>
      </Card>
    </Link>
  )
}
