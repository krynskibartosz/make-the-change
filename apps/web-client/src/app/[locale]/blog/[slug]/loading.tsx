import { Card, CardContent, Skeleton } from '@make-the-change/core/ui'

export default function BlogPostLoading() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-20 rounded-lg" />

        <div className="mt-6">
          <Card className="overflow-hidden border bg-background/70 shadow-sm backdrop-blur">
            <Skeleton className="aspect-[16/8]" />
            <CardContent className="space-y-4 p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-9 w-4/5 sm:h-10" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-10/12" />
              <Skeleton className="h-5 w-9/12" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
