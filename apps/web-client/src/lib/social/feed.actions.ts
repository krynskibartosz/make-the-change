'use server'

import type { Post } from '@make-the-change/core/shared'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'

const isPostType = (value: unknown): value is Post['type'] =>
  value === 'user_post' || value === 'project_update_share' || value === 'system_event'

const isPostVisibility = (value: unknown): value is Post['visibility'] =>
  value === 'public' || value === 'guild_only' || value === 'private'

const extractCount = (value: unknown): number => {
  if (!Array.isArray(value) || value.length === 0) {
    return 0
  }

  const firstEntry = value[0]
  if (!isRecord(firstEntry)) {
    return 0
  }

  return asNumber(firstEntry.count, 0)
}

const mapRowToPost = (row: unknown, userHasReacted: boolean): Post | null => {
  if (!isRecord(row)) {
    return null
  }

  const id = asString(row.id)
  const authorId = asString(row.author_id)
  const createdAt = asString(row.created_at)
  const updatedAt = asString(row.updated_at)

  if (!id || !authorId || !createdAt || !updatedAt) {
    return null
  }

  const typeValue = row.type
  const visibilityValue = row.visibility
  const metadata = isRecord(row.metadata) ? row.metadata : {}

  return {
    id,
    author_id: authorId,
    content: typeof row.content === 'string' ? row.content : null,
    image_urls: asStringArray(row.image_urls),
    project_update_id: asString(row.project_update_id) || null,
    type: isPostType(typeValue) ? typeValue : 'user_post',
    visibility: isPostVisibility(visibilityValue) ? visibilityValue : 'public',
    metadata,
    created_at: createdAt,
    updated_at: updatedAt,
    author: {
      id: authorId,
      full_name: asString(row.author_full_name, 'Utilisateur'),
      avatar_url: asString(row.author_avatar_url),
    },
    reactions_count: extractCount(row.reactions),
    comments_count: extractCount(row.comments),
    user_has_reacted: userHasReacted,
  }
}

/**
 * Fetch the main feed posts
 */
export async function getFeed(page = 1, limit = 20) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: posts, error } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(`
      *,
      reactions:reactions (count),
      comments:comments (count)
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching feed:', JSON.stringify(error, null, 2))
    throw new Error("Impossible de charger le fil d'actualité")
  }

  // Si on est connecté, vérifier les likes de l'utilisateur pour chaque post
  let userReactionsMap: Record<string, boolean> = {}

  if (user && posts.length > 0) {
    const postIds = posts
      .map((post) => asString(post.id))
      .filter((postId): postId is string => postId.length > 0)
    if (postIds.length > 0) {
      const { data: userReactions } = await supabase
        .schema('social')
        .from('reactions')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
        .eq('type', 'like')

      if (userReactions) {
        userReactionsMap = userReactions.reduce(
          (acc, r) => {
            if (r.post_id) acc[r.post_id] = true
            return acc
          },
          {} as Record<string, boolean>,
        )
      }
    }
  }

  return posts
    .map((post) => mapRowToPost(post, !!userReactionsMap[asString(post.id)]))
    .filter((post): post is Post => post !== null)
}

/**
 * Fetch feed posts for a specific user
 */
export async function getUserFeed(userId: string, page = 1, limit = 20) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: posts, error } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(`
      *,
      reactions:reactions (count),
      comments:comments (count)
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching user feed:', JSON.stringify(error, null, 2))
    throw new Error("Impossible de charger le fil d'actualité de l'utilisateur")
  }

  // Si on est connecté, vérifier les likes de l'utilisateur pour chaque post
  let userReactionsMap: Record<string, boolean> = {}

  if (user && posts.length > 0) {
    const postIds = posts
      .map((post) => asString(post.id))
      .filter((postId): postId is string => postId.length > 0)
    if (postIds.length > 0) {
      const { data: userReactions } = await supabase
        .schema('social')
        .from('reactions')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
        .eq('type', 'like')

      if (userReactions) {
        userReactionsMap = userReactions.reduce(
          (acc, r) => {
            if (r.post_id) acc[r.post_id] = true
            return acc
          },
          {} as Record<string, boolean>,
        )
      }
    }
  }

  return posts
    .map((post) => mapRowToPost(post, !!userReactionsMap[asString(post.id)]))
    .filter((post): post is Post => post !== null)
}

/**
 * Fetch one public post by id with author and counters
 */
