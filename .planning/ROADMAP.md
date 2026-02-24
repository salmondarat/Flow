# Roadmap: Flow

**Project:** Flow - Gunpla Custom Build Service Management
**Created:** 2026-02-24
**Core Value:** Clients can submit orders and track progress; Admins can manage orders through a dashboard — all in one connected system.

---

## Phases

- [ ] **Phase 1: Core Order Flow** - Order submission, database creation, status updates, progress logging, security foundation
- [ ] **Phase 2: Admin Dashboard** - Admin order management, filtering, overview stats
- [ ] **Phase 3: Client Portal** - Authenticated client order viewing, progress timeline
- [ ] **Phase 4: Public Tracking** - Unauthenticated order tracking by order ID

---

## Phase Details

### Phase 1: Core Order Flow

**Goal:** Users can submit orders and admins can manage the order lifecycle with security in place

**Depends on:** Nothing (first phase)

**Requirements:** ORD-01, ORD-02, ORD-03, ORD-06, ORD-07, SEC-01

**Success Criteria** (what must be TRUE):

1. Client can fill out order form with kit details and select services
2. Order submission creates a new order record in the database with "pending" status
3. Client receives confirmation with unique order ID after submission
4. Admin can update order status through valid workflow states
5. Admin can add progress updates with notes to any order
6. RLS policies enforce that clients can only see their own orders

**Plans:** TBD

---

### Phase 2: Admin Dashboard

**Goal:** Admins can efficiently view, search, filter, and manage all orders with overview stats

**Depends on:** Phase 1

**Requirements:** ORD-04, ORD-05, DASH-01, DASH-02

**Success Criteria** (what must be TRUE):

1. Admin sees list of all orders in dashboard
2. Admin can filter orders by status (pending, in-progress, completed, etc.)
3. Admin can search orders by order ID or client name/email
4. Dashboard displays total order count summary
5. Dashboard displays order counts by status (pending, in-progress, completed)
6. Dashboard shows recent activity (last 5-10 order updates)

**Plans:** TBD

---

### Phase 3: Client Portal

**Goal:** Authenticated clients can view their own orders and progress timeline

**Depends on:** Phase 1 (security foundation)

**Requirements:** CLNT-01, CLNT-02, CLNT-03, SEC-02

**Success Criteria** (what must be TRUE):

1. Client can log in and see list of their own orders only
2. Client can click an order to view full details (items, services, pricing)
3. Client can view chronological progress timeline for each order
4. Client cannot access other clients' orders via URL manipulation (IDOR protection)

**Plans:** TBD

---

### Phase 4: Public Tracking

**Goal:** Anyone can track an order by its ID without login

**Depends on:** Phase 1 (order data exists)

**Requirements:** PUBL-01, PUBL-02

**Success Criteria** (what must be TRUE):

1. Public user can enter order ID on tracking page without logging in
2. Tracking page displays current order status
3. Tracking page displays progress timeline (notes, not photos for v1)
4. Invalid order ID shows appropriate "not found" message

**Plans:** TBD

---

## Progress

| Phase              | Plans Complete | Status      | Completed |
| ------------------ | -------------- | ----------- | --------- |
| 1. Core Order Flow | 0/1            | Not started | -         |
| 2. Admin Dashboard | 0/1            | Not started | -         |
| 3. Client Portal   | 0/1            | Not started | -         |
| 4. Public Tracking | 0/1            | Not started | -         |

---

## Dependencies

```
Phase 1 (Core Order Flow)
    ↓
Phase 2 (Admin Dashboard) - requires Phase 1
    ↓
Phase 3 (Client Portal) - requires Phase 1 security
    ↓
Phase 4 (Public Tracking) - requires Phase 1 data
```

---

## Notes

- Research flags Phase 2 (Admin Dashboard) for TanStack Table integration research
- Research flags Phase 3 (Client Portal) for Supabase Realtime implementation
- v1 does not include photo uploads (deferred to v2)
- v1 does not include analytics/revenue trends (deferred to v2)

---

_Roadmap created: 2026-02-24_
