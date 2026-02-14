# Spec: Orders Management

## ADDED Requirements

### Requirement: Orders List Page

The system MUST provide an orders list page at `/admin/orders` displaying all orders with filtering, search, and pagination capabilities.

#### Scenario: Display all orders

- GIVEN an admin user is authenticated
- WHEN the user navigates to `/admin/orders`
- THEN a table of orders is displayed
- AND each row shows:
  - Order ID (clickable to view details)
  - Client name
  - Status badge
  - Number of kits
  - Estimated price
  - Created date
- AND orders are sorted by creation date (newest first)

#### Scenario: Filter orders by status

- GIVEN an admin user is viewing the orders list
- WHEN the user selects a status filter (e.g., "in_progress")
- THEN only orders with that status are displayed
- AND the filter indicator is visible

#### Scenario: Search orders by client name

- GIVEN an admin user is viewing the orders list
- WHEN the user enters a client name in the search box
- THEN orders matching the client name are displayed
- AND search is case-insensitive
- AND search updates as user types (debounced)

#### Scenario: Pagination

- GIVEN more than 20 orders exist
- WHEN an admin user views the orders list
- THEN only 20 orders are displayed per page
- AND pagination controls are shown
- AND user can navigate between pages

### Requirement: Order Details Page

The system MUST provide an order details page at `/admin/orders/[orderId]` displaying complete order information with status management capabilities.

#### Scenario: Display complete order information

- GIVEN an admin user is authenticated
- AND an order with ID "123" exists
- WHEN the user navigates to `/admin/orders/123`
- THEN the following sections are displayed:
  - Order header (ID, status, dates)
  - Client information (name, phone, email, address)
  - Order items (kits, services, complexity, notes)
  - Pricing breakdown (estimated and final)
  - Progress logs (photos and status updates)
  - Change requests (if any)

#### Scenario: Update order status

- GIVEN an admin user is viewing an order details page
- WHEN the user clicks the status dropdown
- AND selects a new status (e.g., "in_progress")
- AND confirms the change
- THEN the order status is updated in the database
- AND a success message is displayed
- AND the status badge is updated

#### Scenario: Order not found

- GIVEN an admin user navigates to `/admin/orders/999`
- AND order 999 does not exist
- THEN a "Order not found" message is displayed
- AND a "Back to Orders" link is provided

### Requirement: Order Status Workflow

The system MUST enforce valid status transitions based on the order flow: draft → estimated → approved → in_progress → completed (or cancelled at any stage).

#### Scenario: Valid status transition

- GIVEN an order has status "estimated"
- WHEN an admin updates the status to "approved"
- THEN the update succeeds
- AND the status is saved

#### Scenario: Invalid status transition (blocked)

- GIVEN an order has status "draft"
- WHEN an admin attempts to update status to "in_progress"
- THEN the transition is blocked
- AND an error message explains the required status flow
- AND the status remains unchanged

### Requirement: Order Items Display

The order details page MUST display all order items with their selected services, complexity, and individual pricing.

#### Scenario: Display multiple order items

- GIVEN an order has multiple kits
- WHEN an admin user views the order details
- THEN each kit is displayed as a card or row
- AND each item shows:
  - Kit name/model
  - Selected services (full_build, repair, repaint)
  - Complexity level
  - Individual price estimate
  - Notes if provided

### Requirement: Progress Logs

The system MUST support viewing and adding progress logs with photo uploads for each order.

#### Scenario: View existing progress logs

- GIVEN an order has progress logs
- WHEN an admin user views the order details
- THEN a "Progress Logs" section is displayed
- AND each log shows:
  - Timestamp
  - Status update message
  - Attached photo (if any)
  - Associated kit/item

#### Scenario: Add new progress log

- GIVEN an admin user is viewing order details
- WHEN the user clicks "Add Progress Update"
- AND enters a status message
- AND optionally uploads a photo
- AND submits the form
- THEN the progress log is saved
- AND the photo is stored in Supabase Storage
- AND the log appears in the progress timeline

### Requirement: Change Requests Display

The order details page MUST display any change requests associated with the order with their status and impact.

#### Scenario: Display pending change request

- GIVEN an order has a pending change request
- WHEN an admin user views the order details
- THEN a "Change Requests" section is displayed
- AND the request shows:
  - Request description
  - Price impact (additional cost)
  - Time impact (additional days)
  - Current status (pending, approved, rejected)
- AND action buttons are shown (Approve/Reject)

#### Scenario: Approve change request

- GIVEN an admin user views a pending change request
- WHEN the user clicks "Approve"
- AND confirms the action
- THEN the change request status is updated to "approved"
- AND the order pricing is updated
- AND a success message is displayed

### Requirement: Loading and Error States

Orders pages MUST display appropriate loading and error states.

#### Scenario: Loading state on orders list

- GIVEN an admin user navigates to `/admin/orders`
- AND data is being fetched
- THEN a loading skeleton is displayed
- AND the skeleton matches the table structure

#### Scenario: Error state on order details

- GIVEN an admin user navigates to `/admin/orders/123`
- AND the data fetch fails
- THEN an error message is displayed
- AND a "Retry" button is provided
- AND a "Back to Orders" link is shown
