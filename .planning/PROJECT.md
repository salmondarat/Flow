# Flow

## What This Is

A web-based business management application for a Model Kit / Gunpla Custom Build Service. It streamlines order intake, estimation, progress tracking, and change management for both clients and admins.

## Core Value

Clients can submit orders and track progress; Admins can manage orders through a dashboard — all in one connected system.

## Requirements

### Validated

- ✓ Public order form with kit/service selection — existing
- ✓ Public order tracking by order ID — existing
- ✓ Role-based authentication (admin/client) — existing
- ✓ Database schema for orders, items, progress logs, change requests — existing
- ✓ Admin and client dashboard layouts — existing

### Active

- [ ] Order submission flow works end-to-end (form → API → database → confirmation)
- [ ] Admin can view all orders in dashboard
- [ ] Admin can update order status
- [ ] Admin can add progress updates with photos
- [ ] Admin dashboard displays meaningful stats/overview
- [ ] Client can view their own orders
- [ ] Client can view order progress timeline

### Out of Scope

- Change request management — defer to v2
- Email notifications — defer to v2
- Payment/invoicing — defer to v2
- Client self-service edits after submission — defer to v2

## Context

**Brownfield project** — significant existing code:

- Next.js 15 + Supabase (PostgreSQL)
- TypeScript, Tailwind CSS 4, Radix UI
- Feature-based architecture in `lib/features/`
- Role-based access via middleware
- Database schema ready but may need testing

**Technical environment:**

- Vercel deployment
- Supabase backend
- React Query for client-side data

## Constraints

- **Timeline**: No deadline — quality over speed
- **Tech Stack**: Next.js + Supabase (already chosen)
- **Scope**: Complete v1 features before adding new ones

## Key Decisions

| Decision            | Rationale                                      | Outcome   |
| ------------------- | ---------------------------------------------- | --------- |
| Brownfield approach | Build on existing code, complete before adding | — Pending |

---

_Last updated: 2026-02-24 after initialization_
