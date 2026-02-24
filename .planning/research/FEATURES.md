# Feature Research

**Domain:** Custom Model Kit / Gunpla Build Service Business Management
**Researched:** 2026-02-24
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels broken or incomplete.

| Feature                        | Why Expected                                                                                                 | Complexity | Notes                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------------- |
| **Order Submission Form**      | Clients must be able to submit custom build requests with kit selection, service options, and specifications | MEDIUM     | Existing validated requirement          |
| **Order ID Tracking (Public)** | Clients need to check order status without logging in using a simple order identifier                        | LOW        | Already exists as validated requirement |
| **Role-Based Authentication**  | Secure access separating admin operations from client viewing                                                | MEDIUM     | Admin vs client roles already validated |
| **Admin Order Management**     | Staff must view, filter, search, and manage all orders in pipeline                                           | MEDIUM     | Core admin function                     |
| **Order Status Updates**       | Ability to change order state (received, in-progress, painting, completed, shipped)                          | LOW        | Status workflow essential               |
| **Progress Timeline**          | Visual chronological display of order milestones and updates                                                 | MEDIUM     | Clients expect to see build progress    |
| **Client Order List**          | Clients need to see all their orders in one place                                                            | LOW        | Basic self-service expectation          |
| **Order Detail View**          | Detailed view of each order with full specifications, items, pricing                                         | LOW        | Required for any service business       |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but create competitive edge and customer delight.

| Feature                              | Value Proposition                                                                                                | Complexity | Notes                                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| **Photo Progress Updates**           | Clients receive visual build updates with photos at key milestones — builds trust and excitement for custom work | MEDIUM     | High value for hobby/custom services; existing code has `uploadProgressPhoto` mutation |
| **Real-Time Progress Notifications** | Clients get instant notifications when order status changes — reduces "where is my order" inquiries              | MEDIUM     | Could integrate with email (v2) or in-app notifications                                |
| **Change Request Management**        | Clients can request modifications mid-build with admin approval workflow — prevents disputes and scope creep     | MEDIUM     | Database schema exists; deferred to v2 per PROJECT.md                                  |
| **Custom Service Configuration**     | Admin can define available services (painting, weathering, custom decals, diorama) with pricing                  | MEDIUM     | Allows flexible service offerings                                                      |
| **Build Specification Details**      | Detailed breakdown of what's included: grade, scale, modifications, materials, labor hours                       | LOW        | Helps manage client expectations                                                       |
| **Dashboard Analytics**              | Admin sees order volume, revenue trends, popular services, turnaround times — data-driven decisions              | MEDIUM     | Already identified as active requirement                                               |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems or scope creep.

| Feature                         | Why Requested                                         | Why Problematic                                                                                           | Alternative                                                         |
| ------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Client Self-Service Edits**   | Clients want to modify order details after submission | Creates complex change tracking, pricing recalculations, status synchronization issues                    | Use change request workflow instead (admin reviews client requests) |
| **Full Email Notifications**    | Everyone wants email alerts                           | Implementation complexity, email deliverability, spam concerns; better to start with in-app notifications | Start with in-app notifications; add email as v2                    |
| **Payment/Invoice Integration** | Natural next step for any order system                | Significant scope: payment processing, tax handling, invoicing, refunds                                   | Defer to v2 per PROJECT.md constraints                              |
| **Real-Time Chat**              | Clients want to ask questions                         | Requires moderation, availability management, history retention                                           | Use structured messages/comments on orders instead                  |
| **Multi-Admin Collaboration**   | Growing businesses want team features                 | Adds permission complexity, audit trails, conflict resolution                                             | Single admin sufficient for v1; add team features later             |

## Feature Dependencies

```
[Order Submission Form]
    └──requires──> [Service Configuration]
                       └──requires──> [Pricing Calculator]

[Admin Order Management]
    └──requires──> [Order Status Updates]
                       └──requires──> [Progress Timeline]

[Client Order List]
    └──requires──> [Order Detail View]
                       └──requires──> [Progress Timeline]

[Photo Progress Updates]
    └──requires──> [Progress Timeline]
    └──requires──> [Order Status Updates]

[Change Request Management]
    └──requires──> [Order Detail View]
    └──requires──> [Admin Order Management]
```

