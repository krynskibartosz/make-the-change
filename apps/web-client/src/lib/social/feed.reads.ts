import 'server-only'

import type { Database } from '@make-the-change/core/database-types'
import type {
  ContributorRank,
  ContributorScope,
  FeedScope,
  FeedSort,
  Guild,
  GuildMember,
  HashtagStats,
  Post,
} from '@make-the-change/core/shared'
import { cacheLife, cacheTag } from 'next/cache'
import { cache } from 'react'
import { getPublicAppUrl } from '@/lib/public-url'
import {
  extractHashtagsFromText,
  hashtagLabelFromSlug,
  sanitizeHashtagSlug,
} from '@/lib/social/hashtags'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { asBoolean, asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'

export type FeedQueryOptions = {
  page?: number
  limit?: number
  sort?: FeedSort
  hashtagSlug?: string
  guildId?: string
  scope?: FeedScope
}

type PostViewRow = Database['social']['Views']['posts_with_authors']['Row']
type PostRowWithCounts = PostViewRow & {
  reactions?: Array<{ count?: number | null }> | null
  comments?: Array<{ count?: number | null }> | null
  score?: number | null
  share_url?: string | null
  og_image_url?: string | null
}
type CommentViewRow = Database['social']['Views']['comments_with_authors']['Row']
type HashtagStatsViewRow = Database['social']['Views']['hashtag_stats']['Row'] & {
  hashtag_slug?: string | null
}
type PostMediaRow = Pick<
  Database['social']['Tables']['post_media']['Row'],
  'post_id' | 'public_url' | 'sort_order' | 'status'
>

type ContributorAggregation = {
  user_id: string
  full_name: string
  avatar_url: string | null
  author_type: 'citizen' | 'company'
  posts_count: number
  reactions_received: number
  comments_received: number
  score: number
}

type GuildDetails = {
  guild: Guild
  members: GuildMember[]
}

type GuildLeaderboardEntry = {
  guild_id: string
  guild_name: string
  guild_slug: string
  members_count: number
  posts_count: number
  reactions_received: number
  comments_received: number
  score: number
}

const FEED_WINDOW_SIZE = 300
const DEFAULT_FEED_LIMIT = 20
const CACHED_FEED_WINDOW_SIZE = 300

export const COMMUNITY_CACHE_TAGS = {
  feed: 'community:feed',
  hashtags: 'community:hashtags',
  guilds: 'community:guilds',
  leaderboard: 'community:leaderboard',
  post: (postId: string) => `community:post:${postId}`,
  guild: (guildId: string) => `community:guild:${guildId}`,
} as const

const isPostType = (value: unknown): value is Post['type'] =>
  value === 'user_post' || value === 'project_update_share' || value === 'system_event'

const isPostVisibility = (value: unknown): value is Post['visibility'] =>
  value === 'public' || value === 'guild_only' || value === 'private'

const isFeedSort = (value: unknown): value is FeedSort =>
  value === 'best' || value === 'newest' || value === 'oldest'

const isFeedScope = (value: unknown): value is FeedScope => value === 'all' || value === 'my_guilds'

const isContributorScope = (value: unknown): value is ContributorScope =>
  value === 'all' || value === 'citizens' || value === 'companies'

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

const computePostScore = (
  post: Pick<Post, 'created_at' | 'reactions_count' | 'comments_count' | 'shares_count'>,
): number => {
  const hoursSinceCreation = Math.max(
    0,
    (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60),
  )
  const freshness = Math.max(0, 48 - hoursSinceCreation)

  return (
    Math.round(
      (asNumber(post.reactions_count, 0) * 5 +
        asNumber(post.comments_count, 0) * 3 +
        asNumber(post.shares_count, 0) * 2 +
        freshness) *
        100,
    ) / 100
  )
}

const parseFeedOptions = (
  optionsOrPage: FeedQueryOptions | number | undefined,
  legacyLimit: number | undefined,
): Required<FeedQueryOptions> => {
  if (typeof optionsOrPage === 'number') {
    return {
      page: Math.max(1, optionsOrPage),
      limit: Math.max(1, legacyLimit || DEFAULT_FEED_LIMIT),
      sort: 'newest',
      hashtagSlug: '',
      guildId: '',
      scope: 'all',
    }
  }

  const options = optionsOrPage || {}

  return {
    page: Math.max(1, asNumber(options.page, 1)),
    limit: Math.max(1, asNumber(options.limit, DEFAULT_FEED_LIMIT)),
    sort: isFeedSort(options.sort) ? options.sort : 'newest',
    hashtagSlug: sanitizeHashtagSlug(asString(options.hashtagSlug)),
    guildId: asString(options.guildId).trim(),
    scope: isFeedScope(options.scope) ? options.scope : 'all',
  }
}

const mapRawAuthorType = (
  rawValue: unknown,
  metadata: Record<string, unknown>,
): 'citizen' | 'company' => {
  if (rawValue === 'citizen' || rawValue === 'company') {
    return rawValue
  }

  const metadataAuthorType = metadata.author_type
  if (metadataAuthorType === 'citizen' || metadataAuthorType === 'company') {
    return metadataAuthorType
  }

  const isCompany =
    asBoolean((metadata as Record<string, unknown>).is_company) ||
    asBoolean((metadata as Record<string, unknown>).author_is_company)

  return isCompany ? 'company' : 'citizen'
}

const extractGuildIdFromRow = (
  row: Record<string, unknown>,
  metadata: Record<string, unknown>,
): string | null => {
  const directGuildId = asString(row.guild_id).trim()
  if (directGuildId) {
    return directGuildId
  }

  const metadataGuildId = asString(metadata.guild_id).trim()
  return metadataGuildId || null
}

const parseShareKind = (
  row: Record<string, unknown>,
  metadata: Record<string, unknown>,
): Post['share_kind'] => {
  const directValue = row.share_kind
  if (directValue === 'quote' || directValue === 'original') {
    return directValue
  }

  const metadataValue = metadata.share_kind
  if (metadataValue === 'quote' || metadataValue === 'original') {
    return metadataValue
  }

  return asString(metadata.source_post_id).trim() ? 'quote' : 'original'
}

const parseSourcePostId = (
  row: Record<string, unknown>,
  metadata: Record<string, unknown>,
): string | null => {
  const directValue = asString(row.source_post_id).trim()
  if (directValue) {
    return directValue
  }

  const metadataValue = asString(metadata.source_post_id).trim()
  return metadataValue || null
}

const parseQuotedPostSummary = (metadata: Record<string, unknown>): Post['source_post'] => {
  const snapshot = isRecord(metadata.quote_source)
    ? metadata.quote_source
    : isRecord(metadata.source_post)
      ? metadata.source_post
      : null

  if (!snapshot) {
    return null
  }

  const snapshotId = asString(snapshot.id).trim()
  if (!snapshotId) {
    return null
  }

  return {
    id: snapshotId,
    content: asString(snapshot.content) || null,
    image_urls: asStringArray(snapshot.image_urls),
    created_at: asString(snapshot.created_at) || new Date().toISOString(),
    author: {
      id: asString(snapshot.author_id) || '',
      full_name: asString(snapshot.author_full_name, 'Utilisateur'),
      avatar_url: asString(snapshot.author_avatar_url) || null,
    },
  }
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
  const metadataHashtags = asStringArray(metadata.hashtags).map((tag) => sanitizeHashtagSlug(tag))
  const rowHashtags = asStringArray(row.hashtags).map((tag) => sanitizeHashtagSlug(tag))
  const contentHashtags = extractHashtagsFromText(asString(row.content))

  const hashtags = [...new Set([...metadataHashtags, ...rowHashtags, ...contentHashtags])].filter(
    Boolean,
  )

  const reactionsCount = extractCount(row.reactions)
  const commentsCount = extractCount(row.comments)
  const sharesCount = asNumber(row.shares_count, 0)
  const shareKind = parseShareKind(row, metadata)
  const sourcePostId = parseSourcePostId(row, metadata)
  const sourcePost = parseQuotedPostSummary(metadata)

  const mapped: Post = {
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
    hashtags,
    shares_count: sharesCount,
    author_type: mapRawAuthorType(row.author_type, metadata),
    share_kind: shareKind,
    source_post_id: sourcePostId,
    source_post: sourcePost,
    share_url: asString(row.share_url) || asString(metadata.share_url) || undefined,
    og_image_url: asString(row.og_image_url) || asString(metadata.og_image_url) || undefined,
    guild_id: extractGuildIdFromRow(row, metadata),
    reactions_count: reactionsCount,
    comments_count: commentsCount,
    user_has_reacted: userHasReacted,
    user_has_bookmarked: false,
  }

  mapped.score = Number.isFinite(asNumber(row.score, Number.NaN))
    ? asNumber(row.score, 0)
    : computePostScore(mapped)

  return mapped
}

const filterPostsByHashtag = (posts: Post[], hashtagSlug: string): Post[] => {
  if (!hashtagSlug) {
    return posts
  }

  return posts.filter((post) => post.hashtags?.includes(hashtagSlug))
}

const filterPostsByGuildId = (posts: Post[], guildId: string): Post[] => {
  const normalizedGuildId = asString(guildId).trim()
  if (!normalizedGuildId) {
    return posts
  }

  return posts.filter((post) => {
    const postGuildId =
      asString(post.guild_id).trim() || asString((post.metadata || {}).guild_id).trim()
    return postGuildId === normalizedGuildId
  })
}

const filterRowsByGuildIds = (rows: unknown[], guildIds: string[]): unknown[] => {
  if (guildIds.length === 0) {
    return []
  }

  const guildIdsSet = new Set(guildIds.map((guildId) => guildId.trim()).filter(Boolean))
  if (guildIdsSet.size === 0) {
    return []
  }

  return rows.filter((row) => {
    if (!isRecord(row)) {
      return false
    }

    const metadata = isRecord(row.metadata) ? row.metadata : {}
    const guildId = extractGuildIdFromRow(row, metadata)
    return !!guildId && guildIdsSet.has(guildId)
  })
}

const sortPosts = (posts: Post[], sort: FeedSort): Post[] => {
  const sorted = [...posts]

  if (sort === 'oldest') {
    sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    return sorted
  }

  if (sort === 'best') {
    sorted.sort((a, b) => {
      const scoreA = asNumber(a.score, computePostScore(a))
      const scoreB = asNumber(b.score, computePostScore(b))

      if (scoreA === scoreB) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }

      return scoreB - scoreA
    })

    return sorted
  }

  sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return sorted
}

