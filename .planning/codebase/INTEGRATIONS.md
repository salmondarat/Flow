# External Integrations

**Analysis Date:** 2026-02-24

## APIs & External Services

**Database Backend:**

- Supabase (PostgreSQL) - Primary database and backend service
  - SDK: `@supabase/supabase-js` 2.39.0
  - Server SDK: `@supabase/ssr` 0.6.1
  - Tables: profiles, orders, order_items, change_requests, progress_logs, service_types, complexity_levels, service_complexities, service_addons, form_templates, status_transitions
  - Auth: Supabase Auth (email/password)
  - Connection: Uses `@supabase/ssr` for server-side, `@supabase/supabase-js` for client-side

**Analytics:**

- Vercel Analytics - Web analytics
  - SDK: `@vercel/analytics` 1.6.1
  - Implementation: Client-side analytics injection

**Image Storage:**

- External image domains configured in `next.config.ts`:
  - `images.unsplash.com` - Stock images
  - `i.pravatar.cc` - Avatar images

## Data Storage

**Database:**

- Supabase PostgreSQL
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` (public), `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - Client: `@supabase/supabase-js`
  - Schema: See `types/database.ts` for full type definitions
  - Migrations: `supabase/migrations/` directory

**File Storage:**

- Supabase Storage (implied for uploaded files)
  - Endpoints: `/api/upload/temp-files`, `/api/upload/reference-images`
  - Used for: Temporary files and reference images in orders

**Caching:**

- None detected - uses React Query for client-side cache

## Authentication & Identity

**Auth Provider:**

- Supabase Auth
  - Implementation: `@supabase/ssr` with cookie-based sessions
  - Server client: `lib/supabase/server.ts`
  - Browser client: `lib/supabase/client.ts`
  - Middleware: `middleware.ts` handles route protection
  - Roles: "admin", "client" (defined in `types/database.ts`)
  - Protected routes:
    - `/admin/*` - Admin role required
    - `/client/*` - Client role required
    - `/auth` - Unified auth page (redirects unauthenticated users)

**Session Management:**

- Cookie-based sessions via Supabase SSR
- Middleware validates authentication on protected routes
- Profile table links to Supabase Auth users

## Monitoring & Observability

**Error Tracking:**

- None explicitly configured

**Logs:**

- Console logging in development mode
- Middleware logs user ID and profile data in development

## CI/CD & Deployment

**Hosting:**

- Vercel
  - Config: `vercel.json`
  - Framework: Next.js
  - Region: iad1 (US East)
  - Build command: `pnpm run build`
  - Install command: `pnpm install`
  - Dev command: `pnpm run dev`

**CI Pipeline:**

- Vercel automatic deployments
- ESLint and TypeScript checks in build

## Environment Configuration

**Required env vars:**

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret, server-only)
- `NEXT_PUBLIC_APP_URL` - Application URL (optional, defaults to http://localhost:3000)

**Environment Validation:**

- Server env: `lib/env/server.ts` - Validates required server variables with Zod
- Client env: `lib/env/client.ts` - Exposes public variables

**Secrets location:**

- Environment variables in `.env.local` (not committed)
- Template in `.env.example`

## Webhooks & Callbacks

**API Routes:**

- RESTful API endpoints in `app/api/`:
  - `/api/auth/me` - Current user info
  - `/api/auth/register` - User registration
  - `/api/orders` - Order management
  - `/api/orders/[orderId]/status` - Order status
  - `/api/admin/*` - Admin CRUD operations (services, addons, complexities)
  - `/api/client/orders/*` - Client order operations
  - `/api/form-templates/*` - Form template management
  - `/api/upload/*` - File upload endpoints

**CORS:**

- Custom CORS middleware in `lib/api/middleware-cors.ts`
- Applied to all API routes via middleware
- Allows all origins (`*`) with standard methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)

## Key Integration Files

**Supabase Client Setup:**

- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/client.ts` - Browser-side Supabase client
- `lib/supabase/admin.ts` - Admin-level Supabase client (service role)
- `middleware.ts` - Authentication middleware with route protection

**Type Definitions:**

- `types/database.ts` - Full Supabase database types

---

_Integration audit: 2026-02-24_
