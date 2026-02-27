import type { Database as GeneratedDatabase, Json } from './database.generated'

type SchemaWithFunctions<TSchema> = TSchema extends {
  Tables: infer Tables
  Views: infer Views
  Enums: infer Enums
  CompositeTypes: infer CompositeTypes
}
  ? {
      Tables: Tables
      Views: Views
      Functions: Record<string, never>
      Enums: Enums
      CompositeTypes: CompositeTypes
    }
  : TSchema

type GamificationSchema = {
  Tables: {
    challenges: {
      Row: {
        id: string
        slug: string
        title: string
        description: string | null
        type: 'daily' | 'monthly' | 'season' | 'special'
        reward_points: number
        reward_badge: string | null
        status: 'active' | 'inactive' | 'archived'
        start_date: string | null
        end_date: string | null
        metadata: Json | null
        created_at: string
        updated_at: string
        created_by: string | null
        updated_by: string | null
      }
      Insert: {
        id?: string
        slug: string
        title: string
        description?: string | null
        type?: 'daily' | 'monthly' | 'season' | 'special'
        reward_points?: number
        reward_badge?: string | null
        status?: 'active' | 'inactive' | 'archived'
        start_date?: string | null
        end_date?: string | null
        metadata?: Json | null
        created_at?: string
        updated_at?: string
        created_by?: string | null
        updated_by?: string | null
      }
      Update: {
        id?: string
        slug?: string
        title?: string
        description?: string | null
        type?: 'daily' | 'monthly' | 'season' | 'special'
        reward_points?: number
        reward_badge?: string | null
        status?: 'active' | 'inactive' | 'archived'
        start_date?: string | null
        end_date?: string | null
        metadata?: Json | null
        created_at?: string
        updated_at?: string
        created_by?: string | null
        updated_by?: string | null
      }
      Relationships: []
    }
    user_challenges: {
      Row: {
        id: string
        user_id: string
        challenge_id: string
        progress: number | null
        target: number | null
        completed_at: string | null
        claimed_at: string | null
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        user_id: string
        challenge_id: string
        progress?: number | null
        target?: number | null
        completed_at?: string | null
        claimed_at?: string | null
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        user_id?: string
        challenge_id?: string
        progress?: number | null
        target?: number | null
        completed_at?: string | null
        claimed_at?: string | null
        created_at?: string
        updated_at?: string
      }
      Relationships: [
        {
          foreignKeyName: 'user_challenges_challenge_id_fkey'
          columns: ['challenge_id']
          isOneToOne: false
          referencedRelation: 'challenges'
          referencedColumns: ['id']
        },
      ]
    }
  }
  Views: Record<never, never>
  Functions: Record<string, never>
  Enums: GeneratedDatabase['public']['Enums']
  CompositeTypes: GeneratedDatabase['public']['CompositeTypes']
}

