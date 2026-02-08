import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

/**
 * Skeleton loader for category detail page
 * Matches the structure of the real page for smooth loading
 */
export function CategoryDetailSkeleton() {
  return (
    <AdminPageLayout>
      <div className="flex h-full flex-col bg-surface-1 text-text-primary transition-colors duration-300 dark:bg-transparent">
        <div className="content-wrapper content-wrapper-dark flex-1 overflow-y-auto">
          {/* Cover Skeleton */}
          <section className="relative mb-6">
            <Skeleton className="h-48 w-full" />
          </section>

          {/* Header Skeleton */}
          <div className="border-b border-border-subtle/60 bg-surface-1/95 shadow-glow-md backdrop-blur-sm">
            <div className="flex flex-row items-center justify-between px-4 py-4 md:px-8">
              <Skeleton className="h-5 w-48" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="relative z-[1] py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <DetailView variant="cards" gridCols={2} spacing="lg">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border-border space-y-4 rounded-xl border p-6">
                    <Skeleton className="h-6 w-48" />
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </DetailView>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
