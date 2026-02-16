"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Global 404 Not Found page
 * Displayed when a user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* 404 Number */}
        <div className="mx-auto">
          <h1 className="text-9xl font-bold text-primary">404</h1>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Message */}
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Looking for something? Try checking the URL or{' '}
            <Link
              href="/"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              visit our home page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
