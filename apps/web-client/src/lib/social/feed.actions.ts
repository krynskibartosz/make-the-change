'use server'

import type {
  ContributorRank,
  ContributorScope,
  FeedScope,
  FeedSort,
  Guild,
  GuildMember,
  HashtagStats,
  Post,
  ShareChannel,
} from '@make-the-change/core/shared'
import { revalidatePath } from 'next/cache'
import {
  extractHashtagsFromText,
  hashtagLabelFromSlug,
  sanitizeHashtagSlug,
} from '@/lib/social/hashtags'
import { createClient } from '@/lib/supabase/server'
import { asBoolean, asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'

export type FeedQueryOptions = {
  page?: number
  limit?: number
  sort?: FeedSort
  hashtagSlug?: string
  guildId?: string
  scope?: FeedScope
}

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

const isPostType = (value: unknown): value is Post['type'] =>
  value === 'user_post' || value === 'project_update_share' || value === 'system_event'

const isPostVisibility = (value: unknown): value is Post['visibility'] =>
  value === 'public' || value === 'guild_only' || value === 'private'

const isFeedSort = (value: unknown): value is FeedSort =>
  value === 'best' || value === 'newest' || value === 'oldest'

const isFeedScope = (value: unknown): value is FeedScope => value === 'all' || value === 'my_guilds'

const isContributorScope = (value: unknown): value is ContributorScope =>
  value === 'all' || value === 'citizens' || value === 'companies'

const isShareChannel = (value: unknown): value is ShareChannel =>
  value === 'copy' ||
  value === 'x' ||
  value === 'linkedin' ||
  value === 'facebook' ||
  value === 'native'

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
      limit: Math.max(1, legacyLimit || 20),
      sort: 'newest',
      hashtagSlug: '',
      guildId: '',
      scope: 'all',
    }
  }

  const options = optionsOrPage || {}

  return {
    page: Math.max(1, asNumber(options.page, 1)),
    limit: Math.max(1, asNumber(options.limit, 20)),
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
    guild_id: extractGuildIdFromRow(row, metadata),
    reactions_count: reactionsCount,
    comments_count: commentsCount,
    user_has_reacted: userHasReacted,
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
    (acc, reaction) => {
      if (reaction.post_id) {
        acc[reaction.post_id] = true
      }
      return acc
    },
    {} as Record<string, boolean>,
  )
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
    .map((entry) => asString(entry.guild_id))
    .filter((guildId): guildId is string => guildId.length > 0)
}

const fetchPostsWindow = async (
  sort: FeedSort,
  visibility: Post['visibility'],
  from: number,
  to: number,
) => {
  const supabase = await createClient()

  const selectExpression = `
      *,
      reactions:reactions (count),
      comments:comments (count)
    `

  let query = supabase
    .schema('social')
    .from('posts_with_authors')
    .select(selectExpression)
    .eq('visibility', visibility)

  query = query.order('created_at', { ascending: sort === 'oldest' })

  return query.range(from, to)
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

/**
 * Fetch the main feed posts.
 * Backward compatible with getFeed(page, limit) and supports object options.
 */
export async function getFeed(optionsOrPage: FeedQueryOptions | number = 1, limit = 20) {
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

    const [publicResult, guildResult] = await Promise.all([
      fetchPostsWindow(options.sort, 'public', 0, windowTo),
      fetchPostsWindow(options.sort, 'guild_only', 0, windowTo),
    ])

    if (publicResult.error && guildResult.error) {
      console.error('Error fetching guild scoped feed:', {
        publicError: publicResult.error,
        guildError: guildResult.error,
      })
      throw new Error("Impossible de charger le fil d'actualité")
    }

    rawRows = mergeAndDeduplicatePostRows([
      ...(publicResult.data || []),
      ...filterRowsByGuildIds(guildResult.data || [], guildIds),
    ])
  } else {
    const { data, error } = await fetchPostsWindow(
      options.sort,
      'public',
      inMemoryProcessing ? 0 : from,
      windowTo,
    )

    if (error) {
      console.error('Error fetching feed:', JSON.stringify(error, null, 2))
      throw new Error("Impossible de charger le fil d'actualité")
    }

    rawRows = data || []
  }

  const postIds = rawRows
    .map((row) => (isRecord(row) ? asString(row.id) : ''))
    .filter((postId): postId is string => postId.length > 0)

  const userReactionsMap = await extractUserReactionsMap(user?.id, postIds)

  let posts = rawRows
    .map((row) => mapRowToPost(row, !!userReactionsMap[isRecord(row) ? asString(row.id) : '']))
    .filter((post): post is Post => post !== null)

  posts = filterPostsByHashtag(posts, options.hashtagSlug)
  posts = filterPostsByGuildId(posts, options.guildId)
  posts = sortPosts(posts, options.sort)

  if (inMemoryProcessing) {
    return posts.slice(from, to + 1)
  }

  return posts
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

  const postIds = (posts || [])
    .map((post) => asString(post.id))
    .filter((postId): postId is string => postId.length > 0)

  const userReactionsMap = await extractUserReactionsMap(user?.id, postIds)

  return (posts || [])
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

  const userReactionsMap = await extractUserReactionsMap(user?.id, [asString(post.id)])
  return mapRowToPost(post, !!userReactionsMap[asString(post.id)])
}

