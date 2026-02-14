# Tasks: Configurable Client Orders

## Phase 1: Authentication & Client Profiles

### 1.1 Database Schema Updates

- [x] Extend `profiles` table with client-specific fields (phone, address)
- [x] Add unique constraint on profiles.email
- [x] Create `status_transitions` table for workflow validation
- [x] Add indexes for client-related queries
- [x] Update RLS policies for client role access

### 1.2 Authentication API

- [x] Create `/api/auth/register` endpoint for client registration
- [x] Implement registration validation (email unique, phone format)
- [x] Create `/api/auth/me` endpoint to get current user profile
- [x] Add role checking middleware for client routes

### 1.3 Client Authentication UI

- [x] Create `/client/register` page with registration form
- [x] Create `/client/login` page (reuse or adapt from admin login)
- [x] Add role-based redirect (admin logging via client login → admin dashboard)
- [x] Create `/client/profile` page for viewing and updating profile
- [ ] Add change password functionality

### 1.4 Client Route Protection

- [x] Create middleware for `/client/*` route protection
- [x] Implement redirect logic for unauthenticated clients
- [x] Add post-login redirect to original destination
- [x] Prevent admins from accessing client routes

## Phase 2: Form Configuration System

### 2.1 Database Schema for Form Templates

- [x] Create `form_templates` table with JSONB config column
- [x] Add `form_template_id` and `form_template_version` to orders table
- [x] Create RLS policies for form_templates (admin only)
- [x] Add indexes for form template queries

### 2.2 Form Template Types & Validation

- [x] Define TypeScript interfaces for FormTemplate, FormStep, FormField
- [x] Create Zod schemas for form template validation
- [x] Define FieldType union (text, textarea, select, checkbox, number, file)
- [x] Create ServiceConfig and PricingConfig types

### 2.3 Form Template API

- [x] Create `GET /api/form-templates` - List all templates (admin)
- [x] Create `GET /api/form-templates/[id]` - Get single template (admin)
- [x] Create `POST /api/form-templates` - Create template (admin)
- [x] Create `PUT /api/form-templates/[id]` - Update template (admin)
- [x] Create `DELETE /api/form-templates/[id]` - Soft delete template (admin)
- [x] Implement template versioning on update

### 2.4 Admin Form Builder UI

- [x] Create `/admin/settings/form-templates` page
- [x] Build form template list with create/edit/delete actions
- [x] Create form template builder component with step management
- [x] Build field configuration components for each field type
- [ ] Add drag-and-drop for step reordering
- [x] Implement service and pricing configuration UI
- [x] Add form template preview modal

## Phase 3: Dynamic Form Rendering

### 3.1 Form Field Component Registry

- [x] Create base FieldProps interface
- [x] Implement TextField component
- [x] Implement TextareaField component
- [x] Implement SelectField component
- [x] Implement CheckboxField component
- [x] Implement NumberField component
- [x] Implement FileField component for reference images

### 3.2 Dynamic Form Engine

- [x] Create FormFieldRenderer component
- [x] Build DynamicForm component with multi-step support
- [x] Implement form state management (values, errors, current step)
- [x] Add validation based on field configuration
- [x] Implement progress indicator for multi-step form

### 3.3 Form Template Integration

- [x] Create hook to fetch default form template
- [x] Update order creation to use template configuration
- [x] Implement backward compatibility for orders without templates

## Phase 4: Client Portal - Order Creation

### 4.1 Client New Order Page

- [x] Create `/client/orders/new` page
- [x] Integrate DynamicForm with order template
- [x] Add kit management (add, remove, edit)
- [x] Implement service selection per kit
- [x] Add complexity selection with real-time price preview
- [x] Add notes and reference image upload per kit

### 4.2 Reference Image Upload

- [x] Set up Supabase Storage bucket for reference images
- [x] Create upload API endpoint with client validation
- [x] Implement image upload component
- [x] Add image preview thumbnails
- [x] Enforce limits (5 images per kit, 5MB per image)
- [x] Create temporary file upload for form fields

### 4.3 Order Creation API (Client)

- [x] Create `POST /api/client/orders` endpoint
- [ ] Validate order data against form template
- [x] Set client_id to authenticated user
- [x] Save order with status "draft"
- [x] Handle draft saving vs final submission

### 4.4 Order Submission Flow

- [x] Create success page after order submission
- [x] Show order ID and tracking information
- [ ] Send confirmation notification to client
- [x] Redirect to order details page

## Phase 5: Client Portal - Order Management

### 5.1 Client Dashboard

- [x] Create `/client/dashboard` page
- [x] Build summary cards (total, active, pending, completed orders)
- [x] Show recent orders list
- [x] Add quick action button for new order

### 5.2 Client Orders List

- [x] Create `/client/orders` page
- [x] Display all client orders with cards/table
- [x] Add status filter
- [x] Add search by kit name
- [x] Show order status badge, kits count, price, dates

### 5.3 Client Order Details

