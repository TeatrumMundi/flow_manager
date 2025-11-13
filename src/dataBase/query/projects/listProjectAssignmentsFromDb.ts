import { eq } from "drizzle-orm";
import { projectAssignments, userProfiles, users } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface ProjectAssignmentListItem {
  assignmentId: number;
  userId: number;
  projectId: number;
  roleOnProject: string | null;
  assignedAt: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  position: string | null;
}

/**
 * Lists all users assigned to a specific project with their details.
 *
 * @param projectId - The ID of the project
 * @returns Array of assigned users with their information
 *
 * @example
 * ```ts
 * const assignments = await listProjectAssignmentsFromDb(10);
 * ```
 */
export async function listProjectAssignmentsFromDb(
  projectId: number,
): Promise<ProjectAssignmentListItem[]> {
  const result = await database
    .select({
      assignmentId: projectAssignments.id,
      userId: users.id,
      projectId: projectAssignments.projectId,
      roleOnProject: projectAssignments.roleOnProject,
      assignedAt: projectAssignments.assignedAt,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      email: users.email,
      position: userProfiles.position,
    })
    .from(projectAssignments)
    .innerJoin(users, eq(projectAssignments.userId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(projectAssignments.projectId, projectId))
    .orderBy(projectAssignments.assignedAt);

  return result;
}
