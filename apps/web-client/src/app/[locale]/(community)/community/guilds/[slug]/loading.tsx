import { CommunityPageFrame } from '../../_features/community-page-frame'

export default function CommunityGuildDetailLoading() {
  return (
    <CommunityPageFrame
      sidebarUser={null}
      centerClassName="max-w-[760px]"
      rightRail={
        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
          <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      }
    >
      <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="h-10 w-44 animate-pulse rounded-xl bg-muted" />
        <div className="h-56 w-full animate-pulse rounded-3xl bg-muted" />
        <div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    </CommunityPageFrame>
  )
}
