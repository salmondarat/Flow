# Project Research Summary

**Project:** Flow - Gunpla Custom Build Service
**Domain:** Order Management System (Service Business Variant)
**Researched:** 2026-02-24
**Confidence:** HIGH (Stack/Architecture), MEDIUM (Features/Pitfalls)

## Executive Summary

This research confirms that the existing Next.js + Supabase stack is well-suited for building an order management dashboard and client portal. The recommended approach is to **extend the current stack with TanStack Table and shadcn/ui components** rather than introducing new technologies. This aligns with the existing Radix UI + Tailwind foundation and leverages the team's existing expertise.

The domain is a service-based order management system (OMS) focused on project lifecycle tracking, progress communication, and service customization rather than inventory management. The architecture should follow a **server-first pattern** with real-time updates via Supabase Realtime for progress tracking — this is the key differentiator for custom build services.

The highest-risk areas identified are **broken access control (IDOR)** and **RLS misconfiguration**. These must be addressed in Phase 1 as foundational security concerns before any user-facing features are built.

## Key Findings

### Recommended Stack

**Summary from STACK.md** — The existing Next.js + Supabase + React Query + Tailwind stack is the correct foundation. No major technology changes required.

**Core technologies:**

- **@tanstack/react-table (v8)**: Industry standard for React data grids — powers sorting, filtering, pagination with server-side compatibility
- **shadcn/ui**: Recommended UI layer for Next.js dashboards — builds on existing Radix UI primitives
- **Supabase Auth**: Existing auth solution — sufficient for role-based access (admin vs client)
- **React Query**: Already installed — handles server state and enables optimistic updates

**What NOT to use:**

- MUI X Data Grid (heavy, conflicts with Tailwind)
- Redux Toolkit (overkill — React Query handles server state)
- Prisma/Drizzle (existing Supabase JS client sufficient)

### Expected Features

**Summary from FEATURES.md** — Research identifies table stakes, differentiators, and anti-features for custom build service order management.

**Must have (table stakes) — P1:**

- Order Submission Form — core value proposition
- Public Order Tracking (Order ID) — without login status check
- Role-Based Authentication — admin vs client separation
- Admin Order Management — view, filter, search orders
- Order Status Updates — workflow state management
- Progress Timeline — chronological milestone display
- Client Order List — self-service expectation
- Order Detail View — specifications and history

**Should have (competitive) — P2:**

- Photo Progress Updates — key differentiator for custom build services
- Dashboard Analytics — admin stats for orders, revenue, popular services
- In-App Notifications — real-time alerts for status changes

**Defer (v2+):**

- Change Request Management — formal workflow for mid-build modifications
- Email Notifications — add after in-app is proven
- Payment/Invoicing — significant scope, defer per PROJECT.md
- Service Configuration UI — admin interface for managing services

### Architecture Approach

**Summary from ARCHITECTURE.md** — Standard OMS patterns adapted for service businesses. Focus on project lifecycle tracking, progress communication, and service customization.

**Major components:**

1. **Order Submission** — Public-facing form capturing kit info, service options, pricing calculation
2. **Progress Management** — Append-only log of build milestones with photos, timeline display
3. **Status State Machine** — Explicit states and valid transitions: received → confirmed → in_progress → quality_check → completed
4. **Client Portal** — Authenticated view of own orders with progress timeline
5. **Admin Dashboard** — Full order management, status updates, progress logging

**Key architectural patterns:**

- Server-First Data Fetching — Server Components fetch via Supabase server client
- Real-Time Updates — Supabase Realtime subscription for progress logs
- Optimistic Updates — React Query for immediate UI feedback on mutations
- Status State Machine — Explicit transitions prevent invalid states

### Critical Pitfalls

**Top 5 from PITFALLS.md:**

1. **Broken Object Level Authorization (IDOR)** — Clients can view other clients' orders by manipulating URL parameters. Prevention: Always filter queries by `auth.uid()`, use RLS policies as safety net.

2. **Order State Machine Missing Invalid Transitions** — Orders can jump from "pending" to "completed" skipping stages. Prevention: Define explicit states with database constraints, validate transitions in mutation layer.

3. **Supabase RLS Policies Not Applied** — Data exposed to wrong users. Prevention: Enable RLS on ALL tables, test with anon client, create policies for every operation.

4. **Real-time Updates Not Working** — Clients must refresh to see progress. Prevention: Enable Realtime in dashboard, implement subscription cleanup, invalidate React Query on events.

5. **Progress Timeline Incomplete** — Entries out of order, missing timestamps, photo uploads fail. Prevention: Always include `created_at`, query with explicit ordering, configure storage bucket policies.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Core Order Flow

**Rationale:** Foundation phase — must establish security and basic order lifecycle before any user-facing features. Addresses critical pitfalls (RLS, state machine, timeline).

