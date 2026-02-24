# Architecture Research

**Domain:** Order Management Systems (Service Business Variant)
**Researched:** 2026-02-24
**Confidence:** HIGH

## Executive Summary

Order Management Systems (OMS) for service businesses like custom model kit building differ significantly from traditional e-commerce OMS. Rather than inventory and shipping management, the focus is on **project lifecycle tracking**, **progress communication**, and **service customization**. This research maps standard OMS patterns to the Gunpla custom build service context and identifies how the existing Next.js + Supabase architecture can be extended to support comprehensive order management.

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Public Order │  │  Admin       │  │ Client Portal            │  │
│  │ Form/Tracker │  │ Dashboard    │  │ (Order List + Details)  │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────────┘  │
│         │                  │                      │                   │
├─────────┼──────────────────┼──────────────────────┼───────────────────┤
│         │         BUSINESS LOGIC LAYER           │                   │
├─────────┼──────────────────┼──────────────────────┼───────────────────┤
│         ▼                  ▼                      ▼                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Order       │  │ Progress     │  │ Estimation               │  │
│  │ Submission  │  │ Management  │  │ Engine                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Supabase (PostgreSQL)                      │  │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │ Orders  │  │ Progress │  │ Change   │  │ Storage     │  │  │
│  │  │ Table   │  │ Logs     │  │ Requests │  │ (Photos)    │  │  │
│  │  └─────────┘  └──────────┘  └──────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component                   | Responsibility                                                        | Implementation in This Project                             |
| --------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Order Submission**        | Capture order details, kit info, service options, calculate estimates | `app/(public)/order/`, `lib/features/orders/`              |
| **Order Status Tracking**   | Manage order lifecycle states (received → in progress → completed)    | `lib/features/orders/queries.ts`, `updateOrderStatus()`    |
| **Progress Logging**        | Record build milestones with messages and photos                      | `lib/features/orders/mutations.ts`, `addProgressLog()`     |
| **Public Tracking**         | Allow clients to view order status without authentication             | `app/(public)/track/[orderId]/`, `getOrderByIdForPublic()` |
| **Client Portal**           | Authenticated clients view their orders                               | `app/(client)/`, role-protected                            |
| **Admin Dashboard**         | Admin manages all orders, updates status, adds progress               | `app/(admin)/`, role-protected                             |
| **Estimation Engine**       | Calculate prices and turnaround times based on services               | `lib/estimation/`                                          |
| **Change Request Handling** | Process scope changes during build                                    | `approveChangeRequest()`, `rejectChangeRequest()`          |

## Recommended Project Structure

```
lib/features/orders/
├── queries.ts              # Data fetching (existing)
├── mutations.ts            # Data modifications (existing)
├── form-schema.ts          # Zod validation schemas
├── status.ts               # Order status definitions & transitions
└── types.ts                # TypeScript types for orders

lib/features/progress/
├── queries.ts              # Fetch progress logs for orders
├── mutations.ts            # Add progress updates
└── types.ts                # Progress-specific types

lib/features/clients/
├── queries.ts              # Get client's orders
└── types.ts                # Client portal types

lib/estimation/
├── calculate.ts            # Pricing calculations (existing)
├── rules.ts                # Business rules for estimation
└── validation.ts           # Estimation validation

app/
├── (public)/
│   ├── order/
│   │   ├── page.tsx       # Order form
│   │   └── success/
│   │       └── [orderId]/
│   │           └── page.tsx
│   └── track/
│       └── [orderId]/
│           └── page.tsx   # Public tracking page
├── (admin)/
│   └── admin/
│       ├── page.tsx       # Dashboard overview
│       └── orders/
│           ├── page.tsx   # Order list
│           └── [orderId]/
│               └── page.tsx # Order detail + progress
├── (client)/
│   └── client/
│       ├── page.tsx       # Client overview
│       └── orders/
│           ├── page.tsx   # Client's orders
│           └── [orderId]/
│               └── page.tsx # Client's order detail
└── api/
    └── orders/
        └── route.ts       # Order submission API
```

### Structure Rationale

- **`lib/features/orders/`:** Core order logic—queries, mutations, schemas. Keeps order-related code collocated.
- **`lib/features/progress/`:** Separated from orders because progress logging has distinct UI (timeline view) and data patterns (append-only log).
- **`lib/features/clients/`:** Client-specific queries (only their orders) with row-level security already enforced by Supabase.
- **`app/(public)/order/`:** Public-facing order submission, separate from authenticated routes.
- **`app/(admin)/admin/`:** Admin-only routes with middleware protection.
- **`app/(client)/client/`:** Client-only routes with middleware protection.

