'use server'

import { createHmac, randomUUID } from 'node:crypto'
import type { Post, ShareChannel, ShareEventType } from '@make-the-change/core/shared'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPublicAppUrl } from '@/lib/public-url'
import {
  COMMUNITY_CACHE_TAGS,
  getComments,
  getCommentsPage,
  getPostById,
} from '@/lib/social/feed.reads'
import {
  extractHashtagsFromText,
  hashtagLabelFromSlug,
  sanitizeHashtagSlug,
} from '@/lib/social/hashtags'
import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, isRecord } from '@/lib/type-guards'

const SHARE_EVENT_TYPES = new Set<ShareEventType>([
  'initiated',
  'channel_clicked',
  'link_copied',
  'target_opened',
  'landing',
  'conversion',
])

const SHARE_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const REEL_STORAGE_BUCKET = 'community-media'
const MAX_REEL_VIDEO_SIZE_BYTES = 100 * 1024 * 1024
const MAX_REEL_DURATION_SECONDS = 60
const REEL_ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4'])

const safeRevalidateTag = (tag: string) => {
  try {
    revalidateTag(tag, 'max')
  } catch {
    // Fallback path invalidation remains active in each mutation.
  }
}

const normalizeUuid = (value: string, errorLabel: string) => {
  const normalized = asString(value).trim()
  if (!UUID_REGEX.test(normalized)) {
    throw new Error(`${errorLabel} invalide`)
  }

  return normalized
}

const normalizeStoragePath = (value: string) => asString(value).trim().replace(/^\/+/, '')

const invalidateCommunityCaches = (input?: { postId?: string | null; guildId?: string | null }) => {
  safeRevalidateTag(COMMUNITY_CACHE_TAGS.feed)
  safeRevalidateTag(COMMUNITY_CACHE_TAGS.hashtags)
  safeRevalidateTag(COMMUNITY_CACHE_TAGS.guilds)
  safeRevalidateTag(COMMUNITY_CACHE_TAGS.leaderboard)

  const postId = asString(input?.postId).trim()
  const guildId = asString(input?.guildId).trim()

  if (postId) {
    safeRevalidateTag(COMMUNITY_CACHE_TAGS.post(postId))
  }

  if (guildId) {
    safeRevalidateTag(COMMUNITY_CACHE_TAGS.guild(guildId))
  }
}

const isShareChannel = (value: unknown): value is ShareChannel =>
  value === 'copy' ||
  value === 'x' ||
  value === 'linkedin' ||
  value === 'facebook' ||
  value === 'native' ||
  value === 'whatsapp' ||
  value === 'telegram' ||
  value === 'email' ||
  value === 'reddit' ||
  value === 'embed' ||
  value === 'internal_quote'

const isShareEventType = (value: unknown): value is ShareEventType =>
  typeof value === 'string' && SHARE_EVENT_TYPES.has(value as ShareEventType)

const buildPostAbsoluteUrl = (postId: string) => `${getPublicAppUrl()}/community/posts/${postId}`

const buildPostOgImageUrl = (postId: string, variant: string = 'default') =>
  `${getPublicAppUrl()}/api/og/community/post/${postId}?variant=${encodeURIComponent(variant)}`

const buildQuoteSourceSnapshot = (sourcePost: Post) => ({
  id: sourcePost.id,
  content: sourcePost.content || null,
  image_urls: sourcePost.image_urls || [],
  created_at: sourcePost.created_at,
  author_id: asString(sourcePost.author?.id || sourcePost.author_id),
  author_full_name: asString(sourcePost.author?.full_name, 'Utilisateur'),
  author_avatar_url: asString(sourcePost.author?.avatar_url) || null,
})

