/**
 * Dashboard query limits and constants
 */
export const DASHBOARD_LIMITS = {
  RECENT_ORDERS: 5,
  RECENT_LOGS: 5,
  MAX_ACTIVITIES: 10,
  MAX_ATTENTION_ITEMS: 5,
  MAX_WORKLOAD_ITEMS: 10,
  DEFAULT_PROGRESS: 50,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
} as const;

/**
 * Default values for orders
 */
export const ORDER_DEFAULTS = {
  STATUS: "draft" as const,
  ESTIMATED_PRICE_CENTS: 0,
  ESTIMATED_DAYS: 0,
} as const;
