import { DashboardSidebar, DashboardHeader } from "@/components/dashboard";
import { CLIENT_NAV } from "@/components/dashboard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      <DashboardSidebar navigation={CLIENT_NAV} role="client" user={null} />
      <div className="bg-background relative flex h-full min-w-0 flex-1 flex-col">
        <DashboardHeader role="client" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-[1400px] flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