type SocialSchema = {
  Tables: {
    posts: {
      Row: {
        id: string
        author_id: string
        content: string | null
        image_urls: string[] | null
        project_update_id: string | null
        type: string
        visibility: string
        metadata: Json | null
        shares_count: number | null
        share_kind: 'original' | 'quote' | null
        source_post_id: string | null
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        author_id: string
        content?: string | null
        image_urls?: string[] | null
        project_update_id?: string | null
        type?: string
        visibility?: string
        metadata?: Json | null
        shares_count?: number | null
        share_kind?: 'original' | 'quote' | null
        source_post_id?: string | null
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        author_id?: string
        content?: string | null
        image_urls?: string[] | null
        project_update_id?: string | null
        type?: string
        visibility?: string
        metadata?: Json | null
        shares_count?: number | null
        share_kind?: 'original' | 'quote' | null
        source_post_id?: string | null
        created_at?: string
        updated_at?: string
      }
      Relationships: []
    }
    comments: {
      Row: {
        id: string
        post_id: string
        author_id: string
        content: string
        metadata: Json | null
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        post_id: string
        author_id: string
        content: string
        metadata?: Json | null
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        post_id?: string
        author_id?: string
        content?: string
        metadata?: Json | null
        created_at?: string
        updated_at?: string
      }
      Relationships: []
    }
    reactions: {
      Row: {
        id: string
        user_id: string
        post_id: string | null
        comment_id: string | null
        type: string
        created_at: string
      }
      Insert: {
        id?: string
        user_id: string
        post_id?: string | null
        comment_id?: string | null
        type: string
        created_at?: string
      }
      Update: {
        id?: string
        user_id?: string
        post_id?: string | null
        comment_id?: string | null
        type?: string
        created_at?: string
      }
      Relationships: []
    }
    post_shares: {
      Row: {
        id: string
        post_id: string
        user_id: string | null
        channel: string
        metadata: Json | null
        created_at: string
      }
      Insert: {
        id?: string
        post_id: string
        user_id?: string | null
        channel: string
        metadata?: Json | null
        created_at?: string
      }
      Update: {
        id?: string
        post_id?: string
        user_id?: string | null
        channel?: string
        metadata?: Json | null
        created_at?: string
      }
      Relationships: []
    }
    post_share_events: {
      Row: {
        id: string
        post_id: string
        actor_user_id: string | null
        channel: string
        event_type: string
        share_token: string | null
        target_url: string | null
        referrer: string | null
        user_agent: string | null
        metadata: Json | null
        created_at: string
      }
      Insert: {
        id?: string
        post_id: string
        actor_user_id?: string | null
        user_id?: string | null
        channel: string
        event_type: string
        share_token?: string | null
        target_url?: string | null
        referrer?: string | null
        user_agent?: string | null
        metadata?: Json | null
        created_at?: string
      }
      Update: {
        id?: string
        post_id?: string
        actor_user_id?: string | null
        user_id?: string | null
        channel?: string
        event_type?: string
        share_token?: string | null
        target_url?: string | null
        referrer?: string | null
        user_agent?: string | null
        metadata?: Json | null
        created_at?: string
      }
      Relationships: []
    }
    hashtags: {
      Row: {
        id: string
        slug: string
        label: string | null
        usage_count: number | null
        created_at: string
      }
      Insert: {
        id?: string
        slug: string
        label?: string | null
        usage_count?: number | null
        created_at?: string
      }
      Update: {
        id?: string
        slug?: string
        label?: string | null
        usage_count?: number | null
        created_at?: string
      }
      Relationships: []
    }
    post_hashtags: {
      Row: {
        post_id: string
        hashtag_id: string
        hashtag_slug: string | null
        created_at: string
      }
      Insert: {
        post_id: string
        hashtag_id: string
        hashtag_slug?: string | null
        created_at?: string
      }
      Update: {
        post_id?: string
        hashtag_id?: string
        hashtag_slug?: string | null
        created_at?: string
      }
      Relationships: []
    }
    bookmarks: {
      Row: {
        id: string
        user_id: string
        post_id: string
        created_at: string
      }
      Insert: {
        id?: string
        user_id: string
        post_id: string
        created_at?: string
      }
      Update: {
        id?: string
        user_id?: string
        post_id?: string
        created_at?: string
      }
      Relationships: []
    }
    post_media: {
      Row: {
        id: string
        post_id: string
        owner_id: string
        public_url: string
        storage_bucket: string
        storage_path: string
        mime_type: string
        size_bytes: number
        width: number | null
        height: number | null
        blurhash: string | null
        alt_text: string | null
        sort_order: number
        status: string
        moderation: Json
        created_at: string
      }
      Insert: {
        id?: string
        post_id: string
        owner_id: string
        public_url: string
        storage_bucket: string
        storage_path: string
        mime_type: string
        size_bytes: number
        width?: number | null
        height?: number | null
        blurhash?: string | null
        alt_text?: string | null
        sort_order?: number
        status?: string
        moderation?: Json
        created_at?: string
      }
      Update: {
        id?: string
        post_id?: string
        owner_id?: string
        public_url?: string
        storage_bucket?: string
        storage_path?: string
        mime_type?: string
        size_bytes?: number
        width?: number | null
        height?: number | null
        blurhash?: string | null
        alt_text?: string | null
        sort_order?: number
        status?: string
        moderation?: Json
        created_at?: string
      }
      Relationships: []
    }
  }
  Views: {
    posts_with_authors: {
      Row: {
        id: string | null
        author_id: string | null
        content: string | null
        image_urls: string[] | null
        project_update_id: string | null
        type: string | null
        visibility: string | null
        metadata: Json | null
        shares_count: number | null
        share_kind: 'original' | 'quote' | null
        source_post_id: string | null
        created_at: string | null
        updated_at: string | null
        author_full_name: string | null
        author_avatar_url: string | null
        author_type: 'citizen' | 'company' | null
        guild_id: string | null
        hashtags: string[] | null
      }
    }
    comments_with_authors: {
      Row: {
        id: string | null
        post_id: string | null
        author_id: string | null
        content: string | null
        metadata: Json | null
        created_at: string | null
        updated_at: string | null
        author_full_name: string | null
        author_avatar_url: string | null
      }
    }
    hashtag_stats: {
      Row: {
        slug: string | null
        label: string | null
        total_count: number | null
        usage_count: number | null
        today_count: number | null
        month_count: number | null
        year_count: number | null
      }
    }
    user_liked_posts: {
      Row: {
        user_id: string | null
        post_id: string | null
        liked_at: string | null
      }
    }
    user_bookmarked_posts: {
      Row: {
        user_id: string | null
        post_id: string | null
        bookmarked_at: string | null
      }
    }
  }
  Functions: Record<string, never>
  Enums: Record<never, never>
  CompositeTypes: Record<never, never>
}

export type Database = Omit<
  GeneratedDatabase,
  'commerce' | 'investment' | 'content' | 'identity' | 'social'
> & {
  commerce: SchemaWithFunctions<GeneratedDatabase['commerce']>
  investment: SchemaWithFunctions<GeneratedDatabase['investment']>
  content: SchemaWithFunctions<GeneratedDatabase['content']>
  identity: SchemaWithFunctions<GeneratedDatabase['identity']>
  gamification: GamificationSchema
  social: SocialSchema
}

export type {
  CompositeTypes,
  Enums,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.generated'

export const Constants = Object.freeze({})
