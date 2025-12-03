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
 * Lists all work logs for a specific task from the database.
 *
 * @param taskId - ID of the task whose work logs to retrieve
 * @returns Array of work logs with related user and project data
 *
 * @example
 * ```ts
 * const taskWorkLogs = await listWorkLogsByTaskFromDb(15);
 * console.log(`Task has ${taskWorkLogs.length} work log entries`);
 * ```
 */
export async function listWorkLogsByTaskFromDb(
  taskId: number,
): Promise<WorkLogListItem[]> {
  if (!taskId) {
    throw new Error("Task ID is required");
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
    .where(eq(workLogs.taskId, taskId))
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
