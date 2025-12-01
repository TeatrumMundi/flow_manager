import { eq } from "drizzle-orm";
import { projects, tasks } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface UserTaskListItem {
  id: number;
  projectId: number | null;
  projectName: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  estimatedHours: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Lists all tasks assigned to a specific user.
 *
 * @param userId - ID of the user
 * @returns Array of tasks assigned to the specified user
 *
 * @example
 * ```ts
 * const myTasks = await listTasksByUserFromDb(7);
 * console.log(`You have ${myTasks.length} tasks assigned`);
 * ```
 */
export async function listTasksByUserFromDb(
  userId: number,
): Promise<UserTaskListItem[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const result = await database
    .select({
      id: tasks.id,
      projectId: tasks.projectId,
      projectName: projects.name,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      estimatedHours: tasks.estimatedHours,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(eq(tasks.assignedToId, userId))
    .orderBy(tasks.createdAt);

  return result;
}
