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
 * Retrieves a single work log by ID from the database with related information.
 *
 * @param workLogId - ID of the work log to retrieve
 * @returns Work log with related user, task, and project data
 * @throws Error if work log not found
 *
 * @example
 * ```ts
 * const workLog = await getWorkLogByIdFromDb(42);
 * console.log(`Work log: ${workLog.employeeName} - ${workLog.hoursWorked}h`);
 * ```
 */
export async function getWorkLogByIdFromDb(
  workLogId: number,
): Promise<WorkLogListItem> {
  if (!workLogId) {
    throw new Error("Work log ID is required");
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
    .where(eq(workLogs.id, workLogId))
    .limit(1);

  if (result.length === 0) {
    throw new Error(`Work log with ID ${workLogId} not found`);
  }

  const log = result[0];

  return {
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
  };
}
