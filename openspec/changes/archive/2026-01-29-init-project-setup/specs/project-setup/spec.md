## ADDED Requirements

### Requirement: Next.js Project Structure

The system SHALL use Next.js 15 with App Router and TypeScript strict mode as the web framework.

#### Scenario: Project initialization

- **WHEN** a new developer clones the repository
- **THEN** running `npm install` and `npm run dev` shall start the development server
- **AND** the project shall compile with TypeScript strict mode enabled

#### Scenario: Build process

- **WHEN** running `npm run build`
- **THEN** the application shall build without TypeScript errors
- **AND** production assets shall be generated

### Requirement: Code Quality Tools

The system SHALL include ESLint and Prettier configured with project conventions.

#### Scenario: Linting

- **WHEN** running `npm run lint`
- **THEN** ESLint shall check all TypeScript files
- **AND** report only violations of project conventions

#### Scenario: Code formatting

- **WHEN** running `npm run format`
- **THEN** Prettier shall format all files according to project rules
- **AND** the formatted output shall match project style guide

### Requirement: Environment Configuration

The system SHALL use environment variables for sensitive configuration.

#### Scenario: Environment variable loading

- **WHEN** the application starts
- **THEN** environment variables shall be loaded from `.env.local`
- **AND** missing required variables shall cause a clear error message

#### Scenario: Type-safe environment access

- **WHEN** code accesses environment variables
- **THEN** variables shall be type-safe
- **AND** undefined variables shall cause TypeScript errors at build time

### Requirement: Path Aliases

The system SHALL use TypeScript path aliases for clean imports.

#### Scenario: Importing with aliases

- **WHEN** importing from `@/components`, `@/lib`, or `@/types`
- **THEN** the import shall resolve correctly
- **AND** TypeScript shall provide autocomplete support
