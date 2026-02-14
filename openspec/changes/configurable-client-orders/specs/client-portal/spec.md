# client-portal Specification

## Purpose

The client-portal capability provides authenticated clients with a dashboard to manage their orders. Clients can create new orders using admin-configured forms, track progress, approve estimates, submit change requests, cancel orders, and provide feedback. This enables a self-service experience while maintaining admin oversight.

## Core Workflow (MVP)

### Client Flow

1. Register / Login
2. Create New Order
3. Add one or more Model Kits to the order
4. For each kit:
   - Select one or more services (Full Build, Repair, Repaint)
   - Select complexity level (Low / Medium / High)
   - Optional notes and reference images
5. View auto-generated estimation (price + time)
6. Submit order
7. Wait for Admin approval
8. Track progress with status and photos
9. Submit Change Request if needed
10. View updated estimation if change is approved
11. Order completed

### Admin Flow

1. Login as Admin
2. View order dashboard with status filters
3. Open order details
4. Review each kit and its services
5. Adjust estimation if needed
6. Approve estimation
7. Update order status (Draft → Estimated → Approved → In Progress → Completed)
8. Upload progress photos per kit
9. Receive and handle change requests (Approve / Reject, Apply price and time delta)
10. Finalize order and invoice

## ADDED Requirements

### Requirement: Client Dashboard

The system MUST provide a client dashboard at `/client/dashboard` displaying an overview of the client's orders.

#### Scenario: View client dashboard

- GIVEN a client user is authenticated
- WHEN the user navigates to `/client/dashboard`
- THEN the dashboard displays:
  - Welcome message with client name
  - Summary cards showing:
    - Total orders
    - Active orders (in_progress, approved)
    - Pending orders (draft, estimated)
    - Completed orders
  - Recent orders list (last 5 orders)
  - Quick action button to create new order

#### Scenario: Filter orders by status on dashboard

- GIVEN a client user is viewing their dashboard
- WHEN the user clicks a status filter (e.g., "Active Orders")
- THEN only orders matching the status are displayed in the recent orders list
- AND the filter indicator is visible

#### Scenario: Navigate to order details from dashboard

- GIVEN a client user is viewing their dashboard
- WHEN the user clicks on an order in the recent orders list
- THEN the user is navigated to `/client/orders/[orderId]`

### Requirement: Client Orders List

The system MUST provide an orders list page at `/client/orders` showing all the client's orders with filtering and search.

#### Scenario: View all client orders

- GIVEN a client user is authenticated
- WHEN the user navigates to `/client/orders`
- THEN a list of all the client's orders is displayed
- AND each order card/row shows:
  - Order ID
  - Order status badge
  - Number of kits
  - Estimated price
  - Created date
  - Last update date
- AND orders are sorted by creation date (newest first)

#### Scenario: Filter orders by status

- GIVEN a client user is viewing their orders list
- WHEN the user selects a status filter (e.g., "in_progress")
- THEN only orders with that status are displayed
- AND the filter indicator is visible

#### Scenario: Search orders by kit name

- GIVEN a client user is viewing their orders list
- WHEN the user enters a kit name in the search box
- THEN orders containing matching kit names are displayed
- AND search is case-insensitive
- AND search updates as user types (debounced)

### Requirement: Create New Order

The system MUST provide a new order form at `/client/orders/new` using the admin-configured form template.

#### Scenario: Start new order creation

- GIVEN a client user is authenticated
- WHEN the user navigates to `/client/orders/new`
- AND a default form template exists
- THEN the form wizard is displayed
- AND the form follows the configured template structure
- AND step 1 of the form is shown

#### Scenario: Configure form steps (Admin-defined)

- GIVEN an admin has configured a form template with steps:
  1. Client Information (name, phone, email, address)
  2. Kit Details (kit name, grade, quantity)
  3. Services (service type, complexity, notes)
  4. Review & Submit (summary, estimation)
