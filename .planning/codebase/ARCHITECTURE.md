# Architecture

**Analysis Date:** 2026-02-24

## Pattern Overview

**Overall:** Next.js App Router with Feature-Based Architecture

**Key Characteristics:**

- **Route Groups with Layouts:** Uses Next.js route groups `(admin)`, `(client)`, `(public)` for separate layouts and access patterns
- **Feature-First Organization:** Business logic organized in `lib/features/[feature]/` with queries and mutations
- **Server-First Data Fetching:** Server components fetch data directly via Supabase server client
- **Role-Based Access Control:** Middleware enforces admin/client role separation at the edge

## Layers

### UI Layer: `components/`

- **Purpose:** React components for rendering
- **Location:** `components/`
- **Contains:** Reusable UI primitives (`components/ui/`), feature components (`components/dashboard/`, `components/admin/`, `components/client/`), form fields
- **Depends on:** Types from `types/`, utilities from `lib/`
- **Used by:** Pages in `app/`

### Route Layer: `app/`

- **Purpose:** Next.js App Router pages and API endpoints
- **Location:** `app/`
- **Contains:**
  - Pages: `app/(admin)/admin/*`, `app/(client)/client/*`, `app/(public)/*`
  - API Routes: `app/api/*/route.ts`
  - Layouts: `app/layout.tsx`, `app/(admin)/layout.tsx`, `app/(client)/layout.tsx`
- **Depends on:** `lib/features/`, `lib/supabase/`, `types/`
- **Used by:** HTTP requests, browser navigation

### Business Logic Layer: `lib/features/`, `lib/estimation/`

- **Purpose:** Domain logic, queries, mutations, and calculations
- **Location:** `lib/features/orders/`, `lib/features/dashboard/`, `lib/estimation/`
- **Contains:**
  - Queries: `getOrders`, `getOrderById`, `getDashboardStats`
  - Mutations: `addProgressLog`, `approveChangeRequest`, `rejectChangeRequest`
  - Calculations: `calculateOrderTotal`, `calculateItemPrice`
- **Depends on:** `lib/supabase/`, `types/`
- **Used by:** Route handlers, client components via React Query

### Data Layer: `lib/supabase/`, `types/`

- **Purpose:** Database client initialization and type definitions
- **Location:** `lib/supabase/client.ts`, `lib/supabase/server.ts`, `types/database.ts`
- **Contains:**
  - Server client: `createClient()` for Server Components and API routes
  - Browser client: `createClient()` for Client Components
  - Admin client: `createAdminClient()` for privileged operations
  - Generated types from Supabase schema
- **Used by:** All layers requiring database access

## Data Flow

### Public Order Creation Flow:

1. User fills form on `app/(public)/order/page.tsx`
2. Form submits to `app/api/orders/route.ts` (POST)
3. API validates with Zod schema from `lib/features/orders/form-schema.ts`
4. API calculates pricing via `lib/estimation/calculate.ts`
5. API creates order in Supabase via `lib/supabase/server.ts`
6. Returns order ID to client
7. Redirects to `app/(public)/order/success/[orderId]/page.tsx`

### Authenticated Dashboard Flow:

1. User navigates to `/admin` or `/client`
2. `middleware.ts` intercepts request
3. Middleware verifies Supabase session and profile role
4. Admin routes require `role === "admin"`, client routes require `role === "client"`
5. Page loads with Server Component fetching data via `lib/features/*/queries.ts`
6. Real-time updates via `lib/hooks/use-realtime.ts` subscription

### Order Tracking Flow:

1. Public user visits `app/(public)/track/[orderId]/page.tsx`
2. Server Component calls `getOrderByIdForPublic` from `lib/features/orders/queries.ts`
3. Returns sanitized data (excludes sensitive fields)
4. Supabase Realtime subscribes to `progress_logs` table for live updates

## Key Abstractions

### Queries (Server-Side Data Fetching):

