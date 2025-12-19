import { auth } from "@/auth";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { WorkTimeView } from "@/components/workTime/WorkTimeView";
import { listAllProjectAssignmentsFromDb } from "@/dataBase/query/projects/listAllProjectAssignmentsFromDb";
import { listAllTaskAssignmentsFromDb } from "@/dataBase/query/tasks/listAllTaskAssignmentsFromDb";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { listUsersFromDb } from "@/dataBase/query/users/listUsersFromDb";
import { listWorkLogsByUserFromDb } from "@/dataBase/query/workLogs/listWorkLogsByUserFromDb";
import { listWorkLogsFromDb } from "@/dataBase/query/workLogs/listWorkLogsFromDb";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkTimePage() {
  // Get current user session and profile
  const session = await auth();
  const userProfile = session?.user?.email
    ? await getFullUserProfileFromDbByEmail(session.user.email)
    : null;

  // Define access levels based on user role
  // Full access: Administrator, Zarząd - can see, add, edit, delete all logs
  // View all + own edit: HR, Księgowość - can see all logs but only add/edit/delete own
  // Own only: Regular employees - can only see and manage their own logs
  const fullAccessRoles = ["Administrator", "Zarząd"];
  const viewAllRoles = ["HR", "Księgowość"];

  const hasFullAccess = userProfile?.role?.name
    ? fullAccessRoles.includes(userProfile.role.name)
    : false;

  const canViewAll = userProfile?.role?.name
    ? viewAllRoles.includes(userProfile.role.name)
    : false;

  // Fetch work logs based on user role
  // Full access or view all roles can see all logs
  // Regular employees see only their own
  const workLogsData =
    hasFullAccess || canViewAll || !userProfile?.id
      ? await listWorkLogsFromDb()
      : await listWorkLogsByUserFromDb(userProfile.id);

  // Fetch all data in parallel for better performance
  const [usersData, allProjectAssignments, allTaskAssignments] =
    await Promise.all([
      listUsersFromDb(),
      listAllProjectAssignmentsFromDb(),
      listAllTaskAssignmentsFromDb(),
    ]);

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

  // Build user projects map from pre-fetched data (no additional queries)
  const userProjectsMap: Record<string, { label: string; value: string }[]> =
    {};

  for (const employee of availableEmployees) {
    userProjectsMap[employee.value] = [];
  }

  for (const assignment of allProjectAssignments) {
    if (assignment.isArchived) continue;
    const userIdStr = String(assignment.userId);
    if (!userProjectsMap[userIdStr]) {
      userProjectsMap[userIdStr] = [];
    }
    userProjectsMap[userIdStr].push({
      label: assignment.projectName || "Unknown",
      value: String(assignment.projectId),
    });
  }

  // Build user-project-tasks map from pre-fetched data (no additional queries)
  const userProjectTasksMap: Record<
    string,
    { label: string; value: string }[]
  > = {};

  for (const task of allTaskAssignments) {
    if (!task.assignedToId || !task.projectId) continue;
    const key = `${task.assignedToId}_${task.projectId}`;
    if (!userProjectTasksMap[key]) {
      userProjectTasksMap[key] = [];
    }
    userProjectTasksMap[key].push({
      label: task.title || "Unknown",
      value: String(task.id),
    });
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile
            title={
              hasFullAccess || canViewAll ? "Czas pracy" : "Mój czas pracy"
            }
          />
        </div>

        <WorkTimeView
          initialLogs={workLogs}
          availableEmployees={availableEmployees}
          userProjectsMap={userProjectsMap}
          userProjectTasksMap={userProjectTasksMap}
          hasFullAccess={hasFullAccess}
          canViewAll={canViewAll}
          currentUserId={userProfile?.id}
        />
      </main>
    </div>
  );
}
