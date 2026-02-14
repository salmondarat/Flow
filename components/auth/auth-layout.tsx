interface AuthLayoutProps {
  children: React.ReactNode;
  brandingPanel: React.ReactNode;
}

/**
 * AuthLayout - Split-screen authentication page layout
 *
 * Left panel: Branding content (hidden on mobile)
 * Right panel: Centered auth form
 *
 * Responsive: Stacked on mobile (<1024px), side-by-side on desktop (>=1024px)
 */
export function AuthLayout({ children, brandingPanel }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="bg-primary text-primary-foreground hidden flex-col justify-between p-12 lg:flex">
        {brandingPanel}
      </div>

      {/* Right Panel - Auth Form */}
      <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:min-h-0 lg:p-12">
        {children}
      </div>
    </div>
  );
}
