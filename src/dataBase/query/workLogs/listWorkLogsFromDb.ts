import { eq } from "drizzle-orm";
import {
  projects,
  tasks,
  userProfiles,
  users,
  workLogs,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface WorkLogListItem {
  id: number;
  userId: number | null;
  employeeName: string | null;
  employeeEmail: string | null;
  taskId: number | null;
  taskName: string | null;
  projectId: number | null;
  projectName: string | null;
  date: string | null;
  hoursWorked: string | null;
  isOvertime: boolean | null;
  note: string | null;
}

/**
 * Lists all work logs from the database with user, task, and project information.
 *
 * @returns Array of work logs with related user, task, and project data
 *
 * @example
 * ```ts
 * const allWorkLogs = await listWorkLogsFromDb();
 * console.log(`Found ${allWorkLogs.length} work logs`);
 * allWorkLogs.forEach(log => {
 *   console.log(`${log.employeeName} worked ${log.hoursWorked}h on ${log.projectName}`);
 * });
 * ```
 */
export async function listWorkLogsFromDb(): Promise<WorkLogListItem[]> {
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
