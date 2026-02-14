# Change: Initialize Project Structure with Minimal Setup

## Why

The project directory is currently empty except for OpenSpec scaffolding. Before implementing any features, we need to establish the foundational project structure with Next.js, TypeScript, Tailwind CSS, and Supabase integration. This will provide a working development environment and enable incremental feature development.

## What Changes

- Initialize Next.js 15 project with TypeScript and App Router
- Configure Tailwind CSS with custom design tokens
- Set up shadcn/ui component library
- Configure Supabase client (client and server)
- Create base project structure (app/, components/, lib/, types/)
- Set up ESLint and Prettier with project conventions
- Configure environment variable handling
- Create landing page as proof of life
- Set up basic admin layout with sidebar

## Impact

- **Affected specs**: `project-setup`, `web-app`, `database` (new capabilities)
- **Affected code**: All new files (entire project structure)
- **Breaking changes**: None (new project)

## Success Criteria

- Project runs locally with `npm run dev`
- Landing page loads at `http://localhost:3000`
- Admin login route exists at `/admin/login`
- Supabase connection is configurable via environment variables
- TypeScript compiles without errors
- ESLint passes with project conventions
