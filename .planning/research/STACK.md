# Technology Stack: Order Management & Client Portal

**Project:** Flow - Gunpla Custom Build Service
**Research Date:** 2026-02-24
**Research Mode:** Stack dimension for order management dashboard and client portal

---

## Executive Summary

The existing Next.js + Supabase stack is well-suited for order management dashboards and client portals. **No major technology changes are needed** — the ecosystem recommends extending the current stack with TanStack Table (for data grids) and additional shadcn/ui components (for UI). This aligns perfectly with the existing Radix UI + Tailwind CSS foundation.

---

## Recommended Stack Extensions

### Data Tables (Critical)

| Technology                | Version | Purpose              | Why                                                                                                                                                                 |
| ------------------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@tanstack/react-table** | ^8.21.0 | Headless table logic | Industry standard for React data grids in 2025/2026. Powers sorting, filtering, pagination, column visibility, row selection. Server-side compatible with Supabase. |
| **@tanstack/react-query** | ^5.90.0 | Already installed    | Works seamlessly with TanStack Table for server-side data fetching patterns                                                                                         |

**Confidence:** HIGH — TanStack Table has 2.8M+ weekly downloads, recommended by shadcn/ui official docs

### UI Components

| Technology                                  | Purpose                  | Why                                                                                                                                                                                           |
| ------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn/ui** (via `npx shadcn@latest add`) | Styled component library | Built on Radix UI primitives (already installed), adds pre-styled Tailwind components. Official recommendation from 2025/2026 dashboard templates. Integrates with existing Tailwind 4 setup. |
| **@tanstack/react-query-devtools**          | Already installed        | Debug table data fetching                                                                                                                                                                     |

**Recommended shadcn/ui components for order management:**

```bash
# Core table components
npx shadcn@latest add table badge card skeleton

# Navigation & layout
npx shadcn@latest add tabs breadcrumb avatar dropdown-menu

# Forms & inputs
npx shadcn@latest add input select textarea checkbox label

# Feedback
npx shadcn@latest add toast alert dialog popover

# Display
npx shadcn@latest add progress tooltip separator
```

**Confidence:** HIGH — shadcn/ui is the recommended UI layer for Next.js dashboards in 2026

### Client Portal Patterns

| Pattern                | Implementation                                  | Existing Tech                      |
| ---------------------- | ----------------------------------------------- | ---------------------------------- |
| **Role-based access**  | Supabase RLS + middleware (already implemented) | ✅ Supabase Auth                   |
| **Order visibility**   | Database queries filtered by `user_id`          | ✅ Supabase client                 |
| **Real-time updates**  | Supabase Realtime (optional, defer to v2)       | Available in @supabase/supabase-js |
| **File/photo uploads** | Supabase Storage                                | Already configured                 |

**Confidence:** HIGH — Existing Supabase setup covers client portal requirements

---

## What NOT to Use and Why

| Technology                | Why Avoid                                                                           | Use Instead                                  |
| ------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| **MUI X Data Grid**       | Heavy (60KB+), Material Design styling conflicts with custom Tailwind design system | TanStack Table (headless, lightweight ~15KB) |
| **AG Grid Community**     | Complex licensing, overly enterprise for this use case                              | TanStack Table                               |
| **Redux Toolkit**         | Overkill — React Query already handles server state                                 | React Query (already installed)              |
| **React Table v7**        | Deprecated, v8 is current standard                                                  | @tanstack/react-table v8                     |
| **NextAuth.js (Auth.js)** | Switching auth providers adds complexity; Supabase Auth works fine                  | Supabase Auth (existing)                     |
| **Prisma/Drizzle**        | Switching ORMs adds migration effort; Supabase JS client sufficient                 | Supabase JS client (existing)                |

---

## Installation

```bash
# Core table library
pnpm add @tanstack/react-table

# Add recommended shadcn/ui components
# (Run in project root after shadcn init if not already done)
npx shadcn@latest add table badge card skeleton tabs breadcrumb avatar \
  dropdown-menu input select textarea checkbox label toast alert dialog \
  popover progress tooltip separator
```

---

## Architecture Patterns

### Server-Side Table Pattern (Recommended)

For order management with Supabase:

```typescript
// app/orders/_components/columns.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table"

// Define columns with type safety
export type OrderColumn = {
  id: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  created_at: string
  total: number
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>
  },
  // ...
]
```

```typescript
// app/orders/_components/data-table.tsx
"use client"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  PaginationState,
} from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function DataTable({ columns }: { columns: ColumnDef<Order>[] }) {
  const supabase = createClient()

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Server-side data fetching with React Query
  const { data, isLoading } = useQuery({
    queryKey: ["orders", sorting, pagination],
    queryFn: async () => {
      const { data: orders, count } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order(sorting[0]?.id, {
          ascending: sorting[0]?.desc ?? true
        })
        .range(
          pagination.pageIndex * pagination.pageSize,
          (pagination.pageIndex + 1) * pagination.pageSize - 1
        )
      return { orders, count }
    },
  })

  const table = useReactTable({
    data: data?.orders ?? [],
    columns,
    pageCount: Math.ceil((data?.count ?? 0) / pagination.pageSize),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualSorting: true,  // Tell table: server handles sorting
    manualPagination: true, // Tell table: server handles pagination
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <DataTablePagination table={table} />
      <DataTableContent table={table} isLoading={isLoading} />
    </div>
  )
}
```

### Client Portal Pattern

```typescript
// Client sees only their own orders
const { data: orders } = await supabase
  .from("orders")
  .select("*")
  .eq("user_id", session.user.id) // Filter by authenticated user
  .order("created_at", { ascending: false });
```

---

## Scalability Considerations

| Scale              | Approach                                                                       |
| ------------------ | ------------------------------------------------------------------------------ |
| **100 orders**     | Client-side pagination, simple queries                                         |
| **1,000 orders**   | Server-side pagination (required), basic indexes                               |
| **10,000+ orders** | Server-side pagination + filtering, database indexes on `status`, `created_at` |

---

## Sources

- **TanStack Table v8 Docs** — https://tanstack.com/table/v8 (Authoritative, current)
- **shadcn/ui Data Table Guide** — https://ui.shadcn.com/docs/components/data-table (Authoritative)
- **Next.js Admin Dashboard Templates 2026** — https://adminlte.io/blog/nextjs-admin-dashboard-templates/ (Industry survey)
- **React Data Grid Libraries 2026** — https://www.syncfusion.com/blogs/post/top-react-data-grid-libraries (Comparison)

---

## Summary

| Area               | Recommendation                            | Confidence |
| ------------------ | ----------------------------------------- | ---------- |
| **Data Tables**    | TanStack Table v8 + shadcn/ui Table       | HIGH       |
| **UI Components**  | shadcn/ui (install additional components) | HIGH       |
| **Authentication** | Supabase Auth (existing)                  | HIGH       |
| **Data Fetching**  | React Query + Supabase (existing)         | HIGH       |
| **Charts**         | Recharts (existing)                       | HIGH       |

**Key Finding:** The existing Next.js + Supabase + React Query + Tailwind stack is the correct foundation. Add TanStack Table and shadcn/ui components to complete the order management dashboard capability. No major technology changes required.

---

_Research confidence: HIGH — Multiple authoritative sources (official docs, industry surveys) confirm these recommendations for 2025/2026_