- **Purpose:** Fetch data from Supabase in Server Components
- **Examples:**
  - `lib/features/orders/queries.ts` - `getOrders()`, `getOrderById()`, `getOrderByIdForPublic()`
  - `lib/features/dashboard/queries.ts` - `getDashboardStats()`, `getRecentActivity()`
- **Pattern:** Async functions returning typed data or null

### Mutations (Data Modifications):

- **Purpose:** Modify data in Supabase (inserts, updates, deletes)
- **Examples:**
  - `lib/features/orders/mutations.ts` - `addProgressLog()`, `approveChangeRequest()`, `uploadProgressPhoto()`
- **Pattern:** Async functions returning `{ success: boolean; error?: string }`

### React Query Integration:

- **Purpose:** Client-side caching and optimistic updates
- **Examples:** `lib/hooks/use-service-configuration.ts`
- **Pattern:** Custom hooks wrapping TanStack Query for specific features

### Real-time Subscriptions:

- **Purpose:** Live updates when database changes
- **Examples:** `lib/hooks/use-realtime.ts` - `useRealtimeSubscription()`, `useOrderRealtime()`
- **Pattern:** Supabase Postgres changes subscription with fallback polling

### Estimation/Calculation:

- **Purpose:** Business logic for pricing and time estimates
- **Examples:** `lib/estimation/calculate.ts` - `calculateOrderTotal()`, `calculateItemPrice()`
- **Pattern:** Pure functions taking input data, returning computed values

## Entry Points

### Root Layout:

- **Location:** `app/layout.tsx`
- **Triggers:** Every page request
- **Responsibilities:**
  - Wrap app with providers: `QueryProvider`, `ThemeProvider`
  - Include global styles: `globals.css`
  - Add fonts via `next/font/google`
  - Include `Analytics` component

### Middleware:

- **Location:** `middleware.ts`
- **Triggers:** Every request to protected routes
- **Responsibilities:**
  - CORS handling for API routes
  - Session verification via Supabase
  - Role-based redirect (admin → `/admin`, client → `/client`)
  - Auth guard for `/admin/*` and `/client/*`

### API Routes:

- **Location:** `app/api/*/route.ts`
- **Triggers:** HTTP requests to `/api/*`
- **Responsibilities:**
  - Request validation with Zod
  - Business logic execution
  - Database operations via Supabase
  - JSON response formation

### Route Groups:

- `(admin)`: `app/(admin)/admin/*` - Admin dashboard pages
- `(client)`: `app/(client)/client/*` - Client portal pages
- `(public)`: `app/(public)/*` - Public marketing and tracking pages

## Error Handling

**Strategy:** Layered error handling with try-catch and Next.js error boundaries

**Patterns:**

- API Routes: `try-catch` returning `NextResponse.json({ error: "..." }, { status: 500 })`
- Database Errors: Logged via `console.error()`, return user-friendly messages
- Form Validation: Zod schema validation returning 400 with detailed errors
- Client Components: React Hook Form with Zod resolver, toast notifications via `sonner`
- Global Error Boundary: `app/error.tsx` catches errors in child routes

## Cross-Cutting Concerns

**Authentication:** Supabase Auth with middleware enforcement

- Client auth: `lib/auth/client.ts` - login, signup, logout, OAuth
- Server auth: `lib/auth/server.ts` - session management
- Middleware: `middleware.ts` - route protection by role

**Validation:**

- Zod schemas in `lib/features/*/form-schema.ts` and `lib/estimation/validation.ts`
- Server-side validation in API routes
- Client-side validation via `react-hook-form` with Zod resolver

**Environment:**

- Server env: `lib/env/server.ts` - secrets not exposed to client
- Client env: `lib/env/client.ts` - public variables only

**State Management:**

- Server state: Server Components with async data fetching
- Client state: React Query for server state cache
- UI state: React `useState` for local component state

---

_Architecture analysis: 2026-02-24_
