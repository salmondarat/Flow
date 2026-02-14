# web-app Specification Deltas

## ADDED Requirements

### Requirement: Code Splitting for Heavy Dependencies

The application SHALL use Next.js dynamic imports for heavy client-side dependencies to reduce initial bundle size.

#### Scenario: Charts load dynamically on dashboard

- **GIVEN** an admin user navigates to the dashboard
- **WHEN** the dashboard page component renders
- **THEN** chart components SHALL be loaded dynamically
- **AND** a loading skeleton SHALL be displayed while charts load
- **AND** the initial page bundle SHALL NOT include chart library code

#### Scenario: Non-dashboard pages exclude chart code

- **GIVEN** a user navigates to any page other than the dashboard
- **WHEN** the page bundle is loaded
- **THEN** the bundle SHALL NOT contain Recharts library code
- **AND** the initial JavaScript payload SHALL be reduced by approximately 200KB

### Requirement: Memoized Layout Components

Frequently rendered layout components with minimal props SHALL be memoized to prevent unnecessary re-renders.

#### Scenario: Sidebar does not re-render on route change

- **GIVEN** an admin user is logged in
- **WHEN** the user navigates between admin routes
- **THEN** the sidebar component SHALL NOT re-render
- **AND** sidebar state SHALL be preserved across navigation

#### Scenario: Header does not re-render on unrelated state changes

- **GIVEN** an admin user is viewing any admin page
- **WHEN** state changes in a sibling component
- **THEN** the header component SHALL NOT re-render unless props change

### Requirement: Stable Keys for List Items

List items in React SHALL use stable unique identifiers as keys rather than array indices.

#### Scenario: List items use stable IDs

- **GIVEN** a component renders a list of items with unique IDs
- **WHEN** the list is rendered
- **THEN** each item SHALL use its unique ID as the React key
- **AND** array indices SHALL NOT be used as keys

#### Scenario: List re-ordering preserves component state

- **GIVEN** a list of items with stable IDs is displayed
- **WHEN** items are re-ordered in the list
- **THEN** React SHALL correctly associate each item with its previous component instance
- **AND** component state SHALL be preserved for each item

### Requirement: Cached Formatter Instances

Expensive formatter instances (e.g., Intl.NumberFormat) SHALL be cached at module level or with useMemo rather than created on every render.

#### Scenario: Currency formatter is reused

- **GIVEN** a component displays formatted currency values
- **WHEN** the component re-renders
- **THEN** the Intl.NumberFormat instance SHALL be reused
- **AND** a new formatter instance SHALL NOT be created

#### Scenario: Multiple formatters share same instance

- **GIVEN** multiple components require the same currency formatting
- **WHEN** formatters are created
- **THEN** a shared module-level formatter instance SHALL be used
- **AND** duplicate formatter instances SHALL NOT be created

## MODIFIED Requirements

### Requirement: Tailwind CSS Configuration

The system SHALL use Tailwind CSS for styling with custom design tokens.

#### Scenario: Tailwind utility classes

- **WHEN** using Tailwind utility classes in components
- **THEN** styles shall apply correctly
- **AND** support responsive breakpoints

#### Scenario: Custom design tokens

- **WHEN** using custom colors, spacing, or typography from the theme
- **THEN** the configured values shall apply
- **AND** be consistent across the application

#### Scenario: Font preloading

- **GIVEN** the application uses external fonts
- **WHEN** the root layout renders
- **THEN** critical font files SHALL be preloaded with `rel="preload"`
- **AND** fonts SHALL load earlier in the request waterfall
