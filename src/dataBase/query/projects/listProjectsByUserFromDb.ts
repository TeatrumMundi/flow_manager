import { and, eq, inArray } from "drizzle-orm";
import {
  projectAssignments,
  projects,
  userProfiles,
  users,
} from "@/dataBase/schema";
import { database } from "@/utils/db";
import type { ProjectListItem } from "./listProjectsFromDb";

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
export async function listProjectsByUserFromDb(
  userId: number,
): Promise<ProjectListItem[]> {
  // First get all project IDs that the user is assigned to
  const userProjectIds = await database
    .selectDistinct({
      projectId: projectAssignments.projectId,
    })
    .from(projectAssignments)
    .where(eq(projectAssignments.userId, userId));

  if (userProjectIds.length === 0) {
    return [];
  }

  const projectIdList = userProjectIds.map((p) => p.projectId);

  // Then get full project data with manager info for those projects
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
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      managerFirstName: userProfiles.firstName,
      managerLastName: userProfiles.lastName,
      managerEmail: users.email,
    })
    .from(projects)
    .leftJoin(
      projectAssignments,
      and(
        eq(projects.id, projectAssignments.projectId),
        eq(projectAssignments.roleOnProject, "Manager"),
      ),
    )
    .leftJoin(users, eq(projectAssignments.userId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(inArray(projects.id, projectIdList))
    .orderBy(projects.createdAt);

  return result;
}
