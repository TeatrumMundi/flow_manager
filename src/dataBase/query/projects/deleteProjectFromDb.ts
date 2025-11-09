import { eq } from "drizzle-orm";
import {
  financialReports,
  projectAssignments,
  projectCosts,
  projects,
  tasks,
  workLogs,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Deletes a project and all related records from the database.
 *
 * This function performs a cascading delete that removes:
 * - Work logs related to project tasks
 * - Tasks assigned to the project
 * - Project assignments (user assignments to project)
 * - Project costs
 * - Financial reports
 * - Project record
 *
 * @param projectId - The ID of the project to delete
 * @returns Object with success status and deleted project name
 * @throws Error if project not found or deletion fails
 *
 * @example
 * ```ts
 * // Delete project by ID
 * const result = await deleteProjectFromDb(5);
 * console.log(result); // { success: true, name: "Project Name" }
 * ```
 */
export async function deleteProjectFromDb(
  projectId: number,
): Promise<{ success: boolean; name: string }> {
  // Check if project exists
  const [existingProject] = await database
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!existingProject) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  // Delete related records first (foreign key constraints)
  // 1. Delete work logs related to this project
  await database.delete(workLogs).where(eq(workLogs.projectId, projectId));

  // 2. Delete tasks assigned to this project
  await database.delete(tasks).where(eq(tasks.projectId, projectId));

  // 3. Delete project assignments (user-project relationships)
  await database
    .delete(projectAssignments)
    .where(eq(projectAssignments.projectId, projectId));

  // 4. Delete project costs
  await database
    .delete(projectCosts)
    .where(eq(projectCosts.projectId, projectId));

  // 5. Delete financial reports
  await database
    .delete(financialReports)
    .where(eq(financialReports.projectId, projectId));

  // 6. Finally, delete the project
  await database.delete(projects).where(eq(projects.id, projectId));

  return {
    success: true,
    name: existingProject.name || `Project #${projectId}`,
  };
}

/**
 * Deletes multiple projects from the database.
 *
 * @param projectIds - Array of project IDs to delete
 * @returns Object with count of deleted projects and their names
 * @throws Error if any deletion fails
 *
 * @example
 * ```ts
 * // Delete multiple projects
 * const result = await deleteMultipleProjectsFromDb([1, 2, 3]);
 * console.log(result); // { success: true, deletedCount: 3, names: [...] }
 * ```
 */
export async function deleteMultipleProjectsFromDb(
  projectIds: number[],
): Promise<{ success: boolean; deletedCount: number; names: string[] }> {
  const deletedNames: string[] = [];

  for (const projectId of projectIds) {
    try {
      const result = await deleteProjectFromDb(projectId);
      deletedNames.push(result.name);
    } catch (error) {
      console.error(`Failed to delete project ${projectId}:`, error);
      throw error;
    }
  }

  return {
    success: true,
    deletedCount: deletedNames.length,
    names: deletedNames,
  };
}
