# Design: Performance Optimization

## Context

The Flow application is a Next.js 15 React app for managing model kit orders. A performance audit using Vercel's React best practices identified multiple performance issues:

1. **Bundle Size**: Recharts (~200KB) imported directly in client components
2. **Re-rendering**: Missing React.memo on components that receive no props
3. **JavaScript**: Intl.NumberFormat created on every render
4. **State Management**: Cascading updates from spreading large state objects
5. **List Rendering**: Using array index as key instead of stable IDs

**Stakeholders**: Admin users (primary), clients (secondary)
**Constraints**: Must maintain existing functionality and visual behavior

## Goals / Non-Goals

**Goals**:

- Reduce initial bundle size by 30-40%
- Eliminate unnecessary re-renders on navigation and interactions
- Cache expensive formatter instances
- Maintain all existing functionality
- Preserve visual loading states

**Non-Goals**:

- Changing business logic or data flow
- Modifying API or database schemas
- Altering UI/UX behavior
- Adding new dependencies (use existing patterns)

## Decisions

### 1. Dynamic Import Recharts (`bundle-dynamic-imports`)

**Decision**: Use `next/dynamic` to lazy-load chart components with loading skeletons.

**Rationale**:

- Recharts is ~200KB and only needed on dashboard
- Dashboard already has loading states
- No SEO benefit (admin-only, authenticated)
- Pattern already used in Next.js ecosystem

**Alternatives considered**:

- Keep as-is: ❌ Adds 200KB to every admin page load
- Server-side charts: ❌ More complex, hydration issues
- Replace with lighter library: ❌ Significant refactor, regression risk

### 2. Cache Intl.NumberFormat (`js-cache-function-results`)

**Decision**: Move formatter creation to module level or use `useMemo`.

**Rationale**:

- Intl.NumberFormat is expensive to create
- Same locale/options used throughout app
- No dynamic inputs to formatter options

**Alternatives considered**:

- Keep as-is: ❌ Creates new formatter on every render
- Use a library: ❌ Over-engineering, adds dependency

### 3. React.memo for Layout Components (`rerender-memo`)

**Decision**: Wrap `SidebarContent` and `AdminHeader` in React.memo.

**Rationale**:

- Components receive no/minimal props
- Re-render on every route change (parent context updates)
- Memo is low-cost for these cases
- No children props (memo effective)

**Alternatives considered**:

- Keep as-is: ❌ Unnecessary re-renders on navigation
- Split layout: ❌ More complex, larger refactor

### 4. useImmer for FormBuilder State (`rerender-derived-state-no-effect`)

**Decision**: Use `use-immer` hook for nested state updates in FormBuilder.

**Rationale**:

- FormBuilder has deeply nested state (steps → fields → properties)
- Current spread pattern creates cascading updates
- Immer produces immutable updates with mutable syntax
- Type-safe with TypeScript

**Alternatives considered**:

- Keep manual spreads: ❌ Verbose, error-prone, cascading updates
- Use Zustand: ❌ Overkill, adds external state management
- Flatten state: ❌ Significant refactor, breaks existing patterns

### 5. Stable IDs for List Items (`rerender-memo`)

**Decision**: Add unique `id` field to KitCardData and use as key.

**Rationale**:

- Using array index as key causes issues when reordering
- React needs stable keys for reconciliation
- Already have unique IDs in database

**Alternatives considered**:

- Keep index: ❌ Forces re-render of all items on any change
- Use hash: ❌ Unnecessary, database has IDs

### 6. Split FormBuilder Component (`bundle-dynamic-imports`)

**Decision**: Extract dialog components as separate files and dynamic import.

**Rationale**:

- FormBuilder is 888 lines
- Dialogs only shown when editing
- Can defer loading until interaction

**Alternatives considered**:

- Keep monolithic: ❌ All code loaded upfront
- Virtual scrolling: ❌ Not applicable to dialogs

## Migration Plan

### Phase 1: Quick Wins (No Behavior Change)

1. Dynamic import Recharts
2. Cache Intl.NumberFormat
3. Hoist static fieldTypes array

### Phase 2: Re-render Optimization

4. Add React.memo to layout components
5. Fix DynamicForm callback dependencies

### Phase 3: FormBuilder Refactor

6. Install `use-immer` dependency
7. Refactor state updates to use Immer
8. Split dialog components

### Phase 4: List Item Optimization

9. Add stable IDs to KitCardData
10. Wrap KitCard in React.memo

### Rollback

- All changes are additive (no breaking changes)
- Can revert commit if performance regresses
- Monitor bundle size with `next build --debug`

## Risks / Trade-offs

### Risk: Dynamic imports may cause "pop-in" effect

**Mitigation**: Add proper loading skeletons with same dimensions

### Risk: React.memo may hide bugs (stale props)

**Mitigation**: Only memo components with no/minimal props, monitor useEffect

### Risk: use-immer adds new dependency

**Mitigation**: Well-maintained library, small bundle (~3KB), type-safe

### Risk: Adding IDs to KitCardData may break existing code

**Mitigation**: Make ID optional with fallback to index during migration

## Performance Targets

- **Bundle Size**: Reduce by 30-40% (~200KB from Recharts)
- **Dashboard Load**: < 1s initial render (currently ~2s)
- **Navigation**: < 100ms for route transitions (currently ~300ms)
- **Form Re-renders**: Reduce by 50% on field changes

## Open Questions

1. Should we use React.lazy for entire route groups? → **No**, Next.js already handles route code splitting
2. Should we add bundle analysis to CI? → **Yes**, add `next-bundle-analyzer` for monitoring
3. Should we replace Recharts entirely? → **No**, out of scope, significant regression risk
