/**
 * ClientBrandingPanel - Left panel branding content for client authentication pages
 *
 * Features:
 * - Flow.sys branding with token icon
 * - Build journey tagline
 * - Feature list: Real-time Tracking, Change Requests, Builder Chat
 * - Blue background (bg-primary) applied by parent layout
 */
export function ClientBrandingPanel() {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined icon-fill text-4xl">token</span>
        <span className="text-3xl font-bold tracking-widest uppercase">
          Flow<span className="text-yellow-300">.sys</span>
        </span>
      </div>

      {/* Tagline */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Your Build Journey Starts Here</h2>
        <p className="text-primary-foreground/80 mt-4 text-lg">
          Track your custom model kit orders, request changes, and communicate with builders.
        </p>
      </div>

      {/* Features List */}
      <ul className="mt-12 space-y-4">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-yellow-300">visibility</span>
          <span className="text-lg">Real-time Order Tracking</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-yellow-300">edit</span>
          <span className="text-lg">Change Requests</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-yellow-300">chat</span>
          <span className="text-lg">Direct Builder Chat</span>
        </li>
      </ul>

      {/* Footer */}
      <div className="border-primary-foreground/20 mt-auto border-t pt-12">
        <p className="text-primary-foreground/60 text-sm">v2.0 // System Operational</p>
      </div>
    </>
  );
}
