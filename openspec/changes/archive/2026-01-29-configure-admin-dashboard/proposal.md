# Change: Configure Admin Dashboard

## Why

The Flow application currently has only basic admin layout components with no functionality. The admin login page is a static form without authentication logic, and there is no dashboard or orders management functionality. This change implements secure admin access via Supabase authentication, a functional dashboard with statistics and activity tracking, and orders management with filtering and status updates.

## What Changes

- Add authentication and authorization via Supabase Auth for admin login/logout
- Add dashboard overview page with stats cards, recent activity feed, attention-needed items, and workload overview
- Add orders management with list page (filtering/search) and order details view (status management)
- Complete admin navigation and layout with sidebar, header, and responsive design
- Integrate shadcn/ui components with proper theming (Button, Card, Table, Form, Input, Badge, Dialog, etc.)
- Add database schema with tables (profiles, orders, order_items, change_requests, progress_logs) and RLS policies

## Impact

- Affected specs: authentication, dashboard, database-schema, orders-management
- Affected code:
  - `app/(admin)/admin/login/page.tsx` - Authentication page
  - `app/(admin)/admin/dashboard/page.tsx` - Dashboard overview
  - `app/(admin)/admin/orders/page.tsx` - Orders list
  - `app/(admin)/admin/orders/[orderId]/page.tsx` - Order details
  - `lib/auth/` - Authentication utilities
  - `lib/features/dashboard/` - Dashboard queries
  - `lib/features/orders/` - Orders queries and mutations
  - `supabase/migrations/` - Database migrations
  - `components/admin/` - Admin components
  - `components/ui/` - shadcn/ui components
  - `middleware.ts` - Route protection
