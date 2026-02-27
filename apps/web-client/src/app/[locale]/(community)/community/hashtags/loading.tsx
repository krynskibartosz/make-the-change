export default function CommunityHashtagsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-14 w-full animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  )
}
