'use client';

import { Clock, Coins, History } from 'lucide-react';
import { type FC } from 'react';

import type { InvestmentReturn } from '@/lib/types/investment';

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Non défini';

const formatPoints = (value: number) =>
  `${value.toLocaleString('fr-FR')} pts`;

type InvestmentReturnsTimelineProps = {
  returns?: InvestmentReturn[];
};

export const InvestmentReturnsTimeline: FC<InvestmentReturnsTimelineProps> = ({
  returns,
}) => {
  if (!returns || returns.length === 0) {
    return (
      <div className="border-border/40 flex flex-col items-center justify-center rounded-2xl border bg-surface-1/50 p-10 text-center shadow-sm">
        <Clock className="text-muted-foreground mb-3 h-8 w-8" />
        <h3 className="text-foreground mb-1 text-lg font-semibold">
          Aucun retour enregistré
        </h3>
        <p className="text-muted-foreground text-sm">
          Les versements apparaitront ici dès qu’un retour de points sera enregistré pour cet investissement.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/40 space-y-4 rounded-2xl border bg-surface-1/60 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <History className="text-primary h-5 w-5" />
        <h3 className="text-foreground text-lg font-semibold">
          Historique des retours ({returns.length})
        </h3>
      </div>

      <div className="space-y-4">
        {returns
          .slice()
          .sort((a, b) => {
            const aDate = a.distribution_date ?? a.created_at ?? '';
            const bDate = b.distribution_date ?? b.created_at ?? '';
            return bDate.localeCompare(aDate);
          })
          .map(item => (
            <div
              key={item.id}
              className="border-border/20 flex flex-col gap-2 rounded-xl border bg-background/80 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-foreground text-sm font-semibold">
                  {item.return_period ?? 'Période inconnue'}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4 text-emerald-500" />
                  <span>{formatPoints(item.points_returned)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>Distribué le {formatDate(item.distribution_date)}</span>
                <span>Enregistré le {formatDate(item.created_at)}</span>
              </div>

              {item.notes && (
                <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                  {item.notes}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
