# database-schema Specification

## Purpose

TBD - created by archiving change configure-admin-dashboard. Update Purpose after archive.

## Requirements

### Requirement: Profiles Table

The system MUST extend Supabase auth.users with a profiles table that stores user role information.

#### Scenario: Create profile on user registration

- GIVEN a new user is created in Supabase Auth
- WHEN a trigger fires on auth.users creation
- THEN a corresponding profile is created in public.profiles
- AND the profile has:
  - id matching auth.users.id
  - role defaulting to 'client'
  - created_at and updated_at timestamps

#### Scenario: Assign admin role

- GIVEN a user exists in auth.users
- WHEN the profile is updated with role = 'admin'
- THEN the user has admin privileges
- AND RLS policies allow admin access to protected tables

### Requirement: Orders Table

The system MUST provide an orders table to store order information with status tracking and estimation data.

#### Scenario: Create new order

- GIVEN a client submits an order via the public form
- WHEN the order is saved to the database
- THEN the orders record contains:
  - id (UUID, primary key)
  - client_id (reference to profiles.id)
  - status (enum: draft, estimated, approved, in_progress, completed, cancelled)
  - estimated_price_cents (integer)
  - estimated_days (integer)
  - final_price_cents (integer, nullable)
  - final_days (integer, nullable)
  - notes (text, nullable)
  - created_at and updated_at timestamps

#### Scenario: Order status history

- GIVEN an order exists
- WHEN the order status changes
- THEN the updated_at timestamp is updated
- AND the previous status can be queried from audit logs

### Requirement: Order Items Table

The system MUST provide an order_items table to store individual kits and services per order.

#### Scenario: Add items to order

- GIVEN an order is being created
- WHEN multiple kits are added
- THEN each item creates an order_items record with:
  - id (UUID, primary key)
  - order_id (foreign key to orders.id)
  - kit_name (text)
  - kit_model (text)
  - service_type (enum: full_build, repair, repaint)
  - complexity (enum: low, medium, high)
  - notes (text, nullable)
  - created_at timestamp

#### Scenario: Calculate item pricing

- GIVEN an order item exists
- WHEN the pricing is calculated
- THEN the price is determined by:
  - base price for the service type
  - multiplied by complexity multiplier
  - summed across all items in the order

### Requirement: Change Requests Table

The system MUST provide a change_requests table to track client modification requests with their impact.

#### Scenario: Create change request

- GIVEN a client requests changes to an in-progress order
- WHEN the request is saved
- THEN a change_requests record is created with:
  - id (UUID, primary key)
  - order_id (foreign key to orders.id)
  - description (text)
  - price_impact_cents (integer, can be negative for discounts)
  - days_impact (integer, can be negative for time savings)
  - status (enum: pending, approved, rejected)
  - created_at and updated_at timestamps

#### Scenario: Approve change request

- GIVEN a pending change request exists
- WHEN an admin approves it
- THEN the status is updated to 'approved'
- AND the order's estimated_price_cents is increased by price_impact_cents
- AND the order's estimated_days is increased by days_impact

### Requirement: Progress Logs Table

The system MUST provide a progress_logs table to track status updates and photo uploads during builds.

#### Scenario: Add progress log with photo

- GIVEN an order is in progress
- WHEN an admin adds a progress update
- THEN a progress_logs record is created with:
  - id (UUID, primary key)
  - order_id (foreign key to orders.id)
  - order_item_id (foreign key to order_items.id, nullable)
  - message (text)
  - photo_url (text, nullable, Supabase Storage URL)
  - created_at timestamp

#### Scenario: View progress timeline

- GIVEN an order has multiple progress logs
- WHEN the logs are queried
- THEN they are ordered by created_at DESC
- AND each log shows the message and optional photo

### Requirement: Row Level Security (RLS)

All tables MUST have RLS policies that restrict access based on user roles.

#### Scenario: Admin can access all data

- GIVEN a user has role 'admin'
- WHEN the user queries any table
- THEN all records are accessible
- AND all CRUD operations are allowed

#### Scenario: Non-admin cannot access admin tables

- GIVEN a user does NOT have role 'admin'
- WHEN the user attempts to query orders, order_items, etc.
- THEN the query returns zero records
- AND write operations are denied

#### Scenario: Users can only read own profile

- GIVEN any authenticated user
- WHEN querying the profiles table
- THEN only their own profile is visible
- AND they can only update their own profile

### Requirement: Initial Admin User

The database MUST provide a mechanism to create the initial admin user for first-time setup.

#### Scenario: Create initial admin via SQL

- GIVEN the database is newly created
- WHEN the setup script is run
- THEN an admin user is created with:
  - Email from environment variable or default
  - A default password that must be changed on first login
  - Role set to 'admin' in profiles table

#### Scenario: First login password change

- GIVEN an admin logs in with default credentials
- WHEN the admin first accesses the system
- THEN they are prompted to change their password
- AND the password cannot be the default password

### Requirement: Database Indexes

The database MUST have appropriate indexes for common query patterns.

#### Scenario: Query orders by status

- GIVEN an index exists on orders(status)
- WHEN querying orders filtered by status
- THEN the query uses the index
- AND results are returned efficiently

#### Scenario: Query orders by client

- GIVEN an index exists on orders(client_id)
- WHEN querying orders for a specific client
- THEN the query uses the index
- AND results are returned efficiently

#### Scenario: Query change requests by order

- GIVEN an index exists on change_requests(order_id)
- WHEN querying change requests for an order
- THEN the query uses the index
- AND results are ordered by created_at

### Requirement: Database Constraints

The database MUST enforce referential integrity and data validity through constraints.

#### Scenario: Prevent orphaned order items

- GIVEN an order_item references an order
- WHEN attempting to delete the order
- THEN the deletion is blocked (RESTRICT)
- OR all order items are deleted (CASCADE)

#### Scenario: Valid status values

- GIVEN the orders table has a status column
- WHEN inserting or updating an order
- THEN only valid status enum values are accepted
- AND invalid values are rejected

#### Scenario: Non-negative pricing

- GIVEN an order has estimated_price_cents
- WHEN inserting or updating the order
- THEN negative values are rejected
- AND the value must be >= 0
