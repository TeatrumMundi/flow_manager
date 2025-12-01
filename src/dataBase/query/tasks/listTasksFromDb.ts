import { eq } from "drizzle-orm";
import { tasks, projects, users, userProfiles } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface TaskListItem {
  id: number;
  projectId: number | null;
  projectName: string | null;
  title: string | null;
  description: string | null;
  assignedToId: number | null;
  assignedToName: string | null;
  assignedToEmail: string | null;
  status: string | null;
  estimatedHours: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Lists all tasks from the database with project and assignee information.
 *
 * @returns Array of tasks with related project and user data
 *
 * @example
 * ```ts
 * const allTasks = await listTasksFromDb();
 * console.log(`Found ${allTasks.length} tasks`);
 * allTasks.forEach(task => {
 *   console.log(`${task.title} assigned to ${task.assignedToName || 'Unassigned'}`);
 * });
 * ```
 */
export async function listTasksFromDb(): Promise<TaskListItem[]> {
  const result = await database
    .select({
      id: tasks.id,
      projectId: tasks.projectId,
      projectName: projects.name,
      title: tasks.title,
      description: tasks.description,
      assignedToId: tasks.assignedToId,
      assignedToName: userProfiles.firstName,
      assignedToLastName: userProfiles.lastName,
      assignedToEmail: users.email,
      status: tasks.status,
      estimatedHours: tasks.estimatedHours,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assignedToId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .orderBy(tasks.createdAt);

  // Combine first and last name for assigned user
  return result.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    projectName: task.projectName,
    title: task.title,
    description: task.description,
    assignedToId: task.assignedToId,
    assignedToName:
      task.assignedToName && task.assignedToLastName
        ? `${task.assignedToName} ${task.assignedToLastName}`
        : null,
    assignedToEmail: task.assignedToEmail,
    status: task.status,
    estimatedHours: task.estimatedHours,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}
