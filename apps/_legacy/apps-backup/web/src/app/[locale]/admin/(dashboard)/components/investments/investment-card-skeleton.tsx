'use client';

import { Calendar, Coins, Leaf, PiggyBank, TrendingUp } from 'lucide-react';
import { type FC } from 'react';

import { DataCard } from '@make-the-change/core/ui';

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Investment Card Skeleton - Grid View
 * Matches the design with cover image, avatar, and detailed info
 */
export const InvestmentCardSkeleton: FC = () => (
  <DataCard className="!overflow-visible">
    <DataCard.Header className="pb-0 !block !overflow-visible">
      <div className="relative -mx-6 -mt-6 overflow-visible rounded-t-xl">
        {/* Cover gradient placeholder */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
          <div className={`bg-gradient-to-br from-primary/20 to-primary/40 h-full w-full ${shimmerClasses}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />
          
          {/* Badges on cover */}
          <div className="absolute bottom-4 left-5 right-4 flex items-end justify-between gap-3">
            <div className={`h-7 w-40 rounded-full bg-background/80 border border-border/60 ${shimmerClasses}`} />
            <div className={`h-7 w-36 rounded-full bg-background/70 border border-border/50 ${shimmerClasses}`} />
          </div>
        </div>

        {/* Avatar and type badge positioned below cover */}
        <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background shadow-xl">
            <div className={`bg-primary/20 flex h-full w-full items-center justify-center ${shimmerClasses}`}>
              <PiggyBank className="text-primary h-7 w-7" />
            </div>
          </div>
          <div className={`h-7 w-24 rounded-full bg-background/90 border border-border/60 ${shimmerClasses}`} />
        </div>
      </div>
    </DataCard.Header>

    <DataCard.Content className="relative z-10">
      <div className="space-y-4 pt-12">
        {/* Title and badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className={`h-5 w-3/4 rounded-md bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-4 w-1/2 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className={`h-6 w-20 rounded-full bg-muted/40 ${shimmerClasses}`} />
        </div>

        {/* Info lines with icons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-emerald-500" />
            <div className={`h-3.5 w-40 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <div className={`h-3.5 w-48 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            <div className={`h-3.5 w-36 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-sky-500" />
            <div className={`h-3.5 w-44 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
        </div>
      </div>
    </DataCard.Content>
  </DataCard>
);

/**
 * Investment List Skeleton - List View
 */
export const InvestmentListSkeleton: FC = () => (
  <div className="rounded-xl border border-border/40 bg-surface-1 p-4 shadow-sm">
    <div className="flex items-center gap-2 md:gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full md:h-8 md:w-8 ${shimmerClasses}`}>
          <PiggyBank className="text-primary h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
        {/* Name and email */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className={`h-4 w-40 rounded-md bg-muted/40 ${shimmerClasses}`} />
          <div className={`h-3 w-32 rounded-md bg-muted/30 hidden md:block ${shimmerClasses}`} />
        </div>

        {/* Status badge */}
        <div className={`h-6 w-20 rounded-full bg-muted/40 ${shimmerClasses}`} />

        {/* Type */}
        <div className="hidden md:flex items-center gap-1">
          <Leaf className="h-3 w-3 text-muted-foreground" />
          <div className={`h-3 w-16 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>

        {/* Amount */}
        <div className="hidden md:flex items-center gap-1">
          <Coins className="h-3 w-3 text-muted-foreground" />
          <div className={`h-3 w-20 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>

        {/* Last return */}
        <div className="hidden md:flex items-center gap-1">
          <div className={`h-3 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>
    </div>
  </div>
);
