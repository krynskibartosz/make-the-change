import { Bug, Globe, FileText } from 'lucide-react';
import { DataCard, DataListItem } from '../../components/ui/data-list';
import { cn } from '@make-the-change/core/shared/utils';

import type { FC } from 'react';

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Species Card Skeleton - Grid View
 * Matches the design with cover image and icon
 */
export const SpeciesCardSkeleton: FC = () => (
  <DataCard className="!overflow-visible">
    <DataCard.Header className="pb-0 !block !overflow-visible">
      <div className="relative -mx-6 -mt-6 rounded-t-xl overflow-visible">
        {/* Cover image placeholder */}
        <div className={cn('h-32 w-full bg-muted/50', shimmerClasses)} />
        
        {/* Icon placeholder */}
        <div className="absolute -bottom-4 left-4">
          <div className={cn('h-16 w-16 rounded-full bg-muted/50', shimmerClasses)} />
        </div>
      </div>
    </DataCard.Header>

    <DataCard.Content className="mt-6 space-y-4">
      {/* Name placeholder */}
      <div className={cn('h-6 w-3/4 rounded-md bg-muted/50', shimmerClasses)} />

      {/* Scientific name placeholder */}
      <div className={cn('h-4 w-1/2 rounded-md bg-muted/50', shimmerClasses)} />

      {/* Description placeholder */}
      <div className="space-y-2">
        <div className={cn('h-4 w-full rounded-md bg-muted/50', shimmerClasses)} />
        <div className={cn('h-4 w-4/5 rounded-md bg-muted/50', shimmerClasses)} />
      </div>
    </DataCard.Content>

    <DataCard.Footer className="flex-wrap gap-2">
      {/* Footer items placeholders */}
      <div className={cn('h-8 w-24 rounded-md bg-muted/50', shimmerClasses)} />
      <div className={cn('h-8 w-24 rounded-md bg-muted/50', shimmerClasses)} />
    </DataCard.Footer>
  </DataCard>
);

/**
 * Species List Skeleton - List View
 */
export const SpeciesListSkeleton: FC = () => (
  <DataListItem>
    <div className="flex items-center gap-4">
      {/* Icon placeholder */}
      <div className={cn('h-12 w-12 rounded-full bg-muted/50', shimmerClasses)} />

      <div className="flex-1 space-y-2">
        {/* Name and scientific name placeholders */}
        <div className="flex items-center gap-2">
          <div className={cn('h-5 w-40 rounded-md bg-muted/50', shimmerClasses)} />
          <div className={cn('h-4 w-32 rounded-md bg-muted/50', shimmerClasses)} />
        </div>

        {/* Description placeholder */}
        <div className={cn('h-4 w-3/4 rounded-md bg-muted/50', shimmerClasses)} />
      </div>

      {/* Action buttons placeholders */}
      <div className="flex items-center gap-2">
        <div className={cn('h-8 w-8 rounded-md bg-muted/50', shimmerClasses)} />
        <div className={cn('h-8 w-8 rounded-md bg-muted/50', shimmerClasses)} />
      </div>
    </div>
  </DataListItem>
);