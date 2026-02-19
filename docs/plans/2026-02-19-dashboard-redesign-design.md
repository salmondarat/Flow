# Dashboard Redesign Design

**Date:** 2026-02-19
**Status:** Approved

## Overview

Redesign the admin dashboard to match the provided HTML reference while maintaining the existing sidebar and adapting the header. Connect all widgets to Supabase data with proper TypeScript types.

## Requirements

- Match HTML reference layout proportions exactly
- Keep existing sidebar structure (Flow branding, team selector, workspace nav)
- Hybrid header combining existing components with HTML visual pattern
- Connect all widgets to Supabase data
- No `any` types - strict TypeScript
- Update deprecated dependencies
- Fix all warnings

## Architecture

### Grid Layout

```
Row 1: Stats Cards (4 columns)
  - Total Projects (Primary, emerald gradient)
  - Ended Projects (White background)
  - Running Projects (White background)
  - Pending Projects (White background)

Row 2:
  - Project Analytics (2 columns)
  - Reminders (1 column)

Row 3:
  - Team Collaboration (1 column)
  - Project Progress (1 column)
  - Project List (1 column)
  - Time Tracker (1 column)
```

## Components

### Stats Cards
- Primary card: emerald-600 with decorative circle
- Other cards: white with border, hover effect
- Display: title, value, subtitle with trend indicator

### Project Analytics
- 2-column span (`lg:col-span-2`)
- Bar chart with 7 days
- Striped pattern for inactive days
- Tooltip with percentage

### Reminders
- Meeting title and time
- "Start Meeting" button with video icon

### Team Collaboration
- Team member list with avatar, name, task, status badge
- "Add Member" button

### Project Progress
- Semi-circle/doughnut chart
- Center text: "41% Project Ended"
- Color-coded legend

### Project List
- Icon, name, due date
- "New" button

### Time Tracker
- Dark green gradient background
- Digital time display
- Pause/Stop buttons

## Data Flow

### Supabase Queries

```sql
-- Stats
SELECT COUNT(*) as total,
       SUM(CASE WHEN status = 'ended' THEN 1 ELSE 0 END) as ended,
       SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
FROM projects
WHERE user_id = $1

-- Team
SELECT u.id, u.full_name, u.avatar_url,
       t.name as task_name, t.status
FROM users u
JOIN tasks t ON t.assignee_id = u.id
JOIN projects p ON t.project_id = p.id
WHERE p.user_id = $1
LIMIT 4

-- Project List
SELECT p.name, p.due_date, p.type
FROM projects p
WHERE p.user_id = $1
ORDER BY p.due_date ASC
LIMIT 5

-- Progress
SELECT COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
       COUNT(*) as total
FROM tasks
WHERE project_id = $1
```

### State Management
- React hooks for client-side fetching
- Independent loading/error states per widget
- Refresh on mount and manual trigger

## Error Handling

- Loading: skeleton/shimmer effect
- Error: message with retry button
- Graceful degradation for partial data

## File Structure

```
app/(admin)/admin/dashboard/
├── page.tsx
└── dashboard-content.tsx

components/admin/dashboard/
├── dashboard-stats-cards.tsx
├── project-analytics.tsx
├── reminders-widget.tsx
├── team-collaboration.tsx
├── project-progress.tsx
├── project-list-widget.tsx
├── timer-widget.tsx
└── types.ts
```

## Implementation Notes

- Use strict TypeScript - no `any` types
- Update all deprecated dependencies
- Fix all warnings before commit
- Use Material Icons for consistency
- Apply emerald-600 as primary color
