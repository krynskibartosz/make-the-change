import { Badge } from '@make-the-change/core/ui'
import type { FC } from 'react'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionStatusBadgeProps = {
  status: Subscription['status']
}

export const SubscriptionStatusBadge: FC<SubscriptionStatusBadgeProps> = ({ status }) => {
  const variants = {
    active: { color: 'green' as const, label: 'Actif' },
    inactive: { color: 'gray' as const, label: 'Inactif' },
    cancelled: { color: 'red' as const, label: 'Annulé' },
    past_due: { color: 'red' as const, label: 'En retard' },
    unpaid: { color: 'red' as const, label: 'Impayé' },
    trialing: { color: 'blue' as const, label: 'Essai' },
    expired: { color: 'gray' as const, label: 'Expiré' },
    incomplete: { color: 'yellow' as const, label: 'Incomplet' },
    paused: { color: 'yellow' as const, label: 'Suspendu' },
  }

  const config = (status ? variants[status] : null) ?? variants.inactive

  return <Badge color={config.color}>{config.label}</Badge>
}