const extractUserReactionsMap = async (
  userId: string | undefined,
  postIds: string[],
): Promise<Record<string, boolean>> => {
  if (!userId || postIds.length === 0) {
    return {}
  }

  const supabase = await createClient()

  const { data: userReactions } = await supabase
    .schema('social')
    .from('reactions')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds)
    .eq('type', 'like')

  if (!userReactions) {
    return {}
  }

  return userReactions.reduce(
    (acc: Record<string, boolean>, reaction: { post_id: string | null }) => {
      if (reaction.post_id) {
        acc[reaction.post_id] = true
      }
      return acc
    },
    {} as Record<string, boolean>,
  )
}

const extractUserBookmarksMap = async (
  userId: string | undefined,
  postIds: string[],
): Promise<Record<string, boolean>> => {
  if (!userId || postIds.length === 0) {
    return {}
  }

  const supabase = await createClient()
  const { data: bookmarks } = await supabase
    .schema('social')
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds)

  if (!bookmarks) {
    return {}
  }

  return bookmarks.reduce(
    (acc: Record<string, boolean>, bookmark: { post_id: string | null }) => {
      if (bookmark.post_id) {
        acc[bookmark.post_id] = true
      }

      return acc
    },
    {} as Record<string, boolean>,
  )
}

const fetchPostMediaRows = async (
  postIds: string[],
  useStaticClient: boolean,
): Promise<PostMediaRow[]> => {
  if (postIds.length === 0) {
    return []
  }

  const supabase = useStaticClient ? createStaticClient() : await createClient()
  const { data, error } = await supabase
    .schema('social')
    .from('post_media')
    .select('post_id, public_url, sort_order, status')
    .in('post_id', postIds)
    .order('sort_order', { ascending: true })

  if (error || !data) {
    return []
  }

  return data
}

