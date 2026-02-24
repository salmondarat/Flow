# Pitfalls Research

**Domain:** Order Management & Client Portal for Custom Build Services
**Researched:** 2026-02-24
**Confidence:** MEDIUM-HIGH

## Executive Summary

This research identifies critical pitfalls when adding order management and client portals to existing applications. Based on analysis of order management challenges, client portal development mistakes, and Supabase-specific issues, the following are the highest-risk areas:

1. **Broken Access Control** — Most critical security issue; client data exposure via IDOR
2. **Order State Machine Gaps** — Invalid state transitions cause order processing failures
3. **RLS Misconfiguration** — Supabase-specific data exposure risks
4. **Real-time Update Failures** — Clients see stale progress data
5. **Missing Status Workflow States** — Edge cases create data inconsistencies

---

## Critical Pitfalls

### Pitfall 1: Broken Object Level Authorization (IDOR)

**What goes wrong:**
A client can view other clients' orders by manipulating URL parameters (e.g., changing order ID in `/client/orders/123` to `/client/orders/456`). The frontend loads, but backend doesn't verify ownership.

**Why it happens:**

- Developers rely on frontend routing guards only (middleware checks role, not ownership)
- Query logic assumes user ID from session is sufficient without explicit ownership checks
- API endpoints accept order ID parameters without validating the authenticated user owns that order

**How to avoid:**

- Every database query for user-specific data MUST include `auth.uid()` or profile ID filter in the WHERE clause
- Use Supabase RLS policies to enforce ownership at database level — this is your safety net
- Implement query functions that ALWAYS filter by the requesting user's ID, never accept user-controlled order IDs without validation

**Warning signs:**

- Any endpoint accepting `{orderId}` as a parameter without checking `order.user_id === auth.uid()`
- Client-side components that hide data via CSS instead of not fetching it
- API responses that return 404 instead of 403 for unauthorized access (404 is more secure but 403 is acceptable)

**Phase to address:** Order viewing implementation (Phase 2: Client Portal)

---

### Pitfall 2: Order State Machine Missing Invalid Transitions

**What goes wrong:**
An order can jump from "pending" directly to "completed" without going through "in_progress". Or an admin can mark an order complete that was never started. Progress timeline becomes meaningless.

**Why it happens:**

- No formal state machine defined — developers use ad-hoc if/else status checks
- Database allows any string in status column without constraints
- Frontend UI doesn't enforce valid transition sequences

**How to avoid:**

- Define explicit order states: `pending` → `accepted` → `in_progress` → `quality_check` → `completed`
- Create database constraint (CHECK constraint or enum) limiting valid status values
- Implement state transition validation in the mutation layer before database updates
- Document valid transitions in code comments and enforce in UI (disable invalid buttons)

**Warning signs:**

- Status column is a free-form VARCHAR with no constraints
- Any status can be set from any other status via admin panel
- No validation preventing "completed" on an order with no progress logs

**Phase to address:** Order status management (Phase 1: Core Order Flow)

---

### Pitfall 3: Supabase RLS Policies Not Applied or Incorrect

**What goes wrong:**
All client data is exposed to any authenticated user, or worse, to anonymous users with the anon key. Orders, progress logs, and personal information are publicly readable.

**Why it happens:**

- RLS enabled but no policies created (returns empty results for everyone)
- Policies created for INSERT but not SELECT
- Policy uses `auth.uid()` but table doesn't have user_id column
- Service role client used in frontend code (bypasses RLS incorrectly)

**How to avoid:**

- Enable RLS on ALL tables in the application schema
- Create policies for every operation (SELECT, INSERT, UPDATE, DELETE) for each role
- Test RLS by querying from anon client — should return empty, not data
- Never expose service role key to client-side code
- For orders table: `CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());`

**Warning signs:**

- Tables in Supabase dashboard showing "RLS: disabled"
- Queries return empty arrays in production but work in admin dashboard
- No RLS policies visible in Supabase SQL editor

**Phase to address:** Database security (Phase 1: Core Order Flow - foundation phase)

---

### Pitfall 4: Real-time Updates Not Working or Inefficient

**What goes wrong:**
Clients refresh the page to see progress updates. Real-time subscription fails silently. Admin updates don't appear for clients until manual refresh.

**Why it happens:**

- Supabase Realtime not configured for the tables being monitored
- React Query caching prevents UI updates (stale data)
- Subscription errors not handled gracefully
- Too many subscriptions causing performance issues

**How to avoid:**

