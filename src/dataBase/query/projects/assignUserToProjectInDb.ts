import { eq } from "drizzle-orm";
import { projectAssignments } from "@/dataBase/schema";
import { database } from "@/library/db";

export interface AssignUserToProjectInput {
  userId: number;
  projectId: number;
  roleOnProject: string;
}

/**
 * Assigns a user to a project with a specific role.
 *
 * @param input - The assignment details
 * @param input.userId - The ID of the user to assign
 * @param input.projectId - The ID of the project
 * @param input.roleOnProject - The role of the user on the project (e.g., "Manager", "Developer")
 * @returns The created project assignment
 *
 * @example
 * ```ts
 * const assignment = await assignUserToProjectInDb({
 *   userId: 5,
 *   projectId: 10,
 *   roleOnProject: "Manager"
 * });
 * ```
 */
export async function assignUserToProjectInDb(
  input: AssignUserToProjectInput,
): Promise<typeof projectAssignments.$inferSelect> {
  const { userId, projectId, roleOnProject } = input;

  if (!userId || !projectId) {
    throw new Error("userId and projectId are required");
  }

  if (!roleOnProject || roleOnProject.trim() === "") {
    throw new Error("roleOnProject is required");
  }

  const [assignment] = await database
    .insert(projectAssignments)
    .values({
      userId,
      projectId,
      roleOnProject: roleOnProject.trim(),
    })
    .returning();

  return assignment;
}

/**
 * Removes a user's assignment from a project.
 *
 * @param userId - The ID of the user
 * @param projectId - The ID of the project
 * @returns The deleted assignment
 *
 * @example
 * ```ts
 * await removeUserFromProjectInDb(5, 10);
 * ```
 */
export async function removeUserFromProjectInDb(
  userId: number,
  projectId: number,
): Promise<void> {
  await database
    .delete(projectAssignments)
    .where(
      eq(projectAssignments.userId, userId) &&
        eq(projectAssignments.projectId, projectId),
    );
}

/**
 * Updates a user's role on a project.
 *
 * @param userId - The ID of the user
 * @param projectId - The ID of the project
 * @param newRole - The new role for the user
 * @returns The updated assignment
 *
 * @example
 * ```ts
 * const updated = await updateUserRoleOnProjectInDb(5, 10, "Lead Developer");
 * ```
 */
export async function updateUserRoleOnProjectInDb(
  userId: number,
  projectId: number,
  newRole: string,
): Promise<typeof projectAssignments.$inferSelect> {
  if (!newRole || newRole.trim() === "") {
    throw new Error("newRole is required");
  }

  const [updated] = await database
    .update(projectAssignments)
    .set({ roleOnProject: newRole.trim() })
    .where(
      eq(projectAssignments.userId, userId) &&
        eq(projectAssignments.projectId, projectId),
    )
    .returning();

  return updated;
}