## Architectural Patterns

### Pattern 1: Server-First Data Fetching

**What:** Server Components fetch data directly via Supabase server client, reducing client bundle size and improving initial load performance.

**When to use:** For all pages that don't require real-time interactivity.

**Trade-offs:**

- Pros: Better SEO, smaller bundles, no loading states for initial render
- Cons: Slower navigation (full page reload vs client-side)

**Example:**

```typescript
// app/(admin)/admin/orders/page.tsx
import { getOrders } from "@/lib/features/orders/queries";

export default async function AdminOrdersPage() {
  const { orders, total } = await getOrders({ pageSize: 20 });

  return <OrderList orders={orders} total={total} />;
}
```

### Pattern 2: Real-Time Progress Updates

**What:** Subscribe to Supabase Realtime changes on progress_logs table for live updates without polling.

**When to use:** When clients/admins need instant visibility into build progress.

**Trade-offs:**

- Pros: Instant updates, better UX
- Cons: Connection management, fallback handling needed

**Example:**

```typescript
// lib/hooks/use-order-realtime.ts
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useOrderRealtime(orderId: string, onUpdate: () => void) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "progress_logs",
          filter: `order_id=eq.${orderId}`,
        },
        onUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, onUpdate]);
}
```

### Pattern 3: Optimistic Updates with React Query

**What:** Update UI immediately while mutation processes in background, rollback on failure.

**When to use:** For actions like status changes where immediate feedback improves UX.

**Trade-offs:**

- Pros: Snappy UI, better perceived performance
- Cons: Complexity in error handling and rollback

**Example:**

```typescript
// Using React Query's onMutate for optimistic update
const queryClient = useQueryClient();

await queryClient.updateQueryData(["orders", orderId], (old) => ({ ...old, status: newStatus }));
```

### Pattern 4: Status State Machine

**What:** Define explicit states and valid transitions between states for orders.

**When to use:** To prevent invalid state changes and track order lifecycle.

**Trade-offs:**

- Pros: Prevents invalid states, clear workflow
- Cons: Additional code to maintain state definitions

**Example:**

```typescript
// lib/features/orders/status.ts
export const ORDER_STATUSES = [
  "received",
  "confirmed",
  "in_progress",
  "quality_check",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  received: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["quality_check", "cancelled"],
  quality_check: ["completed", "in_progress"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
```

## Data Flow

### Request Flow 1: Order Submission

```
[User fills form]
    ↓
[Form validation (Zod)] → errors displayed inline
    ↓
[POST /api/orders]
    ↓
[Validate with form-schema.ts]
    ↓
[Calculate pricing via lib/estimation/]
    ↓
[Insert order to Supabase]
    ↓
[Insert order_items to Supabase]
    ↓
[Redirect to /order/success/[orderId]]
    ↓
[User sees confirmation with tracking ID]
```

### Request Flow 2: Admin Progress Update

```
[Admin selects order]
    ↓
[Admin fills progress form (message + optional photo)]
    ↓
[Upload photo to Supabase Storage]
    ↓
[Add progress_log record]
    ↓
[Supabase Realtime broadcasts to subscribers]
    ↓
[Client portal updates via useOrderRealtime hook]
    ↓
[Client sees new progress in timeline]
```

### Request Flow 3: Public Order Tracking

```
[User enters order ID]
    ↓
[GET /track/[orderId]]
    ↓
[Server calls getOrderByIdForPublic()]
    ↓
[Returns sanitized data (excludes sensitive info)]
    ↓
[Page renders with status + progress timeline]
    ↓
[Supabase Realtime subscribes to progress_logs]
    ↓
[Live updates appear without page refresh]
```

### State Management

```
[Supabase Database]
    ↓ (Realtime)
[useOrderRealtime hook]
    ↓ (updates React Query cache)
[React Query]
    ↓ (provides data)
[UI Components]
    ↓ (user actions)
[Mutations]
    ↓ (write to Supabase)
[Supabase Database]
```

### Key Data Flows

1. **Order Creation Flow:** Public form → API → Database → Confirmation page. Requires validation, pricing calculation, and proper error handling.

2. **Progress Update Flow:** Admin action → Photo upload → Progress log insert → Realtime broadcast → Client view update. Critical for the build service model.

3. **Status Change Flow:** Admin action → Validation (canTransition) → Status update → Audit log. Prevents invalid transitions.

