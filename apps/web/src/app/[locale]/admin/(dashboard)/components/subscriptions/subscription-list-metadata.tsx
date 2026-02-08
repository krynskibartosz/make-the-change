'use client'
import { Calendar, Euro, Settings, User } from 'lucide-react'
import type { FC } from 'react'

import type { Subscription } from '@/lib/types/subscription'

type SubscriptionListMetadataProps = {
  subscription: Subscription
}

export const SubscriptionListMetadata: FC<SubscriptionListMetadataProps> = ({ subscription }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <User className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="text-sm">{subscription.users?.email}</span>
      </div>

      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Settings className="w-4 h-4 text-blue-500/70 md:group-hover:text-blue-500 group-active:text-blue-500 transition-colors duration-200" />
        <span className="text-sm">{subscription.plan_type}</span>
      </div>
    </div>

    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Euro className="w-4 h-4 text-green-500/70 md:group-hover:text-green-500 group-active:text-green-500 transition-colors duration-200" />
        <span className="text-sm">
          €
          {subscription.billing_frequency === 'monthly'
            ? (subscription.monthly_price ?? 0)
            : (subscription.annual_price ?? 0)}{' '}
          / {subscription.billing_frequency === 'monthly' ? 'mois' : 'an'}
        </span>
      </div>

      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Calendar className="w-4 h-4 text-purple-500/70 md:group-hover:text-purple-500 group-active:text-purple-500 transition-colors duration-200" />
        <span className="text-sm">
          Début:{' '}
          {subscription.current_period_start
            ? new Date(subscription.current_period_start).toLocaleDateString('fr-FR')
            : '—'}
        </span>
      </div>
    </div>
  </div>
)
