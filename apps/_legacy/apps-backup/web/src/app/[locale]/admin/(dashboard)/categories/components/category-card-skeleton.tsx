'use client';

import { Folder, Eye, Tag } from 'lucide-react';
import { FC } from 'react';

import {
  DataCard,
  DataListItem,
} from '@make-the-change/core/ui';

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Category Card Skeleton - Grid View
 * Matches the design with icon, name, slug, description, and badges
 */
export const CategoryCardSkeleton: FC = () => (
  <DataCard>
    <DataCard.Header>
      <div className="flex items-start gap-3">
        {/* Icon placeholder */}
        <div className="flex-shrink-0">
          <div className={`bg-primary/10 flex h-16 w-16 items-center justify-center rounded-lg ${shimmerClasses}`}>
            <Folder className="text-primary h-7 w-7" />
          </div>
        </div>

        {/* Title and slug */}
        <div className="flex-1 space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className={`h-5 w-32 rounded-md bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-4 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
        </div>
      </div>
    </DataCard.Header>

    <DataCard.Content>
      <div className="space-y-3">
        {/* Description */}
        <div className="space-y-2">
          <div className={`h-3.5 w-full rounded-md bg-muted/30 ${shimmerClasses}`} />
          <div className={`h-3.5 w-3/4 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <div className={`h-6 w-32 rounded-full bg-muted/40 ${shimmerClasses}`} />
        </div>
      </div>
    </DataCard.Content>

    <DataCard.Footer>
      <div className="flex w-full items-center justify-between gap-4">
        {/* Sort order */}
        <div className="flex items-center gap-3">
          <div className={`h-10 w-16 rounded-xl bg-muted/40 border border-border ${shimmerClasses}`} />
        </div>

        {/* Toggle and status */}
        <div className="flex items-center gap-2">
          <div className={`h-6 w-12 rounded-full bg-muted/40 ${shimmerClasses}`} />
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div className={`h-4 w-16 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
        </div>
      </div>
    </DataCard.Footer>
  </DataCard>
);

/**
 * Category List Skeleton - List View
 */
export const CategoryListSkeleton: FC = () => (
  <DataListItem>
    <DataListItem.Header>
      <div className="flex items-center gap-2 md:gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`bg-muted/50 flex h-12 w-12 items-center justify-center rounded-lg ${shimmerClasses}`}>
            <Folder className="text-primary h-6 w-6" />
          </div>
        </div>

        {/* Name and slug */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`h-5 w-40 rounded-md bg-muted/40 ${shimmerClasses}`} />
          <div className={`h-4 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>
    </DataListItem.Header>

    <DataListItem.Content>
      <div className="space-y-3">
        {/* Description */}
        <div className="space-y-2">
          <div className={`h-3.5 w-full rounded-md bg-muted/30 ${shimmerClasses}`} />
          <div className={`h-3.5 w-2/3 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>

        {/* Badge */}
        <div className="flex flex-wrap gap-2">
          <div className={`h-6 w-32 rounded-full bg-muted/40 ${shimmerClasses}`} />
        </div>
      </div>
    </DataListItem.Content>

    <DataListItem.Actions>
      <div className="flex w-full items-center justify-between gap-4">
        {/* Sort order */}
        <div className="flex items-center gap-3">
          <div className={`h-10 w-16 rounded-xl bg-muted/40 border border-border ${shimmerClasses}`} />
        </div>

        {/* Toggle and status */}
        <div className="flex items-center gap-2">
          <div className={`h-6 w-12 rounded-full bg-muted/40 ${shimmerClasses}`} />
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div className={`h-4 w-16 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
        </div>
      </div>
    </DataListItem.Actions>
  </DataListItem>
);
