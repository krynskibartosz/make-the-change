import { Skeleton } from '@/components/ui/skeleton';

export function BlogPostCardSkeleton() {
  return (
    <div className="bg-surface-2 border-border-subtle group relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-glow-sm">
      {/* Cover Image Skeleton */}
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-5">
        {/* Status Badge Skeleton */}
        <Skeleton className="h-5 w-20" />

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* Excerpt Skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function BlogPostListSkeleton() {
  return (
    <div className="bg-surface-2 border-border-subtle flex items-center gap-4 rounded-lg border p-4 shadow-sm">
      {/* Thumbnail Skeleton */}
      <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Actions Skeleton */}
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  );
}
