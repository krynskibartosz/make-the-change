import type { PostContext } from '@/types/context'
import { PostCardEnhanced } from './post-card-enhanced'

interface AdventureEnhancedProps {
  posts: PostContext[]
}

export function AdventureEnhanced({ posts }: AdventureEnhancedProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCardEnhanced key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
