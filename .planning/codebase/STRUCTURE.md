# Codebase Structure

**Analysis Date:** 2026-02-24

## Directory Layout

```
flow/
├── app/                    # Next.js App Router pages and API routes
├── components/             # React components
├── lib/                    # Core utilities, services, and business logic
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── supabase/               # Supabase configuration and migrations
├── scripts/                # One-off scripts
├── references/             # Documentation and references
├── openspec/               # Specification documents
├── docs/                   # Additional documentation
├── issues/                 # Issue tracking
└── .planning/              # Planning artifacts (generated)
```

## Directory Purposes

### `app/`

- **Purpose:** Next.js App Router - pages, layouts, and API routes
- **Contains:**
  - Route groups: `(admin)/`, `(client)/`, `(public)/`
  - API routes: `api/*/route.ts`
  - Root files: `layout.tsx`, `page.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`
- **Key files:**
  - `app/layout.tsx` - Root layout with providers
  - `app/(admin)/admin/layout.tsx` - Admin dashboard shell
  - `app/(client)/client/layout.tsx` - Client portal shell
  - `app/(public)/order/page.tsx` - Public order form

### `components/`

- **Purpose:** React components organized by feature
- **Contains:**
  - `ui/` - Reusable primitive components (buttons, inputs, dialogs)
  - `admin/` - Admin-specific components (sidebar, header, kanban, calendar)
  - `client/` - Client-specific components
  - `dashboard/` - Shared dashboard components (sidebar, header, bento grid)
  - `form-fields/` - Form input components
  - `providers/` - React context providers
  - `shared/` - Cross-cutting components
  - `landing/` - Landing page components
- **Key files:**
  - `components/dashboard/dashboard-sidebar.tsx` - Navigation sidebar
  - `components/admin/admin-sidebar.tsx` - Admin navigation
  - `components/ui/` - Shadcn/ui components

### `lib/`

- **Purpose:** Core business logic, utilities, and integrations
- **Contains:**
  - `auth/` - Authentication functions (client and server)
  - `supabase/` - Supabase client initialization
  - `features/` - Feature modules with queries/mutations
  - `estimation/` - Pricing and time calculation logic
  - `hooks/` - Custom React hooks
  - `api/` - API utilities and helpers
  - `env/` - Environment variable configuration
  - `services/` - External service integrations
  - `utils.ts` - General utilities (cn helper)
  - `constants.ts` - Application constants
- **Key files:**
  - `lib/supabase/server.ts` - Server-side Supabase client
  - `lib/supabase/client.ts` - Client-side Supabase client
  - `lib/features/orders/queries.ts` - Order data fetching
  - `lib/features/orders/mutations.ts` - Order data modifications

### `types/`

- **Purpose:** TypeScript type definitions
- **Contains:**
  - `database.ts` - Generated Supabase database types
  - `index.ts` - Re-exports and domain types
  - `form-config.ts` - Form configuration types
- **Key files:**
  - `types/index.ts` - Domain types like `OrderWithItems`, `OrderStatus`

### `supabase/`

- **Purpose:** Supabase configuration and database schema
- **Contains:** Migration files, schema definitions

## Key File Locations

### Entry Points

- **Landing:** `app/page.tsx` - Marketing homepage
- **Admin Dashboard:** `app/(admin)/admin/dashboard/page.tsx`
- **Client Dashboard:** `app/(client)/client/dashboard/page.tsx`
- **Order Form:** `app/(public)/order/page.tsx`
- **Order Tracking:** `app/(public)/track/[orderId]/page.tsx`

### Configuration

- **Next.js:** `next.config.ts`
- **TypeScript:** `tsconfig.json`
- **Tailwind:** `tailwind.config.ts`
- **ESLint:** `eslint.config.mjs`
- **Prettier:** `.prettierrc`

### API Routes

- **Orders:** `app/api/orders/route.ts` - Create orders
- **Order Status:** `app/api/orders/[orderId]/status/route.ts` - Update status
- **Client Orders:** `app/api/client/orders/route.ts` - Client order management
- **Admin Services:** `app/api/admin/services/route.ts` - Service type CRUD
- **Admin Addons:** `app/api/admin/addons/route.ts` - Add-on CRUD
- **Admin Complexities:** `app/api/admin/complexities/route.ts` - Complexity level CRUD

