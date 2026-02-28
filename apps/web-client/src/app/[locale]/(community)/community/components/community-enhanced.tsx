import { PostContext } from '@/types/context'
import { PostCardEnhanced } from './post-card-enhanced'

interface CommunityEnhancedProps {
  posts: PostContext[]
}

export function CommunityEnhanced({ posts }: CommunityEnhancedProps) {
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