const upsertHashtagRelations = async (postId: string, hashtags: string[]) => {
  if (hashtags.length === 0) {
    return
  }

  const supabase = await createClient()

  const upsertPayloadWithLabel = hashtags.map((slug) => ({
    slug,
    label: hashtagLabelFromSlug(slug),
  }))

  const upsertWithLabel = await supabase
    .schema('social')
    .from('hashtags')
    .upsert(upsertPayloadWithLabel, { onConflict: 'slug' })

  if (upsertWithLabel.error) {
    await supabase
      .schema('social')
      .from('hashtags')
      .upsert(
        hashtags.map((slug) => ({ slug })),
        { onConflict: 'slug' },
      )
  }

  const { data: hashtagRows, error: hashtagRowsError } = await supabase
    .schema('social')
    .from('hashtags')
    .select('id, slug')
    .in('slug', hashtags)

  if (hashtagRowsError || !hashtagRows || hashtagRows.length === 0) {
    return
  }

  const normalizedHashtagRows = hashtagRows
    .map((row) => {
      if (!isRecord(row)) {
        return null
      }

      const hashtagId = asString(row.id).trim()
      if (!hashtagId) {
        return null
      }

      return {
        id: hashtagId,
        slug: asString(row.slug) || null,
      }
    })
    .filter((row): row is { id: string; slug: string | null } => row !== null)

  if (normalizedHashtagRows.length === 0) {
    return
  }

  const relationPayload = normalizedHashtagRows.map((hashtag) => ({
    post_id: postId,
    hashtag_id: hashtag.id,
    hashtag_slug: hashtag.slug,
  }))

  const relationInsert = await supabase
    .schema('social')
    .from('post_hashtags')
    .upsert(relationPayload, { onConflict: 'post_id,hashtag_id' })

  if (relationInsert.error) {
    await supabase
      .schema('social')
      .from('post_hashtags')
      .upsert(
        normalizedHashtagRows.map((hashtag) => ({ post_id: postId, hashtag_id: hashtag.id })),
        { onConflict: 'post_id,hashtag_id' },
      )
  }
}

const insertPost = async (payload: Record<string, unknown>) => {
  const supabase = await createClient()
  return supabase.schema('social').from('posts').insert(payload).select().single()
}

