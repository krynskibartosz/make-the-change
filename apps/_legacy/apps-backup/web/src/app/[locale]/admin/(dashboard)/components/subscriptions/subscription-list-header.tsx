'use client';
import { CreditCard, Calendar, DollarSign } from 'lucide-react';
import { type FC } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { getInitials } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';
import type { Subscription } from '@/lib/types/subscription';

type SubscriptionListHeaderProps = {
  subscription: Subscription;
};

export const SubscriptionListHeader: FC<SubscriptionListHeaderProps> = ({
  subscription,
}) => {
  const displayName = subscription.users?.user_profiles
    ? `${subscription.users.user_profiles.first_name} ${subscription.users.user_profiles.last_name}`
    : subscription.users?.email || 'Utilisateur inconnu';

  const statusLabels: Record<Subscription['status'], string> = {
    active: 'Actif',
    paused: 'En pause',
    cancelled: 'Annulé',
    expired: 'Expiré',
  };

  const statusVariants: Record<Subscription['status'], 'success' | 'warning' | 'destructive' | 'secondary'> = {
    active: 'success',
    paused: 'warning',
    cancelled: 'destructive',
    expired: 'secondary',
  };

  const formatCurrency = (value?: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value ?? 0);

  const nextBilling = subscription.next_billing_date
    ? new Date(subscription.next_billing_date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Non défini';

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8">
        {getInitials(displayName)}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
        <h3 className="text-foreground truncate text-base font-medium">
          {displayName}
        </h3>

        <Badge variant={statusVariants[subscription.status] ?? 'secondary'}>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            {statusLabels[subscription.status]}
          </span>
        </Badge>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <CreditCard className="h-3 w-3" />
          <span>{subscription.subscription_tier === 'ambassadeur_premium' ? 'Premium' : 'Standard'}</span>
        </div>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <DollarSign className="h-3 w-3" />
          <span>{formatCurrency(subscription.amount_eur)}</span>
        </div>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <Calendar className="h-3 w-3" />
          <span>{nextBilling}</span>
        </div>
      </div>
    </div>
  );
};
