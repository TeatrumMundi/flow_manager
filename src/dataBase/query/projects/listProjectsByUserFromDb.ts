import { eq } from "drizzle-orm";
import { projectAssignments, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Lists all projects assigned to a specific user.
 *
 * @param userId - The ID of the user
 * @returns Array of projects assigned to the user
 *
 * @example
 * ```ts
 * const userProjects = await listProjectsByUserFromDb(5);
 * console.log(`User has ${userProjects.length} projects assigned`);
 * ```
 */
export async function listProjectsByUserFromDb(userId: number) {
  const result = await database
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      budget: projects.budget,
      progress: projects.progress,
      startDate: projects.startDate,
      endDate: projects.endDate,
      isArchived: projects.isArchived,
    })
    .from(projects)
    .innerJoin(
      projectAssignments,
      eq(projects.id, projectAssignments.projectId),
    )
    .where(eq(projectAssignments.userId, userId));

  return result;
}
