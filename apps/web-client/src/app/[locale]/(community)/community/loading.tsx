export default function CommunityLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-16 w-full animate-pulse rounded-xl bg-muted" />
      <div className="mt-4 space-y-3">
        <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
