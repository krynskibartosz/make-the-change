import { Card, CardContent, Skeleton } from '@make-the-change/core/ui'

export default function LeaderboardLoading() {
  return (
    <div className="container mx-auto flex h-[calc(100svh-4rem-6rem)] flex-col px-4 py-4 md:h-[calc(100svh-4rem)] md:py-6">
      <Card className="flex-1 overflow-hidden border bg-background/70 shadow-sm backdrop-blur">
        <CardContent className="flex h-full flex-col p-0">
          <div className="flex items-center justify-between gap-3 border-b bg-background/40 px-4 py-3">
            <Skeleton className="h-5 w-28" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          <div className="border-b px-4 py-4">
            <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border bg-card/50 p-3">
                  <Skeleton className="h-4 w-10" />
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="mt-2 h-14 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto divide-y divide-border/70">
              <div className="sticky top-0 z-10 border-b bg-background/55 px-4 py-3">
                <Skeleton className="h-9 w-full rounded-full" />
              </div>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