export async function getPostById(postId: string): Promise<Post | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(`
      *,
      reactions:reactions (count),
      comments:comments (count)
    `)
    .eq('id', postId)
    .eq('visibility', 'public')
    .maybeSingle()

  if (error) {
    console.error('Error fetching post by id:', JSON.stringify(error, null, 2))
    throw new Error('Impossible de charger la publication')
  }

  if (!post) {
    return null
  }

  let userHasReacted = false

  if (user) {
    const { data: userReaction } = await supabase
      .schema('social')
      .from('reactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', post.id)
      .eq('type', 'like')
      .maybeSingle()

    userHasReacted = !!userReaction
  }

  return mapRowToPost(post, userHasReacted)
}

/**
 * Toggle a simple "like" reaction on a post
 */
export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Vous devez être connecté')

  // Check if already liked
  const { data: existing } = await supabase
    .schema('social')
    .from('reactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .eq('type', 'like')
    .single()

  let isLiked = false

  if (existing) {
    // Remove like
    await supabase.schema('social').from('reactions').delete().eq('id', existing.id)
    isLiked = false
  } else {
    // Add like
    await supabase.schema('social').from('reactions').insert({
      user_id: user.id,
      post_id: postId,
      type: 'like',
    })
    isLiked = true
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isLiked
}

/**
 * Create a new user post in the feed
 */
export async function createPost(content: string, imageUrls: string[] = []) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Vous devez être connecté pour publier')
  if (!content || content.trim() === '') throw new Error('Le contenu ne peut pas être vide')

  const { data: newPost, error } = await supabase
    .schema('social')
    .from('posts')
    .insert({
      author_id: user.id,
      content: content.trim(),
      image_urls: imageUrls,
      type: 'user_post',
      visibility: 'public',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', JSON.stringify(error, null, 2))
    throw new Error('Impossible de publier le message')
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return newPost
}

/**
 * Fetch comments for a specific post
 */
export async function getComments(postId: string) {
  const supabase = await createClient()

  const { data: comments, error } = await supabase
    .schema('social')
    .from('comments_with_authors')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', JSON.stringify(error, null, 2))
    throw new Error('Impossible de charger les commentaires')
  }

  return comments.map((comment) => ({
    ...comment,
    author: {
      id: comment.author_id,
      full_name: comment.author_full_name,
      avatar_url: comment.author_avatar_url,
    },
  }))
}

/**
 * Add a comment to a post
 */
export async function addComment(postId: string, content: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Vous devez être connecté')

  const { error } = await supabase.schema('social').from('comments').insert({
    post_id: postId,
    author_id: user.id,
    content,
  })

  if (error) {
    console.error('Error adding comment:', JSON.stringify(error, null, 2))
    throw new Error("Impossible d'ajouter le commentaire")
  }

  revalidatePath('/dashboard')
}

/**
 * Toggle super like on a post (Plant a seed)
 */
export async function toggleSuperLike(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Vous devez être connecté')

  // Identify the "seed" item ID (assuming slug is 'seed' or 'graine')
  const { data: seedItem } = await supabase
    .schema('gamification')
    .from('items')
    .select('id')
    .eq('slug', 'graine')
    .single()

  // Check if already super liked
  const { data: existing } = await supabase
    .schema('social')
    .from('reactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .eq('type', 'super_like')
    .single()

  let isSuperLiked = false

  if (existing) {
    // Remove super like
    await supabase.schema('social').from('reactions').delete().eq('id', existing.id)

    // Refund the seed
    if (seedItem) {
      const { data: inventoryItem } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('item_id', seedItem.id)
        .single()

      if (inventoryItem) {
        await supabase
          .schema('gamification')
          .from('user_inventory')
          .update({ quantity: inventoryItem.quantity + 1, updated_at: new Date().toISOString() })
          .eq('id', inventoryItem.id)
      } else {
        await supabase
          .schema('gamification')
          .from('user_inventory')
          .insert({ user_id: user.id, item_id: seedItem.id, quantity: 1 })
      }
    }

    isSuperLiked = false
  } else {
    // Try to Add super like

    // Check inventory first
    if (seedItem) {
      const { data: inventoryItem } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('item_id', seedItem.id)
        .single()

      if (!inventoryItem || inventoryItem.quantity < 1) {
        throw new Error("Vous n'avez pas assez de graines (inventaire insuffisant)")
      }

      // Deduct seed
      await supabase
        .schema('gamification')
        .from('user_inventory')
        .update({ quantity: inventoryItem.quantity - 1, updated_at: new Date().toISOString() })
        .eq('id', inventoryItem.id)
    }

    await supabase.schema('social').from('reactions').insert({
      user_id: user.id,
      post_id: postId,
      type: 'super_like',
    })
    isSuperLiked = true
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isSuperLiked
}
