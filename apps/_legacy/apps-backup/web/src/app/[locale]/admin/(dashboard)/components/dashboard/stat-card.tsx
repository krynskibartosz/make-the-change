'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
};

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="card-base card-base-dark rounded-2xl p-6 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className={`h-4 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
            <div className={`h-8 w-24 rounded-md bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-5 w-20 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className={`h-12 w-12 rounded-lg bg-muted/40 ${shimmerClasses}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="card-base card-base-dark group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <h3 className="text-foreground mt-2 text-3xl font-bold leading-tight">
            {value}
          </h3>
          {trend && (
            <div
              className={cn(
                'mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {trend.isPositive ? '+' : ''}
                {trend.value.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-lg border bg-gradient-to-br to-orange-500/20 p-3 transition-transform group-hover:scale-110">
          <Icon className="text-primary h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
