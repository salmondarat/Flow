import { DashboardSidebar, DashboardHeader } from "@/components/dashboard";
import { ADMIN_NAV } from "@/components/dashboard";

export default function AdminLayout({
  children,
  params: _params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      <DashboardSidebar navigation={ADMIN_NAV} role="admin" user={null} />
      <div className="bg-background relative flex h-full min-w-0 flex-1 flex-col">
        <DashboardHeader role="admin" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
