# Flow

A project management tool built with Next.js 15, TypeScript, and Supabase.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd flow
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format

# Run type checking
pnpm type-check
```

## Project Structure

```
flow/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard routes
│   ├── (public)/          # Public-facing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── admin/            # Admin-specific components
│   └── providers/        # Context providers
├── lib/                   # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── features/         # Feature-specific modules
│   ├── supabase/         # Supabase client configs
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript type definitions
├── supabase/             # Database migrations
└── public/               # Static assets
```

## Database Setup

Run migrations using the Supabase CLI:

```bash
# Link to your Supabase project
supabase link

# Push database schema
supabase db push
```

## Development Workflow

1. Create a new branch for your feature
2. Make your changes following the code style guidelines
3. Run tests and linting
4. Submit a pull request

## Type Safety

This project follows strict TypeScript conventions:

- No `as any` type assertions
- Use proper Supabase generics for query results
- All database types are defined in `types/database.ts`
- Utility types are exported from `types/index.ts`

## License

[MIT](LICENSE)
