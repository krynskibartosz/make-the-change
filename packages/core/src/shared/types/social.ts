// ============================================================================
// SOCIAL SCHEMA TYPES
// ============================================================================

export type PostType = 'user_post' | 'project_update_share' | 'system_event'
export type PostVisibility = 'public' | 'guild_only' | 'private'
export type ReactionType = 'like' | 'super_like' | 'plant'
export type FeedSort = 'best' | 'newest' | 'oldest'
export type FeedScope = 'all' | 'my_guilds'
export type ShareChannel =
  | 'copy'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'native'
  | 'whatsapp'
  | 'telegram'
  | 'email'
  | 'reddit'
  | 'embed'
  | 'internal_quote'
export type ShareEventType =
  | 'initiated'
  | 'channel_clicked'
  | 'link_copied'
  | 'target_opened'
  | 'landing'
  | 'conversion'
export type ShareKind = 'original' | 'quote'
export type ContributorScope = 'all' | 'citizens' | 'companies'

export interface QuotedPostSummary {
  id: string
  content: string | null
  image_urls: string[]
  created_at: string
  author: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

export interface Post {
  id: string
  author_id: string
  content: string | null
  image_urls: string[]
  project_update_id: string | null
  type: PostType
  visibility: PostVisibility
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined fields (optional)
  author?: {
    id: string
    full_name: string
    avatar_url: string
  }
  hashtags?: string[]
  score?: number
  shares_count?: number
  author_type?: 'citizen' | 'company'
  share_kind?: ShareKind
  source_post_id?: string | null
  source_post?: QuotedPostSummary | null
  share_url?: string
  og_image_url?: string
  guild_id?: string | null
  comments_count?: number
  reactions_count?: number
  user_has_reacted?: boolean
  user_has_bookmarked?: boolean
}

export interface PostMedia {
  id: string
  post_id: string
  public_url: string
  mime_type: string
  size_bytes: number
  width: number | null
  height: number | null
  alt_text: string | null
  sort_order: number
  status: string
}

export interface UserLikedPost {
  user_id: string
  post_id: string
  liked_at: string
}

export interface UserBookmarkedPost {
  user_id: string
  post_id: string
  bookmarked_at: string
}

export interface Comment {
  id: string
  author_id: string
  post_id: string | null
  project_update_id: string | null
  content: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined fields
  author?: {
    id: string
    full_name: string
    avatar_url: string
  }
}

export interface Reaction {
  id: string
  user_id: string
  type: ReactionType
  post_id: string | null
  comment_id: string | null
  project_update_id: string | null
  created_at: string
}

export interface HashtagStats {
  slug: string
  label: string
  total_count: number
  today_count: number
  month_count: number
  year_count: number
}

export interface ContributorRank {
  user_id: string
  full_name: string
  avatar_url: string | null
  author_type: 'citizen' | 'company'
  posts_count: number
  reactions_received: number
  comments_received: number
  score: number
}

// ============================================================================
// IDENTITY SCHEMA TYPES (GUILDS)
// ============================================================================

export type GuildType = 'open' | 'invite_only' | 'corporate' | 'school' | 'family'
export type GuildRole = 'member' | 'officer' | 'leader'

export interface Guild {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  owner_id: string
  type: GuildType
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined fields
  members_count?: number
  xp_total?: number
  is_member?: boolean
}

export interface GuildMember {
  guild_id: string
  user_id: string
  role: GuildRole
  joined_at: string
  // Joined fields
  user?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

// ============================================================================
// GAMIFICATION SCHEMA TYPES
// ============================================================================

export type XpSourceType =
  | 'investment'
  | 'comment'
  | 'share'
  | 'reaction'
  | 'daily_login'
  | 'quest'
  | 'referral'
  | 'manual_adjustment'

export interface Level {
  level: number
  name: string
  xp_required: number
  icon_url: string | null
  rewards: Record<string, unknown>
}

export interface XpLedgerEntry {
  id: string
  user_id: string
  amount: number
  source_type: XpSourceType
  source_id: string | null
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface UserGamificationProfile {
  user_id: string
  total_xp: number
  current_level: number
  next_level_xp: number
  progress_to_next_level: number // 0-100
}
