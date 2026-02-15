'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Global error boundary component
 * Catches client-side errors and displays a user-friendly message
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-md bg-muted p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">
              Error Details (Development):
            </p>
            <pre className="overflow-x-auto text-xs text-muted-foreground">
              {error.stack}
            </pre>
          </div>
        )}

        {/* Support Message */}
        <p className="text-sm text-muted-foreground">
          If this problem persists, please{' '}
          <a
            href="mailto:support@flow.com"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
