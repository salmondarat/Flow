# Tasks & Calendar Pages Design

**Date:** 2026-02-20
**Status:** Approved
**Author:** Claude Code

## Overview

Design for dedicated Tasks and Calendar pages to replace the current placeholder sidebar navigation that points both buttons to `/admin/orders`.

## Requirements

### Tasks Page
- Route: `/admin/tasks`
- Hybrid view with toggleable Kanban and List views
- Full editing capabilities including status changes
- Drag-and-drop with confirmation modal for status updates
- Filters by Status, Priority, and Assignee
- View state persisted in URL query params

### Calendar Page
- Route: `/admin/calendar`
- Full project schedule with milestones, deadlines, and team availability
- Month/Week/Day view switching
- Events color-coded by status and urgency
- Click event to view details and quick actions
- Add new events capability

## Design Decisions

### Page Structure
Separate dedicated pages (Approach A) chosen for:
- Clean, focused URLs (easier to bookmark/share)
- Independent layout optimization
- Simpler navigation structure
- Clear separation of concerns

### Tasks View Toggle
Users can switch between Kanban and List views:
- **Kanban:** Visual, drag-and-drop workflow
- **List:** Data-focused, sortable/filterable table
- State persisted in URL: `?view=kanban` or `?view=list`
- Filters preserved across view toggles

### Status Change Confirmation
Drag-and-drop status changes require user confirmation:
- Prevents accidental status changes
- Shows old status → new status transition
- User must click "Confirm" to update database

## Component Architecture

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `TasksPage` | `components/admin/tasks/tasks-page.tsx` | Main tasks page container with view toggle and filters |
| `TaskListView` | `components/admin/tasks/task-list-view.tsx` | Table-based list view with sorting/filtering |
| `StatusChangeModal` | `components/admin/tasks/status-change-modal.tsx` | Confirmation modal for drag-drop status changes |
| `CalendarPage` | `components/admin/calendar/calendar-page.tsx` | Main calendar page container with view switching |
| `CalendarGrid` | `components/admin/calendar/calendar-grid.tsx` | Calendar grid component (Month/Week/Day variants) |
| `CalendarEvent` | `components/admin/calendar/calendar-event.tsx` | Individual event card with color coding |
| `EventDetailModal` | `components/admin/calendar/event-detail-modal.tsx` | Modal showing order details and quick actions |

### Reused Components
- `KanbanBoard` - from `components/admin/kanban/kanban-board.tsx`
- `TaskCard` - from `components/admin/kanban/task-card.tsx`
- `getKanbanTasks()` - from `lib/features/dashboard/kanban-queries.ts`

## Data Flow

### Tasks Page
1. Page loads → calls `getKanbanTasks()` to fetch orders
2. Orders transformed to Task objects with status, priority, due dates
3. View state (kanban/list) controlled by URL query param
4. Drag task → opens `StatusChangeModal` → user confirms → calls update mutation → refreshes data
5. Filter changes → updates URL params → refetches data

### Calendar Page
1. Page loads → fetches all orders with `estimated_days`
2. Calculates due dates from `created_at + estimated_days`
3. Maps orders to calendar days (created date, due date, milestones)
4. Click event → opens `EventDetailModal` → shows order info + quick actions

## State Management

- **Client-side:** View mode, active filters, selected event
- **Server-side:** Orders in Supabase
- **Sync:** URL query params for view state, optimistic UI updates for drag-drop

## Calendar Event Color Coding

| Color | Meaning |
|-------|---------|
| 🔴 Red | Overdue (due date past today) |
| 🟠 Orange | Due Today |
| 🔵 Blue | Upcoming (this week) |
| 🟢 Green | Completed on this date |
| ⚪ White/Gray | New Order Created |

## Kanban Column Mapping

| Kanban Column | Order Status |
|---------------|--------------|
| To Do | draft, estimated |
| In Progress | approved, in_progress |
| Under Review | cancelled |
| Completed | completed |

## Technical Stack

- **Calendar:** Custom grid component (no heavy library dependency)
- **Drag-and-drop:** HTML5 drag-and-drop API
- **State:** React hooks (`useState`, `useSearchParams`)
- **Styling:** Tailwind CSS

## Page Routes

```
/admin/tasks          # Tasks page (default: kanban view)
/admin/tasks?view=list  # Tasks page (list view)
/admin/calendar       # Calendar page
```

## API Endpoints Needed

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/[orderId]/status` | PATCH | Update order status |
| `/api/orders` | POST | Create new order |
| `/api/orders/[orderId]` | DELETE | Delete order |

## Success Criteria

- Tasks page fully functional with Kanban and List views
- Calendar page displays orders with proper color coding
- Status changes require confirmation before updating
- View state persists across page refreshes via URL
- Both pages integrate cleanly with existing sidebar navigation
