import { Card, CardContent, Skeleton } from '@make-the-change/core/ui'

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="fixed left-0 right-0 top-0 z-40 px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="relative h-[34vh] w-full overflow-hidden bg-muted sm:h-[44vh]">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-3xl px-5 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-9 w-4/5" />
            <Skeleton className="mt-3 h-4 w-44" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6">
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-5 sm:p-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="mt-3 h-2 w-full rounded-full" />
              <div className="mt-3 flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border bg-muted/30 p-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-7 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border bg-background/60 px-4 py-3">
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-5 w-40" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