**Delivers:**

- Order submission form with pricing calculation
- Order status workflow with state machine
- Progress timeline with basic logging
- RLS policies on all tables
- Photo upload capability

**Addresses features:** Order Submission Form, Order Status Updates, Progress Timeline
**Avoids pitfalls:** RLS misconfiguration, state machine gaps, timeline issues

### Phase 2: Admin Dashboard

**Rationale:** Core operations — admin needs to manage orders before clients can meaningfully submit them. Establishes operational capability.

**Delivers:**

- Admin order list with filtering/search (TanStack Table)
- Order detail view with full specifications
- Status update controls
- Progress log addition with photos
- Basic dashboard stats

**Uses:** TanStack Table, shadcn/ui components (table, badge, card, tabs)
**Implements:** Admin Dashboard component, Progress Management

### Phase 3: Client Portal

**Rationale:** Completes experience — authenticated clients need to see their orders and progress. Must handle access control carefully.

**Delivers:**

- Client order list (filtered by user)
- Order detail view with progress timeline
- Real-time updates via Supabase Realtime

**Addresses features:** Client Order List, Order Detail View
**Avoids pitfalls:** IDOR vulnerability — must test with two accounts

### Phase 4: Public Tracking

**Rationale:** Visibility — allows prospective and existing clients to check status without login. Important for customer service.

**Delivers:**

- Public order tracking page (/track/[orderId])
- Sanitized queries (exclude sensitive data)
- Realtime updates for public page

**Addresses features:** Order ID Tracking (Public)

### Phase 5: Advanced Features (v1.x)

**Rationale:** Differentiation — adds competitive advantages once core is working.

**Delivers:**

- Photo progress updates at milestones
- Dashboard analytics (order volume, revenue trends)
- In-app notifications for status changes

**Addresses features:** Photo Progress Updates, Dashboard Analytics, In-App Notifications

### Phase Ordering Rationale

- **Phases 1-2 first:** Security foundation (Phase 1) and admin operations (Phase 2) must precede any client-facing features
- **Phases 3-4 client access:** Client portal before public tracking — authenticated flow is simpler to secure
- **Phase 5 differentiation:** Analytics and photo updates add value but require core to be stable first
- **Avoids pitfalls:** Each phase maps to specific pitfalls that must be addressed before proceeding

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 2 (Admin Dashboard):** Complex filtering/sorting with TanStack Table — may need research on best practices for server-side pagination with Supabase
- **Phase 3 (Client Portal):** Real-time subscription implementation details — verify Supabase Realtime configuration

Phases with standard patterns (skip research-phase):

- **Phase 1 (Core Order Flow):** Well-documented patterns, state machine and form validation are standard
- **Phase 4 (Public Tracking):** Simple read-only queries, established pattern

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                            |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------ |
| Stack        | HIGH        | Multiple authoritative sources confirm recommendations; aligns with existing codebase            |
| Features     | MEDIUM      | Based on industry analysis and PROJECT.md requirements; some prioritization subjective           |
| Architecture | HIGH        | Standard OMS patterns adapted for service business; existing codebase analysis confirms approach |
| Pitfalls     | MEDIUM-HIGH | Based on OWASP, Supabase docs, and industry case studies; some issues are Supabase-specific      |

**Overall confidence:** HIGH

### Gaps to Address

- **Service Configuration UI:** Research identifies this as a v2 feature, but the order submission form requires service options to be configurable. Need to clarify during planning: hardcoded services for v1 or admin-configurable from start?
- **Pricing Calculation:** Estimation engine mentioned in architecture but not detailed in feature research. May need specific research on pricing rules implementation.
- **Photo Storage Configuration:** Bucket policies need explicit setup in Supabase — should verify during Phase 1 implementation.

## Sources

### Primary (HIGH confidence)

- TanStack Table v8 Docs — https://tanstack.com/table/v8 (Authoritative, current)
- shadcn/ui Data Table Guide — https://ui.shadcn.com/docs/components/data-table (Authoritative)
- Supabase RLS Documentation — https://supabase.io/docs/learn/auth-deep-dive/auth-row-level-security
- OWASP Authorization Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

### Secondary (MEDIUM confidence)

- Next.js Admin Dashboard Templates 2026 — https://adminlte.io/blog/nextjs-admin-dashboard-templates/ (Industry survey)
- WooCommerce Custom Orders — Made-to-order business workflow patterns
- Client Portal Best Practices — https://www.clinked.com/blog/customer-portals (Portal feature expectations)

### Tertiary (LOW confidence)

- 3DPBOSS, GrabCAD Shop — Custom service business management features (competitive analysis)

---

_Research completed: 2026-02-24_
_Ready for roadmap: yes_
