export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  commerce: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          depth: number | null
          description_default: string | null
          description_i18n: Json | null
          id: string
          is_active: boolean
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          parent_id: string | null
          path_ltree: unknown
          root_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          depth?: number | null
          description_default?: string | null
          description_i18n?: Json | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          parent_id?: string | null
          path_ltree?: unknown
          root_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          depth?: number | null
          description_default?: string | null
          description_i18n?: Json | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          parent_id?: string | null
          path_ltree?: unknown
          root_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          order_id: string
          product_id: string
          product_snapshot: Json | null
          quantity: number
          total_price_amount: number | null
          total_price_points: number
          unit_price_amount: number | null
          unit_price_points: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          order_id: string
          product_id: string
          product_snapshot?: Json | null
          quantity: number
          total_price_amount?: number | null
          total_price_points: number
          unit_price_amount?: number | null
          unit_price_points: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          product_snapshot?: Json | null
          quantity?: number
          total_price_amount?: number | null
          total_price_points?: number
          unit_price_amount?: number | null
          unit_price_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          carrier: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          deleted_at: string | null
          delivered_at: string | null
          id: string
          notes: string | null
          payment_method: Database["commerce"]["Enums"]["payment_method"] | null
          points_earned: number
          points_used: number
          shipped_at: string | null
          shipping_address: Json
          shipping_cost_points: number
          status: Database["commerce"]["Enums"]["order_status"]
          stripe_payment_intent_id: string | null
          subtotal_points: number
          tax_points: number
          total_amount: number | null
          total_points: number
          tracking_number: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          carrier?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          id?: string
          notes?: string | null
          payment_method?:
            | Database["commerce"]["Enums"]["payment_method"]
            | null
          points_earned?: number
          points_used: number
          shipped_at?: string | null
          shipping_address: Json
          shipping_cost_points?: number
          status?: Database["commerce"]["Enums"]["order_status"]
          stripe_payment_intent_id?: string | null
          subtotal_points: number
          tax_points?: number
          total_amount?: number | null
          total_points: number
          tracking_number?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          carrier?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          id?: string
          notes?: string | null
          payment_method?:
            | Database["commerce"]["Enums"]["payment_method"]
            | null
          points_earned?: number
          points_used?: number
          shipped_at?: string | null
          shipping_address?: Json
          shipping_cost_points?: number
          status?: Database["commerce"]["Enums"]["order_status"]
          stripe_payment_intent_id?: string | null
          subtotal_points?: number
          tax_points?: number
          total_amount?: number | null
          total_points?: number
          tracking_number?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          balance_after: number
          created_at: string
          delta: number
          id: string
          metadata: Json | null
          reason: Database["commerce"]["Enums"]["points_ledger_reason"]
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          delta: number
          id?: string
          metadata?: Json | null
          reason?: Database["commerce"]["Enums"]["points_ledger_reason"]
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          delta?: number
          id?: string
          metadata?: Json | null
          reason?: Database["commerce"]["Enums"]["points_ledger_reason"]
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          allergens: Database["commerce"]["Enums"]["allergen"][] | null
          category_id: string
          certifications:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          dimensions: Json | null
          discontinue_date: string | null
          featured: boolean
          fulfillment_method: Database["commerce"]["Enums"]["fulfillment_method"]
          id: string
          images: string[] | null
          is_active: boolean
          is_hero_product: boolean
          launch_date: string | null
          metadata: Json | null
          min_tier: Database["identity"]["Enums"]["user_level"]
          name_default: string
          name_i18n: Json
          nutrition_facts: Json | null
          origin_country: string | null
          partner_source: Database["commerce"]["Enums"]["product_partner_source"]
          price_eur_equivalent: number | null
          price_points: number
          producer_id: string
          search_vector: unknown
          seasonal_availability: Json | null
          secondary_category_id: string | null
          seo_description: string | null
          seo_description_i18n: Json | null
          seo_keywords: string | null
          seo_title: string | null
          seo_title_i18n: Json | null
          short_description_default: string | null
          short_description_i18n: Json | null
          slug: string
          stock_management: boolean
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string
          updated_by: string | null
          variants: Json | null
          weight_grams: number | null
        }
        Insert: {
          allergens?: Database["commerce"]["Enums"]["allergen"][] | null
          category_id: string
          certifications?:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean
          fulfillment_method: Database["commerce"]["Enums"]["fulfillment_method"]
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_hero_product?: boolean
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: Database["identity"]["Enums"]["user_level"]
          name_default?: string
          name_i18n?: Json
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?: Database["commerce"]["Enums"]["product_partner_source"]
          price_eur_equivalent?: number | null
          price_points: number
          producer_id: string
          search_vector?: unknown
          seasonal_availability?: Json | null
          secondary_category_id?: string | null
          seo_description?: string | null
          seo_description_i18n?: Json | null
          seo_keywords?: string | null
          seo_title?: string | null
          seo_title_i18n?: Json | null
          short_description_default?: string | null
          short_description_i18n?: Json | null
          slug: string
          stock_management?: boolean
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Update: {
          allergens?: Database["commerce"]["Enums"]["allergen"][] | null
          category_id?: string
          certifications?:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean
          fulfillment_method?: Database["commerce"]["Enums"]["fulfillment_method"]
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_hero_product?: boolean
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: Database["identity"]["Enums"]["user_level"]
          name_default?: string
          name_i18n?: Json
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?: Database["commerce"]["Enums"]["product_partner_source"]
          price_eur_equivalent?: number | null
          price_points?: number
          producer_id?: string
          search_vector?: unknown
          seasonal_availability?: Json | null
          secondary_category_id?: string | null
          seo_description?: string | null
          seo_description_i18n?: Json | null
          seo_keywords?: string | null
          seo_title?: string | null
          seo_title_i18n?: Json | null
          short_description_default?: string | null
          short_description_i18n?: Json | null
          slug?: string
          stock_management?: boolean
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_secondary_category_id_fkey"
            columns: ["secondary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          data: Json | null
          event_id: string
          id: string
          processed_at: string
          type: string
        }
        Insert: {
          data?: Json | null
          event_id: string
          id?: string
          processed_at?: string
          type: string
        }
        Update: {
          data?: Json | null
          event_id?: string
          id?: string
          processed_at?: string
          type?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          annual_points: number
          annual_price: number | null
          billing_frequency:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage: number | null
          cancel_at_period_end: boolean
          cancellation_reason: string | null
          cancelled_at: string | null
          conversion_date: string | null
          conversion_incentive: Json | null
          converted_from:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          deleted_at: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          monthly_points: number
          monthly_points_allocation: number
          monthly_price: number | null
          next_billing_date: string | null
          plan_type: Database["commerce"]["Enums"]["subscription_plan"]
          status: Database["commerce"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          annual_points?: number
          annual_price?: number | null
          billing_frequency?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          conversion_incentive?: Json | null
          converted_from?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          monthly_points?: number
          monthly_points_allocation: number
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type: Database["commerce"]["Enums"]["subscription_plan"]
          status?: Database["commerce"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          annual_points?: number
          annual_price?: number | null
          billing_frequency?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          conversion_incentive?: Json | null
          converted_from?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          monthly_points?: number
          monthly_points_allocation?: number
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: Database["commerce"]["Enums"]["subscription_plan"]
          status?: Database["commerce"]["Enums"]["subscription_status"]
          stripe_customer_id?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _compute_category_path: { Args: { p_id: string }; Returns: unknown }
      _ltree_label_uuid: { Args: { p_id: string }; Returns: unknown }
      _recalc_order_points: { Args: { p_order_id: string }; Returns: undefined }
      add_points: {
        Args: {
          p_delta: number
          p_metadata?: Json
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
          p_user_id: string
        }
        Returns: string
      }
      get_products_i18n: {
        Args: {
          p_category_id?: string
          p_language?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          category_id: string
          created_at: string
          description: string
          id: string
          name: string
          price: number
          short_description: string
          sku: string
          status: string
          stock: number
          updated_at: string
        }[]
      }
      soft_delete_order: { Args: { p_order_id: string }; Returns: undefined }
    }
    Enums: {
      allergen:
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
      billing_frequency: "monthly" | "annual"
      certification:
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
      fulfillment_method:
        | "ship"
        | "pickup"
        | "digital"
        | "experience"
        | "dropship"
        | "ondemand"
      order_status:
        | "pending"
        | "paid"
        | "processing"
        | "in_transit"
        | "completed"
        | "closed"
      payment_method:
        | "points"
        | "stripe_card"
        | "stripe_sepa"
        | "stripe_bank_transfer"
        | "mixed"
      points_ledger_reason:
        | "purchase"
        | "refund"
        | "investment"
        | "investment_returns"
        | "admin_adjustment"
        | "welcome_bonus"
        | "referral"
      product_partner_source:
        | "direct"
        | "cooperative"
        | "partner"
        | "marketplace"
      subscription_plan:
        | "monthly_standard"
        | "monthly_premium"
        | "annual_standard"
        | "annual_premium"
      subscription_status:
        | "active"
        | "inactive"
        | "cancelled"
        | "past_due"
        | "unpaid"
        | "trialing"
        | "expired"
        | "incomplete"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  content: {
    Tables: {
      blog_authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          social_links: Json | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          social_links?: Json | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          social_links?: Json | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: Json | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          estimated_read_time_minutes: number | null
          excerpt: string | null
          excerpt_i18n: Json | null
          featured: boolean | null
          id: string
          producer_id: string | null
          project_id: string | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_metadata: Json | null
          seo_title: string | null
          slug: string
          status: Database["content"]["Enums"]["blog_post_status"]
          title: string
          title_i18n: Json | null
          updated_at: string
          updated_by: string | null
          view_count: number
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          estimated_read_time_minutes?: number | null
          excerpt?: string | null
          excerpt_i18n?: Json | null
          featured?: boolean | null
          id?: string
          producer_id?: string | null
          project_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_metadata?: Json | null
          seo_title?: string | null
          slug: string
          status?: Database["content"]["Enums"]["blog_post_status"]
          title: string
          title_i18n?: Json | null
          updated_at?: string
          updated_by?: string | null
          view_count?: number
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          estimated_read_time_minutes?: number | null
          excerpt?: string | null
          excerpt_i18n?: Json | null
          featured?: boolean | null
          id?: string
          producer_id?: string | null
          project_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_metadata?: Json | null
          seo_title?: string | null
          slug?: string
          status?: Database["content"]["Enums"]["blog_post_status"]
          title?: string
          title_i18n?: Json | null
          updated_at?: string
          updated_by?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      image_blur_hashes: {
        Row: {
          blur_data_url: string | null
          blur_hash: string
          entity_id: string
          entity_type: string
          file_size: number | null
          generated_at: string | null
          height: number | null
          id: number
          image_url: string
          updated_at: string | null
          width: number | null
        }
        Insert: {
          blur_data_url?: string | null
          blur_hash: string
          entity_id: string
          entity_type: string
          file_size?: number | null
          generated_at?: string | null
          height?: number | null
          id?: number
          image_url: string
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          blur_data_url?: string | null
          blur_hash?: string
          entity_id?: string
          entity_type?: string
          file_size?: number | null
          generated_at?: string | null
          height?: number | null
          id?: number
          image_url?: string
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          blurhash: string | null
          bucket_id: string | null
          caption: string | null
          checksum: string | null
          created_at: string
          created_by: string | null
          external_url: string | null
          file_name: string | null
          file_size: number | null
          focal_point: Json | null
          height: number | null
          id: string
          metadata: Json
          mime_type: string | null
          storage_path: string | null
          updated_by: string | null
          variants: Json | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          blurhash?: string | null
          bucket_id?: string | null
          caption?: string | null
          checksum?: string | null
          created_at?: string
          created_by?: string | null
          external_url?: string | null
          file_name?: string | null
          file_size?: number | null
          focal_point?: Json | null
          height?: number | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          storage_path?: string | null
          updated_by?: string | null
          variants?: Json | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          blurhash?: string | null
          bucket_id?: string | null
          caption?: string | null
          checksum?: string | null
          created_at?: string
          created_by?: string | null
          external_url?: string | null
          file_name?: string | null
          file_size?: number | null
          focal_point?: Json | null
          height?: number | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          storage_path?: string | null
          updated_by?: string | null
          variants?: Json | null
          width?: number | null
        }
        Relationships: []
      }
      media_relations: {
        Row: {
          created_at: string
          display_order: number | null
          entity_id: string
          entity_type: string
          id: string
          media_asset_id: string
          metadata: Json | null
          role: Database["content"]["Enums"]["media_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          entity_id: string
          entity_type: string
          id?: string
          media_asset_id: string
          metadata?: Json | null
          role?: Database["content"]["Enums"]["media_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          entity_id?: string
          entity_type?: string
          id?: string
          media_asset_id?: string
          metadata?: Json | null
          role?: Database["content"]["Enums"]["media_role"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_relations_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: []
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
        Relationships: []
      }
      translation_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          entity_id: string
          entity_type: string
          fields_count: number
          id: string
          language: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          fields_count?: number
          id?: string
          language: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          fields_count?: number
          id?: string
          language?: string
        }
        Relationships: []
      }
    }
    Views: {
      media_stats: {
        Row: {
          avg_file_size: number | null
          external_urls: number | null
          mime_types: string[] | null
          stored_in_supabase: number | null
          total_media: number | null
          total_size: number | null
          unique_mime_types: number | null
          with_blurhash: number | null
          with_dimensions: number | null
          with_variants: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_orphaned_media: { Args: never; Returns: number }
      generate_image_variants: {
        Args: { p_bucket_id?: string; p_storage_path: string }
        Returns: Json
      }
      get_entity_media: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_role?: Database["content"]["Enums"]["media_role"]
        }
        Returns: {
          blurhash: string
          display_order: number
          media_asset_id: string
          mime_type: string
          role: Database["content"]["Enums"]["media_role"]
          storage_path: string
        }[]
      }
      get_optimal_image_url: {
        Args: {
          p_desired_width?: number
          p_format?: string
          p_media_id: string
        }
        Returns: string
      }
      get_product_media: {
        Args: { p_desired_width?: number; p_product_id: string }
        Returns: {
          alt_text: string
          blurhash: string
          caption: string
          height: number
          id: string
          media_position: number
          role: string
          url: string
          variants: Json
          width: number
        }[]
      }
      get_project_media: {
        Args: { p_desired_width?: number; p_project_id: string }
        Returns: {
          alt_text: string
          blurhash: string
          caption: string
          height: number
          id: string
          media_position: number
          role: string
          url: string
          variants: Json
          width: number
        }[]
      }
    }
    Enums: {
      blog_post_status: "draft" | "published" | "archived"
      media_role:
        | "hero"
        | "cover"
        | "gallery"
        | "document"
        | "avatar"
        | "logo"
        | "thumbnail"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  finance: {
    Tables: {
      accounts: {
        Row: {
          account_type: Database["finance"]["Enums"]["finance_account_type"]
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
          name: string
          slug: string
        }
        Insert: {
          account_type: Database["finance"]["Enums"]["finance_account_type"]
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
        }
        Update: {
          account_type?: Database["finance"]["Enums"]["finance_account_type"]
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json
          occurred_at: string
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: []
      }
      journal_lines: {
        Row: {
          account_id: string
          amount: number
          direction: Database["finance"]["Enums"]["finance_entry_direction"]
          entry_id: string
          id: string
          metadata: Json
        }
        Insert: {
          account_id: string
          amount: number
          direction: Database["finance"]["Enums"]["finance_entry_direction"]
          entry_id: string
          id?: string
          metadata?: Json
        }
        Update: {
          account_id?: string
          amount?: number
          direction?: Database["finance"]["Enums"]["finance_entry_direction"]
          entry_id?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "journal_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reconcile_ledger: {
        Args: never
        Returns: {
          actual_value: number
          check_name: string
          difference: number
          expected_value: number
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      finance_account_type:
        | "asset"
        | "liability"
        | "equity"
        | "revenue"
        | "expense"
        | "off_balance"
      finance_entry_direction: "debit" | "credit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  gamification: {
    Tables: {
      challenges: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          reward_badge: string | null
          reward_points: number
          slug: string
          start_date: string | null
          status: Database["gamification"]["Enums"]["challenge_status"]
          title: string
          type: Database["gamification"]["Enums"]["challenge_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          reward_badge?: string | null
          reward_points?: number
          slug: string
          start_date?: string | null
          status?: Database["gamification"]["Enums"]["challenge_status"]
          title: string
          type?: Database["gamification"]["Enums"]["challenge_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          reward_badge?: string | null
          reward_points?: number
          slug?: string
          start_date?: string | null
          status?: Database["gamification"]["Enums"]["challenge_status"]
          title?: string
          type?: Database["gamification"]["Enums"]["challenge_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string | null
          description_i18n: Json | null
          id: string
          image_url: string | null
          metadata: Json | null
          name_i18n: Json | null
          rarity: string | null
          slug: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description_i18n?: Json | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          name_i18n?: Json | null
          rarity?: string | null
          slug: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description_i18n?: Json | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          name_i18n?: Json | null
          rarity?: string | null
          slug?: string
          type?: string | null
        }
        Relationships: []
      }
      levels: {
        Row: {
          icon_url: string | null
          level: number
          name: string
          rewards: Json | null
          xp_required: number
        }
        Insert: {
          icon_url?: string | null
          level: number
          name: string
          rewards?: Json | null
          xp_required: number
        }
        Update: {
          icon_url?: string | null
          level?: number
          name?: string
          rewards?: Json | null
          xp_required?: number
        }
        Relationships: []
      }
      quests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          property_id: string | null
          reward_items: Json | null
          reward_points: number
          slug: string
          status: string | null
          title: string
          type: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          property_id?: string | null
          reward_items?: Json | null
          reward_points?: number
          slug: string
          status?: string | null
          title: string
          type?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          property_id?: string | null
          reward_items?: Json | null
          reward_points?: number
          slug?: string
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          challenge_id: string
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          progress: number | null
          target: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          target?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          target?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_inventory: {
        Row: {
          acquired_at: string | null
          id: string
          item_id: string
          metadata: Json | null
          quantity: number
          user_id: string
        }
        Insert: {
          acquired_at?: string | null
          id?: string
          item_id: string
          metadata?: Json | null
          quantity?: number
          user_id: string
        }
        Update: {
          acquired_at?: string | null
          id?: string
          item_id?: string
          metadata?: Json | null
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_inventory_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quests: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          quest_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          quest_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          quest_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_quests_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_ledger: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          source_id: string | null
          source_type: Database["gamification"]["Enums"]["xp_source_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          source_type: Database["gamification"]["Enums"]["xp_source_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          source_type?: Database["gamification"]["Enums"]["xp_source_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_stats: {
        Row: {
          current_level: number | null
          level_name: string | null
          next_level_xp_required: number | null
          progress_percent: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: []
      }
      user_xp_totals: {
        Row: {
          current_level: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      add_xp: {
        Args: {
          p_amount: number
          p_description?: string
          p_source_id?: string
          p_source_type: Database["gamification"]["Enums"]["xp_source_type"]
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      challenge_status: "active" | "inactive" | "archived"
      challenge_type: "daily" | "monthly" | "season" | "special" | "quest"
      xp_source_type:
        | "investment"
        | "comment"
        | "share"
        | "reaction"
        | "daily_login"
        | "quest"
        | "referral"
        | "manual_adjustment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  identity: {
    Tables: {
      guild_members: {
        Row: {
          guild_id: string
          joined_at: string | null
          role: Database["identity"]["Enums"]["guild_role"] | null
          user_id: string
        }
        Insert: {
          guild_id: string
          joined_at?: string | null
          role?: Database["identity"]["Enums"]["guild_role"] | null
          user_id: string
        }
        Update: {
          guild_id?: string
          joined_at?: string | null
          role?: Database["identity"]["Enums"]["guild_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          banner_url: string | null
          cover_alt: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_alt: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          owner_id: string
          slug: string
          type: Database["identity"]["Enums"]["guild_type"] | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          cover_alt?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_alt?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          owner_id: string
          slug: string
          type?: Database["identity"]["Enums"]["guild_type"] | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          cover_alt?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_alt?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          slug?: string
          type?: Database["identity"]["Enums"]["guild_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: Database["identity"]["Enums"]["user_consent_type"]
          consent_version: string
          decision_at: string
          granted: boolean
          id: string
          ip: unknown
          metadata: Json
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: Database["identity"]["Enums"]["user_consent_type"]
          consent_version: string
          decision_at?: string
          granted: boolean
          id?: string
          ip?: unknown
          metadata?: Json
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: Database["identity"]["Enums"]["user_consent_type"]
          consent_version?: string
          decision_at?: string
          granted?: boolean
          id?: string
          ip?: unknown
          metadata?: Json
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          deleted_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          metadata: Json
          revoked_at: string | null
          role: Database["identity"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          deleted_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          metadata?: Json
          revoked_at?: string | null
          role: Database["identity"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          deleted_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          metadata?: Json
          revoked_at?: string | null
          role?: Database["identity"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions_archive: {
        Row: {
          id: string
          ip: unknown
          metadata: Json
          session_id: string | null
          signed_in_at: string
          signed_out_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip?: unknown
          metadata?: Json
          session_id?: string | null
          signed_in_at?: string
          signed_out_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip?: unknown
          metadata?: Json
          session_id?: string | null
          signed_in_at?: string
          signed_out_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hard_delete_user: { Args: { p_user_id: string }; Returns: undefined }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { uid: string }; Returns: boolean }
      is_producer: { Args: never; Returns: boolean }
      is_translation_editor: { Args: never; Returns: boolean }
      restore_user: { Args: { p_user_id: string }; Returns: undefined }
      soft_delete_user: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      guild_role: "member" | "officer" | "leader"
      guild_type: "open" | "invite_only" | "corporate" | "school" | "family"
      kyc_status: "pending" | "light" | "complete" | "rejected"
      user_consent_type:
        | "terms_of_use"
        | "privacy_policy"
        | "marketing"
        | "data_processing"
      user_level: "explorateur" | "protecteur" | "ambassadeur"
      user_role: "user" | "admin" | "superadmin" | "producer" | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  investment: {
    Tables: {
      ecosystems: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description_default: string | null
          description_i18n: Json | null
          icon_name: string | null
          id: string
          image_url: string | null
          name_default: string | null
          name_i18n: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name_default?: string | null
          name_i18n?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name_default?: string | null
          name_i18n?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount_eur_equivalent: number
          amount_points: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          expected_return_rate: number | null
          id: string
          investment_terms: Json | null
          last_return_date: string | null
          maturity_date: string | null
          notes: string | null
          project_id: string
          returns_received_points: number
          status: Database["investment"]["Enums"]["investment_status"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          amount_eur_equivalent: number
          amount_points: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          expected_return_rate?: number | null
          id?: string
          investment_terms?: Json | null
          last_return_date?: string | null
          maturity_date?: string | null
          notes?: string | null
          project_id: string
          returns_received_points?: number
          status?: Database["investment"]["Enums"]["investment_status"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          amount_eur_equivalent?: number
          amount_points?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          expected_return_rate?: number | null
          id?: string
          investment_terms?: Json | null
          last_return_date?: string | null
          maturity_date?: string | null
          notes?: string | null
          project_id?: string
          returns_received_points?: number
          status?: Database["investment"]["Enums"]["investment_status"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "my_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      producers: {
        Row: {
          address_city: string | null
          address_coordinates: unknown
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
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          documents: string[] | null
          id: string
          images: string[] | null
          location: unknown
          metadata: Json | null
          name_default: string
          name_i18n: Json | null
          notes: string | null
          owner_user_id: string | null
          partnership_start: string | null
          partnership_type: Database["investment"]["Enums"]["producer_partnership"]
          payment_terms: number
          slug: string
          social_media: Json | null
          specialties: string[] | null
          status: Database["investment"]["Enums"]["producer_status"]
          story_default: string | null
          story_i18n: Json | null
          type: Database["investment"]["Enums"]["producer_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address_city?: string | null
          address_coordinates?: unknown
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
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          location?: unknown
          metadata?: Json | null
          name_default?: string
          name_i18n?: Json | null
          notes?: string | null
          owner_user_id?: string | null
          partnership_start?: string | null
          partnership_type?: Database["investment"]["Enums"]["producer_partnership"]
          payment_terms?: number
          slug: string
          social_media?: Json | null
          specialties?: string[] | null
          status?: Database["investment"]["Enums"]["producer_status"]
          story_default?: string | null
          story_i18n?: Json | null
          type?: Database["investment"]["Enums"]["producer_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address_city?: string | null
          address_coordinates?: unknown
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
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          location?: unknown
          metadata?: Json | null
          name_default?: string
          name_i18n?: Json | null
          notes?: string | null
          owner_user_id?: string | null
          partnership_start?: string | null
          partnership_type?: Database["investment"]["Enums"]["producer_partnership"]
          payment_terms?: number
          slug?: string
          social_media?: Json | null
          specialties?: string[] | null
          status?: Database["investment"]["Enums"]["producer_status"]
          story_default?: string | null
          story_i18n?: Json | null
          type?: Database["investment"]["Enums"]["producer_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          images: string[] | null
          metrics: Json | null
          project_id: string | null
          published_at: string | null
          title: string
          type: Database["investment"]["Enums"]["update_type"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          images?: string[] | null
          metrics?: Json | null
          project_id?: string | null
          published_at?: string | null
          title: string
          type: Database["investment"]["Enums"]["update_type"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          images?: string[] | null
          metrics?: Json | null
          project_id?: string | null
          published_at?: string | null
          title?: string
          type?: Database["investment"]["Enums"]["update_type"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "my_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address_city: string | null
          address_coordinates: unknown
          address_country_code: string | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          avatar_image_url: string | null
          certification_labels: string[] | null
          created_at: string
          created_by: string | null
          current_funding: number
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          ecosystem_id: string | null
          featured: boolean
          funding_progress: number | null
          gallery_image_urls: string[] | null
          hero_image_url: string | null
          id: string
          impact_metrics: Json | null
          launch_date: string | null
          location: unknown
          long_description_default: string | null
          long_description_i18n: Json | null
          maturity_date: string | null
          metadata: Json | null
          name_default: string
          name_i18n: Json | null
          producer_id: string
          seo_description: string | null
          seo_description_i18n: Json | null
          seo_keywords: string | null
          seo_title: string | null
          seo_title_i18n: Json | null
          slug: string
          species_id: string | null
          status: Database["investment"]["Enums"]["project_status"]
          target_budget: number
          type: Database["investment"]["Enums"]["project_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address_city?: string | null
          address_coordinates?: unknown
          address_country_code?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          avatar_image_url?: string | null
          certification_labels?: string[] | null
          created_at?: string
          created_by?: string | null
          current_funding?: number
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          ecosystem_id?: string | null
          featured?: boolean
          funding_progress?: number | null
          gallery_image_urls?: string[] | null
          hero_image_url?: string | null
          id?: string
          impact_metrics?: Json | null
          launch_date?: string | null
          location?: unknown
          long_description_default?: string | null
          long_description_i18n?: Json | null
          maturity_date?: string | null
          metadata?: Json | null
          name_default?: string
          name_i18n?: Json | null
          producer_id: string
          seo_description?: string | null
          seo_description_i18n?: Json | null
          seo_keywords?: string | null
          seo_title?: string | null
          seo_title_i18n?: Json | null
          slug: string
          species_id?: string | null
          status?: Database["investment"]["Enums"]["project_status"]
          target_budget: number
          type: Database["investment"]["Enums"]["project_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address_city?: string | null
          address_coordinates?: unknown
          address_country_code?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          avatar_image_url?: string | null
          certification_labels?: string[] | null
          created_at?: string
          created_by?: string | null
          current_funding?: number
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          ecosystem_id?: string | null
          featured?: boolean
          funding_progress?: number | null
          gallery_image_urls?: string[] | null
          hero_image_url?: string | null
          id?: string
          impact_metrics?: Json | null
          launch_date?: string | null
          location?: unknown
          long_description_default?: string | null
          long_description_i18n?: Json | null
          maturity_date?: string | null
          metadata?: Json | null
          name_default?: string
          name_i18n?: Json | null
          producer_id?: string
          seo_description?: string | null
          seo_description_i18n?: Json | null
          seo_keywords?: string | null
          seo_title?: string | null
          seo_title_i18n?: Json | null
          slug?: string
          species_id?: string | null
          status?: Database["investment"]["Enums"]["project_status"]
          target_budget?: number
          type?: Database["investment"]["Enums"]["project_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_ecosystem_id_fkey"
            columns: ["ecosystem_id"]
            isOneToOne: false
            referencedRelation: "ecosystems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_quick_stats"
            referencedColumns: ["producer_id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers_with_jsonb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_city: string | null
          address_country_code: string | null
          capacity: number | null
          contact_email: string | null
          created_at: string | null
          current_funding: number | null
          funding_goal: number | null
          id: string
          location: string | null
          manager_name: string | null
          metadata: Json | null
          name: string
          project_id: string
          slug: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address_city?: string | null
          address_country_code?: string | null
          capacity?: number | null
          contact_email?: string | null
          created_at?: string | null
          current_funding?: number | null
          funding_goal?: number | null
          id?: string
          location?: string | null
          manager_name?: string | null
          metadata?: Json | null
          name: string
          project_id: string
          slug: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address_city?: string | null
          address_country_code?: string | null
          capacity?: number | null
          contact_email?: string | null
          created_at?: string | null
          current_funding?: number | null
          funding_goal?: number | null
          id?: string
          location?: string | null
          manager_name?: string | null
          metadata?: Json | null
          name?: string
          project_id?: string
          slug?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "my_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      species: {
        Row: {
          bioscore: number | null
          characteristics: Json | null
          conservation_status:
            | Database["investment"]["Enums"]["conservation_status"]
            | null
          content_levels: Json | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          gallery_urls: string[] | null
          habitat: string[] | null
          habitat_default: string | null
          habitat_i18n: Json | null
          id: string
          image_url: string | null
          is_endemic: boolean
          is_featured: boolean
          name_default: string | null
          name_i18n: Json | null
          scientific_name: string | null
          threats: string[] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          bioscore?: number | null
          characteristics?: Json | null
          conservation_status?:
            | Database["investment"]["Enums"]["conservation_status"]
            | null
          content_levels?: Json | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          gallery_urls?: string[] | null
          habitat?: string[] | null
          habitat_default?: string | null
          habitat_i18n?: Json | null
          id?: string
          image_url?: string | null
          is_endemic?: boolean
          is_featured?: boolean
          name_default?: string | null
          name_i18n?: Json | null
          scientific_name?: string | null
          threats?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          bioscore?: number | null
          characteristics?: Json | null
          conservation_status?:
            | Database["investment"]["Enums"]["conservation_status"]
            | null
          content_levels?: Json | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          gallery_urls?: string[] | null
          habitat?: string[] | null
          habitat_default?: string | null
          habitat_i18n?: Json | null
          id?: string
          image_url?: string | null
          is_endemic?: boolean
          is_featured?: boolean
          name_default?: string | null
          name_i18n?: Json | null
          scientific_name?: string | null
          threats?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_unlocked_species: {
        Row: {
          current_level: number
          progress_xp: number
          source_investment_id: string | null
          species_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          current_level?: number
          progress_xp?: number
          source_investment_id?: string | null
          species_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          current_level?: number
          progress_xp?: number
          source_investment_id?: string | null
          species_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocked_species_source_investment_id_fkey"
            columns: ["source_investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_unlocked_species_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      my_blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content: Json | null
          cover_image_url: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          id: string | null
          producer_id: string | null
          producer_name: string | null
          producer_slug: string | null
          project_id: string | null
          published_at: string | null
          slug: string | null
          status: Database["content"]["Enums"]["blog_post_status"] | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_quick_stats"
            referencedColumns: ["producer_id"]
          },
          {
            foreignKeyName: "blog_posts_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers_with_jsonb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "my_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      my_projects: {
        Row: {
          address_city: string | null
          address_coordinates: unknown
          address_country_code: string | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          certification_labels: string[] | null
          created_at: string | null
          created_by: string | null
          current_funding: number | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          featured: boolean | null
          funding_progress: number | null
          funding_progress_percentage: number | null
          id: string | null
          impact_metrics: Json | null
          launch_date: string | null
          location: unknown
          long_description_i18n: Json | null
          maturity_date: string | null
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          producer_id: string | null
          producer_name: string | null
          producer_slug: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          species_id: string | null
          status: Database["investment"]["Enums"]["project_status"] | null
          target_budget: number | null
          total_investments: number | null
          type: Database["investment"]["Enums"]["project_type"] | null
          unique_investors: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_quick_stats"
            referencedColumns: ["producer_id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers_with_jsonb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      producer_quick_stats: {
        Row: {
          producer_id: string | null
          stats: Json | null
        }
        Relationships: []
      }
      producers_with_jsonb: {
        Row: {
          address_city: string | null
          address_coordinates: unknown
          address_country_code: string | null
          address_jsonb: Json | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          capacity_info: Json | null
          certifications: string[] | null
          commission_rate: number | null
          contact_email: string | null
          contact_info_jsonb: Json | null
          contact_person_name: string | null
          contact_phone: string | null
          contact_website: string | null
          created_at: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          documents: string[] | null
          id: string | null
          images: string[] | null
          location: unknown
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          notes: string | null
          partnership_start: string | null
          partnership_type:
            | Database["investment"]["Enums"]["producer_partnership"]
            | null
          payment_terms: number | null
          slug: string | null
          social_media: Json | null
          specialties: string[] | null
          status: Database["investment"]["Enums"]["producer_status"] | null
          story_i18n: Json | null
          type: Database["investment"]["Enums"]["producer_type"] | null
          updated_at: string | null
        }
        Insert: {
          address_city?: string | null
          address_coordinates?: unknown
          address_country_code?: string | null
          address_jsonb?: never
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          capacity_info?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_info_jsonb?: never
          contact_person_name?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          documents?: string[] | null
          id?: string | null
          images?: string[] | null
          location?: unknown
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          notes?: string | null
          partnership_start?: string | null
          partnership_type?:
            | Database["investment"]["Enums"]["producer_partnership"]
            | null
          payment_terms?: number | null
          slug?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          status?: Database["investment"]["Enums"]["producer_status"] | null
          story_i18n?: Json | null
          type?: Database["investment"]["Enums"]["producer_type"] | null
          updated_at?: string | null
        }
        Update: {
          address_city?: string | null
          address_coordinates?: unknown
          address_country_code?: string | null
          address_jsonb?: never
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          capacity_info?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_info_jsonb?: never
          contact_person_name?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          documents?: string[] | null
          id?: string | null
          images?: string[] | null
          location?: unknown
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          notes?: string | null
          partnership_start?: string | null
          partnership_type?:
            | Database["investment"]["Enums"]["producer_partnership"]
            | null
          payment_terms?: number | null
          slug?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          status?: Database["investment"]["Enums"]["producer_status"] | null
          story_i18n?: Json | null
          type?: Database["investment"]["Enums"]["producer_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      find_producers_nearby: {
        Args: {
          p_latitude: number
          p_limit?: number
          p_longitude: number
          p_radius_km?: number
        }
        Returns: {
          address: Json
          distance_km: number
          formatted_address: string
          id: string
          latitude: number
          longitude: number
          name: string
          slug: string
          type: string
        }[]
      }
      find_projects_nearby: {
        Args: {
          p_latitude: number
          p_limit?: number
          p_longitude: number
          p_radius_km?: number
        }
        Returns: {
          address: Json
          distance_km: number
          formatted_address: string
          id: string
          latitude: number
          longitude: number
          name: string
          slug: string
          status: string
        }[]
      }
      get_projects_centroid: {
        Args: never
        Returns: {
          latitude: number
          longitude: number
        }[]
      }
      get_projects_i18n: {
        Args: {
          p_language?: string
          p_limit?: number
          p_offset?: number
          p_status?: string
        }
        Returns: {
          created_at: string
          current_amount: number
          description: string
          end_date: string
          id: string
          long_description: string
          name: string
          slug: string
          start_date: string
          status: string
          target_amount: number
          updated_at: string
        }[]
      }
    }
    Enums: {
      conservation_status: "LC" | "NT" | "VU" | "EN" | "CR" | "EW" | "EX"
      investment_status:
        | "pending"
        | "approved"
        | "active"
        | "completed"
        | "cancelled"
        | "defaulted"
      producer_partnership: "exclusive" | "preferred" | "standard" | "trial"
      producer_status:
        | "pending"
        | "active"
        | "inactive"
        | "suspended"
        | "archived"
      producer_type:
        | "farmer"
        | "cooperative"
        | "association"
        | "company"
        | "individual"
      project_status: "draft" | "active" | "funded" | "completed" | "archived"
      project_type: "beehive" | "olive_tree" | "vineyard" | "forest" | "marine"
      update_type:
        | "production"
        | "maintenance"
        | "harvest"
        | "impact"
        | "news"
        | "milestone"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  ledger: {
    Tables: {
      points_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          reference_id: string | null
          reference_type: Database["ledger"]["Enums"]["reference_type"] | null
          type: Database["ledger"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: Database["ledger"]["Enums"]["reference_type"] | null
          type: Database["ledger"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: Database["ledger"]["Enums"]["reference_type"] | null
          type?: Database["ledger"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_next_partition: { Args: never; Returns: undefined }
      create_next_partition_with_rls: { Args: never; Returns: undefined }
      get_points_balance: { Args: { p_user_id: string }; Returns: number }
      get_user_balance: { Args: { p_user_id: string }; Returns: number }
      recompute_balance_after: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      reference_type:
        | "order"
        | "subscription"
        | "investment"
        | "referral"
        | "admin_adjustment"
        | "bonus"
        | "refund"
        | "expiration"
      transaction_type:
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
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
          status: Database["public"]["Enums"]["message_status"]
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
          status?: Database["public"]["Enums"]["message_status"]
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
          status?: Database["public"]["Enums"]["message_status"]
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
          kyc_status: Database["identity"]["Enums"]["kyc_status"] | null
          language_code: string | null
          last_login_at: string | null
          last_name: string | null
          metadata: Json | null
          notification_preferences: Json | null
          phone: string | null
          points_balance: number
          social_links: Json | null
          theme_config: Json | null
          timezone: string | null
          updated_at: string
          user_level: Database["identity"]["Enums"]["user_level"] | null
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
          kyc_status?: Database["identity"]["Enums"]["kyc_status"] | null
          language_code?: string | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          notification_preferences?: Json | null
          phone?: string | null
          points_balance?: number
          social_links?: Json | null
          theme_config?: Json | null
          timezone?: string | null
          updated_at?: string
          user_level?: Database["identity"]["Enums"]["user_level"] | null
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
          kyc_status?: Database["identity"]["Enums"]["kyc_status"] | null
          language_code?: string | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          notification_preferences?: Json | null
          phone?: string | null
          points_balance?: number
          social_links?: Json | null
          theme_config?: Json | null
          timezone?: string | null
          updated_at?: string
          user_level?: Database["identity"]["Enums"]["user_level"] | null
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
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
        ]
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
          kyc_status: Database["identity"]["Enums"]["kyc_status"] | null
          last_login_at: string | null
          purchase_status: string | null
          user_level: Database["identity"]["Enums"]["user_level"] | null
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
          status: Database["investment"]["Enums"]["investment_status"] | null
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
          status?: Database["investment"]["Enums"]["investment_status"] | null
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
          status?: Database["investment"]["Enums"]["investment_status"] | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_featured_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
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
          payment_method: Database["commerce"]["Enums"]["payment_method"] | null
          points_earned: number | null
          points_used: number | null
          shipped_at: string | null
          shipping_address: Json | null
          shipping_cost_points: number | null
          status: Database["commerce"]["Enums"]["order_status"] | null
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
          payment_method?:
            | Database["commerce"]["Enums"]["payment_method"]
            | null
          points_earned?: number | null
          points_used?: number | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_cost_points?: number | null
          status?: Database["commerce"]["Enums"]["order_status"] | null
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
          payment_method?:
            | Database["commerce"]["Enums"]["payment_method"]
            | null
          points_earned?: number | null
          points_used?: number | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_cost_points?: number | null
          status?: Database["commerce"]["Enums"]["order_status"] | null
          stripe_payment_intent_id?: string | null
          subtotal_points?: number | null
          tax_points?: number | null
          total_points?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      producers: {
        Row: {
          address_city: string | null
          address_coordinates: unknown
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
          location: unknown
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          notes: string | null
          owner_user_id: string | null
          partnership_start: string | null
          partnership_type:
            | Database["investment"]["Enums"]["producer_partnership"]
            | null
          payment_terms: number | null
          slug: string | null
          social_media: Json | null
          specialties: string[] | null
          status: Database["investment"]["Enums"]["producer_status"] | null
          story_i18n: Json | null
          type: Database["investment"]["Enums"]["producer_type"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_city?: string | null
          address_coordinates?: unknown
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
          location?: unknown
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          notes?: string | null
          owner_user_id?: string | null
          partnership_start?: string | null
          partnership_type?:
            | Database["investment"]["Enums"]["producer_partnership"]
            | null
          payment_terms?: number | null
          slug?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          status?: Database["investment"]["Enums"]["producer_status"] | null
          story_i18n?: Json | null
          type?: Database["investment"]["Enums"]["producer_type"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_city?: string | null
          address_coordinates?: unknown
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
          location?: unknown
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          notes?: string | null
          owner_user_id?: string | null
          partnership_start?: string | null
          partnership_type?:
            | Database["investment"]["Enums"]["producer_partnership"]
            | null
          payment_terms?: number | null
          slug?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          status?: Database["investment"]["Enums"]["producer_status"] | null
          story_i18n?: Json | null
          type?: Database["investment"]["Enums"]["producer_type"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producers_country_fkey"
            columns: ["address_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: Database["commerce"]["Enums"]["allergen"][] | null
          category_id: string | null
          certifications:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description_default: string | null
          description_i18n: Json | null
          dimensions: Json | null
          discontinue_date: string | null
          featured: boolean | null
          fulfillment_method:
            | Database["commerce"]["Enums"]["fulfillment_method"]
            | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          is_hero_product: boolean | null
          launch_date: string | null
          metadata: Json | null
          min_tier: Database["identity"]["Enums"]["user_level"] | null
          name_default: string | null
          name_i18n: Json | null
          nutrition_facts: Json | null
          origin_country: string | null
          partner_source:
            | Database["commerce"]["Enums"]["product_partner_source"]
            | null
          price_eur_equivalent: number | null
          price_points: number | null
          producer_id: string | null
          search_vector: unknown
          seasonal_availability: Json | null
          secondary_category_id: string | null
          seo_description: string | null
          seo_description_i18n: Json | null
          seo_keywords: string | null
          seo_title: string | null
          seo_title_i18n: Json | null
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
          allergens?: Database["commerce"]["Enums"]["allergen"][] | null
          category_id?: string | null
          certifications?:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?:
            | Database["commerce"]["Enums"]["fulfillment_method"]
            | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: Database["identity"]["Enums"]["user_level"] | null
          name_default?: string | null
          name_i18n?: Json | null
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?:
            | Database["commerce"]["Enums"]["product_partner_source"]
            | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          search_vector?: unknown
          seasonal_availability?: Json | null
          secondary_category_id?: string | null
          seo_description?: string | null
          seo_description_i18n?: Json | null
          seo_keywords?: string | null
          seo_title?: string | null
          seo_title_i18n?: Json | null
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
          allergens?: Database["commerce"]["Enums"]["allergen"][] | null
          category_id?: string | null
          certifications?:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?:
            | Database["commerce"]["Enums"]["fulfillment_method"]
            | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: Database["identity"]["Enums"]["user_level"] | null
          name_default?: string | null
          name_i18n?: Json | null
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?:
            | Database["commerce"]["Enums"]["product_partner_source"]
            | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          search_vector?: unknown
          seasonal_availability?: Json | null
          secondary_category_id?: string | null
          seo_description?: string | null
          seo_description_i18n?: Json | null
          seo_keywords?: string | null
          seo_title?: string | null
          seo_title_i18n?: Json | null
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
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_origin_country_fkey"
            columns: ["origin_country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "products_producer_fk"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_fk"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_secondary_category_id_fkey"
            columns: ["secondary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_secondary_category_id_fkey"
            columns: ["secondary_category_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_categories: {
        Row: {
          created_at: string | null
          description_default: string | null
          icon: string | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          name_default: string | null
          slug: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_default?: string | null
          icon?: never
          id?: string | null
          image_url?: never
          is_active?: boolean | null
          name_default?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_default?: string | null
          icon?: never
          id?: string | null
          image_url?: never
          is_active?: boolean | null
          name_default?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_featured_projects: {
        Row: {
          address_city: string | null
          address_country_code: string | null
          created_at: string | null
          current_funding: number | null
          description_default: string | null
          featured: boolean | null
          funding_progress: number | null
          hero_image_url: string | null
          id: string | null
          launch_date: string | null
          long_description_default: string | null
          maturity_date: string | null
          name_default: string | null
          producer_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          status: Database["investment"]["Enums"]["project_status"] | null
          target_budget: number | null
          type: Database["investment"]["Enums"]["project_type"] | null
        }
        Insert: {
          address_city?: string | null
          address_country_code?: string | null
          created_at?: string | null
          current_funding?: number | null
          description_default?: string | null
          featured?: boolean | null
          funding_progress?: number | null
          hero_image_url?: string | null
          id?: string | null
          launch_date?: string | null
          long_description_default?: string | null
          maturity_date?: string | null
          name_default?: string | null
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["investment"]["Enums"]["project_status"] | null
          target_budget?: number | null
          type?: Database["investment"]["Enums"]["project_type"] | null
        }
        Update: {
          address_city?: string | null
          address_country_code?: string | null
          created_at?: string | null
          current_funding?: number | null
          description_default?: string | null
          featured?: boolean | null
          funding_progress?: number | null
          hero_image_url?: string | null
          id?: string | null
          launch_date?: string | null
          long_description_default?: string | null
          maturity_date?: string | null
          name_default?: string | null
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["investment"]["Enums"]["project_status"] | null
          target_budget?: number | null
          type?: Database["investment"]["Enums"]["project_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_country_fkey"
            columns: ["address_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
        ]
      }
      public_producers: {
        Row: {
          address_city: string | null
          address_country_code: string | null
          contact_website: string | null
          created_at: string | null
          description_default: string | null
          id: string | null
          images: string[] | null
          location: unknown
          metadata: Json | null
          name_default: string | null
          slug: string | null
          social_media: Json | null
          status: Database["investment"]["Enums"]["producer_status"] | null
          updated_at: string | null
        }
        Insert: {
          address_city?: string | null
          address_country_code?: string | null
          contact_website?: string | null
          created_at?: string | null
          description_default?: string | null
          id?: string | null
          images?: string[] | null
          location?: unknown
          metadata?: Json | null
          name_default?: string | null
          slug?: string | null
          social_media?: Json | null
          status?: Database["investment"]["Enums"]["producer_status"] | null
          updated_at?: string | null
        }
        Update: {
          address_city?: string | null
          address_country_code?: string | null
          contact_website?: string | null
          created_at?: string | null
          description_default?: string | null
          id?: string | null
          images?: string[] | null
          location?: unknown
          metadata?: Json | null
          name_default?: string | null
          slug?: string | null
          social_media?: Json | null
          status?: Database["investment"]["Enums"]["producer_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producers_country_fkey"
            columns: ["address_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      public_products: {
        Row: {
          allergens: Database["commerce"]["Enums"]["allergen"][] | null
          category_id: string | null
          certifications:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at: string | null
          description_default: string | null
          description_i18n: Json | null
          featured: boolean | null
          fulfillment_method:
            | Database["commerce"]["Enums"]["fulfillment_method"]
            | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          metadata: Json | null
          name_default: string | null
          name_i18n: Json | null
          origin_country: string | null
          price_eur_equivalent: number | null
          price_points: number | null
          producer_id: string | null
          short_description_default: string | null
          short_description_i18n: Json | null
          slug: string | null
          stock_quantity: number | null
          tags: string[] | null
        }
        Insert: {
          allergens?: Database["commerce"]["Enums"]["allergen"][] | null
          category_id?: string | null
          certifications?:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          featured?: boolean | null
          fulfillment_method?:
            | Database["commerce"]["Enums"]["fulfillment_method"]
            | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          origin_country?: string | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          short_description_default?: string | null
          short_description_i18n?: Json | null
          slug?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
        }
        Update: {
          allergens?: Database["commerce"]["Enums"]["allergen"][] | null
          category_id?: string | null
          certifications?:
            | Database["commerce"]["Enums"]["certification"][]
            | null
          created_at?: string | null
          description_default?: string | null
          description_i18n?: Json | null
          featured?: boolean | null
          fulfillment_method?:
            | Database["commerce"]["Enums"]["fulfillment_method"]
            | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          metadata?: Json | null
          name_default?: string | null
          name_i18n?: Json | null
          origin_country?: string | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          short_description_default?: string | null
          short_description_i18n?: Json | null
          slug?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_origin_country_fkey"
            columns: ["origin_country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "products_producer_fk"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_fk"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
        }
        Relationships: []
      }
      public_projects: {
        Row: {
          address_city: string | null
          address_country_code: string | null
          created_at: string | null
          current_funding: number | null
          description_default: string | null
          featured: boolean | null
          funding_progress: number | null
          hero_image_url: string | null
          id: string | null
          launch_date: string | null
          long_description_default: string | null
          maturity_date: string | null
          name_default: string | null
          producer_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          status: Database["investment"]["Enums"]["project_status"] | null
          target_budget: number | null
          type: Database["investment"]["Enums"]["project_type"] | null
        }
        Insert: {
          address_city?: string | null
          address_country_code?: string | null
          created_at?: string | null
          current_funding?: number | null
          description_default?: string | null
          featured?: boolean | null
          funding_progress?: number | null
          hero_image_url?: string | null
          id?: string | null
          launch_date?: string | null
          long_description_default?: string | null
          maturity_date?: string | null
          name_default?: string | null
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["investment"]["Enums"]["project_status"] | null
          target_budget?: number | null
          type?: Database["investment"]["Enums"]["project_type"] | null
        }
        Update: {
          address_city?: string | null
          address_country_code?: string | null
          created_at?: string | null
          current_funding?: number | null
          description_default?: string | null
          featured?: boolean | null
          funding_progress?: number | null
          hero_image_url?: string | null
          id?: string | null
          launch_date?: string | null
          long_description_default?: string | null
          maturity_date?: string | null
          name_default?: string | null
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["investment"]["Enums"]["project_status"] | null
          target_budget?: number | null
          type?: Database["investment"]["Enums"]["project_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_country_fkey"
            columns: ["address_country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "public_producers"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "profiles_address_country_code_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      public_user_rankings: {
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
          rank: number | null
          total_invested_eur: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_address_country_code_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      security_fixes_summary: {
        Row: {
          cannot_fix_count: number | null
          fix_type: string | null
          fixed_count: number | null
          fixes: Json | null
          total_fixes: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          annual_points: number | null
          annual_price: number | null
          billing_frequency:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage: number | null
          cancel_at_period_end: boolean | null
          cancellation_reason: string | null
          cancelled_at: string | null
          conversion_date: string | null
          conversion_incentive: Json | null
          converted_from:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          deleted_at: string | null
          ended_at: string | null
          id: string | null
          metadata: Json | null
          monthly_points: number | null
          monthly_points_allocation: number | null
          monthly_price: number | null
          next_billing_date: string | null
          plan_type: Database["commerce"]["Enums"]["subscription_plan"] | null
          status: Database["commerce"]["Enums"]["subscription_status"] | null
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
          billing_frequency?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          conversion_incentive?: Json | null
          converted_from?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          ended_at?: string | null
          id?: string | null
          metadata?: Json | null
          monthly_points?: number | null
          monthly_points_allocation?: number | null
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: Database["commerce"]["Enums"]["subscription_plan"] | null
          status?: Database["commerce"]["Enums"]["subscription_status"] | null
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
          billing_frequency?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          conversion_incentive?: Json | null
          converted_from?:
            | Database["commerce"]["Enums"]["billing_frequency"]
            | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          ended_at?: string | null
          id?: string | null
          metadata?: Json | null
          monthly_points?: number | null
          monthly_points_allocation?: number | null
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: Database["commerce"]["Enums"]["subscription_plan"] | null
          status?: Database["commerce"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "final_clients_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_permissions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      table_size_analysis: {
        Row: {
          deletes: number | null
          index_size: string | null
          inserts: number | null
          schemaname: unknown
          size_status: string | null
          table_name: unknown
          table_size: string | null
          total_size: string | null
          updates: number | null
        }
        Relationships: []
      }
      user_permissions_view: {
        Row: {
          access_description: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          kyc_status: Database["identity"]["Enums"]["kyc_status"] | null
          last_login_at: string | null
          roles: string[] | null
          user_level: Database["identity"]["Enums"]["user_level"] | null
        }
        Relationships: []
      }
      users_with_roles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_admin: boolean | null
          kyc_status: Database["identity"]["Enums"]["kyc_status"] | null
          last_login_at: string | null
          last_name: string | null
          roles: string[] | null
          user_level: Database["identity"]["Enums"]["user_level"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      assign_category_by_keywords: {
        Args: { product_description: string; product_name: string }
        Returns: string
      }
      calculate_conversion_rate:
        | { Args: never; Returns: number }
        | { Args: { end_date?: string; start_date?: string }; Returns: number }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_mrr:
        | { Args: never; Returns: number }
        | { Args: { target_date?: string }; Returns: number }
      check_user_permissions: {
        Args: { p_user_id: string }
        Returns: {
          can_access_admin: boolean
          can_manage_products: boolean
          email: string
          full_name: string
          is_admin: boolean
          is_producer: boolean
          is_superadmin: boolean
          roles: string[]
        }[]
      }
      cleanup_old_soft_deletes: {
        Args: { p_retention_days?: number }
        Returns: {
          deleted_count: number
          table_name: string
        }[]
      }
      cleanup_orphaned_blur_hashes: {
        Args: { p_entity_type?: string }
        Returns: number
      }
      count_total_members: { Args: never; Returns: number }
      create_final_client: {
        Args: {
          p_email: string
          p_first_name?: string
          p_language?: string
          p_last_name?: string
        }
        Returns: string
      }
      create_project_with_default_location: {
        Args: {
          p_address?: Json
          p_description?: string
          p_featured?: boolean
          p_images?: string[]
          p_long_description?: string
          p_name: string
          p_producer_id?: string
          p_slug: string
          p_status?: string
          p_target_budget: number
          p_type: string
        }
        Returns: {
          address: Json
          created_at: string
          description: string
          featured: boolean
          id: string
          images: string[]
          location: unknown
          long_description: string
          name: string
          producer_id: string
          slug: string
          status: string
          target_budget: number
          type: string
          updated_at: string
        }[]
      }
      create_user_with_role: {
        Args: {
          p_email: string
          p_first_name: string
          p_last_name: string
          p_role?: Database["identity"]["Enums"]["user_role"]
          p_user_level?: Database["identity"]["Enums"]["user_level"]
        }
        Returns: string
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      enum_values: { Args: { enum_type: unknown }; Returns: string[] }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      expire_old_points: { Args: never; Returns: number }
      format_address: {
        Args: { p_address: Json; p_country_code?: string }
        Returns: string
      }
      generate_blurhash_for_image: {
        Args: { image_url: string }
        Returns: string
      }
      generate_i18n_types: { Args: never; Returns: string }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_category_path: { Args: { cat_id: string }; Returns: string }
      get_client_kyc_status: {
        Args: { p_user_id: string }
        Returns: {
          can_prefund: boolean
          can_purchase: boolean
          daily_limit: number
          email: string
          full_name: string
          kyc_level: number
          kyc_status: string
          monthly_limit: number
        }[]
      }
      get_dashboard_redirect: { Args: { p_user_id: string }; Returns: string }
      get_days_until_expiry: { Args: { expiry_date: string }; Returns: number }
      get_entity_blur_hashes: {
        Args: { p_entity_id: string; p_entity_type: string }
        Returns: {
          blur_hash: string
          file_size: number
          generated_at: string
          height: number
          image_url: string
          width: number
        }[]
      }
      get_image_blur_hash: { Args: { p_image_url: string }; Returns: string }
      get_project_by_id: {
        Args: { project_uuid: string }
        Returns: {
          created_at: string
          current_amount: number
          description: string
          id: string
          status: string
          target_amount: number
          title: string
          updated_at: string
        }[]
      }
      get_security_fixes_report: {
        Args: never
        Returns: {
          category: string
          details: Json
          fix_rate: number
          fixed_issues: number
          remaining_issues: number
          total_issues: number
        }[]
      }
      get_total_points_generated: { Args: never; Returns: number }
      get_translation: {
        Args: {
          fallback_language?: string
          preferred_language?: string
          translations: Json
        }
        Returns: string
      }
      get_user_roles: {
        Args: { p_user_id: string }
        Returns: {
          role: string
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      grant_producer_role: { Args: { user_email: string }; Returns: boolean }
      handle_payment_intent_succeeded: {
        Args: {
          p_amount_cents: number
          p_event_id: string
          p_metadata: Json
          p_payment_intent_id: string
        }
        Returns: Json
      }
      increment_blog_post_view_count: {
        Args: { post_id: string }
        Returns: undefined
      }
      is_uuid: { Args: { txt: string }; Returns: boolean }
      is_valid_enum_value: {
        Args: { p_enum_type: unknown; p_value: string }
        Returns: boolean
      }
      is_within_radius: {
        Args: {
          lat1: number
          lat2: number
          lon1: number
          lon2: number
          radius_km: number
        }
        Returns: boolean
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      place_euro_order: { Args: { p_order_data: Json }; Returns: Json }
      place_points_order: {
        Args: { p_order_data: Json; p_payment_data: Json }
        Returns: Json
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      refresh_dashboard_kpis_secure: { Args: never; Returns: boolean }
      refresh_dashboard_materialized_views: { Args: never; Returns: undefined }
      refresh_dashboard_materialized_views_logged: {
        Args: never
        Returns: number
      }
      refresh_leaderboard: { Args: never; Returns: undefined }
      refresh_user_rankings: { Args: never; Returns: undefined }
      set_app_search_path: { Args: never; Returns: undefined }
      set_product_images: {
        Args: { p_id: string; p_images: string[] }
        Returns: undefined
      }
      set_product_images_json: {
        Args: { p_id: string; p_images_json: Json }
        Returns: boolean
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_client_wallet: {
        Args: {
          p_amount: number
          p_transaction_type?: string
          p_user_id: string
        }
        Returns: boolean
      }
      update_product_images: {
        Args: { p_id: string; p_images: string[] }
        Returns: undefined
      }
      update_product_images_json:
        | { Args: { p_id: string; p_images_json: Json }; Returns: undefined }
        | {
            Args: { p_id: string; p_images_json: string[] }
            Returns: undefined
          }
        | { Args: { p_id: string; p_images_json: Json }; Returns: undefined }
        | { Args: { p_id: string; p_images_json: Json }; Returns: undefined }
        | {
            Args: { p_id: string; p_images_json: string[] }
            Returns: undefined
          }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      upsert_image_blur_hash: {
        Args: {
          p_blur_hash: string
          p_entity_id: string
          p_entity_type: string
          p_file_size?: number
          p_height?: number
          p_image_url: string
          p_width?: number
        }
        Returns: boolean
      }
      upsert_image_blur_hash_v2: {
        Args: {
          p_blur_data_url: string
          p_blur_hash: string
          p_entity_id: string
          p_entity_type: string
          p_file_size: number
          p_height: number
          p_image_url: string
          p_width: number
        }
        Returns: boolean
      }
      validate_address: { Args: { p_address: Json }; Returns: boolean }
      validate_translations: { Args: { translations: Json }; Returns: boolean }
    }
    Enums: {
      message_status: "pending" | "read" | "replied" | "archived"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
  social: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          post_id: string | null
          project_update_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          post_id?: string | null
          project_update_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          post_id?: string | null
          project_update_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string | null
          id: string
          producer_id: string | null
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id?: string | null
          id?: string
          producer_id?: string | null
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string | null
          id?: string
          producer_id?: string | null
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          created_at: string
          id: string
          label: string | null
          slug: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          slug: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          slug?: string
          usage_count?: number
        }
        Relationships: []
      }
      post_hashtags: {
        Row: {
          created_at: string
          hashtag_id: string
          hashtag_slug: string | null
          post_id: string
        }
        Insert: {
          created_at?: string
          hashtag_id: string
          hashtag_slug?: string | null
          post_id: string
        }
        Update: {
          created_at?: string
          hashtag_id?: string
          hashtag_slug?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      post_media: {
        Row: {
          alt_text: string | null
          blurhash: string | null
          created_at: string
          height: number | null
          id: string
          mime_type: string
          moderation: Json
          owner_id: string
          post_id: string
          public_url: string
          size_bytes: number
          sort_order: number
          status: string
          storage_bucket: string
          storage_path: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          blurhash?: string | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type: string
          moderation?: Json
          owner_id: string
          post_id: string
          public_url: string
          size_bytes: number
          sort_order?: number
          status?: string
          storage_bucket: string
          storage_path: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          blurhash?: string | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string
          moderation?: Json
          owner_id?: string
          post_id?: string
          public_url?: string
          size_bytes?: number
          sort_order?: number
          status?: string
          storage_bucket?: string
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      post_share_events: {
        Row: {
          actor_user_id: string | null
          channel: string
          created_at: string
          event_type: string
          id: string
          metadata: Json
          post_id: string
          referrer: string | null
          share_token: string | null
          target_url: string | null
          user_agent: string | null
        }
        Insert: {
          actor_user_id?: string | null
          channel: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          post_id: string
          referrer?: string | null
          share_token?: string | null
          target_url?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_user_id?: string | null
          channel?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          post_id?: string
          referrer?: string | null
          share_token?: string | null
          target_url?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_share_events_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_share_events_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_share_events_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string | null
          created_at: string | null
          id: string
          image_urls: string[] | null
          metadata: Json | null
          project_update_id: string | null
          share_kind: string
          shares_count: number
          source_post_id: string | null
          type: Database["social"]["Enums"]["post_type"] | null
          updated_at: string | null
          visibility: Database["social"]["Enums"]["post_visibility"] | null
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          image_urls?: string[] | null
          metadata?: Json | null
          project_update_id?: string | null
          share_kind?: string
          shares_count?: number
          source_post_id?: string | null
          type?: Database["social"]["Enums"]["post_type"] | null
          updated_at?: string | null
          visibility?: Database["social"]["Enums"]["post_visibility"] | null
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          image_urls?: string[] | null
          metadata?: Json | null
          project_update_id?: string | null
          share_kind?: string
          shares_count?: number
          source_post_id?: string | null
          type?: Database["social"]["Enums"]["post_type"] | null
          updated_at?: string | null
          visibility?: Database["social"]["Enums"]["post_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          project_update_id: string | null
          type: Database["social"]["Enums"]["reaction_type"] | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          project_update_id?: string | null
          type?: Database["social"]["Enums"]["reaction_type"] | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          project_update_id?: string | null
          type?: Database["social"]["Enums"]["reaction_type"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments_with_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      comments_with_authors: {
        Row: {
          author_avatar_url: string | null
          author_first_name: string | null
          author_full_name: string | null
          author_id: string | null
          author_last_name: string | null
          content: string | null
          created_at: string | null
          id: string | null
          metadata: Json | null
          post_id: string | null
          project_update_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_items: {
        Row: {
          author: Json | null
          author_id: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          image_urls: string[] | null
          metadata: Json | null
          project_update: Json | null
          project_update_id: string | null
          reactions_count: number | null
          type: Database["social"]["Enums"]["post_type"] | null
          updated_at: string | null
          user_has_reacted: boolean | null
          visibility: Database["social"]["Enums"]["post_visibility"] | null
        }
        Relationships: []
      }
      hashtag_stats: {
        Row: {
          label: string | null
          month_count: number | null
          slug: string | null
          today_count: number | null
          total_count: number | null
          year_count: number | null
        }
        Relationships: []
      }
      posts_with_authors: {
        Row: {
          author_avatar_url: string | null
          author_first_name: string | null
          author_full_name: string | null
          author_id: string | null
          author_last_name: string | null
          content: string | null
          created_at: string | null
          id: string | null
          image_urls: string[] | null
          metadata: Json | null
          project_update_id: string | null
          type: Database["social"]["Enums"]["post_type"] | null
          updated_at: string | null
          visibility: Database["social"]["Enums"]["post_visibility"] | null
        }
        Relationships: []
      }
      user_bookmarked_posts: {
        Row: {
          bookmarked_at: string | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          bookmarked_at?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          bookmarked_at?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_liked_posts: {
        Row: {
          liked_at: string | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          liked_at?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          liked_at?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      post_type: "user_post" | "project_update_share" | "system_event"
      post_visibility: "public" | "guild_only" | "private"
      reaction_type: "like" | "super_like" | "plant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  commerce: {
    Enums: {
      allergen: [
        "gluten",
        "lactose",
        "nuts",
        "peanuts",
        "eggs",
        "fish",
        "shellfish",
        "soy",
        "sesame",
        "sulfites",
        "celery",
        "mustard",
        "lupin",
      ],
      billing_frequency: ["monthly", "annual"],
      certification: [
        "bio",
        "organic",
        "fair_trade",
        "vegan",
        "vegetarian",
        "halal",
        "kosher",
        "gluten_free",
        "non_gmo",
        "rainforest_alliance",
        "msc",
        "fsc",
        "ecocert",
        "demeter",
      ],
      fulfillment_method: [
        "ship",
        "pickup",
        "digital",
        "experience",
        "dropship",
        "ondemand",
      ],
      order_status: [
        "pending",
        "paid",
        "processing",
        "in_transit",
        "completed",
        "closed",
      ],
      payment_method: [
        "points",
        "stripe_card",
        "stripe_sepa",
        "stripe_bank_transfer",
        "mixed",
      ],
      points_ledger_reason: [
        "purchase",
        "refund",
        "investment",
        "investment_returns",
        "admin_adjustment",
        "welcome_bonus",
        "referral",
      ],
      product_partner_source: [
        "direct",
        "cooperative",
        "partner",
        "marketplace",
      ],
      subscription_plan: [
        "monthly_standard",
        "monthly_premium",
        "annual_standard",
        "annual_premium",
      ],
      subscription_status: [
        "active",
        "inactive",
        "cancelled",
        "past_due",
        "unpaid",
        "trialing",
        "expired",
        "incomplete",
        "paused",
      ],
    },
  },
  content: {
    Enums: {
      blog_post_status: ["draft", "published", "archived"],
      media_role: [
        "hero",
        "cover",
        "gallery",
        "document",
        "avatar",
        "logo",
        "thumbnail",
      ],
    },
  },
  finance: {
    Enums: {
      finance_account_type: [
        "asset",
        "liability",
        "equity",
        "revenue",
        "expense",
        "off_balance",
      ],
      finance_entry_direction: ["debit", "credit"],
    },
  },
  gamification: {
    Enums: {
      challenge_status: ["active", "inactive", "archived"],
      challenge_type: ["daily", "monthly", "season", "special", "quest"],
      xp_source_type: [
        "investment",
        "comment",
        "share",
        "reaction",
        "daily_login",
        "quest",
        "referral",
        "manual_adjustment",
      ],
    },
  },
  identity: {
    Enums: {
      guild_role: ["member", "officer", "leader"],
      guild_type: ["open", "invite_only", "corporate", "school", "family"],
      kyc_status: ["pending", "light", "complete", "rejected"],
      user_consent_type: [
        "terms_of_use",
        "privacy_policy",
        "marketing",
        "data_processing",
      ],
      user_level: ["explorateur", "protecteur", "ambassadeur"],
      user_role: ["user", "admin", "superadmin", "producer", "moderator"],
    },
  },
  investment: {
    Enums: {
      conservation_status: ["LC", "NT", "VU", "EN", "CR", "EW", "EX"],
      investment_status: [
        "pending",
        "approved",
        "active",
        "completed",
        "cancelled",
        "defaulted",
      ],
      producer_partnership: ["exclusive", "preferred", "standard", "trial"],
      producer_status: [
        "pending",
        "active",
        "inactive",
        "suspended",
        "archived",
      ],
      producer_type: [
        "farmer",
        "cooperative",
        "association",
        "company",
        "individual",
      ],
      project_status: ["draft", "active", "funded", "completed", "archived"],
      project_type: ["beehive", "olive_tree", "vineyard", "forest", "marine"],
      update_type: [
        "production",
        "maintenance",
        "harvest",
        "impact",
        "news",
        "milestone",
      ],
    },
  },
  ledger: {
    Enums: {
      reference_type: [
        "order",
        "subscription",
        "investment",
        "referral",
        "admin_adjustment",
        "bonus",
        "refund",
        "expiration",
      ],
      transaction_type: [
        "earned_subscription",
        "earned_purchase",
        "earned_referral",
        "earned_investment_return",
        "spent_order",
        "spent_investment",
        "adjustment_admin",
        "adjustment_correction",
        "bonus_welcome",
        "bonus_milestone",
        "bonus_referral",
        "refund",
        "expiration",
      ],
    },
  },
  public: {
    Enums: {
      message_status: ["pending", "read", "replied", "archived"],
    },
  },
  social: {
    Enums: {
      post_type: ["user_post", "project_update_share", "system_event"],
      post_visibility: ["public", "guild_only", "private"],
      reaction_type: ["like", "super_like", "plant"],
    },
  },
} as const
