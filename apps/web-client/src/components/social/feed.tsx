import type { FeedScope, FeedSort } from '@make-the-change/core/shared'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { getFeed } from '@/lib/social/feed.actions'
import { createClient } from '@/lib/supabase/server'
import { FeedClient } from './feed-client'

interface FeedProps {
  sort?: FeedSort
  scope?: FeedScope
  hashtagSlug?: string
  guildId?: string
  hideCreatePost?: boolean
  limit?: number
}

export async function Feed({
  sort = 'newest',
  scope = 'all',
  hashtagSlug = '',
  guildId = '',
  hideCreatePost = false,
  limit = 20,
}: FeedProps) {
  const supabase = await createClient()

  const [{ data: authData }, posts] = await Promise.all([
    supabase.auth.getUser(),
    getFeed({ page: 1, limit, sort, scope, hashtagSlug, guildId }),
  ])

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <FeedClient initialPosts={posts} hideCreatePost={hideCreatePost} canWrite={!!authData.user} />
    </Suspense>
  )
}