4. **Public Tracking Flow:** Order ID lookup → Sanitized query → Display + Realtime subscription. Must exclude sensitive data.

## Scaling Considerations

| Scale                   | Architecture Adjustments                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| 0-100 orders/month      | Single Supabase instance, basic queries fine                                                                  |
| 100-1000 orders/month   | Add database indexes on status, created_at. Implement pagination properly.                                    |
| 1000-10000 orders/month | Consider query optimization, possibly add caching layer. Real-time subscriptions may need connection pooling. |
| 10000+ orders/month     | Consider read replicas, move to more sophisticated queue for progress updates, implement CDN for photos.      |

### Scaling Priorities

1. **First bottleneck:** Database queries without indexes. Fix: Add indexes on `orders.status`, `orders.client_id`, `progress_logs.order_id`.

2. **Second bottleneck:** Photo storage and delivery. Fix: Use Supabase Storage with appropriate caching headers, consider image optimization.

3. **Third bottleneck:** Realtime connections at scale. Fix: Implement connection pooling, possibly move to dedicated realtime service for high-volume scenarios.

## Anti-Patterns

### Anti-Pattern 1: Exposing Internal Order IDs

**What people do:** Using sequential or predictable order IDs that reveal business volume.

**Why it's wrong:** Competitors can estimate order volume; sequential IDs can be enumerated.

**Do this instead:** Use UUIDs for order IDs (Supabase default). Display a separate "display ID" or "tracking code" that's user-friendly but not predictable.

### Anti-Pattern 2: Mixing Admin and Client Queries

**What people do:** Using the same query function for both admin and client views.

**Why it's wrong:** Risk of accidentally exposing admin-only data to clients; harder to enforce access control.

**Do this instead:** Create separate query functions with explicit data selection. The existing `getOrderById()` vs `getOrderByIdForPublic()` pattern is correct.

### Anti-Pattern 3: Storing Photos Without Validation

**What people do:** Accepting any file type and size for progress photos.

**Why it's wrong:** Storage costs, security vulnerabilities, display issues.

**Do this instead:** Validate file types (images only), enforce size limits, generate thumbnails for performance.

### Anti-Pattern 4: No Status Transition Validation

**What people do:** allowing any status change without checking validity.

**Why it's wrong:** Orders can end up in impossible states (e.g., "completed" without "in_progress").

**Do this instead:** Implement state machine with explicit transitions. Check `canTransition()` before updating status.

## Integration Points

### External Services

| Service           | Integration Pattern      | Notes                                          |
| ----------------- | ------------------------ | ---------------------------------------------- |
| Supabase Auth     | Built-in                 | Already integrated for admin/client roles      |
| Supabase Storage  | Progress photos          | Bucket: `progress-photos`, validate types/size |
| Supabase Realtime | Live updates             | Subscribe to `progress_logs` table             |
| (Future) Email    | Webhooks on order events | Defer to v2                                    |
| (Future) Payment  | Stripe integration       | Defer to v2                                    |

### Internal Boundaries

| Boundary                 | Communication         | Notes                                                |
| ------------------------ | --------------------- | ---------------------------------------------------- |
| Order Form → API         | Server Action or POST | Use Server Actions for form submission in Next.js 15 |
| API → Database           | Supabase client       | Already implemented                                  |
| Progress Update → Client | Supabase Realtime     | Real-time subscription                               |
| Admin Dashboard ↔ Orders | Server Components     | Direct query, no API layer needed                    |
| Client Portal ↔ Orders   | Server Components     | Same pattern, filtered by user                       |

## Build Order Recommendations

Based on the existing codebase and patterns identified:

1. **Phase 1: Order Submission** (foundational)
   - Complete form submission flow
   - Implement pricing calculation
   - Order confirmation page

2. **Phase 2: Admin Order Management** (core operations)
   - Order list with filtering
   - Order detail view
   - Status updates

3. **Phase 3: Progress Tracking** (differentiator)
   - Progress log mutations
   - Photo upload
   - Timeline display

4. **Phase 4: Client Portal** (completes experience)
   - Client order list
   - Order detail view
   - Progress timeline

5. **Phase 5: Public Tracking** (visibility)
   - Public tracking page
   - Sanitized queries
   - Realtime updates

**Rationale:** Start with order capture (revenue), then admin operations (core work), then progress tracking (the service value), then client visibility, finally public access. Each phase builds on the previous.

---

_Architecture research for: Gunpla Custom Build Service Order Management_
_Researched: 2026-02-24_
_Confidence: HIGH — Based on analysis of existing codebase and standard OMS patterns_
