## ADDED Requirements

### Requirement: Public Order Query

The system MUST allow read-only access to order data for public tracking without authentication.

#### Scenario: Query order by public ID

- GIVEN a client has an order ID
- WHEN querying the order from a public context
- THEN the system returns order details
- AND includes client name, status, items, estimation, progress logs
- AND excludes sensitive admin-only fields (internal notes, admin metadata)

#### Scenario: Public RLS policy

- GIVEN a public request attempts to access order data
- WHEN the request includes a valid order ID
- THEN Row Level Security allows read-only access
- AND prevents write or delete operations
- AND returns 404 for invalid order IDs
