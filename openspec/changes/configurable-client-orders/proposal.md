# Change: Configurable Client Orders

## Why

The Flow application currently has a fixed order form structure that cannot be customized by administrators. As the business evolves, admins need the flexibility to:

- Configure which fields appear on the order form
- Define which fields are required vs optional
- Customize available services and pricing rules
- Adjust the multi-step form flow

Additionally, clients currently cannot manage their own orders - they can only submit new orders publicly and track passively. This change implements a full client portal with authentication, enabling clients to create orders using admin-configured forms and manage existing orders (approve, request changes, cancel, provide feedback) with real-time synchronization to the admin dashboard.

## What Changes

- Add **form configuration system** for admin-customizable order forms
  - Admin settings page to create/edit form templates
  - Configurable form steps, fields, validation rules, service types, and pricing
  - Multiple form templates for different use cases

- Add **client authentication system**
  - Client registration and login
  - Role-based access control (admin vs client)
  - Client profile management

- Add **client portal** with order management capabilities
  - Client dashboard showing all their orders
  - Create new orders using configured form templates
  - View order details and progress
  - Approve/confirm orders and estimates
  - Submit change requests
  - Cancel orders
  - Provide feedback and notes

- Add **real-time synchronization** between client and admin
  - Client actions (approve, change request, cancel, feedback) instantly reflected in admin dashboard
  - Admin status updates instantly visible to clients
  - WebSocket or polling-based live updates

## Impact

- Affected specs: orders-management, authentication, order-form, order-tracking, form-configuration, client-portal
- Affected code:
  - Database: New tables for `form_templates`, `form_fields`, `clients`, `sessions`
  - `app/(admin)/admin/settings/form-templates/` - Admin form configuration UI
  - `app/(client)/` - New client portal section
  - `app/(client)/client/dashboard/` - Client dashboard
  - `app/(client)/client/orders/` - Client order management
  - `app/(client)/client/orders/new/` - Client new order form
  - `app/api/auth/` - Authentication endpoints
  - `app/api/form-templates/` - Form template CRUD
  - `app/api/client/orders/` - Client-specific order endpoints
  - `lib/features/form-configuration/` - Form configuration logic
  - `lib/features/auth/` - Authentication logic
  - `lib/features/client-portal/` - Client portal logic
  - `components/admin/form-builder/` - Admin form builder components
  - `components/client/` - Client portal components

## Dependencies

- Requires `orders-management` spec to be fully implemented
- Requires `authentication` spec to be extended for client roles
- Builds on existing database schema and order workflow
