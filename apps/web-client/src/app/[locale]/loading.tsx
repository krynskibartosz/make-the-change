import { Card, CardContent, CardHeader, Skeleton } from '@make-the-change/core/ui'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Skeleton */}
      <section className="mb-16 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-emerald-50/30 p-8 sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto mb-4 h-6 w-32" />
          <Skeleton className="mx-auto mb-6 h-12 w-3/4" />
          <Skeleton className="mx-auto mb-8 h-6 w-full max-w-md" />
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Skeleton className="h-12 w-full sm:w-40" />
            <Skeleton className="h-12 w-full sm:w-40" />
          </div>
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="mb-16">
        <Skeleton className="mx-auto mb-12 h-8 w-64" />
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="text-center">
              <CardHeader>
                <Skeleton className="mx-auto mb-4 h-14 w-14 rounded-full" />
                <Skeleton className="mx-auto h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mx-auto h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Skeleton */}
      <section>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="aspect-video rounded-t-xl" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-4 h-12 w-full" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
