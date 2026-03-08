// Re-export database types
export * from "./database";

import type {
  Database,
  OrderStatus,
  ChangeRequestStatus,
  ServiceType,
  Complexity,
} from "./database";
import type { Json } from "./database";

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
export type ServiceComplexityInsert =
  Database["public"]["Tables"]["service_complexities"]["Insert"];
export type ServiceComplexityUpdate =
  Database["public"]["Tables"]["service_complexities"]["Update"];

export type ServiceAddonRow = Database["public"]["Tables"]["service_addons"]["Row"];
export type ServiceAddonInsert = Database["public"]["Tables"]["service_addons"]["Insert"];
export type ServiceAddonUpdate = Database["public"]["Tables"]["service_addons"]["Update"];

// Complexity questions and tiers types
export type ComplexityQuestionTemplateRow =
  Database["public"]["Tables"]["complexity_question_templates"]["Row"];
export type ComplexityQuestionTemplateInsert =
  Database["public"]["Tables"]["complexity_question_templates"]["Insert"];
export type ComplexityQuestionTemplateUpdate =
  Database["public"]["Tables"]["complexity_question_templates"]["Update"];

export type ComplexityQuestionRow = Database["public"]["Tables"]["complexity_questions"]["Row"];
export type ComplexityQuestionInsert =
  Database["public"]["Tables"]["complexity_questions"]["Insert"];
export type ComplexityQuestionUpdate =
  Database["public"]["Tables"]["complexity_questions"]["Update"];

export type ComplexityAnswerOptionRow =
  Database["public"]["Tables"]["complexity_answer_options"]["Row"];
export type ComplexityAnswerOptionInsert =
  Database["public"]["Tables"]["complexity_answer_options"]["Insert"];
export type ComplexityAnswerOptionUpdate =
  Database["public"]["Tables"]["complexity_answer_options"]["Update"];

export type ComplexityTierRow = Database["public"]["Tables"]["complexity_tiers"]["Row"];
export type ComplexityTierInsert = Database["public"]["Tables"]["complexity_tiers"]["Insert"];
export type ComplexityTierUpdate = Database["public"]["Tables"]["complexity_tiers"]["Update"];

// Business settings types
export type BusinessSettingsRow = Database["public"]["Tables"]["business_settings"]["Row"];
export type BusinessSettingsInsert = Database["public"]["Tables"]["business_settings"]["Insert"];
export type BusinessSettingsUpdate = Database["public"]["Tables"]["business_settings"]["Update"];

// Domain type aliases for convenience

// Complexity question types
export interface ComplexityQuestionWithAnswers {
  id: string;
  template_id: string;
  question_text: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  answer_options: Array<{
    id: string;
    question_id: string;
    answer_text: string;
    score: number;
    sort_order: number;
    created_at: string;
    updated_at: string;
  }>;
}

export interface ComplexityQuestionTemplateWithQuestions {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  questions: ComplexityQuestionWithAnswers[];
}

export interface ComplexityAnswerSelection {
  question_id: string;
  answer_option_id: string;
}

export interface ComplexityCalculationResult {
  total_score: number;
  tier_id: string | null;
  tier_name: string | null;
  multiplier: number | null;
  estimated_min_price_cents: number | null;
  estimated_max_price_cents: number | null;
}

export interface ComplexityTierWithPricing {
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
}

export interface ServiceComplexityWithTiers {
  service_type_id: string;
  complexity_level_id: string | null;
  complexity_tier_id: string | null;
  override_multiplier: number | null;
  tier_override_multiplier: number | null;
}

// Domain type aliases for convenience

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
  complexity_score: number | null;
  complexity_tier_id: string | null;
  complexity_answers: Json | null;
  complexity_calculation: ComplexityCalculationResult | null;
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
