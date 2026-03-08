export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "admin" | "client";
export type OrderStatus =
  | "draft"
  | "estimated"
  | "approved"
  | "in_progress"
  | "completed"
  | "cancelled";
export type ServiceType = "full_build" | "repair" | "repaint";
export type Complexity = "low" | "medium" | "high";
export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      status_transitions: {
        Row: {
          from_status: string;
          to_status: string;
          allowed_role: string;
        };
        Insert: {
          from_status: string;
          to_status: string;
          allowed_role: string;
        };
        Update: {
          from_status?: string;
          to_status?: string;
          allowed_role?: string;
        };
      };
      form_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          version: number;
          config: Json;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_default?: boolean;
          version?: number;
          config: Json;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_default?: boolean;
          version?: number;
          config?: Json;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          client_id: string;
          status: OrderStatus;
          estimated_price_cents: number;
          estimated_days: number;
          final_price_cents: number | null;
          final_days: number | null;
          notes: string | null;
          form_template_id: string | null;
          form_template_version: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          status?: OrderStatus;
          estimated_price_cents?: number;
          estimated_days?: number;
          final_price_cents?: number | null;
          final_days?: number | null;
          notes?: string | null;
          form_template_id?: string | null;
          form_template_version?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          status?: OrderStatus;
          estimated_price_cents?: number;
          estimated_days?: number;
          final_price_cents?: number | null;
          final_days?: number | null;
          notes?: string | null;
          form_template_id?: string | null;
          form_template_version?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          kit_name: string;
          kit_model: string | null;
          service_type: ServiceType;
          complexity: Complexity;
          service_type_id: string | null;
          complexity_id: string | null;
          complexity_tier_id: string | null;
          complexity_score: number | null;
          complexity_answers: Json | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          kit_name: string;
          kit_model?: string | null;
          service_type?: ServiceType;
          complexity?: Complexity;
          service_type_id?: string | null;
          complexity_id?: string | null;
          complexity_tier_id?: string | null;
          complexity_score?: number | null;
          complexity_answers?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          kit_name?: string;
          kit_model?: string | null;
          service_type?: ServiceType;
          complexity?: Complexity;
          service_type_id?: string | null;
          complexity_id?: string | null;
          complexity_tier_id?: string | null;
          complexity_score?: number | null;
          complexity_answers?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      change_requests: {
        Row: {
          id: string;
          order_id: string;
          description: string;
          price_impact_cents: number;
          days_impact: number;
          status: ChangeRequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          description: string;
          price_impact_cents?: number;
          days_impact?: number;
          status?: ChangeRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          description?: string;
          price_impact_cents?: number;
          days_impact?: number;
          status?: ChangeRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress_logs: {
        Row: {
          id: string;
          order_id: string;
          order_item_id: string | null;
          message: string;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          order_item_id?: string | null;
          message: string;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          order_item_id?: string | null;
          message?: string;
          photo_url?: string | null;
          created_at?: string;
        };
      };
      service_types: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_name: string | null;
          base_price_cents: number;
          base_days: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_name?: string | null;
          base_price_cents: number;
          base_days: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon_name?: string | null;
          base_price_cents?: number;
          base_days?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      complexity_levels: {
        Row: {
          id: string;
          slug: string;
          name: string;
          multiplier: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          multiplier: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          multiplier?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_complexities: {
        Row: {
          id: string;
          service_type_id: string;
          complexity_level_id: string;
          override_multiplier: number | null;
          complexity_tier_id: string | null;
          tier_override_multiplier: number | null;
        };
        Insert: {
          id?: string;
          service_type_id: string;
          complexity_level_id: string;
          override_multiplier?: number | null;
          complexity_tier_id?: string | null;
          tier_override_multiplier?: number | null;
        };
        Update: {
          id?: string;
          service_type_id?: string;
          complexity_level_id?: string;
          override_multiplier?: number | null;
          complexity_tier_id?: string | null;
          tier_override_multiplier?: number | null;
        };
      };
      service_addons: {
        Row: {
          id: string;
          service_type_id: string;
          name: string;
          description: string | null;
          price_cents: number;
          is_required: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_type_id: string;
          name: string;
          description?: string | null;
          price_cents: number;
          is_required?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_type_id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          is_required?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      complexity_question_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_default?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_default?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      complexity_questions: {
        Row: {
          id: string;
          template_id: string;
          question_text: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          question_text: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          question_text?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      complexity_answer_options: {
        Row: {
          id: string;
          question_id: string;
          answer_text: string;
          score: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          answer_text: string;
          score: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          answer_text?: string;
          score?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      complexity_tiers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          min_score: number;
          max_score: number | null;
          multiplier: number;
          base_min_price_cents: number | null;
          base_max_price_cents: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          min_score?: number;
          max_score?: number | null;
          multiplier: number;
          base_min_price_cents?: number | null;
          base_max_price_cents?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          min_score?: number;
          max_score?: number | null;
          multiplier?: number;
          base_min_price_cents?: number | null;
          base_max_price_cents?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      business_settings: {
        Row: {
          id: string;
          business_name: string;
          tagline: string | null;
          description: string | null;
          registration_number: string | null;
          established_date: string | null;
          logo_url: string | null;
          business_email: string | null;
          business_phone: string | null;
          website_url: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state_province: string | null;
          postal_code: string | null;
          country: string;
          instagram_url: string | null;
          facebook_url: string | null;
          twitter_url: string | null;
          youtube_url: string | null;
          portfolio_url: string | null;
          timezone: string;
          monday_enabled: boolean;
          monday_open: string | null;
          monday_close: string | null;
          tuesday_enabled: boolean;
          tuesday_open: string | null;
          tuesday_close: string | null;
          wednesday_enabled: boolean;
          wednesday_open: string | null;
          wednesday_close: string | null;
          thursday_enabled: boolean;
          thursday_open: string | null;
          thursday_close: string | null;
          friday_enabled: boolean;
          friday_open: string | null;
          friday_close: string | null;
          saturday_enabled: boolean;
          saturday_open: string | null;
          saturday_close: string | null;
          sunday_enabled: boolean;
          sunday_open: string | null;
          sunday_close: string | null;
          currency_code: string;
          tax_rate: number;
          tax_enabled: boolean;
          deposit_percentage: number;
          payment_methods: Json;
          invoice_prefix: string;
          invoice_starting_number: number;
          payment_terms_days: number;
          late_payment_fee_percentage: number;
          default_lead_time_days: number;
          rush_order_fee_percentage: number;
          cancellation_policy: string | null;
          revision_policy: string | null;
          max_revisions: number;
          primary_color: string;
          secondary_color: string;
          email_signature: string | null;
          auto_reply_message: string | null;
          terms_of_service_url: string | null;
          privacy_policy_url: string | null;
          warranty_terms: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name?: string;
          tagline?: string | null;
          description?: string | null;
          registration_number?: string | null;
          established_date?: string | null;
          logo_url?: string | null;
          business_email?: string | null;
          business_phone?: string | null;
          website_url?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state_province?: string | null;
          postal_code?: string | null;
          country?: string;
          instagram_url?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          youtube_url?: string | null;
          portfolio_url?: string | null;
          timezone?: string;
          monday_enabled?: boolean;
          monday_open?: string | null;
          monday_close?: string | null;
          tuesday_enabled?: boolean;
          tuesday_open?: string | null;
          tuesday_close?: string | null;
          wednesday_enabled?: boolean;
          wednesday_open?: string | null;
          wednesday_close?: string | null;
          thursday_enabled?: boolean;
          thursday_open?: string | null;
          thursday_close?: string | null;
          friday_enabled?: boolean;
          friday_open?: string | null;
          friday_close?: string | null;
          saturday_enabled?: boolean;
          saturday_open?: string | null;
          saturday_close?: string | null;
          sunday_enabled?: boolean;
          sunday_open?: string | null;
          sunday_close?: string | null;
          currency_code?: string;
          tax_rate?: number;
          tax_enabled?: boolean;
          deposit_percentage?: number;
          payment_methods?: Json;
          invoice_prefix?: string;
          invoice_starting_number?: number;
          payment_terms_days?: number;
          late_payment_fee_percentage?: number;
          default_lead_time_days?: number;
          rush_order_fee_percentage?: number;
          cancellation_policy?: string | null;
          revision_policy?: string | null;
          max_revisions?: number;
          primary_color?: string;
          secondary_color?: string;
          email_signature?: string | null;
          auto_reply_message?: string | null;
          terms_of_service_url?: string | null;
          privacy_policy_url?: string | null;
          warranty_terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          tagline?: string | null;
          description?: string | null;
          registration_number?: string | null;
          established_date?: string | null;
          logo_url?: string | null;
          business_email?: string | null;
          business_phone?: string | null;
          website_url?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state_province?: string | null;
          postal_code?: string | null;
          country?: string;
          instagram_url?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          youtube_url?: string | null;
          portfolio_url?: string | null;
          timezone?: string;
          monday_enabled?: boolean;
          monday_open?: string | null;
          monday_close?: string | null;
          tuesday_enabled?: boolean;
          tuesday_open?: string | null;
          tuesday_close?: string | null;
          wednesday_enabled?: boolean;
          wednesday_open?: string | null;
          wednesday_close?: string | null;
          thursday_enabled?: boolean;
          thursday_open?: string | null;
          thursday_close?: string | null;
          friday_enabled?: boolean;
          friday_open?: string | null;
          friday_close?: string | null;
          saturday_enabled?: boolean;
          saturday_open?: string | null;
          saturday_close?: string | null;
          sunday_enabled?: boolean;
          sunday_open?: string | null;
          sunday_close?: string | null;
          currency_code?: string;
          tax_rate?: number;
          tax_enabled?: boolean;
          deposit_percentage?: number;
          payment_methods?: Json;
          invoice_prefix?: string;
          invoice_starting_number?: number;
          payment_terms_days?: number;
          late_payment_fee_percentage?: number;
          default_lead_time_days?: number;
          rush_order_fee_percentage?: number;
          cancellation_policy?: string | null;
          revision_policy?: string | null;
          max_revisions?: number;
          primary_color?: string;
          secondary_color?: string;
          email_signature?: string | null;
          auto_reply_message?: string | null;
          terms_of_service_url?: string | null;
          privacy_policy_url?: string | null;
          warranty_terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      promote_to_admin: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
