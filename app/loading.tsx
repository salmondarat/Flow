/**
 * Global loading state component
 * Displayed during route transitions and data fetching
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-4 border-primary/70 border-t-transparent" style={{ animationDuration: '1.5s' }} />
        </div>

        {/* Loading Text */}
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
