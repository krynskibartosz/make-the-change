import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card } from './card'

type MetricCardProps = Readonly<{
  helper?: ReactNode
  icon?: LucideIcon
  label: ReactNode
  value: ReactNode
}>

export function MetricCard({ helper, icon: Icon, label, value }: MetricCardProps) {
  return (
    <Card className="flex min-h-28 flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
        {Icon ? <Icon aria-hidden="true" className="size-5 text-primary" /> : null}
      </div>
      <div>
        <p className="font-mono text-3xl font-semibold leading-none text-foreground">{value}</p>
        {helper ? <p className="mt-2 text-sm leading-5 text-muted-foreground">{helper}</p> : null}
      </div>
    </Card>
  )
}