export async function toggleLike(postId: string) {
  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    throw new Error('Publication invalide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: existing } = await supabase
    .schema('social')
    .from('reactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', normalizedPostId)
    .eq('type', 'like')
    .maybeSingle()

  let isLiked = false

  if (existing?.id) {
    await supabase.schema('social').from('reactions').delete().eq('id', existing.id)
    isLiked = false
  } else {
    await supabase.schema('social').from('reactions').insert({
      user_id: user.id,
      post_id: normalizedPostId,
      type: 'like',
    })
    isLiked = true
  }

  invalidateCommunityCaches({ postId: normalizedPostId })
  revalidatePath('/community')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isLiked
}

export async function toggleBookmark(postId: string) {
  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    throw new Error('Publication invalide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: existing } = await supabase
    .schema('social')
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', normalizedPostId)
    .maybeSingle()

  let isBookmarked = false

  if (existing?.id) {
    await supabase.schema('social').from('bookmarks').delete().eq('id', existing.id)
    isBookmarked = false
  } else {
    await supabase
      .schema('social')
      .from('bookmarks')
      .insert({ user_id: user.id, post_id: normalizedPostId })
    isBookmarked = true
  }

  invalidateCommunityCaches({ postId: normalizedPostId })
  revalidatePath('/community')
  revalidatePath('/community/bookmarks')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isBookmarked
}

export async function toggleFollowUser(followingUserId: string) {
  const normalizedFollowingUserId = normalizeUuid(followingUserId, 'Utilisateur')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  if (user.id === normalizedFollowingUserId) {
    return false
  }

  const { data: existing, error: existingError } = await supabase
    .schema('social')
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', normalizedFollowingUserId)
    .maybeSingle()

  if (existingError) {
    throw new Error("Impossible d'actualiser le suivi")
  }

  let isFollowing = false

  if (existing?.id) {
    const { error: deleteError } = await supabase
      .schema('social')
      .from('follows')
      .delete()
      .eq('id', existing.id)

    if (deleteError) {
      throw new Error("Impossible d'actualiser le suivi")
    }

    isFollowing = false
  } else {
    const { error: insertError } = await supabase.schema('social').from('follows').insert({
      follower_id: user.id,
      following_id: normalizedFollowingUserId,
      producer_id: null,
    })

    if (insertError) {
      throw new Error("Impossible d'actualiser le suivi")
    }

    isFollowing = true
  }

  safeRevalidateTag(COMMUNITY_CACHE_TAGS.feed)
  revalidatePath('/community')
  revalidatePath('/profile/[id]')
  revalidatePath(`/profile/${normalizedFollowingUserId}`)

  return isFollowing
}

export async function toggleFollowProducer(producerId: string) {
  const normalizedProducerId = normalizeUuid(producerId, 'Producteur')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: existing, error: existingError } = await supabase
    .schema('social')
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('producer_id', normalizedProducerId)
    .maybeSingle()

  if (existingError) {
    throw new Error("Impossible d'actualiser le suivi")
  }

  let isFollowing = false

  if (existing?.id) {
    const { error: deleteError } = await supabase
      .schema('social')
      .from('follows')
      .delete()
      .eq('id', existing.id)

    if (deleteError) {
      throw new Error("Impossible d'actualiser le suivi")
    }

    isFollowing = false
  } else {
    const { error: insertError } = await supabase.schema('social').from('follows').insert({
      follower_id: user.id,
      following_id: null,
      producer_id: normalizedProducerId,
    })

    if (insertError) {
      throw new Error("Impossible d'actualiser le suivi")
    }

    isFollowing = true
  }

  safeRevalidateTag(COMMUNITY_CACHE_TAGS.feed)
  revalidatePath('/community')
  revalidatePath('/producers')
  revalidatePath('/producers/[slug]')

  return isFollowing
}

export async function createPost(
  content: string,
  imageUrls: string[] = [],
  options?: { guildId?: string | null },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté pour publier')
  }

  const trimmedContent = content.trim()
  if (!trimmedContent) {
    throw new Error('Le contenu ne peut pas être vide')
  }

  const normalizedGuildId = asString(options?.guildId).trim()
  const hashtags = extractHashtagsFromText(trimmedContent)
  const metadata: Record<string, unknown> = {
    hashtags,
    share_kind: 'original',
  }

  if (normalizedGuildId) {
    const { data: membership, error: membershipError } = await supabase
      .schema('identity')
      .from('guild_members')
      .select('guild_id')
      .eq('guild_id', normalizedGuildId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (membershipError || !membership) {
      throw new Error('Vous devez être membre de cette guilde pour publier')
    }

    const { data: guildRow } = await supabase
      .schema('identity')
      .from('guilds')
      .select('slug')
      .eq('id', normalizedGuildId)
      .maybeSingle()

    metadata.guild_id = normalizedGuildId
    metadata.guild_slug = asString(guildRow?.slug) || null
  }

  const payload: Record<string, unknown> = {
    author_id: user.id,
    content: trimmedContent,
    image_urls: imageUrls,
    type: 'user_post',
    visibility: normalizedGuildId ? 'guild_only' : 'public',
    share_kind: 'original',
    source_post_id: null,
    metadata,
  }

  const insertResponse = await insertPost(payload)

  if (insertResponse.error || !insertResponse.data) {
    console.error('Error creating post:', JSON.stringify(insertResponse.error, null, 2))
    throw new Error('Impossible de publier le message')
  }

  try {
    await upsertHashtagRelations(asString(insertResponse.data.id), hashtags)
  } catch {
    // Best effort while hashtag schema is being rolled out.
  }

  invalidateCommunityCaches({
    postId: asString(insertResponse.data.id),
    guildId: normalizedGuildId || null,
  })
  revalidatePath('/community')
  revalidatePath('/community/hashtags')
  revalidatePath('/community/trending')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return insertResponse.data
}

export type CreateVideoPostInput = {
  content?: string | null
  hashtags?: string[]
  publicUrl: string
  storagePath: string
  storageBucket?: string
  mimeType: string
  sizeBytes: number
  width?: number | null
  height?: number | null
  durationSeconds?: number | null
}

export async function createVideoPost(input: CreateVideoPostInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté pour publier')
  }

  const normalizedContent = asString(input.content).trim()
  const normalizedPublicUrl = asString(input.publicUrl).trim()
  const normalizedStoragePath = normalizeStoragePath(input.storagePath)
  const normalizedStorageBucket = asString(input.storageBucket).trim() || REEL_STORAGE_BUCKET
  const normalizedMimeType = asString(input.mimeType).trim().toLowerCase()
  const normalizedSizeBytes = Math.max(0, asNumber(input.sizeBytes, 0))
  const normalizedDurationSeconds = asNumber(input.durationSeconds, 0)
  const normalizedWidth = asNumber(input.width, 0) || null
  const normalizedHeight = asNumber(input.height, 0) || null

  if (!normalizedPublicUrl || !normalizedStoragePath) {
    throw new Error('Vidéo invalide')
  }

  if (normalizedStorageBucket !== REEL_STORAGE_BUCKET) {
    throw new Error('Bucket non autorisé')
  }

  if (!normalizedStoragePath.startsWith(`${user.id}/`)) {
    throw new Error('Chemin vidéo invalide')
  }

  if (!REEL_ALLOWED_VIDEO_MIME_TYPES.has(normalizedMimeType)) {
    throw new Error('Seuls les fichiers MP4 sont autorisés')
  }

  if (normalizedSizeBytes <= 0 || normalizedSizeBytes > MAX_REEL_VIDEO_SIZE_BYTES) {
    throw new Error('La vidéo dépasse la taille maximale de 100MB')
  }

  if (normalizedDurationSeconds > MAX_REEL_DURATION_SECONDS) {
    throw new Error('La vidéo dépasse la durée maximale de 60 secondes')
  }

  const normalizedHashtags = [
    ...new Set(
      [
        ...extractHashtagsFromText(normalizedContent),
        ...(input.hashtags || []).map((tag) => sanitizeHashtagSlug(tag)),
      ].filter(Boolean),
    ),
  ]

  const metadata: Record<string, unknown> = {
    hashtags: normalizedHashtags,
    share_kind: 'original',
    post_format: 'reel',
    primary_video_url: normalizedPublicUrl,
    primary_video_mime_type: normalizedMimeType,
    video_duration_seconds: normalizedDurationSeconds || null,
  }

  const payload: Record<string, unknown> = {
    author_id: user.id,
    content: normalizedContent || null,
    image_urls: [],
    type: 'user_post',
    visibility: 'public',
    share_kind: 'original',
    source_post_id: null,
    metadata,
  }

  const insertResponse = await insertPost(payload)

  if (insertResponse.error || !insertResponse.data) {
    console.error('Error creating video post:', JSON.stringify(insertResponse.error, null, 2))
    throw new Error('Impossible de publier la vidéo')
  }

  const postId = asString(insertResponse.data.id).trim()
  if (!postId) {
    throw new Error('Impossible de publier la vidéo')
  }

  const { error: mediaError } = await supabase.schema('social').from('post_media').insert({
    post_id: postId,
    owner_id: user.id,
    public_url: normalizedPublicUrl,
    storage_bucket: normalizedStorageBucket,
    storage_path: normalizedStoragePath,
    mime_type: normalizedMimeType,
    size_bytes: normalizedSizeBytes,
    width: normalizedWidth,
    height: normalizedHeight,
    sort_order: 0,
    status: 'ready',
  })

  if (mediaError) {
    await supabase.schema('social').from('posts').delete().eq('id', postId)
    console.error('Error linking video media:', JSON.stringify(mediaError, null, 2))
    throw new Error('Impossible de publier la vidéo')
  }

  try {
    await upsertHashtagRelations(postId, normalizedHashtags)
  } catch {
    // Best effort while hashtag schema is being rolled out.
  }

  invalidateCommunityCaches({ postId })
  revalidatePath('/community')
  revalidatePath('/community/reels')
  revalidatePath('/community/reels/new')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return insertResponse.data
}

