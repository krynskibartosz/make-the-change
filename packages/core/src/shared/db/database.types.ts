export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type GeneratedDatabase = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          code: string
          code_alpha3: string | null
          created_at: string
          currency_code: string | null
          flag_emoji: string | null
          is_active: boolean | null
          name_en: string
          name_fr: string
          name_native: string
          name_nl: string
          numeric_code: string | null
          phone_code: string | null
        }
        Insert: {
          code: string
          code_alpha3?: string | null
          created_at?: string
          currency_code?: string | null
          flag_emoji?: string | null
          is_active?: boolean | null
          name_en: string
          name_fr: string
          name_native: string
          name_nl: string
          numeric_code?: string | null
          phone_code?: string | null
        }
        Update: {
          code?: string
          code_alpha3?: string | null
          created_at?: string
          currency_code?: string | null
          flag_emoji?: string | null
          is_active?: boolean | null
          name_en?: string
          name_fr?: string
          name_native?: string
          name_nl?: string
          numeric_code?: string | null
          phone_code?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string
          display_order: number | null
          flag_emoji: string | null
          is_active: boolean | null
          is_default: boolean | null
          is_rtl: boolean | null
          name: string
          native_name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          display_order?: number | null
          flag_emoji?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          is_rtl?: boolean | null
          name: string
          native_name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          display_order?: number | null
          flag_emoji?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          is_rtl?: boolean | null
          name?: string
          native_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      producer_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          producer_id: string
          sender_user_id: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          producer_id: string
          sender_user_id: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          producer_id?: string
          sender_user_id?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "producer_messages_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producer_messages_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_city: string | null
          address_country_code: string | null
          address_postal_code: string | null
          address_street: string | null
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string
          date_of_birth: string | null
          deleted_at: string | null
          email: string
          email_verified_at: string | null
          first_name: string | null
          id: string
          is_public: boolean
          kyc_level: number | null
          kyc_status: "pending" | "light" | "complete" | "rejected" | null
          language_code: string | null
          last_login_at: string | null
          last_name: string | null
          metadata: Json | null
          notification_preferences: Json | null
          phone: string | null
          points_balance: number
          social_links: Json | null
          timezone: string | null
          updated_at: string
          user_level: "explorateur" | "protecteur" | "ambassadeur" | null
        }
        Insert: {
          address_city?: string | null
          address_country_code?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          email: string
          email_verified_at?: string | null
          first_name?: string | null
          id: string
          is_public?: boolean
          kyc_level?: number | null
          kyc_status?: "pending" | "light" | "complete" | "rejected" | null
          language_code?: string | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          notification_preferences?: Json | null
          phone?: string | null
          points_balance?: number
          social_links?: Json | null
          timezone?: string | null
          updated_at?: string
          user_level?: "explorateur" | "protecteur" | "ambassadeur" | null
        }
        Update: {
          address_city?: string | null
          address_country_code?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          email?: string
          email_verified_at?: string | null
          first_name?: string | null
          id?: string
          is_public?: boolean
          kyc_level?: number | null
          kyc_status?: "pending" | "light" | "complete" | "rejected" | null
          language_code?: string | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          notification_preferences?: Json | null
          phone?: string | null
          points_balance?: number
          social_links?: Json | null
          timezone?: string | null
          updated_at?: string
          user_level?: "explorateur" | "protecteur" | "ambassadeur" | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_address_country_code_fkey"
            columns: ["address_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      security_fixes_log: {
        Row: {
          details: Json | null
          entity_name: string
          fix_type: string
          fixed_at: string | null
          id: number
          status: string
        }
        Insert: {
          details?: Json | null
          entity_name: string
          fix_type: string
          fixed_at?: string | null
          id?: number
          status: string
        }
        Update: {
          details?: Json | null
          entity_name?: string
          fix_type?: string
          fixed_at?: string | null
          id?: number
          status?: string
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      blur_system_stats: {
        Row: {
          avg_file_size_bytes: number | null
          avg_height: number | null
          avg_width: number | null
          entity_type: string | null
          first_generated: string | null
          generated_last_24h: number | null
          generated_last_7d: number | null
          last_generated: string | null
          max_file_size_bytes: number | null
          min_file_size_bytes: number | null
          total_blur_hashes: number | null
          unique_entities: number | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          depth: number | null
          description_default: string | null
          description_i18n: Json | null
          id: string | null
          is_active: boolean | null
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          parent_id: string | null
          path_ltree: unknown
          root_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          sort_order: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          depth?: number | null
          description_default?: string | null
          description_i18n?: Json | null
          id?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          parent_id?: string | null
          path_ltree?: unknown
          root_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          depth?: number | null
          description_default?: string | null
          description_i18n?: Json | null
          id?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          parent_id?: string | null
          path_ltree?: unknown
          root_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      columns_to_convert_to_enum: {
        Row: {
          constraint_definition: string | null
          constraint_name: unknown
          conversion_hint: string | null
          table_name: unknown
          table_schema: unknown
        }
        Relationships: []
      }
      enum_documentation: {
        Row: {
          description: string | null
          enum_name: unknown
          possible_values: unknown[] | null
          schema: unknown
          value_count: number | null
        }
        Relationships: []
      }
      enum_usage: {
        Row: {
          column_default: string | null
          column_name: unknown
          enum_type: unknown
          is_nullable: string | null
          table_name: unknown
          table_schema: unknown
        }
        Relationships: []
      }
      final_clients_view: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          kyc_level: number | null
          kyc_status: "pending" | "light" | "complete" | "rejected" | null
          last_login_at: string | null
          limits_description: string | null
          loyalty_points: number | null
          purchase_status: string | null
          total_orders: number | null
          user_level: "explorateur" | "protecteur" | "ambassadeur" | null
          wallet_balance: number | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      index_usage_analysis: {
        Row: {
          cleanup_priority: number | null
          fetches: number | null
          index_name: unknown
          reads: number | null
          schemaname: unknown
          size: string | null
          table_name: unknown
          usage_status: string | null
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount_eur_equivalent: number | null
          amount_points: number | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          expected_return_rate: number | null
          id: string | null
          investment_terms: Json | null
          last_return_date: string | null
          maturity_date: string | null
          notes: string | null
          project_id: string | null
          returns_received_points: number | null
          status:
            | "pending"
            | "approved"
            | "active"
            | "completed"
            | "cancelled"
            | "defaulted"
            | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          amount_eur_equivalent?: number | null
          amount_points?: number | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          expected_return_rate?: number | null
          id?: string | null
          investment_terms?: Json | null
          last_return_date?: string | null
          maturity_date?: string | null
          notes?: string | null
          project_id?: string | null
          returns_received_points?: number | null
          status?:
            | "pending"
            | "approved"
            | "active"
            | "completed"
            | "cancelled"
            | "defaulted"
            | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          amount_eur_equivalent?: number | null
          amount_points?: number | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          expected_return_rate?: number | null
          id?: string | null
          investment_terms?: Json | null
          last_return_date?: string | null
          maturity_date?: string | null
          notes?: string | null
          project_id?: string | null
          returns_received_points?: number | null
          status?:
            | "pending"
            | "approved"
            | "active"
            | "completed"
            | "cancelled"
            | "defaulted"
            | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string | null
          order_id: string | null
          product_id: string | null
          product_snapshot: Json | null
          quantity: number | null
          total_price_points: number | null
          unit_price_points: number | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string | null
          order_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number | null
          total_price_points?: number | null
          unit_price_points?: number | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string | null
          order_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number | null
          total_price_points?: number | null
          unit_price_points?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          carrier: string | null
          created_at: string | null
          deleted_at: string | null
          delivered_at: string | null
          id: string | null
          notes: string | null
          payment_method: "points" | "stripe_card" | "stripe_sepa" | "stripe_bank_transfer" | "mixed" | null
          points_earned: number | null
          points_used: number | null
          shipping_address: Json | null
          shipping_cost_points: number | null
          shipped_at: string | null
          status: "pending" | "paid" | "processing" | "in_transit" | "completed" | "closed" | null
          stripe_payment_intent_id: string | null
          subtotal_points: number | null
          tax_points: number | null
          total_points: number | null
          tracking_number: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          carrier?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          id?: string | null
          notes?: string | null
          payment_method?: "points" | "stripe_card" | "stripe_sepa" | "stripe_bank_transfer" | "mixed" | null
          points_earned?: number | null
          points_used?: number | null
          shipping_address?: Json | null
          shipping_cost_points?: number | null
          shipped_at?: string | null
          status?: "pending" | "paid" | "processing" | "in_transit" | "completed" | "closed" | null
          stripe_payment_intent_id?: string | null
          subtotal_points?: number | null
          tax_points?: number | null
          total_points?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          carrier?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          id?: string | null
          notes?: string | null
          payment_method?: "points" | "stripe_card" | "stripe_sepa" | "stripe_bank_transfer" | "mixed" | null
          points_earned?: number | null
          points_used?: number | null
          shipping_address?: Json | null
          shipping_cost_points?: number | null
          shipped_at?: string | null
          status?: "pending" | "paid" | "processing" | "in_transit" | "completed" | "closed" | null
          stripe_payment_intent_id?: string | null
          subtotal_points?: number | null
          tax_points?: number | null
          total_points?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      producers: {
        Row: {
          address_city: string | null
          address_coordinates: unknown | null
          address_country_code: string | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          capacity_info: Json | null
          certifications: string[] | null
          commission_rate: number | null
          contact_email: string | null
          contact_person_name: string | null
          contact_phone: string | null
          contact_website: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          documents: string[] | null
          id: string | null
          images: string[] | null
          location: unknown | null
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          notes: string | null
          owner_user_id: string | null
          partnership_start: string | null
          partnership_type: "exclusive" | "preferred" | "standard" | "trial" | null
          payment_terms: number | null
          slug: string | null
          social_media: Json | null
          specialties: string[] | null
          status: "pending" | "active" | "inactive" | "suspended" | "archived" | null
          story_default: string | null
          story_i18n: Json | null
          type: "farmer" | "cooperative" | "association" | "company" | "individual" | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_city?: string | null
          address_coordinates?: unknown | null
          address_country_code?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          capacity_info?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_person_name?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          documents?: string[] | null
          id?: string | null
          images?: string[] | null
          location?: unknown | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          notes?: string | null
          owner_user_id?: string | null
          partnership_start?: string | null
          partnership_type?: "exclusive" | "preferred" | "standard" | "trial" | null
          payment_terms?: number | null
          slug?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          status?: "pending" | "active" | "inactive" | "suspended" | "archived" | null
          story_default?: string | null
          story_i18n?: Json | null
          type?: "farmer" | "cooperative" | "association" | "company" | "individual" | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_city?: string | null
          address_coordinates?: unknown | null
          address_country_code?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          capacity_info?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_person_name?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          documents?: string[] | null
          id?: string | null
          images?: string[] | null
          location?: unknown | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          notes?: string | null
          owner_user_id?: string | null
          partnership_start?: string | null
          partnership_type?: "exclusive" | "preferred" | "standard" | "trial" | null
          payment_terms?: number | null
          slug?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          status?: "pending" | "active" | "inactive" | "suspended" | "archived" | null
          story_default?: string | null
          story_i18n?: Json | null
          type?: "farmer" | "cooperative" | "association" | "company" | "individual" | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          allergens: "gluten" | "lactose" | "nuts" | "peanuts" | "eggs" | "fish" | "shellfish" | "soy" | "sesame" | "sulfites" | "celery" | "mustard" | "lupin"[] | null
          category_id: string | null
          certifications: "bio" | "organic" | "fair_trade" | "vegan" | "vegetarian" | "halal" | "kosher" | "gluten_free" | "non_gmo" | "rainforest_alliance" | "msc" | "fsc" | "ecocert" | "demeter"[] | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          dimensions: Json | null
          discontinue_date: string | null
          featured: boolean | null
          fulfillment_method: "ship" | "pickup" | "digital" | "experience" | null
          id: string | null
          is_active: boolean | null
          is_hero_product: boolean | null
          launch_date: string | null
          metadata: Json | null
          min_tier: "explorateur" | "protecteur" | "ambassadeur" | null
          name_default: string | null
          name_i18n: Json | null
          nutrition_facts: Json | null
          origin_country: string | null
          partner_source: "direct" | "cooperative" | "partner" | "marketplace" | null
          price_eur_equivalent: number | null
          price_points: number | null
          producer_id: string | null
          search_vector: unknown | null
          secondary_category_id: string | null
          seasonal_availability: Json | null
          seo_description: string | null
          seo_title: string | null
          short_description_default: string | null
          short_description_i18n: Json | null
          slug: string | null
          stock_management: boolean | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
          updated_by: string | null
          variants: Json | null
          weight_grams: number | null
        }
        Insert: {
          allergens?: "gluten" | "lactose" | "nuts" | "peanuts" | "eggs" | "fish" | "shellfish" | "soy" | "sesame" | "sulfites" | "celery" | "mustard" | "lupin"[] | null
          category_id?: string | null
          certifications?: "bio" | "organic" | "fair_trade" | "vegan" | "vegetarian" | "halal" | "kosher" | "gluten_free" | "non_gmo" | "rainforest_alliance" | "msc" | "fsc" | "ecocert" | "demeter"[] | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?: "ship" | "pickup" | "digital" | "experience" | null
          id?: string | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: "explorateur" | "protecteur" | "ambassadeur" | null
          name_default?: string | null
          name_i18n?: Json | null
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?: "direct" | "cooperative" | "partner" | "marketplace" | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          search_vector?: unknown | null
          secondary_category_id?: string | null
          seasonal_availability?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description_default?: string | null
          short_description_i18n?: Json | null
          slug?: string | null
          stock_management?: boolean | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Update: {
          allergens?: "gluten" | "lactose" | "nuts" | "peanuts" | "eggs" | "fish" | "shellfish" | "soy" | "sesame" | "sulfites" | "celery" | "mustard" | "lupin"[] | null
          category_id?: string | null
          certifications?: "bio" | "organic" | "fair_trade" | "vegan" | "vegetarian" | "halal" | "kosher" | "gluten_free" | "non_gmo" | "rainforest_alliance" | "msc" | "fsc" | "ecocert" | "demeter"[] | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?: "ship" | "pickup" | "digital" | "experience" | null
          id?: string | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: "explorateur" | "protecteur" | "ambassadeur" | null
          name_default?: string | null
          name_i18n?: Json | null
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?: "direct" | "cooperative" | "partner" | "marketplace" | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          search_vector?: unknown | null
          secondary_category_id?: string | null
          seasonal_availability?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description_default?: string | null
          short_description_i18n?: Json | null
          slug?: string | null
          stock_management?: boolean | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          address_city: string | null
          address_coordinates: unknown | null
          address_country_code: string | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          avatar_image_url: string | null
          certification_labels: string[] | null
          created_at: string | null
          created_by: string | null
          current_funding: number | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          featured: boolean | null
          funding_progress: number | null
          gallery_image_urls: string[] | null
          hero_image_url: string | null
          id: string | null
          impact_metrics: Json | null
          launch_date: string | null
          location: unknown | null
          long_description_default: string | null
          long_description_i18n: Json | null
          maturity_date: string | null
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          producer_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          species_id: string | null
          status: "draft" | "active" | "funded" | "completed" | "archived" | null
          target_budget: number | null
          type: "beehive" | "olive_tree" | "vineyard" | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_city?: string | null
          address_coordinates?: unknown | null
          address_country_code?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          avatar_image_url?: string | null
          certification_labels?: string[] | null
          created_at?: string | null
          created_by?: string | null
          current_funding?: number | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          featured?: boolean | null
          funding_progress?: number | null
          gallery_image_urls?: string[] | null
          hero_image_url?: string | null
          id?: string | null
          impact_metrics?: Json | null
          launch_date?: string | null
          location?: unknown | null
          long_description_default?: string | null
          long_description_i18n?: Json | null
          maturity_date?: string | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          species_id?: string | null
          status?: "draft" | "active" | "funded" | "completed" | "archived" | null
          target_budget?: number | null
          type?: "beehive" | "olive_tree" | "vineyard" | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_city?: string | null
          address_coordinates?: unknown | null
          address_country_code?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          avatar_image_url?: string | null
          certification_labels?: string[] | null
          created_at?: string | null
          created_by?: string | null
          current_funding?: number | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          featured?: boolean | null
          funding_progress?: number | null
          gallery_image_urls?: string[] | null
          hero_image_url?: string | null
          id?: string | null
          impact_metrics?: Json | null
          launch_date?: string | null
          location?: unknown | null
          long_description_default?: string | null
          long_description_i18n?: Json | null
          maturity_date?: string | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          species_id?: string | null
          status?: "draft" | "active" | "funded" | "completed" | "archived" | null
          target_budget?: number | null
          type?: "beehive" | "olive_tree" | "vineyard" | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
        }
        Relationships: []
      }
      public_projects: {
        Row: {
          address_city: string | null
          address_coordinates: unknown | null
          address_country_code: string | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          avatar_image_url: string | null
          certification_labels: string[] | null
          created_at: string | null
          created_by: string | null
          current_funding: number | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          featured: boolean | null
          funding_progress: number | null
          gallery_image_urls: string[] | null
          hero_image_url: string | null
          id: string | null
          impact_metrics: Json | null
          launch_date: string | null
          location: unknown | null
          long_description_default: string | null
          long_description_i18n: Json | null
          maturity_date: string | null
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          producer_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          species_id: string | null
          status: "draft" | "active" | "funded" | "completed" | "archived" | null
          target_budget: number | null
          type: "beehive" | "olive_tree" | "vineyard" | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: []
      }
      public_user_profiles: {
        Row: {
          avatar_url: string | null
          biodiversity_impact: number | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          impact_score: number | null
          points_balance: number | null
          projects_count: number | null
          total_invested_eur: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      public_user_rankings: {
        Row: {
          avatar_url: string | null
          biodiversity_impact: number | null
          city: string | null
          country: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          impact_score: number | null
          points_balance: number | null
          projects_count: number | null
          rank: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          annual_points: number | null
          annual_price: number | null
          billing_frequency: "monthly" | "annual" | null
          bonus_percentage: number | null
          cancel_at_period_end: boolean | null
          cancellation_reason: string | null
          cancelled_at: string | null
          conversion_date: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string | null
          monthly_points: number | null
          monthly_points_allocation: number | null
          monthly_price: number | null
          next_billing_date: string | null
          plan_type: "monthly_standard" | "monthly_premium" | "annual_standard" | "annual_premium" | null
          status:
            | "active"
            | "inactive"
            | "cancelled"
            | "past_due"
            | "unpaid"
            | "trialing"
            | "expired"
            | "incomplete"
            | "paused"
            | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          annual_points?: number | null
          annual_price?: number | null
          billing_frequency?: "monthly" | "annual" | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string | null
          monthly_points?: number | null
          monthly_points_allocation?: number | null
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: "monthly_standard" | "monthly_premium" | "annual_standard" | "annual_premium" | null
          status?:
            | "active"
            | "inactive"
            | "cancelled"
            | "past_due"
            | "unpaid"
            | "trialing"
            | "expired"
            | "incomplete"
            | "paused"
            | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          annual_points?: number | null
          annual_price?: number | null
          billing_frequency?: "monthly" | "annual" | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string | null
          monthly_points?: number | null
          monthly_points_allocation?: number | null
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: "monthly_standard" | "monthly_premium" | "annual_standard" | "annual_premium" | null
          status?:
            | "active"
            | "inactive"
            | "cancelled"
            | "past_due"
            | "unpaid"
            | "trialing"
            | "expired"
            | "incomplete"
            | "paused"
            | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_roles: {
        Args: {
          user_id: string
        }
        Returns: string[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      place_euro_order: {
        Args: {
          p_order_data: Json
        }
        Returns: Json
      }
      place_points_order: {
        Args: {
          p_order_data: Json
          p_payment_data: Json
        }
        Returns: Json
      }
      refresh_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_user_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_total_points_generated: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      allergen_enum:
        | "gluten"
        | "lactose"
        | "nuts"
        | "peanuts"
        | "eggs"
        | "fish"
        | "shellfish"
        | "soy"
        | "sesame"
        | "sulfites"
        | "celery"
        | "mustard"
        | "lupin"
      blog_post_status: "draft" | "published" | "archived"
      certification_enum:
        | "bio"
        | "organic"
        | "fair_trade"
        | "vegan"
        | "vegetarian"
        | "halal"
        | "kosher"
        | "gluten_free"
        | "non_gmo"
        | "rainforest_alliance"
        | "msc"
        | "fsc"
        | "ecocert"
        | "demeter"
      currency_code: "EUR" | "USD" | "GBP"
      finance_account_type: "asset" | "liability" | "equity" | "revenue" | "expense" | "off_balance"
      finance_entry_direction: "debit" | "credit"
      fulfillment_method: "ship" | "pickup" | "digital" | "experience" | "mixed"
      kyc_status_enum: "pending" | "light" | "complete" | "rejected"
      media_role_enum: "hero" | "cover" | "gallery" | "document" | "avatar" | "logo" | "thumbnail"
      order_status_enum: "pending" | "paid" | "processing" | "in_transit" | "completed" | "closed"
      payment_method_enum: "points" | "stripe_card" | "stripe_sepa" | "stripe_bank_transfer" | "mixed"
      producer_partnership_enum: "exclusive" | "preferred" | "standard" | "trial"
      producer_status_enum: "pending" | "active" | "inactive" | "suspended" | "archived"
      producer_type_enum: "farmer" | "cooperative" | "association" | "company" | "individual"
      product_partner_source: "direct" | "cooperative" | "partner" | "marketplace"
      project_status_enum: "draft" | "active" | "funded" | "completed" | "archived"
      project_type: "beehive" | "olive_tree" | "vineyard"
      reference_type_enum:
        | "order"
        | "subscription"
        | "investment"
        | "referral"
        | "admin_adjustment"
        | "bonus"
        | "refund"
        | "expiration"
      subscription_plan_enum: "standard" | "premium"
      subscription_plan_enum_v2: "monthly_standard" | "monthly_premium" | "annual_standard" | "annual_premium"
      subscription_status_type:
        | "active"
        | "inactive"
        | "cancelled"
        | "past_due"
        | "unpaid"
        | "trialing"
        | "expired"
        | "incomplete"
        | "paused"
      transaction_type_enum:
        | "earned_subscription"
        | "earned_purchase"
        | "earned_referral"
        | "earned_investment_return"
        | "spent_order"
        | "spent_investment"
        | "adjustment_admin"
        | "adjustment_correction"
        | "bonus_welcome"
        | "bonus_milestone"
        | "bonus_referral"
        | "refund"
        | "expiration"
      update_type_enum: "production" | "maintenance" | "harvest" | "impact" | "news" | "milestone"
      user_consent_type: "terms_of_use" | "privacy_policy" | "marketing" | "data_processing"
      user_level_enum: "explorateur" | "protecteur" | "ambassadeur"
      user_role_enum: "user" | "admin" | "superadmin" | "producer" | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Database = GeneratedDatabase & {
  commerce: {
    Tables: Pick<
      GeneratedDatabase["public"]["Views"],
      | "categories"
      | "products"
      | "orders"
      | "order_items"
      | "subscriptions"
    >
    Views: GeneratedDatabase["public"]["Views"]
    Enums: GeneratedDatabase["public"]["Enums"]
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"]
  }
  investment: {
    Tables: Pick<
      GeneratedDatabase["public"]["Views"],
      "producers" | "projects" | "investments"
    >
    Views: GeneratedDatabase["public"]["Views"]
    Enums: GeneratedDatabase["public"]["Enums"]
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"]
  }
  cms: {
    Tables: Record<never, never>
    Views: GeneratedDatabase["public"]["Views"]
    Enums: GeneratedDatabase["public"]["Enums"]
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"]
  }
  content: {
    Tables: {
      menus: {
        Row: {
          created_at: string | null
          id: string
          slug: string
          structure: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          slug: string
          structure?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          slug?: string
          structure?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          created_at: string | null
          id: string
          sections: Json
          seo: Json | null
          slug: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sections?: Json
          seo?: Json | null
          slug: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sections?: Json
          seo?: Json | null
          slug?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: GeneratedDatabase["public"]["Views"]
    Enums: GeneratedDatabase["public"]["Enums"]
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"]
  }
  identity: {
    Tables: Record<never, never>
    Views: GeneratedDatabase["public"]["Views"]
    Enums: GeneratedDatabase["public"]["Enums"]
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"]
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

type ValidSchema = keyof Omit<Database, "__InternalSupabase">

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: ValidSchema },
  TableName extends PublicTableNameOrOptions extends { schema: ValidSchema }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: ValidSchema }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: ValidSchema },
  TableName extends PublicTableNameOrOptions extends { schema: ValidSchema }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: ValidSchema }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: ValidSchema },
  TableName extends PublicTableNameOrOptions extends { schema: ValidSchema }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: ValidSchema }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: ValidSchema },
  EnumName extends PublicEnumNameOrOptions extends { schema: ValidSchema }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: ValidSchema }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: ValidSchema },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: ValidSchema
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: ValidSchema }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
