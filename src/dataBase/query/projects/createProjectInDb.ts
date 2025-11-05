import { projects } from "@/dataBase/schema";
import { database } from "@/library/db";

interface CreateProjectInput {
  name: string;
  description?: string | null;
  budget?: string | null;
  progress?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isArchived?: boolean;
}

interface CreateProjectResult {
  project: typeof projects.$inferSelect;
}

/**
 * Creates a new project in the database.
 *
 * @param input - Project creation data
 * @param input.name - Project name (required)
 * @param input.description - Optional project description
 * @param input.budget - Optional budget as string (will be stored as numeric)
 * @param input.progress - Optional progress percentage (0-100, defaults to 0)
 * @param input.startDate - Optional start date (YYYY-MM-DD format)
 * @param input.endDate - Optional end date (YYYY-MM-DD format)
 * @param input.isArchived - Optional archived status (defaults to false)
 * @returns Created project
 * @throws Error if project creation fails
 *
 * @example
 * ```ts
 * const result = await createProjectInDb({
 *   name: "Website Redesign",
 *   description: "Complete overhaul of company website",
 *   budget: "50000.00",
 *   startDate: "2025-01-01",
 *   endDate: "2025-06-30"
 * });
 * ```
 */
export async function createProjectInDb(
  input: CreateProjectInput,
): Promise<CreateProjectResult> {
  // Validate required fields
  if (!input.name || input.name.trim() === "") {
    throw new Error("Project name is required");
  }

  // Validate progress if provided (must be between 0 and 100)
  if (input.progress !== undefined && input.progress !== null) {
    if (input.progress < 0 || input.progress > 100) {
      throw new Error("Project progress must be between 0 and 100");
    }
  }

  // Insert project
  const [insertedProject] = await database
    .insert(projects)
    .values({
      name: input.name.trim(),
      description: input.description || null,
      budget: input.budget || null,
      progress: input.progress ?? 0,
      startDate: input.startDate || null,
      endDate: input.endDate || null,
      isArchived: input.isArchived ?? false,
    })
    .returning();

  if (!insertedProject) {
    throw new Error("Failed to create project in database");
  }

  return {
    project: insertedProject,
  };
}
