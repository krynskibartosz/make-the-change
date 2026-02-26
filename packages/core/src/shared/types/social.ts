
// ============================================================================
// SOCIAL SCHEMA TYPES
// ============================================================================

export type PostType = 'user_post' | 'project_update_share' | 'system_event';
export type PostVisibility = 'public' | 'guild_only' | 'private';
export type ReactionType = 'like' | 'super_like' | 'plant';

export interface Post {
  id: string;
  author_id: string;
  content: string | null;
  image_urls: string[];
  project_update_id: string | null;
  type: PostType;
  visibility: PostVisibility;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields (optional)
  author?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  comments_count?: number;
  reactions_count?: number;
  user_has_reacted?: boolean;
}

export interface Comment {
  id: string;
  author_id: string;
  post_id: string | null;
  project_update_id: string | null;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface Reaction {
  id: string;
  user_id: string;
  type: ReactionType;
  post_id: string | null;
  comment_id: string | null;
  project_update_id: string | null;
  created_at: string;
}

// ============================================================================
// IDENTITY SCHEMA TYPES (GUILDS)
// ============================================================================

export type GuildType = 'open' | 'invite_only' | 'corporate' | 'school' | 'family';
export type GuildRole = 'member' | 'officer' | 'leader';

export interface Guild {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  owner_id: string;
  type: GuildType;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  members_count?: number;
  xp_total?: number;
  is_member?: boolean;
}

export interface GuildMember {
  guild_id: string;
  user_id: string;
  role: GuildRole;
  joined_at: string;
  // Joined fields
  user?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

// ============================================================================
// GAMIFICATION SCHEMA TYPES
// ============================================================================

export type XpSourceType = 'investment' | 'comment' | 'share' | 'reaction' | 'daily_login' | 'quest' | 'referral' | 'manual_adjustment';

export interface Level {
  level: number;
  name: string;
  xp_required: number;
  icon_url: string | null;
  rewards: Record<string, any>;
}

export interface XpLedgerEntry {
  id: string;
  user_id: string;
  amount: number;
  source_type: XpSourceType;
  source_id: string | null;
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserGamificationProfile {
  user_id: string;
  total_xp: number;
  current_level: number;
  next_level_xp: number;
  progress_to_next_level: number; // 0-100
}
