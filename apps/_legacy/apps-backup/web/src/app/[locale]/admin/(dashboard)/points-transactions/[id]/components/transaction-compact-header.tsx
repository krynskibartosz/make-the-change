'use client';

import { Calendar, Coins, User } from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

const typeConfig = {
  earned_subscription: {
    label: 'Gagné - Abonnement',
    color: 'bg-emerald-500',
    bgClass: 'from-emerald-500/10 to-emerald-600/5',
    borderClass: 'border-emerald-500/20',
  },
  earned_purchase: {
    label: 'Gagné - Achat',
    color: 'bg-emerald-500',
    bgClass: 'from-emerald-500/10 to-emerald-600/5',
    borderClass: 'border-emerald-500/20',
  },
  earned_referral: {
    label: 'Gagné - Parrainage',
    color: 'bg-emerald-500',
    bgClass: 'from-emerald-500/10 to-emerald-600/5',
    borderClass: 'border-emerald-500/20',
  },
  spent_order: {
    label: 'Dépensé - Commande',
    color: 'bg-rose-500',
    bgClass: 'from-rose-500/10 to-rose-600/5',
    borderClass: 'border-rose-500/20',
  },
  spent_investment: {
    label: 'Dépensé - Investissement',
    color: 'bg-rose-500',
    bgClass: 'from-rose-500/10 to-rose-600/5',
    borderClass: 'border-rose-500/20',
  },
  adjustment_admin: {
    label: 'Ajustement Admin',
    color: 'bg-amber-500',
    bgClass: 'from-amber-500/10 to-amber-600/5',
    borderClass: 'border-amber-500/20',
  },
  bonus_welcome: {
    label: 'Bonus Bienvenue',
    color: 'bg-sky-500',
    bgClass: 'from-sky-500/10 to-sky-600/5',
    borderClass: 'border-sky-500/20',
  },
  bonus_milestone: {
    label: 'Bonus Milestone',
    color: 'bg-sky-500',
    bgClass: 'from-sky-500/10 to-sky-600/5',
    borderClass: 'border-sky-500/20',
  },
} as const;

const formatPoints = (value: number) =>
  `${value.toLocaleString('fr-FR')} pts`;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Non défini';

type TransactionCompactHeaderProps = {
  transaction: any;
};

export const TransactionCompactHeader: FC<TransactionCompactHeaderProps> = ({
  transaction,
}) => {
  const type = transaction.type ?? 'adjustment_admin';
  const config = typeConfig[type as keyof typeof typeConfig] ?? typeConfig.adjustment_admin;

  const userName = transaction.users?.user_profiles?.first_name
    ? `${transaction.users.user_profiles.first_name ?? ''} ${transaction.users.user_profiles.last_name ?? ''}`.trim()
    : transaction.users?.email ?? 'Utilisateur inconnu';

  const isPositive = transaction.amount > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-3 md:px-8 md:py-6 md:pb-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-4">
          <div 
            className={cn(
              'flex-shrink-0 rounded-xl border p-2 backdrop-blur-sm md:p-3',
              isPositive
                ? 'from-emerald-500/20 border-emerald-500/20 bg-gradient-to-br to-green-500/20'
                : 'from-rose-500/20 border-rose-500/20 bg-gradient-to-br to-red-500/20'
            )}
          >
            <Coins className={cn(
              'h-5 w-5 md:h-6 md:w-6',
              isPositive ? 'text-emerald-500' : 'text-rose-500'
            )} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-foreground mb-1 truncate text-lg leading-tight font-bold md:text-2xl">
              {isPositive && '+'}
              {formatPoints(transaction.amount)}
            </h1>
            <p className="text-muted-foreground truncate text-sm">
              {userName}
            </p>

            <div className="mt-3 hidden flex-wrap items-center gap-3 text-xs text-muted-foreground md:flex">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1 font-medium',
                  `bg-gradient-to-r ${config.bgClass} ${config.borderClass}`
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', config.color)} />
                {config.label}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
                <User className="h-3 w-3" />
                {userName}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
                <Coins className="h-3 w-3" />
                Solde: {formatPoints(transaction.balance_after)}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
