import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
  params: _params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] text-gray-900 dark:text-gray-50 flex h-screen overflow-hidden font-sans antialiased">
      <AdminSidebar />
      <div className="relative flex h-full min-w-0 flex-1 flex-col">
        <div className="shrink-0 h-20 flex items-center">
          <AdminHeader />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
