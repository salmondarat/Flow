# Testing Patterns

**Analysis Date:** 2026-02-24

## Test Framework

**Unit Testing:**

- Framework: Vitest 3.x
- Config: Not detected (default config used)
- Run command: `npm test` or `pnpm test`

**E2E Testing:**

- Framework: Playwright 1.50.x
- Config: Not detected
- Run command: `npm run test:e2e` or `pnpm test:e2e`

**Run Commands:**

```bash
npm test              # Run all unit tests (vitest)
npm test -- --watch  # Watch mode
npm run test:e2e     # Run E2E tests (playwright)
```

## Test File Organization

**Location:**

- Not established - **no test files currently exist in the codebase**
- Recommended pattern: Co-located with source files or in `__tests__/` directories

**Naming:**

- Standard: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- E2E: `*.e2e.ts` or in `e2e/` directory

## Test Structure

**Vitest (not yet implemented):**

- Would follow standard Vitest structure:

  ```typescript
  import { describe, it, expect, beforeEach } from "vitest";
  import { calculatePrice } from "@/lib/estimation/calculate";

  describe("calculatePrice", () => {
    it("should calculate price for valid service and complexity", () => {
      const price = calculatePrice("full_build", "medium");
      expect(price).toBeGreaterThan(0);
    });

    it("should throw error for invalid service type", () => {
      expect(() => calculatePrice("invalid", "medium")).toThrow();
    });
  });
  ```

## Mocking

**Framework:** Vitest built-in mocking (or Jest compatibility)

**Patterns to use:**

```typescript
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocking modules
vi.mock("@/lib/api/services", () => ({
  getServiceTypes: vi.fn().mockResolvedValue([{ id: "1", name: "Test" }]),
}));

// Mocking React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  }),
}));
```

**What to Mock:**

- External APIs (`@/lib/api/*`)
- Supabase clients
- Third-party UI libraries (Radix UI primitives)
- Time/date utilities

**What NOT to Mock:**

- Application logic being tested
- Simple utility functions (`lib/utils.ts` - test directly)
- Internal helper functions

## Fixtures and Factories

**Test Data:**

- Create factory functions for complex objects:
  ```typescript
  function createMockServiceType(overrides = {}) {
    return {
      id: "test-id",
      slug: "full_build",
      name: "Full Build",
      description: "Full build service",
      basePriceCents: 100000,
      baseDays: 7,
      isActive: true,
      sortOrder: 1,
      ...overrides,
    };
  }
  ```

**Location:**

- `__fixtures__/` directory at project root or per-module
- Or co-located with test files

## Coverage

**Requirements:** None currently enforced

**View Coverage:**

```bash
npm test -- --coverage
```

## Test Types

**Unit Tests:**

- Focus: Pure functions in `lib/estimation/`, `lib/utils.ts`
- Location: `lib/__tests__/` or co-located
- Example: `calculatePrice`, `cn` utility, validation functions

**Integration Tests:**

- Focus: API functions with Supabase
- Mock Supabase client
- Location: `lib/api/__tests__/` or `__tests__/api/`

**E2E Tests:**

- Framework: Playwright (configured but not implemented)
- Scope: Critical user flows (auth, order creation, tracking)
- Location: `e2e/` directory (to be created)

## Common Patterns

**Async Testing:**

```typescript
import { render, screen, waitFor } from '@testing-library/react';

it('should load services', async () => {
  render(<ServiceList />);

  await waitFor(() => {
    expect(screen.getByText('Full Build')).toBeInTheDocument();
  });
});
```

**Error Testing:**

```typescript
import { render, screen } from '@testing-library/react';

it('should display error message', () => {
  vi.mock('@/lib/api/services', () => ({
    getServiceTypes: vi.fn().mockRejectedValue(new Error('Network error')),
  }));

  render(<ServiceList />);

  expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
});
```

**User Interaction:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should submit form on button click', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();

  render(<OrderForm onSubmit={handleSubmit} />);

  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalled();
});
```

## React Component Testing

**Recommended Libraries:**

- `@testing-library/react` - Component rendering
- `@testing-library/user-event` - User interactions
- `@testing-library/jest-dom` - DOM matchers

**Setup:**

```typescript
// vitest.setup.ts (create this file)
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

**Configure in vitest.config.ts:**

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

## Playwright E2E Setup

**Recommended Configuration (to be created as `playwright.config.ts`):**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Example E2E Test:**

```typescript
import { test, expect } from "@playwright/test";

test("should complete order flow", async ({ page }) => {
  await page.goto("/");

  // Navigate to order page
  await page.click("text=Order Now");

  // Fill order form
  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="phone"]', "+62812345678");

  // Submit
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page).toHaveURL(/.*success/);
  await expect(page.locator("text=Order submitted")).toBeVisible();
});
```

---

_Testing analysis: 2026-02-24_
