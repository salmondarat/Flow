## ADDED Requirements

### Requirement: Supabase Client Configuration

The system SHALL provide Supabase clients for client-side, server-side, and admin operations.

#### Scenario: Client-side Supabase access

- **WHEN** importing from `@/lib/supabase/client`
- **THEN** a Supabase client configured with anon key shall be available
- **AND** the client shall work in browser contexts

#### Scenario: Server-side Supabase access

- **WHEN** importing from `@/lib/supabase/server`
- **THEN** a Supabase client configured for server components shall be available
- **AND** the client shall use cookies for session management

#### Scenario: Admin Supabase access

- **WHEN** importing from `@/lib/supabase/admin`
- **THEN** a Supabase client with service role key shall be available
- **AND** the client shall bypass RLS for admin operations

### Requirement: Environment Variable Validation

The system SHALL validate required Supabase environment variables on startup.

#### Scenario: Missing environment variables

- **WHEN** required Supabase environment variables are missing
- **THEN** the application shall throw a clear error message on startup
- **AND** list which variables are missing

#### Scenario: Invalid environment variables

- **WHEN** Supabase URL or keys are invalid
- **THEN** the application shall fail fast with a descriptive error
- **AND** not start the development server

### Requirement: Type-Safe Database Queries

The system SHALL provide TypeScript types for database tables and queries.

#### Scenario: Database type definitions

- **WHEN** querying the database
- **THEN** TypeScript shall infer return types from database schema
- **AND** provide autocomplete for table and column names

#### Scenario: Domain type exports

- **WHEN** importing from `@/types`
- **THEN** domain types (OrderStatus, ServiceType, Complexity, UserRole) shall be available
- **AND** data interfaces (Order, OrderItem, ChangeRequest, ProgressLog) shall be defined
