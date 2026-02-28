import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'
import { getPostContextList } from '@/lib/api/post-context.service'
import type { PostContext } from '@/types/context'
import type { Post } from '@make-the-change/core/shared'

// Convert PostContext to Post format for FeedClient compatibility
function convertPostContextToPost(context: PostContext): Post {
  return {
    id: context.id,
    author_id: '', // Will be filled by FeedClient
    content: context.content,
    image_urls: [], // Will be filled by FeedClient if needed
    project_update_id: null,
    type: 'user_post' as const,
    visibility: 'public' as const,
    metadata: {},
    created_at: context.created_at,
    updated_at: context.created_at,
    author: {
      id: '',
      full_name: context.author_name,
      avatar_url: context.author_avatar || '',
    },
    hashtags: [],
    comments_count: context.engagement.comments,
    reactions_count: context.engagement.likes,
    shares_count: context.engagement.shares,
    user_has_reacted: context.user_state.hasLiked,
    user_has_bookmarked: context.user_state.hasBookmarked,
    media: [],
    primary_video_url: null,
    primary_video_mime_type: null,
  }
}

export async function getUserLikedPosts(limit = 20) {
  const supabase = await createClient()
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return []
    }

    // Get liked post IDs
    const { data: reactions, error: reactionsError } = await supabase
      .schema('social')
      .from('reactions')
      .select('post_id')
      .eq('user_id', user.id)
      .eq('type', 'like')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (reactionsError || !reactions) {
      console.error('Error fetching liked posts:', reactionsError)
      return []
    }

    const postIds = reactions
      .map(r => asString(r.post_id))
      .filter(Boolean)

    if (postIds.length === 0) {
      return []
    }

    // Get post details using the enhanced post context service
    const allPosts = await getPostContextList()
    const likedPosts = allPosts.filter((post: PostContext) => postIds.includes(post.id))

    // Convert PostContext to Post format for FeedClient compatibility
    return likedPosts.map(convertPostContextToPost).slice(0, limit)
  } catch (error) {
    console.error('Error in getUserLikedPosts:', error)
    return []
  }
}

export async function getUserBookmarkedPosts(limit = 20) {
  const supabase = await createClient()
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return []
    }

    // Get bookmarked post IDs
    const { data: bookmarks, error: bookmarksError } = await supabase
      .schema('social')
      .from('bookmarks')
      .select('post_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (bookmarksError || !bookmarks) {
      console.error('Error fetching bookmarked posts:', bookmarksError)
      return []
    }

    const postIds = bookmarks
      .map(b => asString(b.post_id))
      .filter(Boolean)

    if (postIds.length === 0) {
      return []
    }

    // Get post details using the enhanced post context service
    const allPosts = await getPostContextList()
    const bookmarkedPosts = allPosts.filter((post: PostContext) => postIds.includes(post.id))

    // Convert PostContext to Post format for FeedClient compatibility
    return bookmarkedPosts.map(convertPostContextToPost).slice(0, limit)
  } catch (error) {
    console.error('Error in getUserBookmarkedPosts:', error)
    return []
  }
}