- WHEN a client creates a new order
- THEN the form wizard displays the steps in the configured order
- AND the client can navigate forward and backward through steps
- AND progress indicator shows current step

#### Scenario: Add model kit to order

- GIVEN a client user is on the "Kit Details" step
- WHEN the user enters:
  - Kit name/model (e.g., "RX-78-2 Gundam")
  - Grade (e.g., "MG", "PG", "HG")
  - Quantity (default: 1)
- AND clicks "Add Kit"
- THEN the kit is added to the order
- AND a kit summary card is displayed
- AND the user can add another kit or proceed

#### Scenario: Select services for kit

- GIVEN a client user has added one or more kits
- AND is on the "Services" step
- WHEN the user selects services for each kit:
  - Full Build (checkbox)
  - Repair (checkbox)
  - Repaint (checkbox)
- AND selects complexity level: Low, Medium, or High
- AND optionally adds notes
- THEN the services are saved for each kit
- AND the estimation is updated in real-time
- AND a preview shows the estimated price and time

#### Scenario: Add reference images to kit

- GIVEN a client user is on the "Services" step
- WHEN the user clicks "Add Reference Images" for a kit
- AND selects one or more image files
- AND uploads the images
- THEN the images are uploaded to Supabase Storage
- AND image thumbnails are displayed on the kit card
- AND a maximum of 5 images per kit is enforced

#### Scenario: View auto-generated estimation

- GIVEN a client user is on the "Review & Submit" step
- WHEN the step is displayed
- THEN a summary shows:
  - Client information
  - All kits with their services and complexity
  - Price breakdown:
    - Base price per service
    - Complexity multiplier
    - Total estimated price
  - Time breakdown:
    - Base days per service
    - Complexity multiplier
    - Total estimated days
- AND the estimation is calculated using current pricing rules

#### Scenario: Submit order

- GIVEN a client user is on the "Review & Submit" step
- AND all required fields are filled
- WHEN the user clicks "Submit Order"
- THEN the order is created with status "draft"
- AND the order is linked to the client (client_id set)
- AND the user is redirected to `/client/orders/[orderId]`
- AND a success message is displayed: "Order submitted successfully! Waiting for admin review."

#### Scenario: Save order as draft

- GIVEN a client user is creating an order
- AND not all required fields are filled
- WHEN the user clicks "Save as Draft"
- THEN the order is saved with status "draft"
- AND the user can return later to complete the order
- AND a success message is displayed

### Requirement: Order Details (Client View)

The system MUST provide an order details page at `/client/orders/[orderId]` showing the order's current status and information.

#### Scenario: View order details

- GIVEN a client user owns an order with ID "123"
- WHEN the user navigates to `/client/orders/123`
- THEN the order details page displays:
  - Order header (ID, status badge, created date)
  - Status progress indicator
  - Client information (read-only)
  - All kits with their services, complexity, and notes
  - Reference images for each kit
  - Estimated price and time
  - Progress logs with photos
  - Change requests (if any)

#### Scenario: Access denied for other client's order

- GIVEN a client user "client-a" is authenticated
- WHEN the user attempts to navigate to `/client/orders/456`
- AND order 456 belongs to "client-b"
- THEN a "Not Found" or "Access Denied" message is displayed
- AND the user is redirected to their orders list

#### Scenario: Order not found

- GIVEN a client user navigates to `/client/orders/999`
- AND order 999 does not exist
- THEN a "Order not found" message is displayed
- AND a "Back to Orders" link is provided

### Requirement: Approve Order

The system MUST allow clients to approve orders when they are in "estimated" status.

#### Scenario: Approve estimated order

- GIVEN a client user is viewing an order with status "estimated"
- WHEN the user clicks "Approve Order"
- AND confirms the action
- THEN the order status is updated to "approved"
- AND the admin is notified (dashboard updated)
- AND a success message is displayed: "Order approved! Work will begin soon."

#### Scenario: Cannot approve non-estimated order

- GIVEN a client user is viewing an order with status "draft"
- THEN the "Approve Order" button is not displayed
- OR the button is displayed but disabled
- AND a message explains: "Order must be estimated by admin before approval"

