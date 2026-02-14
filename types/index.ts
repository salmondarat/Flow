// Re-export database types
export * from "./database";

import type { Database } from "./database";

// Utility types for Supabase query results
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];
export type OrderItemUpdate = Database["public"]["Tables"]["order_items"]["Update"];

export type ChangeRequestRow = Database["public"]["Tables"]["change_requests"]["Row"];
export type ChangeRequestInsert = Database["public"]["Tables"]["change_requests"]["Insert"];
export type ChangeRequestUpdate = Database["public"]["Tables"]["change_requests"]["Update"];

export type ProgressLogRow = Database["public"]["Tables"]["progress_logs"]["Row"];
export type ProgressLogInsert = Database["public"]["Tables"]["progress_logs"]["Insert"];
export type ProgressLogUpdate = Database["public"]["Tables"]["progress_logs"]["Update"];

export type FormTemplateRow = Database["public"]["Tables"]["form_templates"]["Row"];
export type FormTemplateInsert = Database["public"]["Tables"]["form_templates"]["Insert"];
export type FormTemplateUpdate = Database["public"]["Tables"]["form_templates"]["Update"];

// Service configuration types
export type ServiceTypeRow = Database["public"]["Tables"]["service_types"]["Row"];
export type ServiceTypeInsert = Database["public"]["Tables"]["service_types"]["Insert"];
export type ServiceTypeUpdate = Database["public"]["Tables"]["service_types"]["Update"];

export type ComplexityLevelRow = Database["public"]["Tables"]["complexity_levels"]["Row"];
export type ComplexityLevelInsert = Database["public"]["Tables"]["complexity_levels"]["Insert"];
export type ComplexityLevelUpdate = Database["public"]["Tables"]["complexity_levels"]["Update"];

export type ServiceComplexityRow = Database["public"]["Tables"]["service_complexities"]["Row"];
export type ServiceComplexityInsert = Database["public"]["Tables"]["service_complexities"]["Insert"];
export type ServiceComplexityUpdate = Database["public"]["Tables"]["service_complexities"]["Update"];

export type ServiceAddonRow = Database["public"]["Tables"]["service_addons"]["Row"];
export type ServiceAddonInsert = Database["public"]["Tables"]["service_addons"]["Insert"];
export type ServiceAddonUpdate = Database["public"]["Tables"]["service_addons"]["Update"];

// Domain type aliases for convenience
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

// Extended domain types with computed fields
export interface OrderWithItems {
  id: string;
  client_id: string;
  status: OrderStatus;
  estimated_price_cents: number;
  estimated_days: number;
  final_price_cents: number | null;
  final_days: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItemWithPricing[];
  progress_logs?: ProgressLog[];
  change_requests?: ChangeRequest[];
  client?: {
    id: string;
    email?: string;
    full_name?: string | null;
  };
  _count?: {
    change_requests: number;
    progress_logs: number;
  };
}

export interface ProgressLog {
  id: string;
  order_id: string;
  order_item_id: string | null;
  message: string;
  photo_url: string | null;
  created_at: string;
}

export interface ChangeRequest {
  id: string;
  order_id: string;
  description: string;
  price_impact_cents: number;
  days_impact: number;
  status: ChangeRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItemWithPricing {
  id: string;
  order_id: string;
  kit_name: string;
  kit_model: string | null;
  service_type: ServiceType;
  complexity: Complexity;
  notes: string | null;
  created_at: string;
  estimated_price: number; // Calculated from service + complexity
}

export interface DashboardStats {
  totalOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  estimatedRevenue: number; // in cents
}

export interface RecentActivity {
  id: string;
  type: "order_created" | "order_updated" | "progress_added" | "change_request";
  description: string;
  relatedId: string;
  createdAt: string;
}

export interface AttentionNeeded {
  id: string;
  type: "new_order" | "pending_approval" | "overdue";
  description: string;
  orderId: string;
  clientName: string;
  createdAt: string;
}

export interface WorkloadItem {
  orderId: string;
  clientName: string;
  kitName: string;
  serviceType: ServiceType;
  status: OrderStatus;
  estimatedCompletion: string;
  progress: number;
}
