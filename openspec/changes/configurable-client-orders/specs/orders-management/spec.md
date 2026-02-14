# orders-management Specification (Delta)

## Purpose

This spec extends the existing orders-management capability to support client-created orders, client-linked orders, and real-time synchronization between client and admin views.

## ADDED Requirements

### Requirement: Client Linking

The system MUST link orders to client profiles when created by authenticated clients.

#### Scenario: Order created by client includes client_id

- GIVEN a client user is authenticated
- WHEN the client creates a new order
- THEN the order's client_id field is set to the client's profile ID
- AND the order appears in the client's order list
- AND the admin can view which client owns the order

#### Scenario: Admin can view client profile from order

- GIVEN an admin user is viewing an order with a linked client
- WHEN the admin clicks on the client's name
- THEN the admin is navigated to the client's profile view
- AND the profile shows all orders from that client

### Requirement: Real-time Status Sync

The system MUST synchronize order status changes between admin and client views in real-time.

#### Scenario: Admin status update reflects to client immediately

- GIVEN a client has an order details page open
- AND an admin changes the order status
- WHEN the change is saved to the database
- THEN the client's view updates automatically
- AND the status badge changes
- AND a notification appears on the client's page

#### Scenario: Client action reflects to admin immediately

- GIVEN an admin has an order details page open
- AND a client approves the order or submits a change request
- WHEN the action is saved
- THEN the admin's view updates automatically
- AND the order status or change request section refreshes

### Requirement: Change Request Management

The system MUST allow admins to view, approve, and reject client change requests with automatic pricing updates.

#### Scenario: View pending change requests

- GIVEN an admin user is viewing an order with pending change requests
- THEN a "Change Requests" section is displayed
- AND each pending request shows:
  - Request description
  - Client's requested changes
  - Calculated price impact
  - Calculated time impact
  - "Approve" and "Reject" buttons

#### Scenario: Approve change request

- GIVEN an admin user is viewing a pending change request
- WHEN the admin clicks "Approve"
- AND optionally adds a response message
- THEN the change request status is set to "approved"
- AND the order's estimated_price_cents is increased by the price impact
- AND the order's estimated_days is increased by the time impact
- AND the client is notified
- AND the admin dashboard shows the updated order

#### Scenario: Reject change request

- GIVEN an admin user is viewing a pending change request
- WHEN the admin clicks "Reject"
- AND adds a rejection reason (required)
- THEN the change request status is set to "rejected"
- AND the order pricing is NOT changed
- AND the client is notified with the reason

### Requirement: Client Notifications in Admin View

The system MUST display client-submitted notes and feedback in the admin order details view.

#### Scenario: View client notes on order

- GIVEN a client has added notes to an order
- WHEN an admin views the order details
- THEN a "Client Notes" section is displayed
- AND all client notes appear in chronological order
- AND each note shows:
  - Note text
  - Timestamp
  - Any attached images
  - Client name

## MODIFIED Requirements

### Requirement: Order Details Page (Modified)

The order details page at `/admin/orders/[orderId]` MUST display client information for client-created orders.

#### Scenario: Display client information (NEW)

- GIVEN an admin user is viewing an order created by a client
- WHEN the page loads
- THEN a "Client Information" section is displayed showing:
  - Client name
  - Client email
  - Client phone
  - Link to client profile
  - Link to view all client's orders

#### Scenario: Display order source (NEW)

- GIVEN an admin user is viewing any order
- WHEN the page loads
- THEN the order header shows the source:
  - "Client Portal" if created by authenticated client
  - "Public Form" if created via public form
  - "Admin Created" if created by admin

### Requirement: Orders List Page (Modified)

The orders list page MUST include client information and support filtering by client.

#### Scenario: Show client name in orders list (NEW)

- GIVEN an admin user is viewing the orders list
- WHEN orders are displayed
- AND an order has a linked client
- THEN the client's name is shown in a "Client" column

#### Scenario: Filter by client (NEW)

- GIVEN an admin user is viewing the orders list
- WHEN the admin searches for or selects a specific client
- THEN only orders from that client are displayed
