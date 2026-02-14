# dashboard Specification Deltas

## MODIFIED Requirements

### Requirement: Dashboard Statistics Cards

The dashboard MUST display statistics cards showing: total orders, in-progress orders, completed orders, and estimated revenue.

#### Scenario: Dashboard displays accurate statistics

- GIVEN an admin user is authenticated
- WHEN the user navigates to `/admin/dashboard`
- THEN statistics cards are displayed showing:
  - Total Orders count
  - In-Progress Orders count
  - Completed Orders count
  - Estimated Revenue (in IDR)
- AND all counts are accurate based on current database state
- AND currency formatters are cached (not recreated on each render)

#### Scenario: Statistics refresh on interval

- GIVEN an admin user is viewing the dashboard
- AND statistics are displayed
- WHEN 30 seconds have elapsed
- THEN the statistics automatically refresh
- AND updated values are displayed if data changed
- AND the statistics cards component does not re-render unless data changes

#### Scenario: Statistics cards use memoized formatters

- GIVEN the statistics cards component renders currency values
- WHEN multiple cards display formatted currency
- THEN a shared Intl.NumberFormat instance is used
- AND new formatter instances are not created for each card

## ADDED Requirements

### Requirement: Lazy-Loaded Chart Components

Chart components on the dashboard SHALL be loaded dynamically to reduce initial bundle size.

#### Scenario: Charts load after initial page render

- **GIVEN** an admin user navigates to `/admin/dashboard`
- **WHEN** the page initially renders
- **THEN** the page SHALL display loading skeletons for chart sections
- **AND** chart library code SHALL NOT be in the initial bundle
- **AND** chart components SHALL load asynchronously after initial render

#### Scenario: Chart loading state matches layout

- **GIVEN** a chart component is loading
- **WHEN** the loading state is active
- **THEN** a skeleton component SHALL be displayed
- **AND** the skeleton dimensions SHALL match the final chart size
- **AND** no layout shift SHALL occur when the chart loads

### Requirement: Optimized Dashboard Re-rendering

Dashboard components SHALL minimize re-renders through memoization and stable callbacks.

#### Scenario: Dashboard sections update independently

- **GIVEN** the dashboard displays multiple sections (stats, charts, activity, attention needed)
- **WHEN** data for one section updates
- **THEN** only that section SHALL re-render
- **AND** other sections SHALL NOT re-render
- **AND** the layout components (sidebar, header) SHALL NOT re-render

#### Scenario: Navigation does not re-render dashboard components

- **GIVEN** an admin user is viewing the dashboard
- **WHEN** the user navigates to a different admin route
- **THEN** previously mounted dashboard components SHALL unmount cleanly
- **AND** layout components SHALL use memoization to avoid unnecessary re-renders
