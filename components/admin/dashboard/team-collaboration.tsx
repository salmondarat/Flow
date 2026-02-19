"use client";

import { Plus } from "lucide-react";
import type { TeamMember, TaskStatus, WidgetState } from "./types";
import { useState, useEffect } from "react";

const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case TaskStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case TaskStatus.PENDING:
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
};

const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "Completed";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.PENDING:
      return "Pending";
  }
};

export function TeamCollaborationWidget() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");

  useEffect(() => {
    // TODO: Connect to Supabase to fetch team members
    // For now, use sample data matching HTML reference
    const sampleMembers: TeamMember[] = [
      {
        id: "1",
        name: "Alexandra Deff",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_qJ9tvZF2Qw38swFrqmUlu3yp0_KSZa99pDmIfVcsQh5QbkrfkEQAm8ZbU4wNjY943Hn0OBBvToESc7GtsJco2gXXzVsTuoim83rcZdzsl9ozcN5P8NHV57l_YvFnKiBWRbuwpoFfE2PgB3umkMgH1JNruCc_lYUxadZxZNMOwrzgnMSp4Tam-8HA_MZJV6LMMY1GON9Ftp2-uilpCB6ptsGoDnxfnBsILTngoSIRg0lgUC8DOuLZ8pUER_GWeKJa02wZOhlgP4",
        taskName: "Working on Github Project Repository",
        status: TaskStatus.COMPLETED,
      },
      {
        id: "2",
        name: "Edwin Adenike",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4t8yE7-nOV4QH-4ERtvuPuXjCe461N5RFC6iSU8Xc-pfZbTGhX2wvdCN1UPCEyDS5ZJh29BCFPTKxMDHG8E0AonkOhwd7P2fQ9STFf7bOezeeooowCmibPO_eoqWY_Y37vEjTkgngcEbgGUr-irOoH31I5PGjNduzPQHPwQ1XYGRj4w8hNd9nGPZTIVgCt-74Gzbd8lruO7JUFLaSz1QQ4tfdj6_RBria5l7FKimrjZF5KEBuIwEoHqz3Rrb-R2PWo-bCee72_Qs",
        taskName: "Working on Integrate User Auth",
        status: TaskStatus.IN_PROGRESS,
      },
      {
        id: "3",
        name: "Isaac Oluwate",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5hs6JBo2WlGdw35o7_ipwmJBUqREYK1p2QUOADRs_VL7iYomEr-lBscsBj_gaM7vMB4HOPgdWKfQT127rXmpvFaboYe-7uZEzEyq2oxDEnpzm5D-IXho1t30ZtgQ0aiX4ie9iX7KpOu9ZVCifCGcNjjEf_e9KsQ4iX0BnIvE_I-Hr6zMRprsCgI2cPYOdp09KzQ4swRujVCgwTWklPEDi6BypajezBCKSOY9Syv1z_l_l24-AvGW4DIB3s2HH9gExkl-NenZKWzM",
        taskName: "Working on Develop Search",
        status: TaskStatus.PENDING,
      },
      {
        id: "4",
        name: "David Oshodi",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjOTNwK5EBP19dWd6pS_OKUAkTw77ZHbCuWCRdUfbEq8MzFFK9vqu82UhCIkFOlLNrHM9hlRwG-Bdxlime7ElOvDROQNKX5fJnk664QzUqQNNgmBX3j5SJ-bFvP0DDtHtnRwbhbFE7q6m59tWj5odr10qtKIWe3tbc1uwnn-t7VQQRZuXtm1xk5JAx1LQJvUcBavPjJj5qcthlPtJIxTFw4v0e6jAH5cUYvpE96H7REVmAfsBiQNGQAiNiGFiNxSw2ywS1BBWXgU4",
        taskName: "Working on Responsive Layout",
        status: TaskStatus.IN_PROGRESS,
      },
    ];
    setTeamMembers(sampleMembers);
    setWidgetState("success");
  }, []);

  if (widgetState === "loading") {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Team Collaboration</h3>
          <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Plus className="h-3 w-3 mr-1" />
            Add Member
          </button>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Team Collaboration</h3>
        <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus className="h-3 w-3 mr-1" />
          Add Member
        </button>
      </div>

      <div className="space-y-5">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-start space-x-3">
            <img
              src={member.avatarUrl || ""}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {member.name}
                </p>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusColor(member.status)}`}
                >
                  {getStatusLabel(member.status)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                Working on <span className="font-semibold text-gray-900 dark:text-white">
                  {member.taskName}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
