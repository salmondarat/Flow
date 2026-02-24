# Technology Stack

**Analysis Date:** 2026-02-24

## Languages

**Primary:**

- TypeScript 5.7.3 - Type-safe JavaScript for entire codebase
- JavaScript (ES2022) - Runtime target

**Styling:**

- CSS - Tailwind CSS 4.0 with custom design system

## Runtime

**Environment:**

- Node.js 22.x (likely - using latest stable)
- Next.js 15.x (React 19 runtime)

**Package Manager:**

- pnpm 9.x
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**

- Next.js 15.1.6 - Full-stack React framework with App Router
- React 19.0.0 - UI library

**Styling:**

- Tailwind CSS 4.0.0 - Utility-first CSS framework
- tailwindcss-animate 1.0.7 - Animation utilities for Tailwind

**UI Components:**

- Radix UI 1.x - Unstyled, accessible component primitives
  - `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-accordion`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-label`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-progress`, `@radix-ui/react-separator`, `@radix-ui/react-slot`
- Lucide React 0.563.0 - Icon library
- Framer Motion 12.30.0 - Animation library
- clsx 2.1.1 - Utility for constructing className strings
- tailwind-merge 3.4.0 - Utility to merge Tailwind CSS classes

**Form Handling:**

- React Hook Form 7.71.1 - Form state management
- Zod 3.24.1 - Schema validation
- @hookform/resolvers 5.2.2 - Zod resolvers for React Hook Form

**Data Fetching:**

- @tanstack/react-query 5.90.20 - Async state management
- @tanstack/react-query-devtools 5.91.2 - React Query devtools

**State & Theming:**

- next-themes 0.4.6 - Dark/light mode theming
- tw-animate-css 1.4.0 - CSS animations

**Charts:**

- Recharts 3.7.0 - Data visualization

**Utilities:**

- date-fns 4.1.0 - Date manipulation
- nanoid 5.1.6 - Unique ID generation
- sonner 2.0.7 - Toast notifications

## Testing

**Test Runner:**

- Vitest 3.0.5 - Unit testing
- Playwright 1.50.0 - E2E testing

**Testing Utilities:**

- @playwright/test - Playwright test runner

## Build & Development

**Build:**

- Vite 6.0.11 - Next.js uses Turbopack for dev, Vite for testing
- TypeScript 5.7.3 - Type checking

**Code Quality:**

- ESLint 9.17.0 - Linting
- Prettier 3.4.2 - Code formatting
- prettier-plugin-tailwindcss 0.6.11 - Tailwind class sorting
- eslint-config-prettier 9.1.0 - Prettier ESLint integration
- eslint-plugin-react 7.37.4 - React-specific linting
- eslint-plugin-react-hooks 5.1.0 - React Hooks linting
- eslint-plugin-react-refresh 0.4.18 - React refresh compatibility

**Deployment:**

- Vercel 50.17.1 - Vercel SDK and CLI
- @vercel/analytics 1.6.1 - Analytics

## Database & Backend

**Database:**

- Supabase (PostgreSQL) - Backend-as-a-Service
  - @supabase/ssr 0.6.1 - Server-side Supabase utilities
  - @supabase/supabase-js 2.39.0 - Supabase JavaScript client

**Database Schema:**

- Tables: profiles, orders, order_items, change_requests, progress_logs, service_types, complexity_levels, service_complexities, service_addons, form_templates, status_transitions

## Configuration

**Environment:**

- Zod 3.24.1 - Environment variable validation (in `lib/env/server.ts`, `lib/env/client.ts`)
- dotenv 17.2.3 - Environment variable loading

**Build Configuration:**

- `tsconfig.json` - TypeScript configuration with path alias `@/*`
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc` - Prettier configuration

**Path Aliases:**

- `@/*` maps to project root

## Platform Requirements

**Development:**

- Node.js 22.x
- pnpm 9.x
- Local Supabase instance (via `supabase` CLI or hosted)

**Production:**

- Vercel deployment (inferred from `vercel.json` and @vercel/analytics)
- Vercel region: iad1 (US East)
- Supabase hosted project

---

_Stack analysis: 2026-02-24_
