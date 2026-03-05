import { TasksPage } from "@/components/admin/tasks/tasks-page";
import { getKanbanTasks } from "@/lib/features/dashboard/kanban-queries";

export const dynamic = "force-dynamic";

export default async function TasksPageRoute() {
  const columns = await getKanbanTasks();
  return <TasksPage initialColumns={columns} />;
}
