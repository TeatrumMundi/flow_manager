import { eq } from "drizzle-orm";
import { tasks } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface UpdateTaskInput {
  id: number;
  projectId?: number;
  title?: string;
  description?: string | null;
  assignedToId?: number | null;
  status?: string | null;
  estimatedHours?: string | null;
}

interface UpdateTaskResult {
  task: typeof tasks.$inferSelect;
}

/**
 * Updates an existing task in the database.
 *
 * @param input - Task update data
 * @param input.id - ID of the task to update (required)
 * @param input.projectId - Optional new project ID
 * @param input.title - Optional new task title
 * @param input.description - Optional new task description
 * @param input.assignedToId - Optional new assignee user ID (null to unassign)
 * @param input.status - Optional new task status
 * @param input.estimatedHours - Optional new estimated hours
 * @returns Updated task
 * @throws Error if task not found or update fails
 *
 * @example
 * ```ts
 * const result = await updateTaskInDb({
 *   id: 10,
 *   status: "In Progress",
 *   assignedToId: 7,
 *   estimatedHours: "12.0"
 * });
 * ```
 */
export async function updateTaskInDb(
  input: UpdateTaskInput,
): Promise<UpdateTaskResult> {
  // Validate required fields
  if (!input.id) {
    throw new Error("Task ID is required");
  }

  // Build update object with only provided fields
  const updateData: Partial<typeof tasks.$inferInsert> = {};

  if (input.projectId !== undefined) {
    updateData.projectId = input.projectId;
  }
  if (input.title !== undefined) {
    if (input.title.trim() === "") {
      throw new Error("Task title cannot be empty");
    }
    updateData.title = input.title.trim();
  }
  if (input.description !== undefined) {
    updateData.description = input.description;
  }
  if (input.assignedToId !== undefined) {
    updateData.assignedToId = input.assignedToId;
  }
  if (input.status !== undefined) {
    updateData.status = input.status;
  }
  if (input.estimatedHours !== undefined) {
    updateData.estimatedHours = input.estimatedHours;
  }

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  // Add updated timestamp
  updateData.updatedAt = new Date().toISOString();

  // Update task
  const [updatedTask] = await database
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, input.id))
    .returning();

  if (!updatedTask) {
    throw new Error(`Task with ID ${input.id} not found`);
  }

  return {
    task: updatedTask,
  };
}
