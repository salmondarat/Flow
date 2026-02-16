import { Suspense } from "react";
import { UnifiedAuthPage } from "@/components/auth/unified-auth-page";

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <UnifiedAuthPage />
    </Suspense>
  );
}
