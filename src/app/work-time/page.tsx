import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { WorkTimeView } from "@/components/workTime/WorkTimeView";
import { listProjectsByUserFromDb } from "@/dataBase/query/projects/listProjectsByUserFromDb";
import { listProjectsFromDb } from "@/dataBase/query/projects/listProjectsFromDb";
import { listTasksByProjectFromDb } from "@/dataBase/query/tasks/listTasksByProjectFromDb";
import { listUsersFromDb } from "@/dataBase/query/users/listUsersFromDb";
import { listWorkLogsFromDb } from "@/dataBase/query/workLogs/listWorkLogsFromDb";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkTimePage() {
  // Fetch data from database
  const workLogsData = await listWorkLogsFromDb();
  const usersData = await listUsersFromDb();
  const projectsData = await listProjectsFromDb({ isArchived: false });

  // Transform work logs to match component interface
  const workLogs = workLogsData.map((log) => ({
    id: log.id,
    employeeName: log.employeeName || "Unknown",
    date: log.date || "",
    projectName: log.projectName || "Unknown",
    taskName: log.taskName || "Unknown",
    hours: Number.parseFloat(log.hoursWorked || "0"),
    isOvertime: log.isOvertime || false,
    note: log.note || "",
    userId: log.userId || undefined,
    taskId: log.taskId || undefined,
    projectId: log.projectId || undefined,
  }));

  // Prepare available employees
  const availableEmployees = usersData
    .filter((user) => user.firstName && user.lastName)
    .map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: String(user.id),
    }));

  // Build project tasks map
  const projectTasksMap: Record<string, { label: string; value: string }[]> =
    {};

  for (const project of projectsData) {
    if (project.id) {
      const tasks = await listTasksByProjectFromDb(project.id);
      projectTasksMap[String(project.id)] = tasks.map((task) => ({
        label: task.title || "Unknown",
        value: String(task.id),
      }));
    }
  }

  // Build user projects map - map of userId to their assigned projects
  const userProjectsMap: Record<string, { label: string; value: string }[]> =
    {};

  for (const user of usersData) {
    if (user.id) {
      const userProjects = await listProjectsByUserFromDb(user.id);
      userProjectsMap[String(user.id)] = userProjects
        .filter((project) => !project.isArchived)
        .map((project) => ({
          label: project.name || "Unknown",
          value: String(project.id),
        }));
    }
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Czas pracy" />
        </div>

        <WorkTimeView
          initialLogs={workLogs}
          availableEmployees={availableEmployees}
          projectTasksMap={projectTasksMap}
          userProjectsMap={userProjectsMap}
        />
      </main>
    </div>
  );
}