export async function createQuoteRepost(
  sourcePostId: string,
  content: string,
  hashtags: string[] = [],
) {
  const normalizedSourcePostId = asString(sourcePostId).trim()
  if (!normalizedSourcePostId) {
    throw new Error('Publication source introuvable')
  }

  const trimmedContent = content.trim()
  if (!trimmedContent) {
    throw new Error('Le contenu ne peut pas être vide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté pour publier')
  }

  const sourcePost = await getPostById(normalizedSourcePostId)
  if (!sourcePost) {
    throw new Error('Publication source introuvable')
  }

  const normalizedHashtags = [
    ...new Set(
      [
        ...extractHashtagsFromText(trimmedContent),
        ...hashtags.map((tag) => sanitizeHashtagSlug(tag)),
      ].filter(Boolean),
    ),
  ]

  const metadata: Record<string, unknown> = {
    hashtags: normalizedHashtags,
    share_kind: 'quote',
    source_post_id: sourcePost.id,
    quote_source: buildQuoteSourceSnapshot(sourcePost),
    share_url: buildPostAbsoluteUrl(sourcePost.id),
    og_image_url: buildPostOgImageUrl(sourcePost.id),
  }

  const payload: Record<string, unknown> = {
    author_id: user.id,
    content: trimmedContent,
    image_urls: [],
    type: 'user_post',
    visibility: 'public',
    share_kind: 'quote',
    source_post_id: sourcePost.id,
    metadata,
  }

  const insertResponse = await insertPost(payload)

  if (insertResponse.error || !insertResponse.data) {
    console.error('Error creating quote repost:', JSON.stringify(insertResponse.error, null, 2))
    throw new Error('Impossible de republier ce message')
  }

  try {
    await upsertHashtagRelations(asString(insertResponse.data.id), normalizedHashtags)
  } catch {
    // Best effort while hashtag schema is being rolled out.
  }

  try {
    await recordShareEvent({
      postId: sourcePost.id,
      channel: 'internal_quote',
      eventType: 'conversion',
      targetUrl: buildPostAbsoluteUrl(asString(insertResponse.data.id)),
    })
  } catch {
    // Quote repost should not fail if analytics cannot be persisted.
  }

  invalidateCommunityCaches({
    postId: asString(insertResponse.data.id),
    guildId: asString(sourcePost.guild_id),
  })
  revalidatePath('/community')
  revalidatePath('/community/hashtags')
  revalidatePath('/community/trending')
  revalidatePath(`/community/posts/${sourcePost.id}`)
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return insertResponse.data
}

