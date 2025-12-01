import { tasks } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface CreateTaskInput {
  projectId: number;
  title: string;
  description?: string | null;
  assignedToId?: number | null;
  status?: string | null;
  estimatedHours?: string | null;
}

interface CreateTaskResult {
  task: typeof tasks.$inferSelect;
}

/**
 * Creates a new task in the database.
 *
 * @param input - Task creation data
 * @param input.projectId - ID of the project this task belongs to (required)
 * @param input.title - Task title (required)
 * @param input.description - Optional task description
 * @param input.assignedToId - Optional user ID to assign the task to
 * @param input.status - Optional task status (e.g., "To Do", "In Progress", "Done")
 * @param input.estimatedHours - Optional estimated hours as string (will be stored as numeric)
 * @returns Created task
 * @throws Error if task creation fails
 *
 * @example
 * ```ts
 * const result = await createTaskInDb({
 *   projectId: 1,
 *   title: "Design homepage mockup",
 *   description: "Create wireframes and high-fidelity mockups",
 *   assignedToId: 5,
 *   status: "To Do",
 *   estimatedHours: "8.5"
 * });
 * ```
 */
export async function createTaskInDb(
  input: CreateTaskInput,
): Promise<CreateTaskResult> {
  // Validate required fields
  if (!input.projectId) {
    throw new Error("Project ID is required");
  }

  if (!input.title || input.title.trim() === "") {
    throw new Error("Task title is required");
  }

  // Insert task
  const [insertedTask] = await database
    .insert(tasks)
    .values({
      projectId: input.projectId,
      title: input.title.trim(),
      description: input.description || null,
      assignedToId: input.assignedToId || null,
      status: input.status || "Do zrobienia",
      estimatedHours: input.estimatedHours || null,
    })
    .returning();

  if (!insertedTask) {
    throw new Error("Failed to create task in database");
  }

  return {
    task: insertedTask,
  };
}
