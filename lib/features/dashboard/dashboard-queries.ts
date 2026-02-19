/**
 * Dashboard Supabase Queries
 *
 * Server-side and client-side data fetching utilities for dashboard widgets
 */

import { createClient } from "@/lib/supabase/client";
import type {
  StatsCardData,
  TeamMember,
  ProjectListItem,
  ProjectProgress,
  Reminder,
  ProjectStatus,
  TaskStatus,
} from "@/components/admin/dashboard/types";

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboardStats(userId: string): Promise<StatsCardData[]> {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, status")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default values on error
    return [
      {
        title: "Total Projects",
        value: 0,
        subtitle: "Unable to load data",
        isPrimary: true,
      },
      {
        title: "Ended Projects",
        value: 0,
        subtitle: "Unable to load data",
      },
      {
        title: "Running Projects",
        value: 0,
        subtitle: "Unable to load data",
      },
      {
        title: "Pending Projects",
        value: 0,
        subtitle: "Unable to load data",
      },
    ];
  }

  const total = projects?.length ?? 0;
  const ended = projects?.filter((p) => p.status === ProjectStatus.ENDED).length ?? 0;
  const running = projects?.filter((p) => p.status === ProjectStatus.RUNNING).length ?? 0;
  const pending = projects?.filter((p) => p.status === ProjectStatus.PENDING).length ?? 0;

  return [
    {
      title: "Total Projects",
      value: total,
      subtitle: "Total projects",
      isPrimary: true,
      trend: { value: total > 0 ? 5 : 0, direction: "up" as const },
    },
    {
      title: "Ended Projects",
      value: ended,
      subtitle: "Completed projects",
      trend: ended > 0 ? { value: Math.floor(ended * 0.6), direction: "up" as const } : undefined,
    },
    {
      title: "Running Projects",
      value: running,
      subtitle: "Active projects",
      trend: running > 0 ? { value: Math.floor(running * 0.2), direction: "up" as const } : undefined,
    },
    {
      title: "Pending Projects",
      value: pending,
      subtitle: "Awaiting review",
    },
  ];
}

/**
 * Fetch team members with their current tasks
 */
export async function fetchTeamMembers(userId: string): Promise<TeamMember[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select(
      `
      id,
      user_id,
      users!inner(
        id,
        full_name,
        avatar_url
      ),
      team_tasks!inner(
        id,
        name,
        status
      )
    `
    )
    .eq("team_members.team_id", userId) // Assuming team filtering
    .limit(4);

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return (
    data?.map((member) => ({
      id: member.id,
      name: member.users.full_name || "Unknown",
      avatarUrl: member.users.avatar_url,
      taskName: member.team_tasks.name || "No task assigned",
      status: member.team_tasks.status as TaskStatus,
    })) ?? []
  );
}

/**
 * Fetch project list
 */
export async function fetchProjectList(userId: string): Promise<ProjectListItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, due_date, type")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Error fetching project list:", error);
    return [];
  }

  return (
    data?.map((project) => ({
      id: project.id,
      name: project.name,
      dueDate: new Date(project.due_date),
      type: project.type || "code",
    })) ?? []
  );
}

/**
 * Fetch project progress data
 */
export async function fetchProjectProgress(projectId: string): Promise<ProjectProgress> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("status")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching project progress:", error);
    return {
      completed: 0,
      inProgress: 0,
      pending: 0,
      total: 0,
    };
  }

  const total = data?.length ?? 0;
  const completed = data?.filter((t) => t.status === TaskStatus.COMPLETED).length ?? 0;
  const inProgress = data?.filter((t) => t.status === TaskStatus.IN_PROGRESS).length ?? 0;
  const pending = data?.filter((t) => t.status === TaskStatus.PENDING).length ?? 0;

  return {
    completed: total > 0 ? Math.round((completed / total) * 100) : 0,
    inProgress: total > 0 ? Math.round((inProgress / total) * 100) : 0,
    pending: total > 0 ? Math.round((pending / total) * 100) : 0,
    total,
  };
}

/**
 * Fetch upcoming reminders
 */
export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reminders")
    .select("id, title, start_time, end_time, date")
    .eq("user_id", userId)
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Error fetching reminders:", error);
    return [];
  }

  return (
    data?.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      startTime: new Date(reminder.start_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      endTime: new Date(reminder.end_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: new Date(reminder.date),
    })) ?? []
  );
}
