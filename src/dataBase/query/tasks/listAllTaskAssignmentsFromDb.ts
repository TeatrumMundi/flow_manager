import { tasks } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface AllTaskAssignmentItem {
  id: number;
  projectId: number | null;
  assignedToId: number | null;
  title: string | null;
}

/**
 * Lists all tasks with their assignments in a single query.
 * Much more efficient than querying per-user-project when building maps.
 *
 * @returns Array of all tasks with assignment info
 *
 * @example
 * ```ts
 * const allTasks = await listAllTaskAssignmentsFromDb();
 * // Build a map: "userId_projectId" -> tasks[]
 * ```
 */
export async function listAllTaskAssignmentsFromDb(): Promise<
  AllTaskAssignmentItem[]
> {
  const result = await database
    .select({
      id: tasks.id,
      projectId: tasks.projectId,
      assignedToId: tasks.assignedToId,
      title: tasks.title,
    })
    .from(tasks);

  return result;
}