export async function addComment(postId: string, content: string) {
  const normalizedPostId = asString(postId).trim()
  const trimmedContent = content.trim()

  if (!normalizedPostId) {
    throw new Error('Publication invalide')
  }

  if (!trimmedContent) {
    throw new Error('Le commentaire ne peut pas être vide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { error } = await supabase.schema('social').from('comments').insert({
    post_id: normalizedPostId,
    author_id: user.id,
    content: trimmedContent,
  })

  if (error) {
    console.error('Error adding comment:', JSON.stringify(error, null, 2))
    throw new Error("Impossible d'ajouter le commentaire")
  }

  invalidateCommunityCaches({ postId: normalizedPostId })
  revalidatePath('/community')
  revalidatePath(`/community/posts/${normalizedPostId}`)
  revalidatePath('/dashboard')
}

export async function fetchPostComments(postId: string) {
  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    return []
  }

  return getComments(normalizedPostId)
}

export async function fetchPostCommentsPage(
  postId: string,
  options?: {
    page?: number
    limit?: number
    sort?: 'top' | 'newest'
  },
) {
  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    return {
      comments: [],
      hasMore: false,
      totalCount: 0,
      page: 1,
    }
  }

  return getCommentsPage(normalizedPostId, {
    page: asNumber(options?.page, 1),
    limit: asNumber(options?.limit, 20),
    sort: options?.sort === 'top' ? 'top' : 'newest',
  })
}

