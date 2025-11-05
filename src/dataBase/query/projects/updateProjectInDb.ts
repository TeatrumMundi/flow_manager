import { eq } from "drizzle-orm";
import { projects } from "@/dataBase/schema";
import { database } from "@/library/db";

interface UpdateProjectInput {
  projectId: number;
  name?: string;
  description?: string | null;
  budget?: string | null;
  progress?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isArchived?: boolean;
}

interface UpdateProjectResult {
  project: typeof projects.$inferSelect;
}

/**
 * Updates an existing project in the database.
 *
 * @param input - Project update data
 * @param input.projectId - ID of the project to update
 * @param input.name - Optional new project name
 * @param input.description - Optional new description
 * @param input.budget - Optional new budget as string
 * @param input.progress - Optional new progress (0-100)
 * @param input.startDate - Optional new start date (YYYY-MM-DD)
 * @param input.endDate - Optional new end date (YYYY-MM-DD)
 * @param input.isArchived - Optional archived status
 * @returns Updated project
 * @throws Error if project not found or validation fails
 *
 * @example
 * ```ts
 * const result = await updateProjectInDb({
 *   projectId: 1,
 *   name: "Updated Project Name",
 *   progress: 75,
 *   budget: "60000.00"
 * });
 * ```
 */
export async function updateProjectInDb(
  input: UpdateProjectInput,
): Promise<UpdateProjectResult> {
  // Check if project exists
  const [existingProject] = await database
    .select()
    .from(projects)
    .where(eq(projects.id, input.projectId))
    .limit(1);

  if (!existingProject) {
    throw new Error(`Project with id ${input.projectId} not found`);
  }

  // Prepare update data
  const updateData: Partial<typeof projects.$inferInsert> = {};

  // Update name if provided and not empty
  if (input.name !== undefined) {
    const trimmedName = input.name.trim();
    if (trimmedName === "") {
      throw new Error("Project name cannot be empty");
    }
    updateData.name = trimmedName;
  }

  // Update description
  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  // Update budget
  if (input.budget !== undefined) {
    updateData.budget = input.budget;
  }

  // Update progress with validation
  if (input.progress !== undefined) {
    if (
      input.progress !== null &&
      (input.progress < 0 || input.progress > 100)
    ) {
      throw new Error("Project progress must be between 0 and 100");
    }
    updateData.progress = input.progress;
  }

  // Update start date
  if (input.startDate !== undefined) {
    updateData.startDate = input.startDate;
  }

  // Update end date
  if (input.endDate !== undefined) {
    updateData.endDate = input.endDate;
  }

  // Update archived status
  if (input.isArchived !== undefined) {
    updateData.isArchived = input.isArchived;
  }

  // If nothing to update, return existing project
  if (Object.keys(updateData).length === 0) {
    return { project: existingProject };
  }

  // Add updated timestamp
  updateData.updatedAt = new Date().toISOString();

  // Perform update
  const [updatedProject] = await database
    .update(projects)
    .set(updateData)
    .where(eq(projects.id, input.projectId))
    .returning();

  if (!updatedProject) {
    throw new Error("Failed to update project in database");
  }

  return {
    project: updatedProject,
  };
}
