import { CommunityPageFrame } from '../_features/community-page-frame'

export default function CommunityHashtagsLoading() {
  return (
    <CommunityPageFrame
      sidebarUser={null}
      centerClassName="max-w-[760px]"
      rightRail={
        <div className="space-y-4">
          <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
          <div className="h-60 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      }
    >
      <div className="space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-14 w-full animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-xl bg-muted" />
          <div className="h-28 animate-pulse rounded-xl bg-muted" />
          <div className="h-28 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </CommunityPageFrame>
  )
}
