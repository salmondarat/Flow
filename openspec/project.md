# Project Context

## Purpose

**flow** is a web-based business management application for a Model Kit / Gunpla Custom Build Service. The application streamlines the end-to-end workflow of order intake, estimation, progress tracking, and change management.

### Core Problems Solved

- Orders are unclear and inconsistent
- Difficulty tracking multiple kits and services per client
- Estimation changes when clients request additions mid-project
- Manual handling of invoices, agreements, and progress updates

### Target Users

1. **Client (Customer)**: Submits orders, selects kits/services, views estimations, tracks progress, requests changes
2. **Admin (Builder/Workshop)**: Reviews estimations, manages order progress, uploads photos, handles change requests

## Tech Stack

### Frontend

- **Next.js 15** with App Router (React framework)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** for styling
- **shadcn/ui** for pre-built components
- **React Hook Form** + **Zod** for form validation
- **TanStack Query (React Query)** for server state
- **Zustand** for client-side UI state

### Backend

- **Supabase** (PostgreSQL database + Auth + Storage)
  - Row Level Security (RLS) for role-based access
  - Built-in authentication (admin login)
  - File storage for progress photos

### Hosting

- **Vercel** (free tier) for frontend deployment
- **Supabase** hosted backend

### Development Tools

- **Vitest** for unit testing
- **Playwright** for E2E testing
- **ESLint** + **Prettier** for code quality
- **TypeScript** for type safety

## Project Conventions

### Code Style

#### TypeScript Configuration

```typescript
// Strict mode enabled
// Use type aliases for domain types
type OrderStatus = "draft" | "estimated" | "approved" | "in_progress" | "completed" | "cancelled";
type ServiceType = "full_build" | "repair" | "repaint";
type Complexity = "low" | "medium" | "high";
type UserRole = "admin" | "client";

// Interfaces for data structures (not types)
interface Order {
  id: string;
  clientId: string;
  status: OrderStatus;
  estimatedPriceCents: number;
  estimatedDays: number;
  finalPriceCents: number;
  finalDays: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Naming Conventions

```
Files:          kebab-case        order-form.tsx
Components:     PascalCase        const OrderForm = () => { ... }
Functions:      camelCase         function calculateEstimation() { ... }
Constants:      SCREAMING_SNAKE   const PRICING_RULES = { ... }
Database:       snake_case        order_items, change_requests
API Routes:     kebab-case        /api/orders/[orderId]
```

#### Code Organization

```
Feature-Based Organization:
├── Each feature has its own folder
├── Shared code in lib/ or components/
├── Server and client code clearly separated

Example:
app/
├── (public)/order/          # Public order feature
├── (admin)/orders/          # Admin order management
lib/
├── features/orders/         # Shared order logic
├── features/estimation/     # Estimation logic
```

### Architecture Patterns

#### Layer Architecture

```
Presentation Layer (app/, components/)
├── Routes and pages
├── UI components
│
Business Logic Layer (lib/features/)
├── Domain logic
├── Estimation calculations
├── Validation schemas
│
Data Access Layer (lib/supabase/)
├── Database queries
├── Authentication
└── File operations
```

#### State Management Strategy

```typescript
// Server State (TanStack Query) - For orders, clients, change requests
const { data: orders, isLoading } = useQuery({
  queryKey: ["orders", status],
  queryFn: () => fetchOrders(status),
});

// Client State (Zustand) - For UI state (sidebar, filters, modals)
interface UIStore {
  sidebarOpen: boolean;
  filters: OrderFilters;
  setSidebarOpen: (open: boolean) => void;
}

