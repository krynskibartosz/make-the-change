'use client';

import { Coins, Leaf, User as UserIcon } from 'lucide-react';
import { type FC } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import {
  formatCurrency,
  formatDate,
  getInitials,
} from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';
import type { Investment } from '@/lib/types/investment';

type InvestmentListHeaderProps = {
  investment: Investment;
};

const statusVariants: Record<
  NonNullable<Investment['status']>,
  'success' | 'warning' | 'secondary' | 'destructive'
> = {
  active: 'success',
  pending: 'warning',
  completed: 'success',
  cancelled: 'destructive',
  expired: 'secondary',
  defaulted: 'destructive',
};

const statusLabels: Record<NonNullable<Investment['status']>, string> = {
  active: 'Actif',
  pending: 'En attente',
  completed: 'Terminé',
  cancelled: 'Annulé',
  expired: 'Expiré',
  defaulted: 'Défaut',
};

const formatInvestmentType = (type: string | null | undefined) => {
  if (!type) return 'Type non défini';

  const normalized = type.toLowerCase();
  const labels: Record<string, string> = {
    beehive: 'Ruche',
    ruche: 'Ruche',
    'bee-hive': 'Ruche',
    olive_tree: 'Olivier',
    olivier: 'Olivier',
    family_plot: 'Parcelle familiale',
    parcelle_familiale: 'Parcelle familiale',
    forest: 'Forêt',
    agroforestry: 'Agroforesterie',
  };

  return labels[normalized] ?? type;
};

export const InvestmentListHeader: FC<InvestmentListHeaderProps> = ({
  investment,
}) => {
  const firstName = investment.user?.first_name ?? undefined;
  const lastName = investment.user?.last_name ?? undefined;
  const hasName = Boolean(firstName || lastName);
  const displayName = investment.user
    ? hasName
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : investment.user.email
    : 'Investisseur inconnu';

  const investmentTypeLabel = formatInvestmentType(investment.investment_type);
  const lastReturn = investment.last_return_date
    ? formatDate(investment.last_return_date)
    : 'Aucun versement';

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8">
        {investment.user ? (
          getInitials(firstName, lastName)
        ) : (
          <UserIcon aria-hidden className="h-4 w-4" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-base font-medium">
            {displayName}
          </h3>
          <p className="text-muted-foreground hidden truncate text-xs md:block">
            {investment.user?.email ?? 'Email non défini'}
          </p>
        </div>

        <Badge variant={statusVariants[investment.status] ?? 'secondary'}>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            {statusLabels[investment.status] ?? investment.status}
          </span>
        </Badge>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <Leaf className="h-3 w-3" />
          <span>{investmentTypeLabel}</span>
        </div>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <Coins className="h-3 w-3" />
          <span>{formatCurrency(investment.amount_eur)}</span>
        </div>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <span>Dernier retour&nbsp;:</span>
          <span>{lastReturn}</span>
        </div>
      </div>
    </div>
  );
};
