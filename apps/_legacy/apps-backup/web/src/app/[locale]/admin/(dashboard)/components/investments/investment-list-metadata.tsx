'use client';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Calendar,
  Leaf,
} from 'lucide-react';
import { type FC } from 'react';

import { formatCurrency } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';
import type { Investment } from '@/lib/types/investment';

type InvestmentListMetadataProps = {
  investment: Investment;
};

const formatPoints = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '0 pts';
  return `${value.toLocaleString('fr-FR')} pts`;
};

const formatPercentage = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '—';
  return `${(Number(value) || 0).toFixed(1)} %`;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Non défini';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const InvestmentListMetadata: FC<InvestmentListMetadataProps> = ({
  investment,
}) => (
  <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Leaf className="text-primary/70 md:group-hover:text-primary group-active:text-primary h-4 w-4 transition-colors duration-200" />
        <span>{investment.project?.name ?? 'Projet non attribué'}</span>
      </div>
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <BarChart3 className="h-4 w-4 text-blue-500/70 transition-colors duration-200 group-active:text-blue-500 md:group-hover:text-blue-500" />
        <span>
          Rendement attendu&nbsp;: {formatPercentage(investment.expected_return_rate)}
        </span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <ArrowDownCircle className="h-4 w-4 text-emerald-500/70 transition-colors duration-200 group-active:text-emerald-500 md:group-hover:text-emerald-500" />
        <span>
          Investi&nbsp;: {formatPoints(investment.amount_points)} ({formatCurrency(investment.amount_eur)})
        </span>
      </div>
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <ArrowUpCircle className="h-4 w-4 text-purple-500/70 transition-colors duration-200 group-active:text-purple-500 md:group-hover:text-purple-500" />
        <span>
          Retours reçus&nbsp;: {formatPoints(investment.returns_received_points)} • Restant&nbsp;:{' '}
          {formatPoints(investment.outstanding_points)}
        </span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Calendar className="h-4 w-4 text-amber-500/70 transition-colors duration-200 group-active:text-amber-500 md:group-hover:text-amber-500" />
        <span>Maturité&nbsp;: {formatDate(investment.maturity_date)}</span>
      </div>
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Calendar className="h-4 w-4 text-slate-500/70 transition-colors duration-200 group-active:text-slate-500 md:group-hover:text-slate-500" />
        <span>Dernier retour&nbsp;: {formatDate(investment.last_return_date)}</span>
      </div>
    </div>
  </div>
);
