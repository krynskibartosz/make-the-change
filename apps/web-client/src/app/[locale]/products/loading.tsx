import { Card, CardContent, Skeleton } from '@make-the-change/core/ui'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-48" />
        <Skeleton className="mx-auto h-6 w-full max-w-sm" />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <Skeleton className="aspect-square rounded-t-xl" />
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="mb-3 h-8 w-full" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