const mergePostMediaIntoPosts = async (
  posts: Post[],
  useStaticClient: boolean,
): Promise<Post[]> => {
  if (posts.length === 0) {
    return posts
  }

  const postIds = [...new Set(posts.map((post) => post.id).filter(Boolean))]
  const mediaRows = await fetchPostMediaRows(postIds, useStaticClient)
  if (mediaRows.length === 0) {
    return posts
  }

  const mediaByPostId = new Map<string, string[]>()

  for (const media of mediaRows) {
    const postId = asString(media.post_id).trim()
    const publicUrl = asString(media.public_url).trim()
    if (!postId || !publicUrl) {
      continue
    }

    const status = asString(media.status).trim().toLowerCase()
    if (status && status !== 'ready') {
      continue
    }

    const existing = mediaByPostId.get(postId) || []
    if (!existing.includes(publicUrl)) {
      existing.push(publicUrl)
      mediaByPostId.set(postId, existing)
    }
  }

  return posts.map((post) => {
    const postMediaUrls = mediaByPostId.get(post.id)
    if (!postMediaUrls || postMediaUrls.length === 0) {
      return post
    }

    return {
      ...post,
      image_urls: [...new Set([...(post.image_urls || []), ...postMediaUrls])],
    }
  })
}

const applyViewerStateToPosts = async (posts: Post[], userId?: string): Promise<Post[]> => {
  if (!userId || posts.length === 0) {
    return posts.map((post) => ({
      ...post,
      user_has_reacted: !!post.user_has_reacted,
      user_has_bookmarked: !!post.user_has_bookmarked,
    }))
  }

  const postIds = [...new Set(posts.map((post) => post.id).filter(Boolean))]
  if (postIds.length === 0) {
    return posts
  }

  const [reactionsMap, bookmarksMap] = await Promise.all([
    extractUserReactionsMap(userId, postIds),
    extractUserBookmarksMap(userId, postIds),
  ])

  return posts.map((post) => ({
    ...post,
    user_has_reacted: !!reactionsMap[post.id],
    user_has_bookmarked: !!bookmarksMap[post.id],
  }))
}

const getUserGuildIds = async (userId: string): Promise<string[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('identity')
    .from('guild_members')
    .select('guild_id')
    .eq('user_id', userId)

  if (error || !data) {
    return []
  }

  return data
    .map((entry: { guild_id: string | null }) => asString(entry.guild_id))
    .filter((guildId): guildId is string => guildId.length > 0)
}

const POSTS_SELECT_EXPRESSION = `
      *,
      reactions:reactions (count),
      comments:comments (count)
    `

const fetchPostsWindowDynamic = async (
  sort: FeedSort,
  visibility: Post['visibility'],
  from: number,
  to: number,
) => {
  const supabase = await createClient()

  let query = supabase
    .schema('social')
    .from('posts_with_authors')
    .select(POSTS_SELECT_EXPRESSION)
    .eq('visibility', visibility)

  query = query.order('created_at', { ascending: sort === 'oldest' })

  return query.range(from, to)
}

const fetchPublicPostsWindowCached = async (sort: FeedSort, from: number, to: number) => {
  'use cache'

  cacheLife('minutes')
  cacheTag(COMMUNITY_CACHE_TAGS.feed)

  const supabase = createStaticClient()
  const query = supabase
    .schema('social')
    .from('posts_with_authors')
    .select(POSTS_SELECT_EXPRESSION)
    .eq('visibility', 'public')
    .order('created_at', { ascending: sort === 'oldest' })
    .range(from, to)

  const { data, error } = await query
  if (error || !data) {
    return []
  }

  return data
}

const mergeAndDeduplicatePostRows = (rows: unknown[]): unknown[] => {
  const map = new Map<string, unknown>()

  for (const row of rows) {
    if (!isRecord(row)) {
      continue
    }

    const id = asString(row.id)
    if (!id) {
      continue
    }

    if (!map.has(id)) {
      map.set(id, row)
    }
  }

  return [...map.values()]
}

const buildQuotedPostSummary = (post: Post): Post['source_post'] => ({
  id: post.id,
  content: post.content || null,
  image_urls: post.image_urls || [],
  created_at: post.created_at,
  author: {
    id: asString(post.author?.id || post.author_id),
    full_name: asString(post.author?.full_name, 'Utilisateur'),
    avatar_url: asString(post.author?.avatar_url) || null,
  },
})

