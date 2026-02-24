# Requirements: Flow

**Defined:** 2026-02-24
**Core Value:** Clients can submit orders and track progress; Admins can manage orders through a dashboard — all in one connected system.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Order Management

- [ ] **ORD-01**: Client can submit order with kit details and service selections
- [ ] **ORD-02**: Order submission creates order in database with pending status
- [ ] **ORD-03**: Client receives order confirmation with order ID
- [ ] **ORD-04**: Admin can view all orders in dashboard
- [ ] **ORD-05**: Admin can filter and search orders
- [ ] **ORD-06**: Admin can update order status (received, in-progress, painting, completed, shipped)
- [ ] **ORD-07**: Admin can add progress updates with notes

### Client Portal

- [ ] **CLNT-01**: Client can log in and view their own orders
- [ ] **CLNT-02**: Client can view order details (items, pricing, status)
- [ ] **CLNT-03**: Client can view progress timeline for their orders

### Public Tracking

- [ ] **PUBL-01**: Public user can track order by order ID without login
- [ ] **PUBL-02**: Public tracking shows current status and progress

### Admin Dashboard

- [ ] **DASH-01**: Admin dashboard shows overview stats (total orders, pending, in-progress, completed)
- [ ] **DASH-02**: Admin dashboard shows recent activity

### Security

- [ ] **SEC-01**: Row Level Security policies enforce client can only see their own orders
- [ ] **SEC-02**: IDOR protection prevents clients from accessing other clients' orders

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Progress Enhancement

- **PROG-01**: Admin can upload progress photos
- **PROG-02**: Client receives in-app notifications for status changes

### Change Management

- **CHNG-01**: Client can request changes to existing order
- **CHNG-02**: Admin can approve/reject change requests
- **CHNG-03**: Change requests update order pricing

### Analytics

- **ANLT-01**: Admin dashboard shows revenue trends
- **ANLT-02**: Admin dashboard shows popular services

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                   | Reason                                    |
| ------------------------- | ----------------------------------------- |
| Payment/invoicing         | Complex financial handling, defer to v2   |
| Email notifications       | Requires email service setup, defer to v2 |
| Client self-service edits | Use change request workflow instead       |
| Multi-admin/team          | Single admin sufficient for v1            |

## Traceability

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| ORD-01      | Phase 1 | Pending |
| ORD-02      | Phase 1 | Pending |
| ORD-03      | Phase 1 | Pending |
| ORD-04      | Phase 2 | Pending |
| ORD-05      | Phase 2 | Pending |
| ORD-06      | Phase 1 | Pending |
| ORD-07      | Phase 1 | Pending |
| CLNT-01     | Phase 3 | Pending |
| CLNT-02     | Phase 3 | Pending |
| CLNT-03     | Phase 3 | Pending |
| PUBL-01     | Phase 4 | Pending |
| PUBL-02     | Phase 4 | Pending |
| DASH-01     | Phase 2 | Pending |
| DASH-02     | Phase 2 | Pending |
| SEC-01      | Phase 1 | Pending |
| SEC-02      | Phase 3 | Pending |

**Coverage:**

- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---

_Requirements defined: 2026-02-24_
_Last updated: 2026-02-24 after initial definition_
