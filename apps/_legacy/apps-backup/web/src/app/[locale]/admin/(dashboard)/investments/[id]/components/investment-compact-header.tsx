'use client';

import { Calendar, Coins, Edit, PiggyBank, Save, X } from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';
import type { Investment } from '@/lib/types/investment';

const statusConfig = {
  active: {
    label: 'Actif',
    color: 'bg-emerald-500',
    bgClass: 'from-emerald-500/10 to-emerald-600/5',
    borderClass: 'border-emerald-500/20',
  },
  pending: {
    label: 'En attente',
    color: 'bg-amber-500',
    bgClass: 'from-amber-500/10 to-amber-600/5',
    borderClass: 'border-amber-500/20',
  },
  completed: {
    label: 'Terminé',
    color: 'bg-sky-500',
    bgClass: 'from-sky-500/10 to-sky-600/5',
    borderClass: 'border-sky-500/20',
  },
  cancelled: {
    label: 'Annulé',
    color: 'bg-rose-500',
    bgClass: 'from-rose-500/10 to-rose-600/5',
    borderClass: 'border-rose-500/20',
  },
  expired: {
    label: 'Expiré',
    color: 'bg-slate-500',
    bgClass: 'from-slate-500/10 to-slate-600/5',
    borderClass: 'border-slate-500/20',
  },
  defaulted: {
    label: 'En défaut',
    color: 'bg-purple-500',
    bgClass: 'from-purple-500/10 to-purple-600/5',
    borderClass: 'border-purple-500/20',
  },
} as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

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

type InvestmentCompactHeaderProps = {
  investment: Investment;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
};

export const InvestmentCompactHeader: FC<InvestmentCompactHeaderProps> = ({
  investment,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  const status = investment.status ?? 'active';
  const config = statusConfig[status] ?? statusConfig.active;

  const projectName = investment.project?.name ?? 'Investissement';
  const investorName = investment.user
    ? `${investment.user.first_name ?? ''} ${investment.user.last_name ?? ''}`.trim() ||
      investment.user.email
    : 'Investisseur inconnu';

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-3 md:px-8 md:py-6 md:pb-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-4">
          <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-xl border bg-gradient-to-br to-orange-500/20 p-2 backdrop-blur-sm md:p-3">
            <PiggyBank className="text-primary h-5 w-5 md:h-6 md:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-foreground mb-1 truncate text-lg leading-tight font-bold md:text-2xl">
              {projectName}
            </h1>
            <p className="text-muted-foreground truncate text-sm">
              {investorName}
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
                <Coins className="h-3 w-3" />
                {formatCurrency(investment.amount_eur)}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
                <PiggyBank className="h-3 w-3" />
                {formatPoints(investment.amount_points)}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1">
                <Calendar className="h-3 w-3" />
                Maturité: {formatDate(investment.maturity_date)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                className="h-8 px-3"
                disabled={isSaving}
                size="sm"
                variant="outline"
                onClick={() => onEditToggle?.(false)}
              >
                <X className="mr-1 h-4 w-4" />
                Annuler
              </Button>
              <Button
                className="h-8 px-3"
                disabled={isSaving || !hasChanges}
                size="sm"
                onClick={onSave}
              >
                {isSaving ? (
                  <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </div>
          ) : (
            <Button
              className="h-8 px-3"
              size="sm"
              variant="outline"
              onClick={() => onEditToggle?.(true)}
            >
              <Edit className="mr-1 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
