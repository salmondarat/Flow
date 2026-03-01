import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ClientBrandingPanel } from "@/components/auth/client-branding-panel";
import { RegisterForm } from "@/components/auth/register-form";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

function RegisterFormWrapper() {
  return <RegisterForm />;
}

export default function ClientRegisterPage() {
  return (
    <AuthLayout brandingPanel={<ClientBrandingPanel />}>
      <Suspense
        fallback={<div className="flex h-full items-center justify-center">Loading...</div>}
      >
        <RegisterFormWrapper />
      </Suspense>
    </AuthLayout>
  );
}
