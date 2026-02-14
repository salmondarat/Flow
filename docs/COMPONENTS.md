# Components Documentation

This document describes all components used in the Flow project, organized by category.

---

## Table of Contents

- [UI Components](#ui-components)
- [Dashboard Components](#dashboard-components)
- [Bento Grid Components](#bento-grid-components)
- [Form Components](#form-components)
- [Auth Components](#auth-components)
- [Admin Components](#admin-components)
- [Client Components](#client-components)
- [Public Components](#public-components)
- [Layout Components](#layout-components)
- [Provider Components](#provider-components)

---

## UI Components

**Location:** `components/ui/`

### Button

**File:** `components/ui/button.tsx`

A flexible button component with variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">Click me</Button>
```

**Variants:**
- `default` - Primary button with primary color
- `destructive` - Destructive action button
- `outline` - Outlined button
- `secondary` - Secondary action button
- `ghost` - Ghost button (no background)
- `link` - Link-style button

**Sizes:**
- `default` - h-10 px-4 py-2
- `sm` - h-9 rounded-md px-3
- `lg` - h-11 rounded-md px-8
- `icon` - h-10 w-10

---

### Input

**File:** `components/ui/input.tsx`

Standard input field component.

```tsx
import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Enter text..." />
```

---

### Textarea

**File:** `components/ui/textarea.tsx`

Multi-line text input component.

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Enter description..." rows={4} />
```

---

### Select

**File:** `components/ui/select.tsx`

Dropdown select component using Radix UI.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Checkbox

**File:** `components/ui/checkbox.tsx`

Checkbox component using Radix UI.

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="terms" />
<label htmlFor="terms">Accept terms</label>
```

---

### Switch

**File:** `components/ui/switch.tsx`

Toggle switch component.

```tsx
import { Switch } from "@/components/ui/switch";

<Switch id="toggle" />
<label htmlFor="toggle">Enable feature</label>
```

---

### Card

**File:** `components/ui/card.tsx`

Card container component.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>Card content</CardContent>
  <CardFooter>Card footer</CardFooter>
</Card>
```

---

### Dialog

**File:** `components/ui/dialog.tsx`

Modal dialog component using Radix UI.

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

---

### Sheet

**File:** `components/ui/sheet.tsx`

Side sheet component using Radix UI.

```tsx
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger>Open Sheet</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
    <div>Sheet content</div>
  </SheetContent>
</Sheet>
```

---

### Tabs

**File:** `components/ui/tabs.tsx`

Tab navigation component.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Table

**File:** `components/ui/table.tsx`

Table component for data display.

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Badge

**File:** `components/ui/badge.tsx`

Badge component for labels and status indicators.

```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

### Avatar

**File:** `components/ui/avatar.tsx`

User avatar component.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.png" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

### Alert

**File:** `components/ui/alert.tsx`

Alert component for notifications.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert>
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert description</AlertDescription>
</Alert>
```

---

### Progress

**File:** `components/ui/progress.tsx`

Progress bar component.

```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={33} />
```

---

### Skeleton

**File:** `components/ui/skeleton.tsx`

Loading skeleton component.

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-full" />
```

---

### Separator

**File:** `components/ui/separator.tsx`

Visual separator/divider component.

```tsx
import { Separator } from "@/components/ui/separator";

<Separator />
```

---

### Dropdown Menu

**File:** `components/ui/dropdown-menu.tsx`

Dropdown menu component using Radix UI.

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Theme Toggle

**File:** `components/ui/theme-toggle.tsx`

Dark/light theme toggle button.

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

<ThemeToggle />
```

---

### Animated Button

**File:** `components/ui/animated-button.tsx`

Button with hover animations.

```tsx
import { AnimatedButton } from "@/components/ui/animated-button";

<AnimatedButton>Click me</AnimatedButton>
```

---

### Sign In

**File:** `components/ui/sign-in.tsx`

Sign in form component with OAuth providers.

```tsx
import { SignIn } from "@/components/ui/sign-in";

<SignIn />
```

---

## Dashboard Components

**Location:** `components/dashboard/`

### Dashboard Header

**File:** `components/dashboard/dashboard-header.tsx`

Header component for dashboard pages with search, notifications, and user menu.

```tsx
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

<DashboardHeader role="admin" title="Dashboard" />
```

**Props:**
- `role`: `"admin" | "client"`
- `title?: string`

---

### Dashboard Sidebar

**File:** `components/dashboard/dashboard-sidebar.tsx`

Sidebar navigation for dashboard.

```tsx
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

<DashboardSidebar navigation={navConfig} role="admin" />
```

**Props:**
- `navigation`: `NavSection[]`
- `role`: `"admin" | "client"`
- `user`: `{ email?: string; full_name?: string } | null`

---

### Nav Config

**File:** `components/dashboard/nav-config.tsx`

Navigation configuration for admin and client sidebars.

---

## Bento Grid Components

**Location:** `components/dashboard/bento/`

### BentoGrid

**File:** `components/dashboard/bento/bento-grid.tsx`

Flexible 12-column grid container for bento card layouts.

```tsx
import { BentoGrid } from "@/components/dashboard/bento";

<BentoGrid>
  {/* Children */}
</BentoGrid>
```

---

### BentoCard

**File:** `components/dashboard/bento/bento-grid.tsx`

Base card component with consistent styling.

```tsx
import { BentoCard } from "@/components/dashboard/bento";

<BentoCard size="md" accent="blue">
  {/* Content */}
</BentoCard>
```

**Props:**
- `size?: "sm" | "md" | "lg" | "wd" | "xl"`
- `accent?: "blue" | "purple" | "green" | "orange" | "red" | "gray" | "brand"`
- `interactive?: boolean`
- `onClick?: () => void`
- `loading?: boolean`

**Sizes:**
- `sm` - 3 columns on XL, 4 on LG, 6 on MD
- `md` - 6 columns on XL/LG/MD (half width)
- `lg` - 9 columns on XL, full on LG
- `wd` - Full width on all breakpoints
- `xl` - Full width, double height

---

### StatsCard

**File:** `components/dashboard/bento/stats-card.tsx`

Display key metrics with trend indicators.

```tsx
import { StatsCard } from "@/components/dashboard/bento";

<StatsCard
  title="Active Operations"
  value="42"
  icon={<LightningIcon />}
  trend={{ value: "+20%", direction: "up" }}
  accent="blue"
/>
```

**Props:**
- `title: string`
- `value: string | number`
- `icon: React.ReactNode`
- `trend?: { value: string; direction: "up" | "down" | "neutral"; isUrgent?: boolean }`
- `description?: string`
- `size?: "sm" | "md" | "lg" | "wd" | "xl"`
- `accent?: "blue" | "purple" | "green" | "orange" | "red" | "gray" | "brand"`
- `onClick?: () => void`

---

### ActivityList

**File:** `components/dashboard/bento/activity-list.tsx`

Display recent activity with timestamp and status.

```tsx
import { ActivityList } from "@/components/dashboard/bento";

<ActivityList
  title="Recent Activity"
  items={activityItems}
  size="lg"
  maxItems={6}
/>
```

**Props:**
- `title: string`
- `items: ActivityItem[]`
- `size?: "md" | "lg"`
- `maxItems?: number`

**ActivityItem:**
- `id: string`
- `type: "order" | "system" | "alert"`
- `title: string`
- `description: string`
- `status: string`
- `timestamp: Date`

---

### ProgressCard

**File:** `components/dashboard/bento/progress-card.tsx`

Display progress items with visual progress bars.

```tsx
import { ProgressCard } from "@/components/dashboard/bento";

<ProgressCard
  title="Workload Progress"
  items={progressItems}
  size="md"
  accent="blue"
/>
```

**Props:**
- `title: string`
- `items: ProgressItem[]`
- `size?: "md" | "lg"`
- `accent?: "blue" | "purple" | "green" | "orange" | "red" | "gray" | "brand"`

**ProgressItem:**
- `id: string`
- `title: string`
- `subtitle?: string`
- `progress: number`
- `status: string`
- `href?: string`

---

### QuickActions

**File:** `components/dashboard/bento/quick-actions.tsx`

Display quick action buttons.

```tsx
import { QuickActions } from "@/components/dashboard/bento";

<QuickActions
  title="Quick Actions"
  actions={quickActions}
  size="sm"
/>
```

**Props:**
- `title: string`
- `actions: QuickAction[]`
- `size?: "sm" | "md"`

**QuickAction:**
- `id: string`
- `label: string`
- `icon: React.ReactNode`
- `onClick: () => void`
- `variant?: "primary" | "secondary" | "ghost"`
- `disabled?: boolean`

---

### Dashboard Header (Bento)

**File:** `components/dashboard/bento/dashboard-header.tsx`

Header component with title, badge, and quick actions.

```tsx
import { DashboardHeader } from "@/components/dashboard/bento";

<DashboardHeader
  title="Command Center"
  subtitle="Overview of active operations"
  badge={{ text: "Live", variant: "success" }}
/>
```

**Props:**
- `title: string`
- `subtitle?: string`
- `badge?: { text: string; variant?: "success" | "warning" | "error" | "info" | "neutral" }`
- `actions?: QuickActionLinkProps[]`

---

### Icons (Bento)

**File:** `components/dashboard/bento/icons.tsx`

Icon components used in bento cards.

- `LightningIcon`
- `ClockIcon`
- `ChartIcon`
- `CheckIcon`
- `ListIcon`
- `PlusIcon`

---

## Form Components

**Location:** `components/form/` and `components/form-fields/`

### Dynamic Form

**File:** `components/form/dynamic-form.tsx`

Dynamic form renderer based on schema.

```tsx
import { DynamicForm } from "@/components/form";

<DynamicForm fields={formFields} onSubmit={handleSubmit} />
```

---

### Text Field

**File:** `components/form-fields/text-field.tsx`

Text input field component.

---

### Textarea Field

**File:** `components/form-fields/textarea-field.tsx`

Multi-line text input field component.

---

### Number Field

**File:** `components/form-fields/number-field.tsx`

Number input field component.

---

### Select Field

**File:** `components/form-fields/select-field.tsx`

Dropdown select field component.

---

### Checkbox Field

**File:** `components/form-fields/checkbox-field.tsx`

Checkbox input field component.

---

### File Field

**File:** `components/form-fields/file-field.tsx`

File upload field component.

---

### Form Field Renderer

**File:** `components/form-fields/form-field-renderer.tsx`

Unified form field renderer.

---

### Image Upload

**File:** `components/form/image-upload.tsx`

Image upload component with preview.

---

## Auth Components

**Location:** `components/auth/`

### Auth Layout

**File:** `components/auth/auth-layout.tsx`

Layout wrapper for authentication pages.

```tsx
import { AuthLayout } from "@/components/auth";

<AuthLayout title="Sign In">
  {/* Auth form */}
</AuthLayout>
```

---

### Register Form

**File:** `components/auth/register-form.tsx`

User registration form component.

---

### Client Branding Panel

**File:** `components/auth/client-branding-panel.tsx`

Panel for client branding during auth.

---

### Unified Auth Page

**File:** `components/auth/unified-auth-page.tsx`

Combined sign-in/sign-up page.

---

## Admin Components

**Location:** `components/admin/`

### Admin Header

**File:** `components/admin/admin-header.tsx`

Header component for admin pages with search and notifications.

```tsx
import { AdminHeader } from "@/components/admin";

<AdminHeader />
```

---

### Admin Sidebar

**File:** `components/admin/admin-sidebar.tsx`

Sidebar navigation for admin dashboard.

---

### Admin Order Form

**File:** `components/admin/admin-order-form.tsx`

Form for creating/editing orders.

---

### Form Builder

**File:** `components/admin/form-builder/form-builder.tsx`

Dynamic form builder for admin.

---

### Stats Cards

**File:** `components/admin/dashboard/stats-cards.tsx`

Statistics cards grid using TailAdmin stats card component.

---

### Revenue Chart

**File:** `components/admin/dashboard/revenue-chart.tsx`

Revenue visualization chart.

---

### Profit Chart

**File:** `components/admin/dashboard/profit-chart.tsx`

Profit visualization chart.

---

## Client Components

**Location:** `components/client/`

### Client Header

**File:** `components/client/client-header.tsx`

Header component for client dashboard.

---

### Change Request Form

**File:** `components/client/change-request-form.tsx`

Form for submitting change requests.

---

## Public Components

**Location:** `components/public/`

### Order Form

**File:** `components/public/order-form.tsx`

Public order submission form.

---

### Order Page

**File:** `components/public/order-page.tsx`

Public order tracking page.

---

### Estimation Summary

**File:** `components/public/estimation-summary.tsx`

Order cost estimation summary.

---

### Service Selector

**File:** `components/public/service-selector.tsx`

Service selection component.

---

### Complexity Selector

**File:** `components/public/complexity-selector.tsx`

Complexity level selection component.

---

### Addon Selector

**File:** `components/public/addon-selector.tsx`

Addon selection component.

---

### Kit Card

**File:** `components/public/kit-card.tsx`

Kit selection card component.

---

### Kit Card Dynamic

**File:** `components/public/kit-card-dynamic.tsx`

Dynamic kit card component.

---

### Order Form Dynamic

**File:** `components/public/order-form-dynamic.tsx`

Dynamic order form component.

---

### Tracking Components

**Location:** `components/public/tracking/`

- `change-requests-list.tsx` - List of change requests
- `order-header.tsx` - Order information header
- `order-items.tsx` - Order items display
- `progress-timeline.tsx` - Progress timeline visualization

---

## Layout Components

**Location:** `components/layout/`

### Header

**File:** `components/layout/header.tsx`

Main site header with navigation.

---

### Footer

**File:** `components/layout/footer.tsx`

Main site footer component.

---

## Provider Components

**Location:** `components/providers/`

### Theme Provider

**File:** `components/providers/theme-provider.tsx`

Theme context provider for dark/light mode.

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";

<ThemeProvider attribute="class" defaultTheme="dark">
  {children}
</ThemeProvider>
```

**Props:**
- `attribute?: "class" | "data-theme"`
- `defaultTheme?: string`
- `enableSystem?: boolean`
- `disableTransitionOnChange?: boolean`

---

### Query Provider

**File:** `components/providers/query-provider.tsx`

React Query provider for data fetching.

```tsx
import { QueryProvider } from "@/components/providers/query-provider";

<QueryProvider>
  {children}
</QueryProvider>
```

---

## Shared Components

**Location:** `components/shared/dashboard/`

### TailAdmin Stats Card

**File:** `components/shared/dashboard/tailadmin-stats-card.tsx`

Stats card component from TailAdmin design.

```tsx
import { TailAdminStatsCard } from "@/components/shared/dashboard";

<TailAdminStatsCard
  title="Active Operations"
  value="42"
  icon={icon}
  trend={{ value: "+20%", isUp: true }}
/>
```

---

### TailAdmin Chart Card

**File:** `components/shared/dashboard/tailadmin-chart-card.tsx`

Chart card component from TailAdmin design.

```tsx
import { TailAdminChartCard } from "@/components/shared/dashboard";

<TailAdminChartCard
  title="Revenue"
  subtitle="Monthly revenue"
  chart={<RevenueChart />}
/>
```

---

## Component Index Files

- `components/dashboard/index.ts` - Dashboard components export
- `components/dashboard/bento/index.ts` - Bento components export
- `components/form-fields/index.ts` - Form field components export

---

## Color System Reference

For detailed color system documentation, see [COLOR-SYSTEM.md](./COLOR-SYSTEM.md).

---

## Generated: 2025-02-09
