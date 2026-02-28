import { CommunityPageFrame } from '../_features/community-page-frame'

export default function CommunityReelsLoading() {
  return (
    <CommunityPageFrame centerClassName="max-w-[760px]">
      <div className="h-[100svh] w-full bg-black p-4">
        <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
        <div className="mt-4 h-[calc(100svh-6.3rem)] w-full animate-pulse rounded-2xl bg-white/10" />
      </div>
    </CommunityPageFrame>
  )
}