### Requirement: Submit Change Request

The system MUST allow clients to submit change requests to add or modify services.

#### Scenario: Submit change request for additional service

- GIVEN a client user is viewing an order with status "approved" or "in_progress"
- WHEN the user clicks "Request Change"
- AND selects a kit to modify
- AND selects additional services (e.g., add "Repaint")
- AND enters a description of the change
- AND optionally uploads reference images
- AND submits the request
- THEN a change request is created with status "pending"
- AND the price and time impact is calculated
- AND the admin dashboard shows the pending change request
- AND the order status remains unchanged
- AND a success message is displayed: "Change request submitted. Wait for admin approval."

#### Scenario: View change request status

- GIVEN a client user has submitted a change request
- WHEN the user views the order details
- THEN the change request section shows:
  - Request description
  - Additional price (if approved)
  - Additional time (if approved)
  - Current status (pending, approved, rejected)
  - Admin response message (if any)

#### Scenario: Change request approved - view updated estimation

- GIVEN a client user submitted a change request
- AND the admin has approved the change request
- WHEN the user refreshes the order details page
- THEN the order's estimated price and time are updated
- AND the change request status shows "approved"
- AND the additional cost and time are displayed
- AND a notification message is displayed: "Your change request has been approved!"

### Requirement: Cancel Order

The system MUST allow clients to cancel orders that are not yet completed.

#### Scenario: Cancel pending order

- GIVEN a client user is viewing an order with status "draft" or "estimated"
- WHEN the user clicks "Cancel Order"
- AND confirms the cancellation
- AND optionally provides a reason
- THEN the order status is updated to "cancelled"
- AND the cancellation reason is saved
- AND the admin dashboard shows the cancelled order
- AND a success message is displayed: "Order cancelled successfully"

#### Scenario: Cannot cancel in-progress order

- GIVEN a client user is viewing an order with status "in_progress"
- THEN the "Cancel Order" button is not displayed
- OR the button shows a warning: "Contact admin to cancel in-progress orders"

### Requirement: Provide Feedback

The system MUST allow clients to add notes or feedback to their orders at any time.

#### Scenario: Add feedback note to order

- GIVEN a client user is viewing any order
- WHEN the user clicks "Add Note"
- AND enters a message in the text area
- AND submits the note
- THEN the note is saved and associated with the order
- AND the note appears in the order's activity feed
- AND the admin can view the note in the order details
- AND a success message is displayed

#### Scenario: Add feedback with reference image

- GIVEN a client user is adding a note
- WHEN the user optionally uploads an image with the note
- THEN the image is uploaded and linked to the note
- AND the image thumbnail is displayed in the activity feed
- AND the admin can view the image

### Requirement: Real-time Synchronization

The system MUST update the client portal in real-time when admin makes changes to orders.

#### Scenario: Order status update reflects immediately

- GIVEN a client user has an order details page open
- AND an admin updates the order status (e.g., from "approved" to "in_progress")
- WHEN the client's page receives the update
- THEN the status badge is updated immediately
- AND the progress indicator reflects the new status
- AND a notification shows: "Order status updated: In Progress"

#### Scenario: Progress photos appear immediately

- GIVEN a client user is viewing an order in progress
- AND an admin uploads a progress photo
- WHEN the client's page receives the update
- THEN the new photo appears in the progress timeline immediately
- AND a notification shows: "New progress update available"

#### Scenario: Change request response appears immediately

- GIVEN a client user has a pending change request
- AND the admin approves or rejects the request
- WHEN the client's page receives the update
- THEN the change request status is updated immediately
- AND the updated estimation is reflected if approved
- AND a notification shows the admin's decision

### Requirement: Order Progress Tracking

The system MUST provide a visual progress timeline for clients to track order progress.

#### Scenario: View progress timeline

