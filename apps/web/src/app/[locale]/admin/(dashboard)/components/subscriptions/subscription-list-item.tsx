'use client'

import type { FC, ReactNode } from 'react'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import type { Subscription } from '@/lib/types/subscription'
import { SubscriptionListHeader } from './subscription-list-header'
import { SubscriptionListMetadata } from './subscription-list-metadata'

type SubscriptionListItemProps = {
  subscription: Subscription
  actions?: ReactNode
}

export const SubscriptionListItem: FC<SubscriptionListItemProps> = ({ subscription, actions }) => (
  <AdminListItem
    actions={actions}
    header={<SubscriptionListHeader subscription={subscription} />}
    href={`/admin/subscriptions/${subscription.id}`}
    metadata={<SubscriptionListMetadata subscription={subscription} />}
  />
)