### Dependency Notes

- **Order submission requires service configuration:** The form needs to know what services are available and their prices before clients can select them
- **Progress timeline requires status updates:** You cannot track progress without discrete status changes to plot on a timeline
- **Photo updates enhance but don't require timeline:** Photos can be added as attachments to status updates even without a visual timeline
- **Change requests require order detail:** Clients need to see current specs before requesting changes

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Order Submission Form** — Core value proposition: clients submit custom build requests
- [x] **Order ID Tracking** — Public access to check status without login (already exists)
- [x] **Role-Based Auth** — Security separation between admin and client (already exists)
- [x] **Admin Order Management** — View, filter, search all orders
- [x] **Order Status Updates** — Change status through workflow states
- [x] **Progress Timeline** — Visual chronological view for clients
- [x] **Client Order List** — See all their orders
- [x] **Order Detail View** — Full specifications and history

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **Photo Progress Updates** — Visual build updates at milestones; high client satisfaction
- [ ] **Dashboard Analytics** — Admin stats: orders, revenue, popular services
- [ ] **In-App Notifications** — Real-time alerts for status changes

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Change Request Management** — Formal workflow for mid-build modifications
- [ ] **Email Notifications** — For status updates and milestones
- [ ] **Payment/Invoicing** — Complete financial workflow
- [ ] **Service Configuration UI** — Admin interface to manage available services

## Feature Prioritization Matrix

| Feature                   | User Value | Implementation Cost | Priority |
| ------------------------- | ---------- | ------------------- | -------- |
| Order Submission Form     | HIGH       | MEDIUM              | P1       |
| Public Order Tracking     | HIGH       | LOW                 | P1       |
| Admin Order Management    | HIGH       | MEDIUM              | P1       |
| Order Status Updates      | HIGH       | LOW                 | P1       |
| Progress Timeline         | HIGH       | MEDIUM              | P1       |
| Client Order List         | HIGH       | LOW                 | P1       |
| Order Detail View         | HIGH       | LOW                 | P1       |
| Role-Based Auth           | HIGH       | MEDIUM              | P1       |
| Photo Progress Updates    | MEDIUM     | MEDIUM              | P2       |
| Dashboard Analytics       | MEDIUM     | MEDIUM              | P2       |
| In-App Notifications      | MEDIUM     | LOW                 | P2       |
| Change Request Management | MEDIUM     | MEDIUM              | P3       |
| Email Notifications       | MEDIUM     | MEDIUM              | P3       |
| Payment/Invoicing         | HIGH       | HIGH                | P3       |
| Service Configuration     | MEDIUM     | MEDIUM              | P3       |

**Priority Key:**

- P1: Must have for launch (table stakes)
- P2: Should have, add when possible (early differentiators)
- P3: Nice to have, future consideration (v2+)

## Competitor Feature Analysis

| Feature           | Generic Order Systems   | 3D Printing Services             | Our Approach                               |
| ----------------- | ----------------------- | -------------------------------- | ------------------------------------------ |
| Order Submission  | Basic product selection | File upload + material selection | Kit catalog + service options              |
| Progress Tracking | Status only             | Printer status + ETA             | Milestone-based with photos                |
| Client Portal     | Order history           | Job dashboard                    | Order list + timeline                      |
| Status Updates    | Automated               | Automated                        | Manual (custom build requires human input) |
| Photo Updates     | Rare                    | Build photos                     | First-class feature (key differentiator)   |

## Sources

- [WooCommerce Custom Orders](https://woocommerce.com/products/custom-order/) — Made-to-order business workflow patterns
- [3DPBOSS](https://3dpboss.com/features) — Custom service business management features
- [GrabCAD Shop](https://cad.grabcad.com/en/shop/features) — Order management for custom manufacturing
- [Client Portal Best Practices](https://www.clinked.com/blog/customer-portals) — Portal feature expectations
- [Order Tracking Software](https://monday.com/blog/project-management/order-tracking-software/) — Tracking portal features
- Project requirements from `.planning/PROJECT.md` — Validated and active requirements

---

_Feature research for: Model Kit / Gunpla Custom Build Service_
_Researched: 2026-02-24_