export async function getTrendingHashtags(limit = 8): Promise<HashtagStats[]> {
  const normalizedLimit = Math.max(1, limit)
  const supabase = await createClient()

  const { data: statsRows, error } = await supabase
    .schema('social')
    .from('hashtag_stats')
    .select('*')
    .order('total_count', { ascending: false })
    .limit(normalizedLimit)

  if (!error && statsRows && statsRows.length > 0) {
    return statsRows
      .map((row) => {
        const slug = sanitizeHashtagSlug(asString(row.slug) || asString(row.hashtag_slug))
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
      .filter((entry): entry is HashtagStats => entry !== null)
  }

  const feedPosts = await getFeed({ page: 1, limit: FEED_WINDOW_SIZE, sort: 'newest' })
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

  const supabase = await createClient()

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

  const posts = await getHashtagFeed(normalizedSlug, {
    page: 1,
    limit: FEED_WINDOW_SIZE,
    sort: 'newest',
  })

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
  const normalizedScope: ContributorScope = isContributorScope(scope) ? scope : 'all'
  const normalizedLimit = Math.max(1, limit)

  const posts = await getFeed({
    page: 1,
    limit: FEED_WINDOW_SIZE,
    sort: 'best',
    hashtagSlug,
  })

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

/**
 * Toggle a simple "like" reaction on a post
 */
export async function toggleLike(postId: string) {
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
    .eq('post_id', postId)
    .eq('type', 'like')
    .single()

  let isLiked = false

  if (existing) {
    await supabase.schema('social').from('reactions').delete().eq('id', existing.id)
    isLiked = false
  } else {
    await supabase.schema('social').from('reactions').insert({
      user_id: user.id,
      post_id: postId,
      type: 'like',
    })
    isLiked = true
  }

  revalidatePath('/community')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isLiked
}

const upsertHashtagRelations = async (postId: string, hashtags: string[]) => {
  if (hashtags.length === 0) {
    return
  }

  const supabase = await createClient()

  // Step 1: ensure hashtags exist
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

  const relationPayload = hashtagRows.map((hashtag) => ({
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
        hashtagRows.map((hashtag) => ({ post_id: postId, hashtag_id: hashtag.id })),
        { onConflict: 'post_id,hashtag_id' },
      )
  }
}

/**
 * Create a new user post in the feed
 */
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
    metadata,
  }

  const insertResponse = await supabase
    .schema('social')
    .from('posts')
    .insert(payload)
    .select()
    .single()

  if (insertResponse.error || !insertResponse.data) {
    console.error('Error creating post:', JSON.stringify(insertResponse.error, null, 2))
    throw new Error('Impossible de publier le message')
  }

  try {
    await upsertHashtagRelations(asString(insertResponse.data.id), hashtags)
  } catch {
    // Hashtag persistence is best-effort while the schema is being rolled out.
  }

  revalidatePath('/community')
  revalidatePath('/community/hashtags')
  revalidatePath('/community/trending')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return insertResponse.data
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

  return (comments || []).map((comment) => ({
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

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { error } = await supabase.schema('social').from('comments').insert({
    post_id: postId,
    author_id: user.id,
    content,
  })

  if (error) {
    console.error('Error adding comment:', JSON.stringify(error, null, 2))
    throw new Error("Impossible d'ajouter le commentaire")
  }

  revalidatePath('/community')
  revalidatePath(`/community/posts/${postId}`)
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

  if (!user) {
    throw new Error('Vous devez être connecté')
  }

  const { data: seedItem } = await supabase
    .schema('gamification')
    .from('items')
    .select('id')
    .eq('slug', 'graine')
    .single()

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
    await supabase.schema('social').from('reactions').delete().eq('id', existing.id)

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

  revalidatePath('/community')
  revalidatePath('/dashboard')
  revalidatePath('/profile/[id]')

  return isSuperLiked
}

export async function recordPostShare(postId: string, channel: ShareChannel) {
  if (!isShareChannel(channel)) {
    return false
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const insertShare = await supabase
    .schema('social')
    .from('post_shares')
    .insert({
      post_id: postId,
      channel,
      user_id: user?.id || null,
    })

  let shareRecorded = !insertShare.error

  if (insertShare.error) {
    const { data: postRow } = await supabase
      .schema('social')
      .from('posts')
      .select('id, shares_count')
      .eq('id', postId)
      .maybeSingle()

    if (postRow) {
      const updateFallback = await supabase
        .schema('social')
        .from('posts')
        .update({ shares_count: asNumber(postRow.shares_count, 0) + 1 })
        .eq('id', postId)

      shareRecorded = !updateFallback.error
    }
  }

  revalidatePath('/community')
  revalidatePath(`/community/posts/${postId}`)
  revalidatePath('/community/trending')

  return shareRecorded
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

export async function getGuilds(limit = 24): Promise<Guild[]> {
  const normalizedLimit = Math.max(1, limit)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    .map((row) => asString(row.id))
    .filter((guildId): guildId is string => guildId.length > 0)

  if (guildIds.length === 0) {
    return []
  }

  const [membersRowsResult, membershipsResult] = await Promise.all([
    supabase.schema('identity').from('guild_members').select('guild_id').in('guild_id', guildIds),
    user
      ? supabase.schema('identity').from('guild_members').select('guild_id').eq('user_id', user.id)
      : Promise.resolve({ data: null, error: null }),
  ])

  const membersCountByGuild = new Map<string, number>()
  for (const memberRow of membersRowsResult.data || []) {
    const guildId = asString(memberRow.guild_id)
    if (!guildId) {
      continue
    }

    membersCountByGuild.set(guildId, (membersCountByGuild.get(guildId) || 0) + 1)
  }

  const memberGuildIds = new Set(
    (membershipsResult.data || [])
      .map((row) => asString(row.guild_id))
      .filter((guildId): guildId is string => guildId.length > 0),
  )

  return guildRows
    .map((row) =>
      mapGuildRow(
        row,
        membersCountByGuild.get(asString(row.id)) || 0,
        memberGuildIds.has(asString(row.id)),
        asNumber(row.xp_total, 0),
      ),
    )
    .filter((guild): guild is Guild => guild !== null)
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
    .map((row) => asString(row.user_id))
    .filter((userId): userId is string => userId.length > 0)

  let profilesById = new Map<string, { full_name: string; avatar_url: string | null }>()

  if (memberIds.length > 0) {
    const { data: profileRows } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', memberIds)

    profilesById = new Map(
      (profileRows || [])
        .map((profile) => {
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
          (entry): entry is readonly [string, { full_name: string; avatar_url: string | null }] =>
            entry !== null,
        ),
    )
  }

  const guild = mapGuildRow(guildRow, memberRows.length, !!membershipsResult.data, 0)

  if (!guild) {
    return null
  }

  const members: GuildMember[] = memberRows.map((memberRow) => {
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
  revalidatePath('/community/guilds')
  revalidatePath('/community')
  if (guildSlug) {
    revalidatePath(`/community/guilds/${guildSlug}`)
  }

  return { success: true }
}

export async function getGuildLeaderboard(
  period: 'weekly' | 'monthly' = 'monthly',
  limit = 10,
): Promise<GuildLeaderboardEntry[]> {
  const normalizedLimit = Math.max(1, limit)
  const supabase = await createClient()

  const guilds = await getGuilds(500)

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
