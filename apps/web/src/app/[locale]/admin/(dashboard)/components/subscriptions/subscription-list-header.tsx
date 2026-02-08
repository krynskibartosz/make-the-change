'use client'
import { getInitials } from '@make-the-change/core/shared/utils'
import { Badge } from '@make-the-change/core/ui'
import { CreditCard } from 'lucide-react'
import type { FC } from 'react'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionListHeaderProps = {
  subscription: Subscription
}

export const SubscriptionListHeader: FC<SubscriptionListHeaderProps> = ({ subscription }) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'cancelled':
      case 'past_due':
      case 'unpaid':
        return 'red'
      case 'trialing':
        return 'blue'
      case 'paused':
      case 'incomplete':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  const displayName = subscription.users
    ? `${subscription.users.first_name || ''} ${subscription.users.last_name || ''}`.trim()
    : 'Utilisateur inconnu'

  if (subscription.users?.email && !displayName) {
    // Fallback to email if name is empty
    return (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
          {getInitials(subscription.users.email)}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="text-base font-medium text-foreground truncate">
            {subscription.users.email}
          </h3>

          <Badge color={getStatusColor(subscription.status)}>{subscription.status}</Badge>

          <CreditCard className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
        {getInitials(displayName)}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate">{displayName}</h3>

        <Badge color={getStatusColor(subscription.status)}>{subscription.status}</Badge>

        <CreditCard className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  )
}