const hydrateQuoteSourcePosts = async (posts: Post[]): Promise<Post[]> => {
  const sourcePostIds = [
    ...new Set(
      posts
        .filter((post) => post.share_kind === 'quote')
        .map((post) => asString(post.source_post_id))
        .filter(Boolean),
    ),
  ]

  if (sourcePostIds.length === 0) {
    return posts
  }

  const missingSourceIds = sourcePostIds.filter(
    (sourcePostId) => !posts.some((post) => post.id === sourcePostId),
  )

  if (missingSourceIds.length === 0) {
    const postMap = new Map(posts.map((post) => [post.id, post] as const))
    return posts.map((post) => {
      if (post.share_kind !== 'quote') {
        return post
      }

      const source = post.source_post_id ? postMap.get(post.source_post_id) : null
      if (!source) {
        return post
      }

      return {
        ...post,
        source_post: buildQuotedPostSummary(source),
      }
    })
  }

  const supabase = createStaticClient()
  const { data: sourceRows } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(`
      *,
      reactions:reactions (count),
      comments:comments (count)
    `)
    .in('id', missingSourceIds)
    .eq('visibility', 'public')

  const sourcePosts = (sourceRows || [])
    .map((row: unknown) => mapRowToPost(row, false))
    .filter((post): post is Post => post !== null)
    .map((post) => ({
      ...post,
      source_post: null,
      source_post_id: null,
      share_kind: 'original' as const,
    }))

  const sourcePostsWithMedia = await mergePostMediaIntoPosts(sourcePosts, true)

  const sourceMap = new Map<string, Post>(sourcePostsWithMedia.map((post) => [post.id, post]))

  for (const post of posts) {
    sourceMap.set(post.id, post)
  }

  return posts.map((post) => {
    if (post.share_kind !== 'quote') {
      return post
    }

    const source = post.source_post_id ? sourceMap.get(post.source_post_id) : null
    if (!source) {
      return post
    }

    return {
      ...post,
      source_post: buildQuotedPostSummary(source),
    }
  })
}

const getFeedPublic = async (options: Required<FeedQueryOptions>) => {
  'use cache'

  cacheLife('minutes')
  cacheTag(COMMUNITY_CACHE_TAGS.feed)

  const inMemoryProcessing =
    options.sort === 'best' ||
    !!options.hashtagSlug ||
    !!options.guildId ||
    options.scope === 'my_guilds'
  const from = (options.page - 1) * options.limit
  const to = from + options.limit - 1
  const windowTo = inMemoryProcessing ? Math.max(CACHED_FEED_WINDOW_SIZE - 1, to) : to

  const publicRows = await fetchPublicPostsWindowCached(
    options.sort,
    inMemoryProcessing ? 0 : from,
    windowTo,
  )
  let posts = publicRows
    .map((row: unknown) => mapRowToPost(row, false))
    .filter((post): post is Post => post !== null)

  posts = await mergePostMediaIntoPosts(posts, true)
  posts = filterPostsByHashtag(posts, options.hashtagSlug)
  posts = filterPostsByGuildId(posts, options.guildId)
  posts = await hydrateQuoteSourcePosts(posts)
  posts = sortPosts(posts, options.sort)

  if (inMemoryProcessing) {
    return posts.slice(from, to + 1)
  }

  return posts
}

/**
 * Fetch the main feed posts.
 * Backward compatible with getFeed(page, limit) and supports object options.
 */
export async function getFeed(
  optionsOrPage: FeedQueryOptions | number = 1,
  limit = DEFAULT_FEED_LIMIT,
) {
  const options = parseFeedOptions(optionsOrPage, limit)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const inMemoryProcessing =
    options.sort === 'best' ||
    !!options.hashtagSlug ||
    !!options.guildId ||
    options.scope === 'my_guilds'
  const from = (options.page - 1) * options.limit
  const to = from + options.limit - 1
  const windowTo = inMemoryProcessing ? Math.max(FEED_WINDOW_SIZE - 1, to) : to

  let rawRows: unknown[] = []

  if (options.scope === 'my_guilds') {
    if (!user) {
      return []
    }

    const guildIds = await getUserGuildIds(user.id)
    if (guildIds.length === 0) {
      return []
    }

    const [publicRows, guildResult] = await Promise.all([
      fetchPublicPostsWindowCached(options.sort, 0, windowTo),
      fetchPostsWindowDynamic(options.sort, 'guild_only', 0, windowTo),
    ])

    if (guildResult.error) {
      console.error('Error fetching guild scoped feed:', {
        guildError: guildResult.error,
      })
      throw new Error("Impossible de charger le fil d'actualité")
    }

    rawRows = mergeAndDeduplicatePostRows([
      ...publicRows,
      ...filterRowsByGuildIds(guildResult.data || [], guildIds),
    ])
  } else {
    const publicPosts = await getFeedPublic(options)
    return applyViewerStateToPosts(publicPosts, user?.id)
  }

  let posts = rawRows
    .map((row) => mapRowToPost(row, false))
    .filter((post): post is Post => post !== null)

  posts = await mergePostMediaIntoPosts(posts, false)
  posts = filterPostsByHashtag(posts, options.hashtagSlug)
  posts = filterPostsByGuildId(posts, options.guildId)
  posts = await hydrateQuoteSourcePosts(posts)
  posts = sortPosts(posts, options.sort)
  const paginatedPosts = posts.slice(from, to + 1)
  return applyViewerStateToPosts(paginatedPosts, user?.id)
}

