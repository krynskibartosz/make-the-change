'use client'

import { DataList, Skeleton } from '@make-the-change/core/ui'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'

export default function Loading() {
  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Skeleton className="h-9 w-[300px]" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[100px] ml-auto" />
      </AdminPageHeader>

      <DataList
        gridCols={3}
        isLoading={true}
        items={[]}
        renderItem={() => null}
        emptyState={{
          title: '',
          description: '',
          icon: undefined,
        }}
        renderSkeleton={() => (
          <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm h-[250px]">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        )}
      />
    </AdminPageContainer>
  )
}
