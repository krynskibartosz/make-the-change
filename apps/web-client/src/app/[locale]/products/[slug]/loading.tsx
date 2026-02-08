import { Card, CardContent, Skeleton } from '@make-the-change/core/ui'

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen pb-28 md:pb-24">
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-10 w-40" />

            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <Skeleton className="hidden h-12 w-full md:block" />

            <Card className="border bg-background/70 shadow-sm backdrop-blur">
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 space-y-4">
          <Skeleton className="h-8 w-56" />
          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="h-full min-w-[200px] sm:min-w-0">
                <Skeleton className="aspect-square rounded-t-xl" />
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-5 w-4/5" />
                  <Skeleton className="h-5 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
