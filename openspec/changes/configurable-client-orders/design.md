# Configurable Client Orders - Design Document

## Overview

This document describes the architectural design for implementing configurable order forms and a client portal with real-time synchronization between clients and admins.

## Architecture Decisions

### 1. Form Configuration System

#### Decision: JSON-based Form Templates

We will store form templates as JSON configurations in the database rather than hardcoding forms. This allows admins to customize forms without code changes.

**Structure:**

```typescript
interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  version: number;
  steps: FormStep[];
  serviceConfig: ServiceConfig;
  pricingConfig: PricingConfig;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // admin user id
}

interface FormStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  key: string; // e.g., "client_name", "kit_grade"
  type: FieldType; // text, textarea, select, checkbox, number, file
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string; // regex
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    customMessage?: string;
  };
  options?: string[]; // for select fields
  defaultValue?: any;
}
```

**Database Schema:**

```sql
-- Form templates table
CREATE TABLE form_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  config JSONB NOT NULL, -- Contains steps, fields, services, pricing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Orders link to form templates
ALTER TABLE orders ADD COLUMN form_template_id UUID REFERENCES form_templates(id);
ALTER TABLE orders ADD COLUMN form_template_version INTEGER;
```

**Trade-offs:**

- **Pros:** Maximum flexibility, no code changes needed for form updates
- **Cons:** More complex validation logic, need careful JSON schema validation
- **Mitigation:** Use Zod schemas to validate form config at runtime

### 2. Client Authentication

#### Decision: Extend Supabase Auth with Role-based Profiles

We will use Supabase Auth for authentication and extend the existing `profiles` table to support client roles.

**Database Schema:**

```sql
-- Existing profiles table extended
ALTER TABLE profiles ADD COLUMN UNIQUE (email);
ALTER TABLE profiles ADD COLUMN phone TEXT;
ALTER TABLE profiles ADD COLUMN address TEXT;

-- Client-specific data can be added to orders via client_id
-- No separate clients table needed - use profiles with role='client'
```

**Authentication Flow:**

```
Client Registration:
1. POST /api/auth/register with email, password, name, phone
2. Create Supabase Auth user
3. Create profile record with role='client'
4. Return session

Client Login:
1. POST /api/auth/login or use Supabase client.auth.signInWithPassword
2. Supabase handles session creation
3. Middleware checks role for route access
```

**Trade-offs:**

- **Pros:** Leverages existing Supabase Auth infrastructure, secure
- **Cons:** Client accounts count toward Supabase auth limits
- **Mitigation:** Supabase free tier allows up to 50,000 users, sufficient for MVP

### 3. Real-time Synchronization

#### Decision: Supabase Realtime for Live Updates

We will use Supabase Realtime (PostgreSQL changes) for instant synchronization between admin and client views.

**Implementation:**

```typescript
// Subscribe to order changes
const channel = supabase
  .channel(`order-${orderId}`)
  .on(
    "postgres_changes",
    {
      event: "*", // INSERT, UPDATE, DELETE
      schema: "public",
      table: "orders",
      filter: `id=eq.${orderId}`,
    },
    (payload) => {
      // Handle order update
      if (payload.eventType === "UPDATE") {
        const newStatus = payload.new.status;
        // Update UI, show notification
      }
    }
  )
  .subscribe();

// Also listen for related tables (progress_logs, change_requests)
```

**Fallback for Realtime Unavailable:**

```typescript
// Poll every 10 seconds as fallback
useEffect(() => {
  const interval = setInterval(async () => {
    await refetchOrder();
  }, 10000);
  return () => clearInterval(interval);
}, []);
```

**Trade-offs:**

- **Pros:** Native Supabase integration, efficient (no polling overhead)
- **Cons:** Requires connection state management, may need fallbacks
- **Mitigation:** Implement graceful fallback to polling

### 4. Dynamic Form Rendering

#### Decision: Component Registry Pattern

We will create a registry of form field components that render based on the field type in the template configuration.

**Implementation:**

```typescript
// lib/features/form-configuration/field-components.tsx
const fieldComponents: Record<FieldType, React.ComponentType<FieldProps>> = {
  text: TextField,
  textarea: TextareaField,
  select: SelectField,
  checkbox: CheckboxField,
  number: NumberField,
  file: FileField,
  // Add more as needed
};

// Dynamic renderer
function FormFieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const Component = fieldComponents[field.type];
  return <Component field={field} value={value} onChange={onChange} error={error} />;
}

// Multi-step form
function DynamicForm({ template, onSubmit }: FormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, any>>({});

  const step = template.steps[currentStep];

  return (
    <form onSubmit={handleSubmit}>
      {step.fields.map(field => (
        <FormFieldRenderer
          key={field.id}
          field={field}
          value={values[field.key]}
          onChange={(v) => setValues({...values, [field.key]: v})}
        />
      ))}
      <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
      <Button type="submit">
        {currentStep < template.steps.length - 1 ? 'Next' : 'Submit'}
      </Button>
    </form>
  );
}
```

**Trade-offs:**

- **Pros:** Extensible, type-safe, follows React patterns
- **Cons:** Initial complexity in component registry
- **Mitigation:** Start with basic field types, add more as needed

