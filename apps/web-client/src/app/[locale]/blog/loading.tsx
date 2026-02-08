import { Card, CardContent, Skeleton } from '@make-the-change/core/ui'

export default function BlogLoading() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-9 w-72 sm:h-10" />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="overflow-hidden border bg-background/70 shadow-sm backdrop-blur"
            >
              <Skeleton className="aspect-[16/10]" />
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-3 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
