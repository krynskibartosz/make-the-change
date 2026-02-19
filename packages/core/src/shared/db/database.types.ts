import type { Database as GeneratedDatabase } from './database.generated'
import type { Json } from './database.generated'

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

export type Database = Omit<
  GeneratedDatabase,
  'commerce' | 'investment' | 'cms' | 'content' | 'identity'
> & {
  commerce: SchemaWithFunctions<GeneratedDatabase['commerce']>
  investment: SchemaWithFunctions<GeneratedDatabase['investment']>
  cms: SchemaWithFunctions<GeneratedDatabase['cms']>
  content: SchemaWithFunctions<GeneratedDatabase['content']>
  identity: SchemaWithFunctions<GeneratedDatabase['identity']>
  gamification: GamificationSchema
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
