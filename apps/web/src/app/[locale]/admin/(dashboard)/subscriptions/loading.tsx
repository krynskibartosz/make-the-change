'use client'

import { DataList, Skeleton } from '@make-the-change/core/ui'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex items-center gap-4 py-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

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
          <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm h-[180px]">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <div className="space-y-2 flex-grow pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}