export async function toggleCommentLike(commentId: string) {
  const normalizedCommentId = asString(commentId).trim()
  if (!normalizedCommentId) {
    throw new Error('Commentaire invalide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: existing, error: existingError } = await supabase
    .schema('social')
    .from('reactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('comment_id', normalizedCommentId)
    .eq('type', 'like')
    .maybeSingle()

  if (existingError) {
    throw new Error("Impossible d'actualiser la réaction")
  }

  let isLiked = false

  if (existing?.id) {
    const { error: deleteError } = await supabase
      .schema('social')
      .from('reactions')
      .delete()
      .eq('id', existing.id)

    if (deleteError) {
      throw new Error("Impossible d'actualiser la réaction")
    }

    isLiked = false
  } else {
    const { error: insertError } = await supabase.schema('social').from('reactions').insert({
      user_id: user.id,
      comment_id: normalizedCommentId,
      type: 'like',
    })

    if (insertError) {
      throw new Error("Impossible d'actualiser la réaction")
    }

    isLiked = true
  }

  invalidateCommunityCaches()
  revalidatePath('/community')

  return isLiked
}

export async function toggleSuperLike(postId: string) {
  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    throw new Error('Publication invalide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: seedItem } = await supabase
    .schema('gamification')
    .from('items')
    .select('id')
    .eq('slug', 'graine')
    .maybeSingle()

  const { data: existing } = await supabase
    .schema('social')
    .from('reactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', normalizedPostId)
    .eq('type', 'super_like')
    .maybeSingle()

  let isSuperLiked = false

  if (existing?.id) {
    await supabase.schema('social').from('reactions').delete().eq('id', existing.id)

    if (seedItem?.id) {
      const { data: inventoryItem } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('item_id', seedItem.id)
        .maybeSingle()

      if (inventoryItem?.id) {
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
    if (seedItem?.id) {
      const { data: inventoryItem } = await supabase
        .schema('gamification')
        .from('user_inventory')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('item_id', seedItem.id)
        .maybeSingle()

      if (!inventoryItem || inventoryItem.quantity < 1) {
        throw new Error("Vous n'avez pas assez de graines (inventaire insuffisant)")
      }

      await supabase
        .schema('gamification')
        .from('user_inventory')
        .update({ quantity: inventoryItem.quantity - 1, updated_at: new Date().toISOString() })
        .eq('id', inventoryItem.id)
    }

    await supabase.schema('social').from('reactions').insert({
      user_id: user.id,
      post_id: normalizedPostId,
      type: 'super_like',
    })
    isSuperLiked = true
  }

  invalidateCommunityCaches({ postId: normalizedPostId })
  revalidatePath('/community')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isSuperLiked
}

type ShareTokenPayload = {
  post_id: string
  channel: ShareChannel
  actor_user_id: string | null
  issued_at: number
  nonce: string
}

const getShareTokenSecret = () =>
  asString(process.env.SHARE_TOKEN_SECRET).trim() ||
  asString(process.env.NEXTAUTH_SECRET).trim() ||
  asString(process.env.SUPABASE_SERVICE_ROLE_KEY).trim() ||
  asString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).trim() ||
  'mtc-share-token-dev'

const base64UrlEncode = (value: string) => Buffer.from(value, 'utf8').toString('base64url')
const base64UrlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

const signShareToken = (payload: ShareTokenPayload) => {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = createHmac('sha256', getShareTokenSecret())
    .update(encodedPayload)
    .digest('base64url')

  return `${encodedPayload}.${signature}`
}

const verifyShareToken = (token: string, expectedPostId?: string): boolean => {
  const parts = token.split('.')
  if (parts.length !== 2) {
    return false
  }

  const encodedPayload = parts[0]
  const signature = parts[1]
  if (!encodedPayload || !signature) {
    return false
  }

  const expectedSignature = createHmac('sha256', getShareTokenSecret())
    .update(encodedPayload)
    .digest('base64url')

  if (signature !== expectedSignature) {
    return false
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as ShareTokenPayload
    if (expectedPostId && payload.post_id !== expectedPostId) {
      return false
    }

    return Date.now() - asNumber(payload.issued_at, 0) <= SHARE_TOKEN_TTL_MS
  } catch {
    return false
  }
}

export async function issueShareToken(postId: string, channel: ShareChannel) {
  if (!isShareChannel(channel)) {
    return null
  }

  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    return null
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const token = signShareToken({
    post_id: normalizedPostId,
    channel,
    actor_user_id: user?.id || null,
    issued_at: Date.now(),
    nonce: randomUUID(),
  })

  try {
    await recordShareEvent({
      postId: normalizedPostId,
      channel,
      eventType: 'initiated',
      shareToken: token,
      targetUrl: buildPostAbsoluteUrl(normalizedPostId),
    })
  } catch {
    // Share token generation should not fail when analytics is unavailable.
  }

  return token
}

type RecordShareEventInput = {
  postId: string
  channel: ShareChannel
  eventType: ShareEventType
  shareToken?: string | null
  targetUrl?: string | null
  referrer?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown>
}

export async function recordShareEvent(input: RecordShareEventInput) {
  const normalizedPostId = asString(input.postId).trim()
  const normalizedChannel = input.channel
  const normalizedEventType = input.eventType
  const normalizedShareToken = asString(input.shareToken).trim() || null
  const normalizedTargetUrl = asString(input.targetUrl).trim() || null
  const normalizedReferrer = asString(input.referrer).trim() || null
  const normalizedUserAgent = asString(input.userAgent).trim() || null

  if (
    !normalizedPostId ||
    !isShareChannel(normalizedChannel) ||
    !isShareEventType(normalizedEventType)
  ) {
    return false
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    normalizedEventType === 'landing' &&
    !user &&
    (!normalizedShareToken || !verifyShareToken(normalizedShareToken, normalizedPostId))
  ) {
    return false
  }

  const payload = {
    post_id: normalizedPostId,
    actor_user_id: user?.id || null,
    channel: normalizedChannel,
    event_type: normalizedEventType,
    share_token: normalizedShareToken,
    target_url: normalizedTargetUrl,
    referrer: normalizedReferrer,
    user_agent: normalizedUserAgent,
    metadata: isRecord(input.metadata) ? input.metadata : {},
  }

  const insertWithActorUserId = await supabase
    .schema('social')
    .from('post_share_events')
    .insert(payload)

  if (!insertWithActorUserId.error) {
    return true
  }

  const legacyPayload = {
    post_id: normalizedPostId,
    user_id: user?.id || null,
    channel: normalizedChannel,
    event_type: normalizedEventType,
    share_token: normalizedShareToken,
    target_url: normalizedTargetUrl,
    referrer: normalizedReferrer,
    user_agent: normalizedUserAgent,
    metadata: isRecord(input.metadata) ? input.metadata : {},
  }

  const insertWithUserId = await supabase
    .schema('social')
    .from('post_share_events')
    .insert(legacyPayload)

  return !insertWithUserId.error
}

export async function recordPostShare(
  postId: string,
  channel: ShareChannel,
  meta?: Record<string, unknown>,
) {
  if (!isShareChannel(channel)) {
    return false
  }

  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    return false
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const insertWithMetadata = await supabase
    .schema('social')
    .from('post_shares')
    .insert({
      post_id: normalizedPostId,
      channel,
      user_id: user?.id || null,
      metadata: isRecord(meta) ? meta : {},
    })

  let shareRecorded = !insertWithMetadata.error

  if (!shareRecorded) {
    const insertWithoutMetadata = await supabase
      .schema('social')
      .from('post_shares')
      .insert({
        post_id: normalizedPostId,
        channel,
        user_id: user?.id || null,
      })

    shareRecorded = !insertWithoutMetadata.error
  }

  if (!shareRecorded) {
    const { data: postRow } = await supabase
      .schema('social')
      .from('posts')
      .select('id, shares_count')
      .eq('id', normalizedPostId)
      .maybeSingle()

    if (postRow) {
      const updateFallback = await supabase
        .schema('social')
        .from('posts')
        .update({ shares_count: asNumber(postRow.shares_count, 0) + 1 })
        .eq('id', normalizedPostId)

      shareRecorded = !updateFallback.error
    }
  }

  invalidateCommunityCaches({ postId: normalizedPostId })
  revalidatePath('/community')
  revalidatePath(`/community/posts/${normalizedPostId}`)
  revalidatePath('/community/trending')

  return shareRecorded
}

export async function joinGuild(guildId: string) {
  const normalizedGuildId = asString(guildId).trim()
  if (!normalizedGuildId) {
    throw new Error('Guilde invalide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: guildRow } = await supabase
    .schema('identity')
    .from('guilds')
    .select('slug')
    .eq('id', normalizedGuildId)
    .maybeSingle()

  const { error } = await supabase.schema('identity').from('guild_members').upsert(
    {
      guild_id: normalizedGuildId,
      user_id: user.id,
      role: 'member',
    },
    { onConflict: 'guild_id,user_id' },
  )

  if (error) {
    throw new Error('Impossible de rejoindre cette guilde')
  }

  const guildSlug = asString(guildRow?.slug)
  invalidateCommunityCaches({ guildId: normalizedGuildId })
  revalidatePath('/community/guilds')
  revalidatePath('/community')
  if (guildSlug) {
    revalidatePath(`/community/guilds/${guildSlug}`)
  }

  return { success: true }
}

export async function leaveGuild(guildId: string) {
  const normalizedGuildId = asString(guildId).trim()
  if (!normalizedGuildId) {
    throw new Error('Guilde invalide')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: guildRow } = await supabase
    .schema('identity')
    .from('guilds')
    .select('slug')
    .eq('id', normalizedGuildId)
    .maybeSingle()

  const { error } = await supabase
    .schema('identity')
    .from('guild_members')
    .delete()
    .eq('guild_id', normalizedGuildId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Impossible de quitter cette guilde')
  }

  const guildSlug = asString(guildRow?.slug)
  invalidateCommunityCaches({ guildId: normalizedGuildId })
  revalidatePath('/community/guilds')
  revalidatePath('/community')
  if (guildSlug) {
    revalidatePath(`/community/guilds/${guildSlug}`)
  }

  return { success: true }
}
