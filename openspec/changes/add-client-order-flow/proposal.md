# Change: Add Client Order Flow

## Why

The Flow application currently has a complete admin dashboard but no way for clients to create orders or track their progress. This change implements the complete client-facing order flow: estimation logic, public order form with real-time pricing, order success confirmation, and public tracking page. This enables the core business workflow where clients can submit orders and administrators can manage them.

## What Changes

- Add estimation system with pricing calculation (basePrice × complexity), time estimation, and validation
- Add public multi-step order form wizard (client info → kits → services → review → submit)
- Add real-time estimation preview during order form input
- Add order success confirmation page with order ID
- Add public order tracking page for clients to view progress
- Add API route for public order creation
- Add orders-management modification for public read access to tracking data

## Impact

- Affected specs: estimation, order-form, order-tracking, orders-management
- Affected code:
  - `lib/estimation.ts` - Pricing and time calculation logic
  - `lib/features/estimation/` - Estimation types and utilities
  - `app/(public)/order/page.tsx` - Multi-step order form
  - `components/public/order-form.tsx` - Form wizard component
  - `components/public/kit-card.tsx` - Kit input component
  - `components/public/service-selector.tsx` - Service selection component
  - `components/public/estimation-summary.tsx` - Real-time pricing preview
  - `app/(public)/order/success/[orderId]/page.tsx` - Success confirmation
  - `app/(public)/track/[orderId]/page.tsx` - Public tracking page
  - `app/api/orders/route.ts` - Order creation endpoint
  - `lib/features/orders/queries.ts` - Add public order query
  - `middleware.ts` - Update for public route handling