- [x] Create `/client/orders/[orderId]` page
- [x] Display order information header
- [x] Show order status progress indicator
- [x] Display all kits with services and complexity
- [ ] Show reference images for each kit
- [x] Show estimated price and time breakdown
- [x] Add access control (only own orders)

### 5.4 Order Approval

- [x] Add "Approve Order" button for "estimated" status orders
- [x] Create `POST /api/client/orders/[id]/approve` endpoint
- [x] Update order status to "approved"
- [x] Show confirmation message

### 5.5 Order Cancellation

- [x] Add "Cancel Order" button for cancellable statuses
- [x] Create `POST /api/client/orders/[id]/cancel` endpoint
- [x] Handle cancellation reason input
- [x] Update order status to "cancelled"
- [x] Show confirmation message

## Phase 6: Change Requests & Client Feedback

### 6.1 Change Request Submission

- [x] Add "Request Change" button on client order details
- [x] Create change request form with kit selection
- [x] Add service modification options
- [x] Implement description input
- [ ] Add optional reference image upload
- [x] Create `POST /api/client/orders/[id]/change-requests` endpoint
- [x] Calculate price/time impact

### 6.2 Change Request Viewing (Client)

- [ ] Display change requests on order details page
- [ ] Show request status (pending, approved, rejected)
- [ ] Display price/time impact when approved
- [ ] Show admin response message

### 6.3 Client Notes/Feedback

- [ ] Add "Add Note" button on order details
- [ ] Create note input form with optional image
- [ ] Create `POST /api/client/orders/[id]/notes` endpoint
- [ ] Display notes in activity feed on order details

### 6.4 Admin Change Request Handling

- [ ] Update admin order details to show pending change requests
- [ ] Add "Approve" and "Reject" buttons
- [ ] Implement approve logic with price/time update
- [ ] Implement reject logic with reason
- [ ] Update orders-management API to handle change requests

## Phase 7: Real-time Synchronization

### 7.1 Supabase Realtime Setup

- [ ] Enable Realtime for orders, progress_logs, change_requests tables
- [x] Create realtime subscription hook
- [ ] Implement connection state management

### 7.2 Live Order Updates

- [ ] Subscribe to order changes on order details page
- [ ] Update status badge in real-time
- [ ] Show notification on status change
- [ ] Handle subscription cleanup on unmount

### 7.3 Live Progress Updates

- [ ] Subscribe to progress_logs changes
- [ ] Display new progress photos immediately
- [ ] Show notification on new progress

### 7.4 Live Change Request Updates

- [ ] Subscribe to change_requests changes
- [ ] Update change request status in real-time
- [ ] Refresh estimation when change request approved

### 7.5 Fallback Polling

- [x] Implement polling fallback when Realtime unavailable
- [ ] Add connection status indicator
- [ ] Handle reconnection logic

### 7.6 Notification System

- [ ] Create notification center component
- [ ] Store notifications in state/context
- [ ] Display notification toast/badge
- [ ] Implement notification click to navigate to related order

## Phase 8: Admin Dashboard Updates

### 8.1 Client Information Display

- [x] Update order details to show client info
- [x] Add link to client profile
- [ ] Show order source (client portal vs public form)
- [x] Add "View Client's Orders" link

### 8.2 Admin Notifications

- [ ] Show notification when new client order created
- [ ] Show notification when client approves order
- [ ] Show notification when client submits change request
- [ ] Show notification when client adds note

### 8.3 Orders List Enhancements

- [x] Add "Client" column to orders list
- [ ] Add filter by client
- [ ] Show order source indicator

### 8.4 Client Profile View (Admin)

- [x] Create `/admin/clients/[clientId]` page
- [x] Display client information
- [x] Show all client orders
- [x] Show client statistics

## Phase 9: Testing & Validation

### 9.1 Unit Tests

- [ ] Test form config validation
- [ ] Test estimation calculations with template pricing
- [ ] Test status transition validation
- [ ] Test client registration validation
- [ ] Test change request price calculation

### 9.2 Integration Tests

- [ ] Test client registration and login flow
- [ ] Test order creation with dynamic form
- [ ] Test order approval flow
- [ ] Test change request submission and approval

### 9.3 E2E Tests

- [ ] Test client creates order, admin reviews, client approves
- [ ] Test change request workflow end-to-end
- [ ] Test real-time sync between admin and client views
- [ ] Test order cancellation flow

### 9.4 Security Testing

- [ ] Verify RLS policies for client isolation
- [ ] Test file upload restrictions
- [ ] Verify role-based route protection
- [ ] Test rate limiting

## Phase 10: Deployment & Documentation

### 10.1 Deployment Preparation

- [ ] Update environment variables documentation
- [ ] Create database migration scripts
- [ ] Test Supabase Realtime in production
- [ ] Verify storage bucket permissions

### 10.2 Documentation

- [ ] Update README with client portal information
- [ ] Document form template configuration
- [ ] Create user guide for client portal
- [ ] Update API documentation

### 10.3 Monitoring

- [ ] Set up error tracking for client portal
- [ ] Monitor Realtime connection health
- [ ] Track form template usage
- [ ] Monitor file upload storage usage
