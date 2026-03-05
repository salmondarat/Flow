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
        };
        Insert: {
          id?: string;
          service_type_id: string;
          complexity_level_id: string;
          override_multiplier?: number | null;
        };
        Update: {
          id?: string;
          service_type_id?: string;
          complexity_level_id?: string;
          override_multiplier?: number | null;
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
