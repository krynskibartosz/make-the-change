import { Skeleton } from '@/components/ui/skeleton';

export function BlogPostDetailSkeleton() {
  return (
    <div className="flex h-full flex-col bg-surface-1">
      {/* Cover Section Skeleton */}
      <div className="relative h-64 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Header Skeleton */}
      <div className="border-border-subtle border-b bg-surface-1 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-2 border-border-subtle space-y-4 rounded-xl border p-6">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
