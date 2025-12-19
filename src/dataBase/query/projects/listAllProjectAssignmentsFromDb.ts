import { eq } from "drizzle-orm";
import { projectAssignments, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface AllProjectAssignmentItem {
  userId: number;
  projectId: number;
  projectName: string | null;
  isArchived: boolean | null;
}

/**
 * Lists all project assignments for all users in a single query.
 * Much more efficient than querying per-user when building maps.
 *
 * @returns Array of all user-project assignments
 *
 * @example
 * ```ts
 * const allAssignments = await listAllProjectAssignmentsFromDb();
 * // Build a map: userId -> projects[]
 * ```
 */
export async function listAllProjectAssignmentsFromDb(): Promise<
  AllProjectAssignmentItem[]
> {
  const result = await database
    .select({
      userId: projectAssignments.userId,
      projectId: projectAssignments.projectId,
      projectName: projects.name,
      isArchived: projects.isArchived,
    })
    .from(projectAssignments)
    .innerJoin(projects, eq(projectAssignments.projectId, projects.id));

  return result;
}
