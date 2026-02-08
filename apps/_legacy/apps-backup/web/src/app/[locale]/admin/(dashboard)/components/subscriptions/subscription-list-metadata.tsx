'use client';
import { User, Settings, Euro, Calendar } from 'lucide-react';
import { type FC } from 'react';

import type { Subscription } from '@/lib/types/subscription';

type SubscriptionListMetadataProps = {
  subscription: Subscription;
};

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Non défini';

const formatTierLabel = (tier?: Subscription['subscription_tier']) => {
  switch (tier) {
    case 'ambassadeur_premium':
      return 'Ambassadeur Premium';
    case 'ambassadeur_standard':
      return 'Ambassadeur Standard';
    default:
      return 'Niveau inconnu';
  }
};

const formatFrequencyLabel = (frequency?: Subscription['billing_frequency']) =>
  frequency === 'annual' ? 'Annuel' : 'Mensuel';

export const SubscriptionListMetadata: FC<SubscriptionListMetadataProps> = ({
  subscription,
}) => (
  <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <User className="text-primary/70 md:group-hover:text-primary group-active:text-primary h-4 w-4 transition-colors duration-200" />
        <span>{subscription.users?.email ?? 'Email inconnu'}</span>
      </div>
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Settings className="h-4 w-4 text-blue-500/70 transition-colors duration-200 group-active:text-blue-500 md:group-hover:text-blue-500" />
        <span>{formatTierLabel(subscription.subscription_tier)}</span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Euro className="h-4 w-4 text-emerald-500/70 transition-colors duration-200 group-active:text-emerald-500 md:group-hover:text-emerald-500" />
        <span>
          {formatCurrency(subscription.amount_eur)} • {formatFrequencyLabel(subscription.billing_frequency)}
        </span>
      </div>
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Calendar className="h-4 w-4 text-purple-500/70 transition-colors duration-200 group-active:text-purple-500 md:group-hover:text-purple-500" />
        <span>Prochaine échéance : {formatDate(subscription.next_billing_date)}</span>
      </div>
    </div>
  </div>
);
