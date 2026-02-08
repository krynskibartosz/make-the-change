import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/admin-page-layout'
import { AdminPageContent } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/content'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header'
import { ProductListSkeleton } from '@/app/[locale]/admin/(dashboard)/products/components/product-card-skeleton'

export default function Loading() {
  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="md:hidden space-y-3">
          <div className="h-10 w-full bg-muted/20 animate-pulse rounded-lg" />
          <div className="h-9 w-full bg-muted/20 animate-pulse rounded-lg" />
        </div>

        <div className="hidden md:block space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="h-10 w-full bg-muted/20 animate-pulse rounded-lg" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-32 bg-muted/20 animate-pulse rounded-lg" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <div className="h-9 w-48 bg-muted/20 animate-pulse rounded-lg" />
              <div className="h-9 w-52 bg-muted/20 animate-pulse rounded-lg" />
              <div className="h-9 w-44 bg-muted/20 animate-pulse rounded-lg" />
              <div className="h-9 w-40 bg-muted/20 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        <ProductListSkeleton />
      </AdminPageContent>
    </AdminPageLayout>
  )
}
