# State: Flow

**Project:** Flow - Gunpla Custom Build Service Management
**Core Value:** Clients can submit orders and track progress; Admins can manage orders through a dashboard — all in one connected system.

---

## Current Position

**Phase:** Planning
**Plan:** Roadmap creation
**Status:** Draft complete, awaiting approval

**Progress:** ░░░░░░░░░░ 0%

---

## Performance Metrics

| Metric                   | Current | Target |
| ------------------------ | ------- | ------ |
| v1 Requirements Mapped   | 15/15   | 15/15  |
| Phases Defined           | 4       | 4      |
| Success Criteria Defined | 17      | 17+    |
| Research Flags Addressed | 0/2     | 2/2    |

---

## Accumulated Context

### Key Decisions

|                           | Status Decision                                                    | Rationale |
| ------------------------- | ------------------------------------------------------------------ | --------- |
| 4-phase structure         | Matches natural requirement groupings and research recommendations | Approved  |
| Phase 1 includes security | RLS and security foundation before any user-facing features        | Approved  |
| Public tracking last      | Authenticated flows are simpler to secure first                    | Approved  |

### Research Flags

- **Phase 2:** TanStack Table server-side pagination with Supabase — needs research during planning
- **Phase 3:** Supabase Realtime subscription implementation — needs research during planning

### Dependencies Identified

- Phase 2 depends on Phase 1 (data model + admin access)
- Phase 3 depends on Phase 1 (security foundation)
- Phase 4 depends on Phase 1 (order data exists)

### Out of Scope for v1

- Photo uploads (PROG-01)
- In-app notifications (PROG-02)
- Change requests (CHNG-01/02/03)
- Revenue analytics (ANLT-01/02)
- Payment/invoicing
- Email notifications

---

## Session Continuity

### What's Been Done

1. Read all planning context files (PROJECT.md, REQUIREMENTS.md, research/SUMMARY.md, config.json)
2. Analyzed 15 v1 requirements across 5 categories
3. Derived 4 phases from requirements (not imposed)
4. Created success criteria for each phase (17 total)
5. Validated 100% coverage (15/15 requirements mapped)

### What's Next

1. User reviews and approves roadmap
2. Move to `/gsd-plan-phase 1` for Core Order Flow
3. Execute Phase 1 plans
4. Progress through phases sequentially

### Notes for Next Session

- Research suggested TanStack Table for Phase 2 (may need dedicated research)
- Research suggested Supabase Realtime for Phase 3 (may need dedicated research)
- All v1 requirements are mapped - no orphans or gaps
- Existing traceability in REQUIREMENTS.md already aligned with derived phases

---

## Quick Reference

**Phases:**

1. Core Order Flow — Order submission, status updates, progress logging, security
2. Admin Dashboard — Order management, filtering, stats
3. Client Portal — Authenticated client access
4. Public Tracking — Unauthenticated order tracking

**Key Requirements:**

- ORD-01/02/03: Order submission flow
- CLNT-01/02/03: Client portal
- PUBL-01/02: Public tracking
- SEC-01/02: Security (RLS, IDOR)

---

_State updated: 2026-02-24 after roadmap creation_
