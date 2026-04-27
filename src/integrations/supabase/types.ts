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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      care_brands: {
        Row: {
          approved: boolean
          category: Database["public"]["Enums"]["care_category"]
          certifications: string[]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_curated: boolean
          lang: string
          name: string
          slug: string
          submitted_by: string | null
          upvotes: number
          website_url: string | null
          why_clean: string | null
        }
        Insert: {
          approved?: boolean
          category: Database["public"]["Enums"]["care_category"]
          certifications?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_curated?: boolean
          lang?: string
          name: string
          slug: string
          submitted_by?: string | null
          upvotes?: number
          website_url?: string | null
          why_clean?: string | null
        }
        Update: {
          approved?: boolean
          category?: Database["public"]["Enums"]["care_category"]
          certifications?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_curated?: boolean
          lang?: string
          name?: string
          slug?: string
          submitted_by?: string | null
          upvotes?: number
          website_url?: string | null
          why_clean?: string | null
        }
        Relationships: []
      }
      care_local_shops: {
        Row: {
          address: string | null
          approved: boolean
          brands_stocked: string[]
          categories_stocked: string[]
          city: string | null
          country: string
          created_at: string
          hours: Json | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          submitted_by: string | null
          upvotes: number
          website_url: string | null
        }
        Insert: {
          address?: string | null
          approved?: boolean
          brands_stocked?: string[]
          categories_stocked?: string[]
          city?: string | null
          country?: string
          created_at?: string
          hours?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          submitted_by?: string | null
          upvotes?: number
          website_url?: string | null
        }
        Update: {
          address?: string | null
          approved?: boolean
          brands_stocked?: string[]
          categories_stocked?: string[]
          city?: string | null
          country?: string
          created_at?: string
          hours?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          submitted_by?: string | null
          upvotes?: number
          website_url?: string | null
        }
        Relationships: []
      }
      care_upvotes: {
        Row: {
          brand_id: string | null
          created_at: string
          id: string
          shop_id: string | null
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          id?: string
          shop_id?: string | null
          user_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          id?: string
          shop_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_upvotes_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "care_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_upvotes_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "care_local_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      care_user_saves: {
        Row: {
          brand_id: string | null
          created_at: string
          id: string
          shop_id: string | null
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          id?: string
          shop_id?: string | null
          user_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          id?: string
          shop_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_user_saves_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "care_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_user_saves_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "care_local_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_resources: {
        Row: {
          age_groups: string[]
          category: string
          content: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          lang: string
          sort_order: number
          title: string
        }
        Insert: {
          age_groups?: string[]
          category: string
          content?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          lang?: string
          sort_order?: number
          title: string
        }
        Update: {
          age_groups?: string[]
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          lang?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          id: string
          kind: string
          phase: string | null
          sent_at: string
          success: boolean
          user_id: string
        }
        Insert: {
          id?: string
          kind: string
          phase?: string | null
          sent_at?: string
          success?: boolean
          user_id: string
        }
        Update: {
          id?: string
          kind?: string
          phase?: string | null
          sent_at?: string
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_group: string | null
          avg_cycle_length: number | null
          avg_period_length: number | null
          created_at: string
          custom_mental_conditions: string[]
          custom_physical_conditions: string[]
          display_name: string | null
          email: string | null
          full_name: string | null
          gender_identity: string | null
          goals: string[]
          has_cycle: string | null
          health_focus: string[]
          id: string
          last_period_date: string | null
          mental_conditions: string[]
          no_cycle_reason: string | null
          notif_checkin: boolean
          notif_digest: boolean
          notif_ovulation: boolean
          notif_period: boolean
          notif_phase_change: boolean
          onboarding_completed: boolean
          onboarding_step: number
          physical_conditions: string[]
          pronouns: string | null
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          avg_cycle_length?: number | null
          avg_period_length?: number | null
          created_at?: string
          custom_mental_conditions?: string[]
          custom_physical_conditions?: string[]
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          gender_identity?: string | null
          goals?: string[]
          has_cycle?: string | null
          health_focus?: string[]
          id: string
          last_period_date?: string | null
          mental_conditions?: string[]
          no_cycle_reason?: string | null
          notif_checkin?: boolean
          notif_digest?: boolean
          notif_ovulation?: boolean
          notif_period?: boolean
          notif_phase_change?: boolean
          onboarding_completed?: boolean
          onboarding_step?: number
          physical_conditions?: string[]
          pronouns?: string | null
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          avg_cycle_length?: number | null
          avg_period_length?: number | null
          created_at?: string
          custom_mental_conditions?: string[]
          custom_physical_conditions?: string[]
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          gender_identity?: string | null
          goals?: string[]
          has_cycle?: string | null
          health_focus?: string[]
          id?: string
          last_period_date?: string | null
          mental_conditions?: string[]
          no_cycle_reason?: string | null
          notif_checkin?: boolean
          notif_digest?: boolean
          notif_ovulation?: boolean
          notif_period?: boolean
          notif_phase_change?: boolean
          onboarding_completed?: boolean
          onboarding_step?: number
          physical_conditions?: string[]
          pronouns?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      shops_within_radius: {
        Args: { radius_miles?: number; user_lat: number; user_lng: number }
        Returns: {
          address: string
          brands_stocked: string[]
          categories_stocked: string[]
          city: string
          distance_miles: number
          hours: Json
          id: string
          name: string
          phone: string
          postal_code: string
          state: string
          upvotes: number
          website_url: string
        }[]
      }
    }
    Enums: {
      care_category: "period" | "wash" | "lube" | "postpartum"
      subscription_tier: "pearl" | "swan" | "ruby"
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
  public: {
    Enums: {
      care_category: ["period", "wash", "lube", "postpartum"],
      subscription_tier: ["pearl", "swan", "ruby"],
    },
  },
} as const
