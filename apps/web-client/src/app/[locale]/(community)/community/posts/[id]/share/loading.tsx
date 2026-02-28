import { CommunityPageFrame } from '../../../_features/community-page-frame'

export default function CommunityPostShareLoading() {
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
      <div className="space-y-4 px-4 py-6 sm:px-6 sm:py-8">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-80 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    </CommunityPageFrame>
  )
}
