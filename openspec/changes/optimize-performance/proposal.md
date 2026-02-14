# Change: Optimize React/Next.js Performance

## Why

A comprehensive performance review using Vercel's React best practices identified 12 performance issues across bundle size, re-rendering, and JavaScript execution patterns. The dashboard initially loads ~200KB of Recharts code even when charts aren't visible, and multiple components re-render unnecessarily on route changes and state updates. Addressing these issues will significantly improve initial load time and runtime performance.

## What Changes

- **CRITICAL**: Dynamic import Recharts components (~200KB savings on initial load)
- **CRITICAL**: Cache Intl.NumberFormat formatters (currently created on every render)
- **CRITICAL**: Add React.memo to sidebar/header components
- **CRITICAL**: Split FormBuilder component with dynamic imports for dialogs
- **HIGH**: Refactor FormBuilder state updates to avoid cascading re-renders
- **HIGH**: Fix unstable callback dependencies in DynamicForm
- **MEDIUM**: Hoist static data (fieldTypes array) outside components
- **MEDIUM**: Add stable IDs to list items and memoize KitCard
- **LOW**: Optimize Google Fonts loading with preload

## Impact

- **Affected specs**: web-app, dashboard
- **Affected code**:
  - `components/admin/dashboard/revenue-chart.tsx`
  - `components/admin/dashboard/profit-chart.tsx`
  - `components/admin/dashboard/stats-cards.tsx`
  - `components/admin/admin-sidebar.tsx`
  - `components/admin/admin-header.tsx`
  - `components/admin/form-builder/form-builder.tsx`
  - `components/form/dynamic-form.tsx`
  - `components/public/order-form.tsx`
  - `components/public/kit-card.tsx`
  - `app/layout.tsx`

**Estimated Impact**: 30-40% reduction in initial bundle size, significantly faster dashboard loads, reduced re-renders on navigation and interactions.