- Enable Realtime for relevant tables in Supabase dashboard (orders, progress_logs)
- Implement proper subscription cleanup in useEffect return function
- Use React Query's `refetchOnWindowFocus` or invalidate queries on subscription events
- Consider polling as fallback when realtime fails

**Warning signs:**

- Progress updates require page refresh
- Console shows subscription errors没有被处理
- Multiple subscription instances created (memory leak)

**Phase to address:** Progress tracking (Phase 1: Core Order Flow)

---

### Pitfall 5: Progress Timeline Incomplete or Out of Order

**What goes wrong:**
Progress updates appear in wrong order, missing timestamps, or admin can't add photos. Timeline becomes confusing instead of helpful.

**Why it happens:**

- No created_at timestamp or using server time without timezone handling
- Query doesn't ORDER descending
- Photo BY timestamp upload storage bucket not configured correctly
- Progress log entries can be deleted, breaking timeline continuity

**How to avoid:**

- Always include `created_at` with `default: now()` in database schema
- Query with explicit `order_by: { created_at: 'desc' }`
- Configure Supabase Storage bucket with proper public read policies for progress photos
- Consider making progress logs append-only (no delete) to preserve history
- Include admin name/ID with each progress entry for attribution

**Warning signs:**

- Progress entries appearing in random order
- Missing timestamps in UI
- Photo upload fails with permission error
- Timeline gaps make order history confusing

**Phase to address:** Progress tracking (Phase 1: Core Order Flow)

---

### Pitfall 6: Admin Dashboard Shows No Meaningful Data

**What goes wrong:**
Admin dashboard displays raw tables instead of actionable insights. No quick overview of order volume, status distribution, or pending actions.

**Why it happens:**

- Dashboard queries directly expose database tables without aggregation
- No statistics calculated — just lists of orders
- Missing filters for common admin workflows (e.g., "orders needing attention")
- Performance issues with large datasets (no pagination, no virtualization)

**How to avoid:**

- Create aggregation queries for dashboard stats: count by status, recent orders, pending items
- Implement pagination with cursor-based navigation for order lists
- Add quick filters: "Needs Review", "In Progress", "Completed This Week"
- Consider admin-specific dashboard views separate from client views
- Pre-compute expensive aggregations or use Supabase Database Functions

**Warning signs:**

- Admin must scroll through thousands of rows to find relevant orders
- No clear indication of which orders need immediate attention
- Dashboard loads slowly with large order volumes

**Phase to address:** Admin dashboard (Phase 2: Admin Dashboard)

---

## Technical Debt Patterns

| Shortcut                     | Immediate Benefit              | Long-term Cost                            | When Acceptable                |
| ---------------------------- | ------------------------------ | ----------------------------------------- | ------------------------------ |
| Skip RLS policies, add later | Faster initial development     | Data breach risk, retrofitting is painful | NEVER — security first         |
| Use free-form status VARCHAR | Flexibility during development | Invalid states possible, harder queries   | Only with app-level validation |
| Skip real-time, use polling  | Simpler initial implementation | Poor UX, increased server load            | Acceptable for MVP only        |
| One big query for dashboard  | Simpler code                   | Performance at scale                      | Defer until performance issues |
| Skip pagination              | Works for small datasets       | Memory issues, timeout at scale           | Only for <100 rows             |

---

## Integration Gotchas

| Integration        | Common Mistake                           | Correct Approach                                                  |
| ------------------ | ---------------------------------------- | ----------------------------------------------------------------- |
| Supabase Auth      | Not handling session expiry              | Implement refresh token handling, middleware redirects to login   |
| Supabase Storage   | Bucket not public, uploads fail          | Set bucket policies for authenticated users, test uploads         |
| React Query        | Stale data, not invalidating             | Use query invalidation on mutations, set appropriate stale times  |
| Next.js Middleware | Checking role but not resource ownership | Middleware handles routing, business logic handles data ownership |

---

## Performance Traps

| Trap                    | Symptoms                                    | Prevention                                 | When It Breaks          |
| ----------------------- | ------------------------------------------- | ------------------------------------------ | ----------------------- |
| N+1 Queries             | Progress log queries for each order in list | Use database JOINs or separate stats query | >50 orders in list view |
| No Pagination           | Dashboard timeout with 1000+ orders         | Implement cursor-based pagination          | >500 total orders       |
| Large Realtime Payloads | Slow UI updates with many listeners         | Filter subscriptions to needed tables only | >5 concurrent users     |
| Unoptimized RLS         | Slow queries on orders table                | Add indexes on user_id, status columns     | >10,000 orders          |