export async function getHashtagFeed(
  slug: string,
  options: Omit<FeedQueryOptions, 'hashtagSlug'> = {},
) {
  return getFeed({ ...options, hashtagSlug: slug })
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

  let mappedPosts = (posts || [])
    .map((post: PostRowWithCounts) => mapRowToPost(post, false))
    .filter((post): post is Post => post !== null)

  mappedPosts = await mergePostMediaIntoPosts(mappedPosts, false)
  mappedPosts = await hydrateQuoteSourcePosts(mappedPosts)
  return applyViewerStateToPosts(mappedPosts, user?.id)
}

/**
 * Fetch one public post by id with author and counters
 */
export const getPostById = cache(async (postId: string): Promise<Post | null> => {
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
    .maybeSingle()

  if (error) {
    console.error('Error fetching post by id:', JSON.stringify(error, null, 2))
    throw new Error('Impossible de charger la publication')
  }

  if (!post) {
    return null
  }

  const postRecord = isRecord(post) ? post : null
  if (!postRecord) {
    return null
  }

  const metadata = isRecord(postRecord.metadata) ? postRecord.metadata : {}
  const visibility = isPostVisibility(postRecord.visibility) ? postRecord.visibility : 'public'
  if (visibility === 'private') {
    return null
  }

  if (visibility === 'guild_only') {
    if (!user) {
      return null
    }

    const guildId = extractGuildIdFromRow(postRecord, metadata)
    if (!guildId) {
      return null
    }

    const { data: membership, error: membershipError } = await supabase
      .schema('identity')
      .from('guild_members')
      .select('guild_id')
      .eq('guild_id', guildId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (membershipError || !membership) {
      return null
    }
  }

  const mappedPost = mapRowToPost(post, false)
  if (!mappedPost) {
    return null
  }

  const withMedia = await mergePostMediaIntoPosts([mappedPost], false)
  const hydrated = await hydrateQuoteSourcePosts(withMedia)
  const viewerStatePosts = await applyViewerStateToPosts(hydrated, user?.id)
  return viewerStatePosts[0] || null
})

export async function getPostPublicById(postId: string): Promise<Post | null> {
  'use cache'

  cacheLife('minutes')
  cacheTag(COMMUNITY_CACHE_TAGS.feed)
  cacheTag(COMMUNITY_CACHE_TAGS.post(postId))

  const normalizedPostId = asString(postId).trim()
  if (!normalizedPostId) {
    return null
  }

  const supabase = createStaticClient()
  const { data: row, error } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(POSTS_SELECT_EXPRESSION)
    .eq('id', normalizedPostId)
    .eq('visibility', 'public')
    .maybeSingle()

  if (error || !row) {
    return null
  }

  const mapped = mapRowToPost(row, false)
  if (!mapped) {
    return null
  }

  const withMedia = await mergePostMediaIntoPosts([mapped], true)
  const hydrated = await hydrateQuoteSourcePosts(withMedia)
  return hydrated[0] || null
}

const canViewerReadPost = (post: Post, viewerId: string, viewerGuildIds: Set<string>): boolean => {
  if (post.visibility === 'public') {
    return true
  }

  if (post.visibility === 'private') {
    return post.author_id === viewerId
  }

  const guildId = asString(post.guild_id).trim() || asString(post.metadata.guild_id).trim()
  return !!guildId && viewerGuildIds.has(guildId)
}

const orderPostsByIds = (posts: Post[], orderedIds: string[]): Post[] => {
  const postById = new Map(posts.map((post) => [post.id, post] as const))
  return orderedIds.map((postId) => postById.get(postId)).filter((post): post is Post => !!post)
}

const getViewerSavedPosts = async (kind: 'likes' | 'bookmarks', limit: number): Promise<Post[]> => {
  const normalizedLimit = Math.max(1, limit)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  let savedRows: Array<{ post_id: string | null }> = []

  if (kind === 'likes') {
    const { data, error } = await supabase
      .schema('social')
      .from('user_liked_posts')
      .select('post_id, liked_at')
      .eq('user_id', user.id)
      .order('liked_at', { ascending: false })
      .limit(normalizedLimit)

    if (error || !data) {
      return []
    }

    savedRows = data
  } else {
    const { data, error } = await supabase
      .schema('social')
      .from('user_bookmarked_posts')
      .select('post_id, bookmarked_at')
      .eq('user_id', user.id)
      .order('bookmarked_at', { ascending: false })
      .limit(normalizedLimit)

    if (error || !data) {
      return []
    }

    savedRows = data
  }

  const orderedPostIds = [
    ...new Set(
      savedRows
        .map((row) => asString(row.post_id).trim())
        .filter((postId): postId is string => postId.length > 0),
    ),
  ]

  if (orderedPostIds.length === 0) {
    return []
  }

  const { data: postRows, error: postRowsError } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(POSTS_SELECT_EXPRESSION)
    .in('id', orderedPostIds)

  if (postRowsError || !postRows) {
    return []
  }

  let posts = postRows
    .map((row: unknown) => mapRowToPost(row, false))
    .filter((post): post is Post => post !== null)

  posts = await mergePostMediaIntoPosts(posts, false)
  posts = await hydrateQuoteSourcePosts(posts)
  posts = await applyViewerStateToPosts(posts, user.id)

  const viewerGuildIds = new Set(await getUserGuildIds(user.id))
  const visiblePosts = posts.filter((post) => canViewerReadPost(post, user.id, viewerGuildIds))
  return orderPostsByIds(visiblePosts, orderedPostIds).slice(0, normalizedLimit)
}

export async function getViewerLikedPosts(limit = 40): Promise<Post[]> {
  return getViewerSavedPosts('likes', limit)
}

export async function getViewerBookmarkedPosts(limit = 40): Promise<Post[]> {
  return getViewerSavedPosts('bookmarks', limit)
}

export async function getTrendingHashtags(limit = 8): Promise<HashtagStats[]> {
  'use cache'

  cacheLife('minutes')
  cacheTag(COMMUNITY_CACHE_TAGS.hashtags)
  cacheTag(COMMUNITY_CACHE_TAGS.feed)

  const normalizedLimit = Math.max(1, limit)
  const supabase = createStaticClient()

  const { data: statsRows, error } = await supabase
    .schema('social')
    .from('hashtag_stats')
    .select('*')
    .order('total_count', { ascending: false })
    .limit(normalizedLimit)

  if (!error && statsRows && statsRows.length > 0) {
    return statsRows
      .map((row: HashtagStatsViewRow) => {
        const slug = sanitizeHashtagSlug(asString(row.slug))
        if (!slug) {
          return null
        }

        return {
          slug,
          label: asString(row.label) || hashtagLabelFromSlug(slug),
          total_count: asNumber(row.total_count, asNumber(row.usage_count, 0)),
          today_count: asNumber(row.today_count, 0),
          month_count: asNumber(row.month_count, 0),
          year_count: asNumber(row.year_count, 0),
        } satisfies HashtagStats
      })
      .filter((entry: HashtagStats | null): entry is HashtagStats => entry !== null)
  }

  const feedPosts = await getFeedPublic(
    parseFeedOptions({ page: 1, limit: CACHED_FEED_WINDOW_SIZE, sort: 'newest' }, undefined),
  )
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const aggregate = new Map<string, HashtagStats>()

  for (const post of feedPosts) {
    const createdAt = new Date(post.created_at)
    const hashtags = post.hashtags || []

    for (const slug of hashtags) {
      const current =
        aggregate.get(slug) ||
        ({
          slug,
          label: hashtagLabelFromSlug(slug),
          total_count: 0,
          today_count: 0,
          month_count: 0,
          year_count: 0,
        } satisfies HashtagStats)

      current.total_count += 1
      if (createdAt >= startOfDay) {
        current.today_count += 1
      }
      if (createdAt >= startOfMonth) {
        current.month_count += 1
      }
      if (createdAt >= startOfYear) {
        current.year_count += 1
      }

      aggregate.set(slug, current)
    }
  }

  return [...aggregate.values()]
    .sort((a, b) => b.total_count - a.total_count)
    .slice(0, normalizedLimit)
}

export async function getHashtagStats(slug: string): Promise<HashtagStats> {
  'use cache'

  cacheLife('minutes')
  cacheTag(COMMUNITY_CACHE_TAGS.hashtags)
  cacheTag(COMMUNITY_CACHE_TAGS.feed)

  const normalizedSlug = sanitizeHashtagSlug(slug)
  if (!normalizedSlug) {
    return {
      slug: '',
      label: '',
      total_count: 0,
      today_count: 0,
      month_count: 0,
      year_count: 0,
    }
  }

  const supabase = createStaticClient()

  const { data, error } = await supabase
    .schema('social')
    .from('hashtag_stats')
    .select('*')
    .eq('slug', normalizedSlug)
    .maybeSingle()

  if (!error && data) {
    return {
      slug: normalizedSlug,
      label: asString(data.label) || hashtagLabelFromSlug(normalizedSlug),
      total_count: asNumber(data.total_count, asNumber(data.usage_count, 0)),
      today_count: asNumber(data.today_count, 0),
      month_count: asNumber(data.month_count, 0),
      year_count: asNumber(data.year_count, 0),
    }
  }

  const posts = await getFeedPublic(
    parseFeedOptions(
      {
        page: 1,
        limit: CACHED_FEED_WINDOW_SIZE,
        sort: 'newest',
        hashtagSlug: normalizedSlug,
      },
      undefined,
    ),
  )

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  let todayCount = 0
  let monthCount = 0
  let yearCount = 0

  for (const post of posts) {
    const createdAt = new Date(post.created_at)

    if (createdAt >= startOfDay) {
      todayCount += 1
    }

    if (createdAt >= startOfMonth) {
      monthCount += 1
    }

    if (createdAt >= startOfYear) {
      yearCount += 1
    }
  }

  return {
    slug: normalizedSlug,
    label: hashtagLabelFromSlug(normalizedSlug),
    total_count: posts.length,
    today_count: todayCount,
    month_count: monthCount,
    year_count: yearCount,
  }
}

export async function getTopContributors(
  scope: ContributorScope = 'all',
  limit = 5,
  hashtagSlug?: string,
): Promise<ContributorRank[]> {
  'use cache'

  cacheLife('minutes')
  cacheTag(COMMUNITY_CACHE_TAGS.leaderboard)
  cacheTag(COMMUNITY_CACHE_TAGS.feed)

  const normalizedScope: ContributorScope = isContributorScope(scope) ? scope : 'all'
  const normalizedLimit = Math.max(1, limit)

  const posts = await getFeedPublic(
    parseFeedOptions(
      {
        page: 1,
        limit: CACHED_FEED_WINDOW_SIZE,
        sort: 'best',
        hashtagSlug,
      },
      undefined,
    ),
  )

  const aggregate = new Map<string, ContributorAggregation>()

  for (const post of posts) {
    const authorId = asString(post.author?.id || post.author_id)
    if (!authorId) {
      continue
    }

    const authorType = post.author_type || 'citizen'

    if (normalizedScope === 'citizens' && authorType !== 'citizen') {
      continue
    }

    if (normalizedScope === 'companies' && authorType !== 'company') {
      continue
    }

    const current =
      aggregate.get(authorId) ||
      ({
        user_id: authorId,
        full_name: asString(post.author?.full_name, 'Utilisateur'),
        avatar_url: asString(post.author?.avatar_url) || null,
        author_type: authorType,
        posts_count: 0,
        reactions_received: 0,
        comments_received: 0,
        score: 0,
      } satisfies ContributorAggregation)

    current.posts_count += 1
    current.reactions_received += asNumber(post.reactions_count, 0)
    current.comments_received += asNumber(post.comments_count, 0)
    current.score += asNumber(post.score, computePostScore(post))

    aggregate.set(authorId, current)
  }

  return [...aggregate.values()]
    .sort((a, b) => {
      if (a.score === b.score) {
        return b.posts_count - a.posts_count
      }

      return b.score - a.score
    })
    .slice(0, normalizedLimit)
}

const buildPostAbsoluteUrl = (postId: string) => `${getPublicAppUrl()}/community/posts/${postId}`

const buildPostOgImageUrl = (postId: string, variant: string = 'default') =>
  `${getPublicAppUrl()}/api/og/community/post/${postId}?variant=${encodeURIComponent(variant)}`

export async function getPostEmbedData(postId: string) {
  'use cache'

  cacheLife('hours')
  cacheTag(COMMUNITY_CACHE_TAGS.feed)
  cacheTag(COMMUNITY_CACHE_TAGS.post(postId))

  const post = await getPostPublicById(postId)
  if (!post) {
    return null
  }

  return {
    id: post.id,
    title: post.content?.slice(0, 120) || 'Make the Change Community',
    description: post.content?.slice(0, 220) || null,
    image_url: post.image_urls[0] || null,
    author_name: asString(post.author?.full_name, 'Community'),
    canonical_url: buildPostAbsoluteUrl(post.id),
    embed_url: `${getPublicAppUrl()}/en/embed/community/posts/${post.id}`,
    og_image_url: buildPostOgImageUrl(post.id),
  }
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

  return (comments || []).map((comment: CommentViewRow) => ({
    ...comment,
    author: {
      id: asString(comment.author_id),
      full_name: asString(comment.author_full_name, 'Utilisateur'),
      avatar_url: asString(comment.author_avatar_url) || null,
    },
  }))
}
const mapGuildRow = (
  row: unknown,
  membersCount: number,
  isMember: boolean,
  fallbackXpTotal: number,
): Guild | null => {
  if (!isRecord(row)) {
    return null
  }

  const id = asString(row.id)
  const slug = asString(row.slug)
  const name = asString(row.name)

  if (!id || !slug || !name) {
    return null
  }

  const guildType = asString(row.type)
  const mappedType: Guild['type'] =
    guildType === 'invite_only' ||
    guildType === 'corporate' ||
    guildType === 'school' ||
    guildType === 'family'
      ? guildType
      : 'open'

  return {
    id,
    name,
    slug,
    description: asString(row.description) || null,
    logo_url: asString(row.logo_url) || null,
    banner_url: asString(row.banner_url) || null,
    owner_id: asString(row.owner_id) || '',
    type: mappedType,
    metadata: isRecord(row.metadata) ? row.metadata : {},
    created_at: asString(row.created_at) || new Date().toISOString(),
    updated_at: asString(row.updated_at) || new Date().toISOString(),
    members_count: membersCount,
    xp_total: asNumber(row.xp_total, fallbackXpTotal),
    is_member: isMember,
  }
}

const getGuildsPublic = async (limit: number): Promise<Guild[]> => {
  'use cache'

  cacheLife('hours')
  cacheTag(COMMUNITY_CACHE_TAGS.guilds)
  cacheTag(COMMUNITY_CACHE_TAGS.leaderboard)

  const normalizedLimit = Math.max(1, limit)
  const supabase = createStaticClient()

  const { data: guildRows, error } = await supabase
    .schema('identity')
    .from('guilds')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(normalizedLimit)

  if (error || !guildRows) {
    return []
  }

  const guildIds = guildRows
    .map((row: unknown) => (isRecord(row) ? asString(row.id) : ''))
    .filter((guildId): guildId is string => guildId.length > 0)

  if (guildIds.length === 0) {
    return []
  }

  const { data: membersRows } = await supabase
    .schema('identity')
    .from('guild_members')
    .select('guild_id')
    .in('guild_id', guildIds)

  const membersCountByGuild = new Map<string, number>()
  for (const memberRow of membersRows || []) {
    const guildId = asString(memberRow.guild_id)
    if (!guildId) {
      continue
    }

    membersCountByGuild.set(guildId, (membersCountByGuild.get(guildId) || 0) + 1)
  }

  return guildRows
    .map((row: unknown) =>
      mapGuildRow(
        row,
        membersCountByGuild.get(isRecord(row) ? asString(row.id) : '') || 0,
        false,
        asNumber(isRecord(row) ? row.xp_total : 0, 0),
      ),
    )
    .filter((guild): guild is Guild => guild !== null)
}

export async function getGuilds(limit = 24): Promise<Guild[]> {
  const guilds = await getGuildsPublic(limit)
  if (guilds.length === 0) {
    return []
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return guilds
  }

  const guildIds = guilds.map((guild) => guild.id)
  const { data: memberships } = await supabase
    .schema('identity')
    .from('guild_members')
    .select('guild_id')
    .eq('user_id', user.id)
    .in('guild_id', guildIds)

  const memberGuildIds = new Set(
    (memberships || [])
      .map((row: { guild_id: string | null }) => asString(row.guild_id))
      .filter((guildId): guildId is string => guildId.length > 0),
  )

  return guilds.map((guild) => ({
    ...guild,
    is_member: memberGuildIds.has(guild.id),
  }))
}

export async function getGuildBySlug(slug: string): Promise<GuildDetails | null> {
  const normalizedSlug = asString(slug).trim()
  if (!normalizedSlug) {
    return null
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: guildRow, error } = await supabase
    .schema('identity')
    .from('guilds')
    .select('*')
    .eq('slug', normalizedSlug)
    .maybeSingle()

  if (error || !guildRow) {
    return null
  }

  const guildId = asString(guildRow.id)
  if (!guildId) {
    return null
  }

  const [memberRowsResult, membershipsResult] = await Promise.all([
    supabase
      .schema('identity')
      .from('guild_members')
      .select('guild_id, user_id, role, joined_at')
      .eq('guild_id', guildId)
      .order('joined_at', { ascending: true })
      .limit(50),
    user
      ? supabase
          .schema('identity')
          .from('guild_members')
          .select('guild_id')
          .eq('guild_id', guildId)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  const memberRows = memberRowsResult.data || []
  const memberIds = memberRows
    .map((row: { user_id: string | null }) => asString(row.user_id))
    .filter((userId): userId is string => userId.length > 0)

  let profilesById = new Map<string, { full_name: string; avatar_url: string | null }>()

  if (memberIds.length > 0) {
    const { data: profileRows } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', memberIds)

    profilesById = new Map(
      (profileRows || [])
        .map((profile: Record<string, unknown>) => {
          const profileId = asString(profile.id)
          if (!profileId) {
            return null
          }

          const fullName =
            [asString(profile.first_name), asString(profile.last_name)].filter(Boolean).join(' ') ||
            'Utilisateur'

          return [
            profileId,
            { full_name: fullName, avatar_url: asString(profile.avatar_url) || null },
          ] as const
        })
        .filter(
          (
            entry: readonly [string, { full_name: string; avatar_url: string | null }] | null,
          ): entry is readonly [string, { full_name: string; avatar_url: string | null }] =>
            entry !== null,
        ),
    )
  }

  const guild = mapGuildRow(guildRow, memberRows.length, !!membershipsResult.data, 0)

  if (!guild) {
    return null
  }

  const members: GuildMember[] = memberRows.map((memberRow: Record<string, unknown>) => {
    const userId = asString(memberRow.user_id)
    const profile = profilesById.get(userId)
    const role = asString(memberRow.role)

    return {
      guild_id: guildId,
      user_id: userId,
      role: role === 'officer' || role === 'leader' ? role : 'member',
      joined_at: asString(memberRow.joined_at) || new Date().toISOString(),
      user: {
        id: userId,
        full_name: profile?.full_name || 'Utilisateur',
        avatar_url: profile?.avatar_url || null,
      },
    }
  })

  return {
    guild,
    members,
  }
}

export async function getGuildLeaderboard(
  period: 'weekly' | 'monthly' = 'monthly',
  limit = 10,
): Promise<GuildLeaderboardEntry[]> {
  'use cache'

  cacheLife('hours')
  cacheTag(COMMUNITY_CACHE_TAGS.guilds)
  cacheTag(COMMUNITY_CACHE_TAGS.leaderboard)

  const normalizedLimit = Math.max(1, limit)
  const supabase = createStaticClient()

  const guilds = await getGuildsPublic(500)

  if (guilds.length === 0) {
    return []
  }

  const startDate = new Date()
  if (period === 'weekly') {
    startDate.setDate(startDate.getDate() - 7)
  } else {
    startDate.setMonth(startDate.getMonth() - 1)
  }

  const { data: postRows, error } = await supabase
    .schema('social')
    .from('posts_with_authors')
    .select(`
      guild_id,
      metadata,
      created_at,
      reactions:reactions (count),
      comments:comments (count)
    `)
    .eq('visibility', 'guild_only')
    .gte('created_at', startDate.toISOString())

  if (error || !postRows) {
    return guilds
      .map((guild) => ({
        guild_id: guild.id,
        guild_name: guild.name,
        guild_slug: guild.slug,
        members_count: guild.members_count || 0,
        posts_count: 0,
        reactions_received: 0,
        comments_received: 0,
        score: guild.xp_total || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, normalizedLimit)
  }

  const aggregation = new Map<string, GuildLeaderboardEntry>()

  for (const guild of guilds) {
    aggregation.set(guild.id, {
      guild_id: guild.id,
      guild_name: guild.name,
      guild_slug: guild.slug,
      members_count: guild.members_count || 0,
      posts_count: 0,
      reactions_received: 0,
      comments_received: 0,
      score: 0,
    })
  }

  for (const postRow of postRows) {
    const postRecord = isRecord(postRow) ? postRow : null
    const postMetadata = postRecord && isRecord(postRecord.metadata) ? postRecord.metadata : {}
    const guildId = postRecord ? extractGuildIdFromRow(postRecord, postMetadata) : null
    if (!guildId) {
      continue
    }

    const entry = aggregation.get(guildId)
    if (!entry) {
      continue
    }

    entry.posts_count += 1
    entry.reactions_received += extractCount(postRow.reactions)
    entry.comments_received += extractCount(postRow.comments)
    entry.score =
      entry.posts_count * 3 +
      entry.reactions_received * 2 +
      entry.comments_received * 1.5 +
      entry.members_count
  }

  return [...aggregation.values()].sort((a, b) => b.score - a.score).slice(0, normalizedLimit)
}