- GIVEN a client user is viewing an order with status "in_progress"
- THEN a progress timeline is displayed showing:
  - Order created (date)
  - Order approved (date)
  - Work started (date)
  - Progress updates with photos (chronological)
  - Each update shows:
    - Date and time
    - Status message
    - Photo(s) if uploaded
    - Associated kit

#### Scenario: Progress percentage indicator

- GIVEN an order has multiple kits and progress updates
- WHEN the client views the order details
- THEN a progress percentage is displayed (e.g., "60% Complete")
- AND the percentage is calculated based on completed items vs total items

### Requirement: Client Notifications

The system MUST display notifications for important order events.

#### Scenario: Notification on status change

- GIVEN a client user has an order
- WHEN the admin changes the order status
- THEN a notification appears in the client's notification center
- AND the notification shows:
  - Order ID
  - Status change (e.g., "Your order is now In Progress")
  - Timestamp
- AND clicking the notification navigates to the order details

#### Scenario: Notification on change request response

- GIVEN a client user submitted a change request
- WHEN the admin approves or rejects the request
- THEN a notification appears showing the decision
- AND the notification includes any price/time impact

#### Scenario: Notification on progress update

- GIVEN a client user has an order in progress
- WHEN the admin uploads a progress photo
- THEN a notification appears: "New progress photos available for your order"

### Requirement: Client API Endpoints

The system MUST provide API endpoints for client-specific operations.

#### Scenario: Get client orders

- GIVEN a client user is authenticated
- WHEN a GET request is made to `/api/client/orders`
- THEN a list of orders belonging to the client is returned
- AND orders include: id, status, kits, estimatedPrice, estimatedDays, createdAt, updatedAt

#### Scenario: Get single client order

- GIVEN a client user is authenticated
- AND owns order with ID "123"
- WHEN a GET request is made to `/api/client/orders/123`
- THEN the full order details are returned
- AND all related data (kits, progress logs, change requests) is included

#### Scenario: Create new order as client

- GIVEN a client user is authenticated
- WHEN a POST request is made to `/api/client/orders`
- AND the request body contains valid order data
- THEN the order is created with client_id set to the authenticated user
- AND a 201 status is returned
- AND the created order is returned

#### Scenario: Approve order

- GIVEN a client user owns an order with status "estimated"
- WHEN a POST request is made to `/api/client/orders/[orderId]/approve`
- THEN the order status is updated to "approved"
- AND a 200 status is returned

#### Scenario: Submit change request

- GIVEN a client user owns an order
- WHEN a POST request is made to `/api/client/orders/[orderId]/change-requests`
- AND the request body contains change details
- THEN a change request is created
- AND the price/time impact is calculated
- AND a 201 status is returned

#### Scenario: Cancel order

- GIVEN a client user owns an order with cancellable status
- WHEN a POST request is made to `/api/client/orders/[orderId]/cancel`
- AND optionally includes a cancellation reason
- THEN the order status is updated to "cancelled"
- AND the reason is saved
- AND a 200 status is returned

#### Scenario: Add note to order

- GIVEN a client user owns an order
- WHEN a POST request is made to `/api/client/orders/[orderId]/notes`
- AND the request body contains the note text and optional image
- THEN the note is saved
- AND a 201 status is returned

### Requirement: Admin Order Management Updates

The system MUST update admin order management to handle client-created orders.

#### Scenario: Admin views client on order details

- GIVEN an admin user is viewing an order created by a client
- THEN the order details page shows:
  - Client information (name, email, phone)
  - Link to client profile
  - Client's order history

#### Scenario: Admin receives notification for new client order

- GIVEN a client user submits a new order
- THEN a notification appears in the admin dashboard
- AND the notification shows: "New order from [Client Name]"
- AND clicking the notification navigates to the order details

#### Scenario: Admin responds to change request

- GIVEN an admin user is viewing a pending change request
- WHEN the admin clicks "Approve" or "Reject"
- AND optionally adds a response message
- THEN the change request status is updated
- AND the order pricing is updated if approved
- AND the client is notified immediately
- AND the change request is marked as handled