### Data Access

- **Queries:** `lib/features/*/queries.ts`
- **Mutations:** `lib/features/*/mutations.ts`
- **Estimation:** `lib/estimation/calculate.ts`

## Naming Conventions

### Files

- **Components:** PascalCase with descriptive names (`DashboardSidebar.tsx`, `OrderCard.tsx`)
- **Utilities:** camelCase (`utils.ts`, `use-realtime.ts`)
- **Queries/Mutations:** kebab-case (`orders/queries.ts`, `dashboard-queries.ts`)
- **Types:** PascalCase (`OrderStatus.ts`, `types.ts`)

### Directories

- **Components:** kebab-case (`admin/`, `dashboard/`, `form-fields/`)
- **Features:** kebab-case (`orders/`, `dashboard/`, `form-configuration/`)
- **API Routes:** kebab-case matching URL path (`orders/`, `admin/addons/`)

### Functions

- **Queries:** camelCase with `get` prefix (`getOrders`, `getOrderById`)
- **Mutations:** camelCase action verb (`addProgressLog`, `approveChangeRequest`)
- **Hooks:** camelCase with `use` prefix (`useRealtime`, `useOrderRealtime`)

### Types

- **Database rows:** PascalCase with `Row` suffix (`ProfileRow`, `OrderRow`)
- **Insert types:** PascalCase with `Insert` suffix (`ProfileInsert`, `OrderInsert`)
- **Update types:** PascalCase with `Update` suffix (`ProfileUpdate`, `OrderUpdate`)
- **Domain types:** PascalCase descriptive (`OrderWithItems`, `DashboardStats`)

## Where to Add New Code

### New Feature (Backend + Frontend)

1. **Database:** Add table via Supabase migration in `supabase/`
2. **Types:** Add row/insert/update types in `types/index.ts`
3. **Queries:** Add query functions in `lib/features/[feature]/queries.ts`
4. **Mutations:** Add mutation functions in `lib/features/[feature]/mutations.ts`
5. **API:** Add route handlers in `app/api/[feature]/route.ts`
6. **Components:** Add UI in `components/[feature]/`
7. **Pages:** Add pages in `app/(admin|client|public)/[feature]/page.tsx`

### New Admin Page

- **Location:** `app/(admin)/admin/[page]/page.tsx`
- **Layout:** Uses `app/(admin)/layout.tsx` (admin shell)
- **Data:** Server Component fetches via `lib/features/*/queries.ts`

### New Client Page

- **Location:** `app/(client)/client/[page]/page.tsx`
- **Layout:** Uses `app/(client)/layout.tsx` (client shell)
- **Data:** Server Component fetches via `lib/features/*/queries.ts`

### New Public Page

- **Location:** `app/(public)/[page]/page.tsx`
- **Layout:** No auth-required layout
- **Data:** Server Component fetches via public-safe queries

### New API Endpoint

- **Location:** `app/api/[feature]/route.ts` or `app/api/[feature]/[id]/route.ts`
- **Pattern:** Use Zod for validation, handle errors with try-catch

### New Component

- **UI Primitives:** `components/ui/` (shadcn/ui style)
- **Feature Component:** `components/[feature]/`
- **Dashboard Component:** `components/dashboard/`

### New Utility

- **General:** `lib/utils.ts` (if small) or `lib/[utility].ts`
- **Hook:** `lib/hooks/use-[name].ts`
- **Calculation:** `lib/estimation/[name].ts`

## Special Directories

### `.planning/`

- **Purpose:** GSD planning artifacts
- **Generated:** Yes by GSD commands
- **Committed:** No (should be in .gitignore)

### `.next/`

- **Purpose:** Next.js build output
- **Generated:** Yes (`next build`)
- **Committed:** No

### `node_modules/`

- **Purpose:** npm dependencies
- **Generated:** Yes (`npm install`/`pnpm install`)
- **Committed:** No

### `supabase/`

- **Purpose:** Database migrations and config
- **Generated:** No (authored)
- **Committed:** Yes

### `public/`

- **Purpose:** Static assets (images, fonts)
- **Generated:** No
- **Committed:** Yes

---

_Structure analysis: 2026-02-24_
