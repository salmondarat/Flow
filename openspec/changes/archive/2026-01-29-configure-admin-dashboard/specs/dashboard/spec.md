# Spec: Dashboard Overview

## ADDED Requirements

### Requirement: Dashboard Statistics Cards

The dashboard MUST display statistics cards showing: total orders, in-progress orders, completed orders, and estimated revenue.

#### Scenario: Dashboard displays accurate statistics

- GIVEN an admin user is authenticated
- WHEN the user navigates to `/admin/dashboard`
- THEN statistics cards are displayed showing:
  - Total Orders count
  - In-Progress Orders count
  - Completed Orders count
  - Estimated Revenue (in IDR)
- AND all counts are accurate based on current database state

#### Scenario: Statistics refresh on interval

- GIVEN an admin user is viewing the dashboard
- AND statistics are displayed
- WHEN 30 seconds have elapsed
- THEN the statistics automatically refresh
- AND updated values are displayed if data changed

### Requirement: Recent Activity Feed

The dashboard MUST display a list of recent activities including new orders, status updates, and change requests with timestamps.

#### Scenario: Display recent orders

- GIVEN an admin user is authenticated
- WHEN the user navigates to `/admin/dashboard`
- THEN a "Recent Activity" section is displayed
- AND the last 10 activities are shown with:
  - Activity type (e.g., "New Order", "Status Updated")
  - Related entity (e.g., order ID, client name)
  - Timestamp in relative format (e.g., "2 hours ago")
  - Visual indicator of activity type

#### Scenario: Empty state when no activity

- GIVEN the database has no activity records
- WHEN an admin user navigates to `/admin/dashboard`
- THEN an empty state message is displayed
- AND the message indicates "No recent activity"

### Requirement: Attention-Needed Section

The dashboard MUST display orders requiring immediate attention: new orders awaiting estimation, orders pending approval, and overdue orders.

#### Scenario: Display orders needing attention

- GIVEN orders exist that require attention
- WHEN an admin user navigates to `/admin/dashboard`
- THEN an "Attention Needed" section is displayed
- AND orders are grouped by category:
  - New Orders (awaiting estimation)
  - Pending Approval
  - Overdue Orders
- AND each order shows client name and order ID
- AND clicking an order navigates to order details

#### Scenario: No orders requiring attention

- GIVEN no orders require immediate attention
- WHEN an admin user navigates to `/admin/dashboard`
- THEN the "Attention Needed" section is hidden
- OR displays "All caught up!" message

### Requirement: Workload Progress Overview

The dashboard MUST display a visual overview of current workload including active orders by status and estimated completion dates.

#### Scenario: Display workload overview

- GIVEN multiple orders are in progress
- WHEN an admin user navigates to `/admin/dashboard`
- THEN a "Workload Overview" section is displayed
- AND active orders are grouped by status
- AND each order shows:
  - Client name
  - Kit/service type
  - Estimated completion date
  - Progress percentage
- AND overdue orders are highlighted

#### Scenario: Workload with no active orders

- GIVEN no orders are currently in progress
- WHEN an admin user navigates to `/admin/dashboard`
- THEN the "Workload Overview" shows an empty state
- AND message indicates "No active orders"

### Requirement: Dashboard Loading State

The dashboard MUST display loading indicators while fetching data.

#### Scenario: Initial page load shows loading state

- GIVEN an admin user navigates to `/admin/dashboard`
- AND data is being fetched
- THEN loading skeletons are displayed for:
  - Statistics cards
  - Recent activity feed
  - Attention needed section
  - Workload overview
- AND loading states match the final layout

### Requirement: Dashboard Error Handling

The dashboard MUST handle errors gracefully and display appropriate error messages.

#### Scenario: Data fetch fails

- GIVEN an admin user navigates to `/admin/dashboard`
- AND the data fetch fails (network error, server error)
- THEN an error message is displayed
- AND a "Retry" button is provided
- AND clicking retry attempts to fetch data again
