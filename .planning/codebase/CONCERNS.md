# Codebase Concerns

**Analysis Date:** 2026-02-24

## Tech Debt

**Type Safety - Type Assertions:**

- Issue: 19 TODO comments referencing "Remove type assertion after migration is run" scattered across `lib/api/services.ts`, `lib/api/complexities.ts`, `lib/api/addons.ts`, and `lib/services/pricing.ts`
- Files: `lib/api/services.ts` (lines 94-219), `lib/api/complexities.ts` (lines 171-312), `lib/api/addons.ts` (lines 112-246), `lib/services/pricing.ts` (lines 64-338)
- Impact: Database schema does not match TypeScript types; runtime errors possible if migrations not applied
- Fix approach: Run pending Supabase migrations and update types in `types/database.ts`

**Type Safety - `as any` Type Casts:**

- Issue: 25 occurrences of `as any` type casts in API routes, bypassing TypeScript's type checking
- Files: `app/api/orders/route.ts` (lines 38-40), `app/api/auth/register/route.ts` (lines 30-100), `app/api/client/orders/route.ts` (lines 20-99), and 7 other API route files
- Impact: Silent runtime errors possible; database errors not caught at compile time
- Fix approach: Update `types/database.ts` with proper Insert/Update types, then remove `as any` casts

**No Test Coverage:**

- Issue: No test files found in the entire codebase (no `*.test.*` or `*.spec.*` files)
- Files: Entire codebase
- Impact: Bugs can be introduced without detection; refactoring is risky
- Fix approach: Add Jest or Vitest with unit tests for utility functions, integration tests for API routes

## Known Bugs

**CORS Wildcard Configuration:**

- Issue: Middleware sets `Access-Control-Allow-Origin: '*'` for all API routes
- Files: `middleware.ts` (line 12)
- Trigger: Any cross-origin API request
- Workaround: None - this is a security misconfiguration for production

## Security Considerations

**Excessive Debug Logging:**

- Risk: User IDs and sensitive profile data logged in production code
- Files: `middleware.ts` (lines 97-104), `app/api/auth/me/route.ts` (lines 70-110), `app/api/auth/register/route.ts` (lines 29-113)
- Current mitigation: Debug logs are wrapped in `if (process.env.NODE_ENV === "development")` in middleware only
- Recommendations: Remove debug logging from auth routes; add environment check to all console.log statements

**CORS Misconfiguration:**

- Risk: API endpoints accessible from any origin
- Files: `middleware.ts` (line 12)
- Current mitigation: None
- Recommendations: Replace wildcard with specific allowed origins from environment configuration

**Missing Authorization Checks:**

- Risk: Some API routes may lack proper authorization validation
- Files: `app/api/orders/route.ts` (no user validation), `app/api/auth/register/route.ts`
- Current mitigation: Supabase RLS policies at database level
- Recommendations: Add explicit user authorization checks in API routes

## Performance Bottlenecks

**Large Component Bundle:**

- Problem: `components/admin/form-builder/form-builder.tsx` is 944 lines; may cause slow initial load
- Files: `components/admin/form-builder/form-builder.tsx`
- Cause: All form-building logic in single component; no code splitting
- Improvement path: Split into smaller components (FieldEditor, StepEditor, PricingConfig)

**No Query Optimization:**

- Problem: No pagination on order listing queries; could fetch thousands of records
- Files: `lib/features/orders/queries.ts`, `app/api/client/orders/route.ts`
- Cause: Default Supabase queries without limit
- Improvement path: Add cursor-based pagination

## Fragile Areas

**Dynamic Form Builder:**

- Files: `components/admin/form-builder/form-builder.tsx`
- Why fragile: 944-line single component; any change risks breaking unrelated functionality
- Safe modification: Test thoroughly; consider extracting sub-components
- Test coverage: None

**Pricing Service:**

- Files: `lib/services/pricing.ts` (366 lines)
- Why fragile: Complex pricing logic with multiple fallback paths; type assertions hide potential runtime errors
- Safe modification: Add unit tests for all pricing scenarios before modifying
- Test coverage: None

**API Route Type Safety:**

- Files: `app/api/orders/route.ts`, `app/api/client/orders/route.ts`
- Why fragile: Using `as any` bypasses type checking; schema changes could cause silent failures
- Safe modification: Use proper typed queries; validate response shapes
- Test coverage: None

## Scaling Limits

**Database Queries:**

- Current capacity: Unbounded queries without pagination
- Limit: Will degrade with large order volumes
- Scaling path: Implement cursor-based pagination; add database indexes

**No Caching:**

- Current capacity: Every page load hits database
- Limit: Degrades under high traffic
- Scaling path: Add Redis or in-memory caching for configuration data

## Dependencies at Risk

**Supabase SSR Package:**

- Risk: Using `@supabase/ssr` which has had breaking changes in past versions
- Impact: Middleware authentication could break on version upgrade
- Migration plan: Pin to stable version; test upgrades in staging

**Next.js App Router:**

- Risk: New features may deprecate current patterns (like `createClient` usage)
- Impact: Migration effort for future Next.js versions
- Migration plan: Monitor Next.js release notes; keep dependencies updated

## Missing Critical Features

**Input Validation:**

- Problem: Some API routes lack comprehensive input validation
- Blocks: Security audits; production readiness

**Error Recovery:**

- Problem: No retry logic for failed database operations
- Blocks: Reliability under network failures

**Audit Logging:**

- Problem: No audit trail for sensitive operations (order status changes, price modifications)
- Blocks: Compliance requirements; debugging production issues

## Test Coverage Gaps

**Utility Functions:**

- What's not tested: `lib/utils.ts`, `lib/services/pricing.ts`, estimation calculations
- Files: `lib/utils.ts`, `lib/services/pricing.ts`
- Risk: Pricing calculation errors go undetected
- Priority: High

**API Routes:**

- What's not tested: All 20+ API routes
- Files: `app/api/**/*.ts`
- Risk: Breaking changes not detected; regression potential
- Priority: High

**React Components:**

- What's not tested: Form components, order forms, admin interfaces
- Files: `components/**/*.tsx`
- Risk: UI bugs in edge cases
- Priority: Medium

---

_Concerns audit: 2026-02-24_
