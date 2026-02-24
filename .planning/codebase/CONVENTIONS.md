# Coding Conventions

**Analysis Date:** 2026-02-24

## Naming Patterns

**Files:**

- Components: `kebab-case.tsx` (e.g., `button.tsx`, `order-form.tsx`)
- Utilities/Lib: `kebab-case.ts` (e.g., `utils.ts`, `calculate.ts`)
- Types: `kebab-case.ts` (e.g., `types.ts`)

**Functions:**

- camelCase: `useServiceConfiguration()`, `calculatePrice()`, `getServiceTypes()`
- Hooks: Prefix with `use` (e.g., `useServiceConfiguration`, `useComplexitiesForService`)
- Async API functions: Prefix with verb (e.g., `getServiceTypes`, `createServiceType`, `updateServiceType`)

**Variables:**

- camelCase: `isLoading`, `error`, `services`, `complexities`
- Interfaces/Types: PascalCase (e.g., `ServiceConfiguration`, `ServicePricingData`)

**Components:**

- PascalCase: `Button`, `OrderForm`, `ServiceSelector`
- Variants via cva: `buttonVariants` (camelCase)

## Code Style

**Formatting:**

- Tool: Prettier 3.x
- Settings (`.prettierrc`):
  ```json
  {
    "semi": true,
    "singleQuote": false,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100
  }
  ```
- Tailwind CSS plugin enabled

**Linting:**

- Tool: ESLint 9.x with TypeScript ESLint
- Config: `eslint.config.mjs`
- Key rules enforced:
  - `react-hooks/exhaustive-deps` (warn)
  - `react-refresh/only-export-components` (warn)
  - TypeScript strict rules relaxed to warnings:
    - `@typescript-eslint/no-explicit-any`: warn
    - `@typescript-eslint/no-unused-vars`: off
    - `@typescript-eslint/no-unsafe-*`: warn

## Import Organization

**Order:**

1. React/Next imports: `react`, `next`
2. External UI libraries: `@radix-ui/*`, `@tanstack/*`, `lucide-react`
3. External services: `@supabase/*`
4. Internal path aliases: `@/lib/*`, `@/components/*`, `@/types`

**Example:**

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ServiceType } from "@/types";
```

**Path Aliases:**

- `@/*` maps to project root (see `tsconfig.json`)

## Error Handling

**Patterns:**

- Try/catch blocks with console.error logging:

  ```typescript
  try {
    const data = await getServiceTypes();
    return data;
  } catch (err) {
    console.error("Error fetching service types:", err);
    throw new Error(`Failed to fetch service types: ${error.message}`);
  }
  ```

- Error state in hooks:

  ```typescript
  const [error, setError] = useState<string | null>(null);
  // ...
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch service configuration";
    setError(message);
    console.error("Error fetching service configuration:", err);
  }
  ```

- Type guards for validation:
  ```typescript
  export function isValidEstimationInput(input: unknown): input is EstimationInput {
    if (typeof input !== "object" || input === null) {
      return false;
    }
    // ...
  }
  ```

## Logging

**Framework:** `console` (browser console)

**Patterns:**

- Error logging with context: `console.error("Error fetching service types:", error);`
- No structured logging framework currently in use

## Comments

**When to Comment:**

- Public API functions with JSDoc
- Deprecation notices with `@deprecated`
- Complex business logic
- TODO items for technical debt

**JSDoc/TSDoc:**

- Usage: Required for public functions in `lib/` directory
- Tags used: `@param`, `@returns`, `@throws`, `@deprecated`, `@example`

**Example from `lib/estimation/calculate.ts`:**

```typescript
/**
 * Calculate price for a single service + complexity combination
 * @deprecated Use calculatePriceAsync from pricing service for new code
 * @param service - Type of service
 * @param complexity - Complexity level
 * @returns Price in cents (IDR)
 * @throws Error if invalid service or complexity
 */
```

## Function Design

**Size:** No strict limit, but prefer small, focused functions

**Parameters:**

- Options objects with defaults:
  ```typescript
  export async function getServiceTypes(
    options: { activeOnly?: boolean; includeInactive?: boolean } = {}
  );
  ```

**Return Values:**

- Always typed (no implicit any)
- Async functions return Promises
- Null checks for optional data: `return data || []`

## Module Design

**Exports:**

- Named exports for utilities/hooks: `export function useServiceConfiguration()`
- Default exports for page components
- Re-exports in index files: `lib/index.ts`, `lib/features/index.ts`

**Barrel Files:**

- Used in `lib/` for feature organization: `lib/features/index.ts`
- Used in `types/` for type re-exports

## Component Patterns

**Client Components:**

- Use `'use client'` directive at top
- Located in: `components/`, `components/ui/`, `components/*/`
- Use React Query for data fetching

**Server Components:**

- Default in Next.js App Router
- Located in: `app/` directory
- Async by default

**UI Components:**

- Use `class-variance-authority` (cva) for variants
- Use `cn()` utility for class merging (clsx + tailwind-merge)
- Forward refs with generic types

**Example from `components/ui/button.tsx`:**

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2...",
  {
    variants: {
      variant: { default: "...", destructive: "...", outline: "..." },
      size: { default: "...", sm: "...", lg: "...", icon: "..." },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
```

## React Query Integration

**Pattern:**

- Use `useQuery` for data fetching
- Use `useMutation` for data mutations
- Provider wrapping in `components/providers/query-provider.tsx`

**Default Options:**

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});
```

---

_Convention analysis: 2026-02-24_
