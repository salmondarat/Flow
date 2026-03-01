"use client";

import { unstable_noStore } from "next/cache";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ClientSettingsPage() {
  unstable_noStore();
  const router = useRouter();

  useEffect(() => {
    router.replace("/client/profile");
  }, [router]);

  return null;
}
