'use client';

import { Calendar, Coins, Leaf, PiggyBank, TrendingUp } from 'lucide-react';
import { type FC, useMemo } from 'react';

import { DataCard } from '@make-the-change/core/ui';
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import type { Investment, InvestmentStatus } from '@/lib/types/investment';

type InvestmentCardProps = {
  investment: Investment;
};

const statusClasses: Record<
  InvestmentStatus,
  {
    badge: string;
    gradient: string;
    dot: string;
  }
> = {
  active: {
    badge: 'badge-success',
    gradient: 'from-emerald-500/25 via-emerald-500/10 to-slate-900/50',
    dot: 'bg-emerald-400',
  },
  pending: {
    badge: 'badge-warning',
    gradient: 'from-amber-500/25 via-amber-500/10 to-slate-900/50',
    dot: 'bg-amber-400',
  },
  completed: {
    badge: 'badge-info',
    gradient: 'from-sky-500/25 via-sky-500/10 to-slate-900/50',
    dot: 'bg-sky-400',
  },
  cancelled: {
    badge: 'badge-destructive',
    gradient: 'from-rose-500/25 via-rose-500/10 to-slate-900/50',
    dot: 'bg-rose-400',
  },
  expired: {
    badge: 'badge-muted',
    gradient: 'from-slate-500/25 via-slate-500/10 to-slate-900/50',
    dot: 'bg-slate-400',
  },
  defaulted: {
    badge: 'badge-destructive',
    gradient: 'from-purple-500/25 via-purple-500/10 to-slate-900/50',
    dot: 'bg-purple-400',
  },
};

const formatPoints = (value: number) =>
  `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} pts`;

const resolveStatusLabel = (status: InvestmentStatus) => {
  const labels: Record<InvestmentStatus, string> = {
    active: 'Actif',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
    expired: 'Expiré',
    defaulted: 'Défaut',
  };
  return labels[status] ?? status;
};

const resolveTypeLabel = (type: string | null) => {
  if (!type) return 'Type non défini';
  const normalized = type.toLowerCase();
  const map: Record<string, string> = {
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
  return map[normalized] ?? type;
};

export const InvestmentCard: FC<InvestmentCardProps> = ({ investment }) => {
  const classes = statusClasses[investment.status];
  const statusLabel = resolveStatusLabel(investment.status);
  const investmentType = resolveTypeLabel(investment.investment_type);

  const heroImage = useMemo(() => {
    if (investment.project?.cover_image) return investment.project.cover_image;

    return null;
  }, [investment.project?.cover_image]);

  const participantName = investment.user
    ? `${investment.user.first_name ?? ''} ${investment.user.last_name ?? ''}`.trim() ||
      investment.user.email
    : 'Investisseur inconnu';

  const outstandingLabel = formatPoints(investment.outstanding_points);
  const returnedLabel = formatPoints(investment.returns_received_points);
  const amountLabel = `${formatCurrency(investment.amount_eur)} • ${formatPoints(investment.amount_points)}`;

  return (
    <DataCard href={`/admin/investments/${investment.id}`} className="!overflow-visible">
      <DataCard.Header className="pb-0 !block !overflow-visible">
        <div className="relative -mx-6 -mt-6 overflow-visible rounded-t-xl">
          <div
            className={cn(
              'relative h-40 w-full overflow-hidden rounded-t-xl bg-gradient-to-br',
              classes.gradient
            )}
          >
            {heroImage ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
            ) : (
              <div className="absolute inset-0 opacity-40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />

            <div className="absolute bottom-4 left-5 right-4 flex items-end justify-between gap-3">
              <div className="bg-background/80 text-foreground flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs font-medium shadow">
                <Leaf className="h-3.5 w-3.5 text-primary" />
                {investment.project?.name ?? 'Projet non attribué'}
              </div>
              <div className="bg-background/70 text-muted-foreground flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs shadow">
                <Calendar className="h-3.5 w-3.5" />
                Maturité&nbsp;: {formatDate(investment.maturity_date ?? '')}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-center gap-3">
            <div className="from-primary/20 to-primary/40 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br shadow-xl">
              <PiggyBank className="text-primary h-7 w-7" />
            </div>
            <div className="rounded-full border border-border/60 bg-background/90 px-3 py-1 text-xs font-medium shadow">
              {investmentType}
            </div>
          </div>
        </div>
      </DataCard.Header>

      <DataCard.Content className="relative z-10">
        <div className="space-y-4 pt-12">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {participantName}
              </h3>
              <div className="text-muted-foreground text-sm">{investment.user?.email ?? 'Email inconnu'}</div>
            </div>
            <span className={classes.badge}>
              <span className="flex items-center gap-1">
                <span className={cn('h-2 w-2 rounded-full', classes.dot)} />
                {statusLabel}
              </span>
            </span>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-emerald-500" />
            <span>{amountLabel}</span>
          </div>
          <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span>
                Retours {returnedLabel} • Restant {outstandingLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span>Dernier retour&nbsp;: {formatDate(investment.last_return_date ?? '')}</span>
            </div>
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-sky-500" />
              <span>
                Rendement attendu&nbsp;: {formatPercentage(investment.expected_return_rate)}
              </span>
            </div>
          </div>
        </div>
      </DataCard.Content>
    </DataCard>
  );
};
