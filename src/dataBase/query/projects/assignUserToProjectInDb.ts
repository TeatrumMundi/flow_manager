import { eq } from "drizzle-orm";
import { projectAssignments } from "@/dataBase/schema";
import { database } from "@/utils/db";

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

  const trimmedRole = roleOnProject.trim();

  // If assigning as Manager, check if there's already a manager and remove them
  // Note: neon-http driver doesn't support transactions, so we do this in sequence
  if (trimmedRole === "Manager") {
    const { and } = await import("drizzle-orm");

    // Find existing manager
    const existingManagers = await database
      .select()
      .from(projectAssignments)
      .where(
        and(
          eq(projectAssignments.projectId, projectId),
          eq(projectAssignments.roleOnProject, "Manager"),
        ),
      );

    // Remove existing managers (there should only be one, but let's be safe)
    if (existingManagers.length > 0) {
      await database
        .delete(projectAssignments)
        .where(
          and(
            eq(projectAssignments.projectId, projectId),
            eq(projectAssignments.roleOnProject, "Manager"),
          ),
        );
    }
  }

  // Insert the new assignment
  const [assignment] = await database
    .insert(projectAssignments)
    .values({
      userId,
      projectId,
      roleOnProject: trimmedRole,
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
  const { and } = await import("drizzle-orm");
  await database
    .delete(projectAssignments)
    .where(
      and(
        eq(projectAssignments.userId, userId),
        eq(projectAssignments.projectId, projectId),
      ),
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

  const { and } = await import("drizzle-orm");
  const [updated] = await database
    .update(projectAssignments)
    .set({ roleOnProject: newRole.trim() })
    .where(
      and(
        eq(projectAssignments.userId, userId),
        eq(projectAssignments.projectId, projectId),
      ),
    )
    .returning();

  return updated;
}
