import { eq } from "drizzle-orm";
import {
  projects,
  tasks,
  userProfiles,
  users,
  workLogs,
} from "@/dataBase/schema";
import { database } from "@/utils/db";
import type { WorkLogListItem } from "./listWorkLogsFromDb";

/**
 * Lists all work logs for a specific project from the database.
 *
 * @param projectId - ID of the project whose work logs to retrieve
 * @returns Array of work logs with related user and task data
 *
 * @example
 * ```ts
 * const projectWorkLogs = await listWorkLogsByProjectFromDb(3);
 * console.log(`Project has ${projectWorkLogs.length} work log entries`);
 * ```
 */
export async function listWorkLogsByProjectFromDb(
  projectId: number,
): Promise<WorkLogListItem[]> {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await database
    .select({
      id: workLogs.id,
      userId: workLogs.userId,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      employeeEmail: users.email,
      taskId: workLogs.taskId,
      taskName: tasks.title,
      projectId: workLogs.projectId,
      projectName: projects.name,
      date: workLogs.date,
      hoursWorked: workLogs.hoursWorked,
      isOvertime: workLogs.isOvertime,
      note: workLogs.note,
    })
    .from(workLogs)
    .leftJoin(users, eq(workLogs.userId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(tasks, eq(workLogs.taskId, tasks.id))
    .leftJoin(projects, eq(workLogs.projectId, projects.id))
    .where(eq(workLogs.projectId, projectId))
    .orderBy(workLogs.date);

  // Combine first and last name for employee
  return result.map((log) => ({
    id: log.id,
    userId: log.userId,
    employeeName:
      log.firstName && log.lastName ? `${log.firstName} ${log.lastName}` : null,
    employeeEmail: log.employeeEmail,
    taskId: log.taskId,
    taskName: log.taskName,
    projectId: log.projectId,
    projectName: log.projectName,
    date: log.date,
    hoursWorked: log.hoursWorked,
    isOvertime: log.isOvertime,
    note: log.note,
  }));
}
