import { and, eq } from "drizzle-orm";
import { tasks } from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Lists all tasks assigned to a specific user in a specific project.
 *
 * @param userId - The ID of the user
 * @param projectId - The ID of the project
 * @returns Array of tasks assigned to the user in the project
 *
 * @example
 * ```ts
 * const userProjectTasks = await listTasksByUserAndProjectFromDb(5, 10);
 * console.log(`User has ${userProjectTasks.length} tasks in this project`);
 * ```
 */
export async function listTasksByUserAndProjectFromDb(
  userId: number,
  projectId: number,
) {
  const result = await database
    .select({
      id: tasks.id,
      projectId: tasks.projectId,
      title: tasks.title,
      description: tasks.description,
      assignedToId: tasks.assignedToId,
      status: tasks.status,
      estimatedHours: tasks.estimatedHours,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .where(and(eq(tasks.assignedToId, userId), eq(tasks.projectId, projectId)));

  return result;
}
