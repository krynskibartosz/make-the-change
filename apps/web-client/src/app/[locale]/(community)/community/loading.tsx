import { CommunityPageFrame } from './_features/community-page-frame'

export default function CommunityLoading() {
  return (
    <CommunityPageFrame
      sidebarUser={null}
      rightRail={
        <div className="space-y-4">
          <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
          <div className="h-60 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      }
    >
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-16 w-full animate-pulse rounded-xl bg-muted" />
        <div className="mt-4 space-y-3">
          <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </CommunityPageFrame>
  )
}