### 5. Order Status Workflow Updates

#### Decision: Client-triggered Status Changes

We will add client-triggered status transitions to the existing workflow while maintaining admin control.

**Updated Status Flow:**

```
Draft (client-created) -> Estimated (admin reviews) -> Approved (client approves) ->
In Progress (admin starts) -> Completed (admin finishes)

At any point: Cancelled (client or admin)

Change Request: Pending (client) -> Approved/Rejected (admin)
```

**Database Constraint for Valid Transitions:**

```sql
CREATE TABLE status_transitions (
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  allowed_role TEXT NOT NULL, -- 'admin', 'client', 'both'
  PRIMARY KEY (from_status, to_status, allowed_role)
);

-- Valid transitions
INSERT INTO status_transitions VALUES
  ('draft', 'estimated', 'admin'),
  ('draft', 'cancelled', 'both'),
  ('estimated', 'approved', 'client'),
  ('estimated', 'cancelled', 'both'),
  ('approved', 'in_progress', 'admin'),
  ('in_progress', 'completed', 'admin'),
  ('in_progress', 'cancelled', 'both');
```

### 6. File Upload for Reference Images

#### Decision: Supabase Storage with Per-Client Buckets

We will use Supabase Storage with RLS policies to ensure clients can only upload to their own order folders.

**Storage Structure:**

```
order-reference-images/
  {orderId}/
    {kitId}/
      {imageId}.jpg
```

**RLS Policy:**

```sql
-- Clients can upload to their own orders
CREATE POLICY "Clients can upload reference images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-reference-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id FROM orders WHERE client_id = auth.uid()
  )
);

-- Admins can view all
CREATE POLICY "Admins can view all reference images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-reference-images'
  AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
```

## Security Considerations

### 1. Row Level Security (RLS)

- **Orders:** Clients can only see orders where `client_id = auth.uid()`
- **Form Templates:** Only admins can create/edit templates
- **Profiles:** Clients can only update their own profile

### 2. Input Validation

- Form template configs validated against schema before saving
- All client inputs sanitized and validated via Zod
- File upload limits: 5 images per kit, 5MB per image

### 3. Rate Limiting

- Order creation: 5 per hour per client
- Change request: 10 per hour per client
- Login attempts: Standard Supabase Auth rate limits

## Performance Considerations

### 1. Database Indexes

```sql
-- For client order queries
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_client_status ON orders(client_id, status);

-- For form template lookups
CREATE INDEX idx_form_templates_is_default ON form_templates(is_default) WHERE deleted_at IS NULL;

-- For change requests
CREATE INDEX idx_change_requests_order_status ON change_requests(order_id, status);
```

### 2. Realtime Connection Management

- Subscribe only to currently viewed order
- Unsubscribe when navigating away
- Implement connection status indicator in UI

### 3. Caching Strategy

- Form templates: Cache in React Query with 5-minute stale time
- Client orders: No cache (real-time preferred)
- Pricing calculations: Memoized in estimation.ts

## Testing Strategy

### 1. Unit Tests

- Form config validation
- Estimation calculations with template-based pricing
- Status transition validation

### 2. Integration Tests

- Client registration and login flow
- Order creation with dynamic form
- Change request approval workflow

### 3. E2E Tests

- Client creates order, admin approves, client views progress
- Change request submission and approval
- Real-time sync verification

## Implementation Phases

### Phase 1: Authentication & Profiles (Week 1)

- Extend profiles table for client role
- Client registration and login
- Client profile management
- RLS policies for client data access

### Phase 2: Form Configuration (Week 2)

- Form templates database and API
- Admin form builder UI
- Dynamic form rendering
- Template versioning

### Phase 3: Client Portal - Order Creation (Week 3)

- Client new order form using templates
- Order creation API with client linking
- Reference image uploads
- Order submission and draft saving

### Phase 4: Client Portal - Order Management (Week 4)

- Client dashboard
- Order list and details views
- Approve order functionality
- Cancel order functionality

### Phase 5: Change Requests & Feedback (Week 5)

- Client change request submission
- Admin change request handling
- Client notes/feedback
- Change request status sync

### Phase 6: Real-time Synchronization (Week 6)

- Supabase Realtime integration
- Live status updates
- Live progress photo updates
- Notification system
- Polling fallback

## Open Questions

1. **Should we implement email verification for client registration?**
   - Recommendation: Yes, to prevent spam accounts and ensure valid contact info

2. **Should clients be able to edit orders after submission (before admin review)?**
   - Recommendation: Yes, allow editing of "draft" status orders

3. **Should we implement WhatsApp notifications in addition to in-app notifications?**
   - Recommendation: Out of scope for MVP, consider for Phase 2

4. **How should we handle orders created via public form (unauthenticated)?**
   - Recommendation: Keep as-is (client_id is NULL), offer client to "claim" the order by registering and verifying phone/email

## Dependencies

- Requires existing orders-management spec fully implemented
- Requires existing database schema (orders, order_items, progress_logs, change_requests)
- Requires Supabase project configured with Auth and Storage
- Requires Supabase Realtime enabled for the project