// Forms (React Hook Form + Zod) - For user input
const orderFormSchema = z.object({
  clientName: z.string().min(2),
  phone: z.string().regex(/^62\d{8,12}$/),
  email: z.string().email().optional(),
});
```

### Testing Strategy

#### Testing Pyramid

```
E2E Tests (Playwright)
├── Critical user flows only
├── Order creation, tracking, admin management
│
Component Tests (Testing Library)
├── User interactions, form validation
├── Complex UI components
│
Unit Tests (Vitest)
├── Business logic, estimation calculations
├── Utilities, helper functions
```

#### Test Coverage Goals

- Business logic (estimation): 90%+
- Components: 70%+
- E2E: Critical paths only

### Git Workflow

#### Branch Structure

```
main          # Production, always deployable
develop       # Integration branch
feature/*     # Feature branches
bugfix/*      # Bug fix branches
```

#### Branch Naming

```
feature/order-management
feature/change-request-system
feature/admin-dashboard
bugfix/estimation-calculation-error
```

#### Commit Messages (Conventional Commits)

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore

Examples:
feat: add order creation form
fix: correct estimation calculation for repaint
docs: update API documentation
refactor: extract estimation logic to separate module
test: add unit tests for pricing rules
```

## Domain Context

### Business Model

#### Order Flow

```
Client Side (Public - No Login)
1. Visit /order
2. Fill information (name, phone, email optional, address)
3. Add one or more model kits
4. For each kit: select services, complexity, notes
5. View auto-generated estimation
6. Submit order → Receive order ID
7. Track progress at /track/{orderId}

Admin Side (Protected - Login Required)
1. Review and finalize estimations
2. Approve orders to start work
3. Update status and upload progress photos
4. Handle change requests (approve/reject)
5. Finalize and complete orders
```

#### Estimation Logic (Rule-Based)

```typescript
// Base pricing (in IDR cents)
const PRICING_RULES = {
  services: {
    full_build: { basePrice: 500000, baseDays: 14 },
    repair: { basePrice: 150000, baseDays: 5 },
    repaint: { basePrice: 200000, baseDays: 7 },
  },
  complexity: {
    low: 1.0,
    medium: 1.5,
    high: 2.0,
  },
};

// Calculation: (basePrice + baseDays) × complexityMultiplier
// Sum of all kit-service combinations
```

### Key Domain Concepts

- **Order**: A client request containing one or more model kits
- **Order Item (Kit)**: Individual model kit with selected services
- **Service**: Type of work (full_build, repair, repaint)
- **Complexity**: Difficulty level (low, medium, high) affecting price/time
- **Change Request**: Client modification request with price/time impact
- **Progress Log**: Photo and status updates per kit during build

## Important Constraints

### Technical Constraints

- **No real payment gateway** in MVP (invoice view-only)
- **No push notifications** (manual status updates)
- **Single admin user** for MVP (role-based for future expansion)
- **Mobile-responsive** but desktop-optimized for admin dashboard

### Business Constraints

- **Indonesian market**: Prices in IDR (Rp), phone validation for +62
- **WhatsApp communication**: Phone number is primary contact
- **Client-side optional**: Email and address are optional fields
- **Estimation snapshots**: Original estimates preserved, changes tracked separately

### Time Constraints

- **3+ month timeline** for production-ready MVP
- **Focus on admin workflow** first, client experience second
- **Iterative development**: Core features before polish

## External Dependencies

### Supabase Services

- **PostgreSQL Database**: Primary data store
- **Authentication**: Admin user management
- **Storage**: Progress photo uploads
- **Row Level Security (RLS)**: Role-based data access

### Third-Party Services (Potential Future)

- **WhatsApp Business API**: For order notifications (out of MVP scope)
- **Payment Gateway**: Midtrans/Xendit (out of MVP scope)
- **Email Service**: Resend/SendGrid (optional, out of MVP scope)

## Environment Variables

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Server-side only

# Admin Credentials (development only)
ADMIN_EMAIL=admin@flow.local
ADMIN_PASSWORD=changeme123

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## File Structure Reference

```
flow/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── order/
│   │   │   ├── page.tsx                # Order form wizard
│   │   │   └── success/[orderId]/page.tsx
│   │   └── track/
│   │       └── [orderId]/page.tsx      # Public tracking
│   │
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx      # Overview dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx            # Orders list
│   │   │   │   └── [orderId]/
│   │   │   │       ├── page.tsx        # Order details
│   │   │   │       └── edit/page.tsx   # Edit order
│   │   │   ├── change-requests/
│   │   │   │   └── [requestId]/page.tsx
│   │   │   └── settings/
│   │   │       └── pricing/page.tsx
│   │   └── layout.tsx                  # Admin layout wrapper
│   │
│   ├── api/
│   │   ├── orders/route.ts             # POST create order
│   │   ├── orders/[orderId]/route.ts   # GET/PUT order
│   │   └── upload/route.ts             # Image upload proxy
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── public/
│   │   ├── OrderForm.tsx               # Multi-step form
│   │   ├── KitCard.tsx
│   │   ├── ServiceSelector.tsx
│   │   ├── EstimationSummary.tsx
│   │   └── TrackingCard.tsx
│   │
│   ├── admin/
│   │   ├── admin-sidebar.tsx
│   │   ├── admin-header.tsx
│   │   ├── admin-layout.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── status-chart.tsx
│   │   │   ├── recent-activity.tsx
│   │   │   ├── attention-needed.tsx
│   │   │   └── workload-progress.tsx
│   │   └── orders/
│   │       ├── orders-table.tsx
│   │       └── status-badge.tsx
│   │
│   └── ui/                             # shadcn/ui components
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── features/
│   │   ├── orders/
│   │   ├── estimation/
│   │   └── change-requests/
│   ├── estimation.ts                  # Pricing logic
│   └── utils.ts
│
├── types/
│   └── index.ts                        # TypeScript types
│
└── public/
    └── images/
```
