import { ShoppingCart, User, Calendar, DollarSign } from 'lucide-react';
import { DataCard, DataListItem } from '../../components/ui/data-list';

import type { FC } from 'react';

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Order Card Skeleton - Grid View
 * Matches the new design with gradient cover and circular avatar
 */
export const OrderCardSkeleton: FC = () => (
  <DataCard className="!overflow-visible">
    <DataCard.Header className="pb-0 !block !overflow-visible">
      <div className="relative -mx-6 -mt-6 rounded-t-xl overflow-visible">
        {/* Cover gradient placeholder */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-500/20 to-slate-500/40">
          <div className={`h-full w-full ${shimmerClasses}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/8 to-transparent" />

          {/* Order number badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border/60 shadow-sm">
              <div className={`h-3 w-16 rounded-md bg-muted/40 ${shimmerClasses}`} />
            </div>
          </div>
        </div>

        {/* Avatar positioned below cover */}
        <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-end gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background shadow-xl">
            <div className={`bg-primary/20 flex h-full w-full items-center justify-center ${shimmerClasses}`}>
              <ShoppingCart className="text-primary h-7 w-7" />
            </div>
          </div>
        </div>
      </div>
    </DataCard.Header>

    <DataCard.Content className="relative z-10">
      {/* Title and info */}
      <div className="pt-16 space-y-3">
        <div className={`h-5 w-3/4 rounded-md bg-muted/40 ${shimmerClasses}`} />

        {/* Customer */}
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground h-3.5 w-3.5" />
          <div className={`h-3.5 w-40 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-3.5 w-3.5" />
          <div className={`h-3.5 w-28 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>

        {/* Amount */}
        <div className="flex items-center gap-2">
          <DollarSign className="text-success h-3.5 w-3.5" />
          <div className={`h-3.5 w-24 rounded-md bg-success/30 ${shimmerClasses}`} />
        </div>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        <div className={`h-6 w-20 rounded-md bg-muted/40 ${shimmerClasses}`} />
      </div>
    </DataCard.Content>

    <DataCard.Footer>
      {/* Status toggle */}
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-12 rounded-full bg-muted/40 ${shimmerClasses}`} />
          <div className={`h-4 w-16 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>
    </DataCard.Footer>
  </DataCard>
);

/**
 * Order List Skeleton - List View
 */
export const OrderListSkeleton: FC = () => (
  <DataListItem>
    <DataListItem.Header>
      <div className="flex items-center gap-2 md:gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full ${shimmerClasses}`}>
            <ShoppingCart className="text-primary h-5 w-5" />
          </div>
        </div>

        {/* Title and ID */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`h-5 w-40 rounded-md bg-muted/40 ${shimmerClasses}`} />
          <div className={`h-3.5 w-20 rounded-md bg-muted/30 ${shimmerClasses}`} />
        </div>
      </div>
    </DataListItem.Header>

    <DataListItem.Content>
      <div className="space-y-3">
        {/* Info rows */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`h-5 w-5 rounded bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-4 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-5 w-5 rounded bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-4 w-28 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="text-success h-4 w-4" />
            <div className={`h-4 w-20 rounded-md bg-success/30 ${shimmerClasses}`} />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <div className={`h-6 w-20 rounded-md bg-muted/40 ${shimmerClasses}`} />
        </div>
      </div>
    </DataListItem.Content>

    <DataListItem.Actions>
      {/* Status toggle */}
      <div className="flex items-center gap-2">
        <div className={`h-6 w-12 rounded-full bg-muted/40 ${shimmerClasses}`} />
        <div className={`h-4 w-16 rounded-md bg-muted/30 ${shimmerClasses}`} />
      </div>
    </DataListItem.Actions>
  </DataListItem>
);
