'use client';

import { type FC } from 'react';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

export const SpeciesDetailSkeleton: FC = () => {
  return (
    <DetailView>
      <div className="w-full">
        {/* Cover Image Skeleton */}
        <div className="relative h-64 w-full bg-muted/60 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Content Skeleton */}
        <div className="container relative z-10 -mt-12 max-w-2xl space-y-6">
          {/* Icon Skeleton */}
          <div className="h-24 w-24 rounded-full bg-muted/60 animate-pulse" />

          {/* Essential Info Section */}
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded-md bg-muted/60 animate-pulse" />
            <div className="h-20 w-full rounded-md bg-muted/60 animate-pulse" />
          </div>

          {/* Content Levels Section */}
          <div className="space-y-4">
            <div className="h-8 w-1/3 rounded-md bg-muted/60 animate-pulse" />
            <div className="space-y-2">
              <div className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
              <div className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
              <div className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </DetailView>
  );
};