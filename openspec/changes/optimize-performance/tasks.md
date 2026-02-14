# Tasks: Performance Optimization

## 1. Quick Wins - Bundle Size

- [ ] 1.1 Create `ChartSkeleton` component for loading states
- [ ] 1.2 Dynamic import `RevenueChart` in dashboard page with loading skeleton
- [ ] 1.3 Dynamic import `ProfitChart` in dashboard page with loading skeleton
- [ ] 1.4 Move `Intl.NumberFormat` formatter to module level in `revenue-chart.tsx`
- [ ] 1.5 Move `Intl.NumberFormat` formatter to module level in `profit-chart.tsx`
- [ ] 1.6 Move `formatCurrency` function to module level in `stats-cards.tsx`
- [ ] 1.7 Verify bundle size reduction with `npm run build`

## 2. Quick Wins - Static Data

- [ ] 2.1 Create `FIELD_TYPES` constant outside FormBuilder component
- [ ] 2.2 Update FormBuilder to render icons dynamically from icon names
- [ ] 2.3 Verify no re-creation of fieldTypes array on render

## 3. Layout Component Memoization

- [ ] 3.1 Import `React` in `admin-sidebar.tsx`
- [ ] 3.2 Wrap `SidebarContent` component with `React.memo`
- [ ] 3.3 Import `React` in `admin-header.tsx`
- [ ] 3.4 Wrap `AdminHeader` component with `React.memo`
- [ ] 3.5 Verify reduced re-renders with React DevTools

## 4. DynamicForm Callback Optimization

- [ ] 4.1 Update `handleFieldChange` to use functional setState for values
- [ ] 4.2 Update `handleFieldChange` to use functional setState for errors
- [ ] 4.3 Remove `errors` from dependency array
- [ ] 4.4 Verify callback stability with React DevTools

## 5. FormBuilder State Refactor

- [ ] 5.1 Install `use-immer` dependency: `npm install use-immer`
- [ ] 5.2 Add TypeScript types for immer if needed
- [ ] 5.3 Refactor `addStep` to use `useImmer`
- [ ] 5.4 Refactor `updateStep` to use `useImmer`
- [ ] 5.5 Refactor `deleteStep` to use `useImmer`
- [ ] 5.6 Refactor `moveStep` to use `useImmer`
- [ ] 5.7 Refactor `addField` to use `useImmer`
- [ ] 5.8 Refactor `updateField` to use `useImmer`
- [ ] 5.9 Refactor `deleteField` to use `useImmer`
- [ ] 5.10 Refactor `moveField` to use `useImmer`
- [ ] 5.11 Verify no cascading re-renders

## 6. FormBuilder Component Splitting

- [ ] 6.1 Extract `FieldEditor` to separate file
- [ ] 6.2 Extract `ServiceConfigEditor` to separate file
- [ ] 6.3 Extract `PricingConfigEditor` to separate file
- [ ] 6.4 Extract `FormPreview` to separate file
- [ ] 6.5 Dynamic import editor components in FormBuilder
- [ ] 6.6 Add loading states for dynamic imports

## 7. List Item Optimization

- [ ] 7.1 Add `id` field to `KitCardData` interface
- [ ] 7.2 Generate unique IDs when adding new items in `order-form.tsx`
- [ ] 7.3 Update `KitCard` to use `item.id` as key
- [ ] 7.4 Wrap `KitCard` component with `React.memo`
- [ ] 7.5 Add custom comparison function for KitCard memo
- [ ] 7.6 Verify reduced re-renders when updating single item

## 8. Font Loading Optimization

- [ ] 8.1 Add `rel="preload"` to Material Symbols link in `layout.tsx`
- [ ] 8.2 Verify fonts load earlier in waterfall

## 9. Validation & Testing

- [ ] 9.1 Run TypeScript type checking: `npm run type-check` or `tsc --noEmit`
- [ ] 9.2 Run ESLint: `npm run lint`
- [ ] 9.3 Test dashboard loading manually
- [ ] 9.4 Test FormBuilder interactions manually
- [ ] 9.5 Test order form wizard manually
- [ ] 9.6 Build and measure bundle size: `npm run build`
- [ ] 9.7 Verify 30-40% bundle size reduction

## 10. Documentation

- [ ] 10.1 Update CHANGELOG with performance improvements
- [ ] 10.2 Document performance optimization patterns for future reference
