import { eq } from "drizzle-orm";
import { tasks, users, userProfiles } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface ProjectTaskListItem {
  id: number;
  projectId: number | null;
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
 * Lists all tasks for a specific project.
 *
 * @param projectId - ID of the project
 * @returns Array of tasks for the specified project
 *
 * @example
 * ```ts
 * const projectTasks = await listTasksByProjectFromDb(5);
 * console.log(`Project has ${projectTasks.length} tasks`);
 * ```
 */
export async function listTasksByProjectFromDb(
  projectId: number,
): Promise<ProjectTaskListItem[]> {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await database
    .select({
      id: tasks.id,
      projectId: tasks.projectId,
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
    .leftJoin(users, eq(tasks.assignedToId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(tasks.projectId, projectId))
    .orderBy(tasks.createdAt);

  // Combine first and last name for assigned user
  return result.map((task) => ({
    id: task.id,
    projectId: task.projectId,
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