---

## Security Mistakes

| Mistake                            | Risk                              | Prevention                                            |
| ---------------------------------- | --------------------------------- | ----------------------------------------------------- |
| IDOR in order viewing              | Client A sees Client B's order    | Always filter by `auth.uid()` in queries + RLS        |
| No rate limiting on order creation | Bot spam, abuse                   | Add Supabase rate limiting or implement in middleware |
| Service role exposed to client     | Full database access from browser | Never use service role in client-side code            |
| Order ID enumeration               | Attacker guesses order IDs        | Use UUIDs, not sequential integers                    |

---

## UX Pitfalls

| Pitfall                           | User Impact                         | Better Approach                                                         |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| No order confirmation             | Clients unsure if order submitted   | Clear success page with order ID, email confirmation                    |
| Vague status labels               | "Processing" means nothing specific | Use clear statuses: "Kit Received", "Painting", "Detailing", "Final QC" |
| No progress photos                | Clients bored, lose trust           | Include photo updates at each stage                                     |
| Can't contact support from portal | Frustrated users                    | Add "Questions?" link or simple message feature                         |
| No estimated completion date      | Uncertainty, repeated inquiries     | Show estimated date when order enters "In Progress"                     |

---

## "Looks Done But Isn't" Checklist

- [ ] **RLS Policies:** Enabled on ALL tables? Verified with anon query?
- [ ] **Order Ownership:** Tested IDOR with two different user accounts?
- [ ] **Real-time:** Does client see updates without refresh?
- [ ] **Status Transitions:** Can you accidentally skip from "pending" to "completed"?
- [ ] **Progress Timeline:** Are entries ordered by time? Oldest first or newest first?
- [ ] **Admin Stats:** Does dashboard show meaningful counts, or just raw tables?
- [ ] **Error Handling:** What shows when a user accesses non-existent order? 404 or 403?
- [ ] **Photo Uploads:** Can admin actually add progress photos, or does it fail silently?

---

## Recovery Strategies

| Pitfall              | Recovery Cost | Recovery Steps                                                               |
| -------------------- | ------------- | ---------------------------------------------------------------------------- |
| RLS not applied      | HIGH          | Audit all queries, add policies, may need to notify users if breach occurred |
| IDOR vulnerability   | HIGH          | Fix queries, audit access logs, may need user notification                   |
| Invalid order states | MEDIUM        | Add database constraints, migrate existing bad data, fix mutation logic      |
| Broken realtime      | LOW           | Fix subscription code, test with multiple clients                            |

---

## Pitfall-to-Phase Mapping

| Pitfall                     | Prevention Phase         | Verification                                             |
| --------------------------- | ------------------------ | -------------------------------------------------------- |
| RLS misconfiguration        | Phase 1: Core Order Flow | Query as anon user — should return empty                 |
| IDOR / broken authorization | Phase 2: Client Portal   | Test with two accounts accessing each other's orders     |
| Order state machine gaps    | Phase 1: Core Order Flow | Try every status transition, verify invalid ones blocked |
| Real-time failures          | Phase 1: Core Order Flow | Update from admin, verify client sees without refresh    |
| Timeline issues             | Phase 1: Core Order Flow | Add multiple progress entries, verify order              |
| Dashboard performance       | Phase 2: Admin Dashboard | Load with 100+ orders, verify response time              |
| Photo upload failures       | Phase 1: Core Order Flow | Attempt upload as admin, verify success                  |

---

## Sources

- Netguru: "13 Order Management Challenges" (2026) — https://www.netguru.com/blog/order-management-challenges
- Fast Slow Motion: "OMS & Fulfillment Integrations" (2026) — https://www.fastslowmotion.com/commerce-cloud-oms-fulfillment-integration/
- Auth0: "Five Common Authentication and Authorization Mistakes" — https://auth0.com/blog/five-common-authentication-and-authorization-mistakes-to-avoid-in-your-saas-application/
- OWASP: "Authorization Cheat Sheet" — https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Supabase: "Row Level Security" docs — https://supabase.io/docs/learn/auth-deep-dive/auth-row-level-security
- DesignRevision: "Supabase RLS Complete Guide" (2026) — https://designrevision.com/blog/supabase-row-level-security
- Medium: "I Skipped the Outbox Pattern" (2026) — real-world case study on data consistency

---

_Pitfalls research for: Model Kit Custom Build Service Order Management_
_Researched: 2026-02-24_
