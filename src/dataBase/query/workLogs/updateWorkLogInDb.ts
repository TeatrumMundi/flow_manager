import { eq } from "drizzle-orm";
import { workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface UpdateWorkLogInput {
  id: number;
  userId?: number;
  taskId?: number | null;
  projectId?: number;
  date?: string;
  hoursWorked?: string;
  isOvertime?: boolean;
  note?: string | null;
}

interface UpdateWorkLogResult {
  workLog: typeof workLogs.$inferSelect;
}

/**
 * Updates an existing work log entry in the database.
 *
 * @param input - Work log update data
 * @param input.id - ID of the work log to update (required)
 * @param input.userId - Optional new user ID
 * @param input.taskId - Optional new task ID (null to remove task association)
 * @param input.projectId - Optional new project ID
 * @param input.date - Optional new date in YYYY-MM-DD format
 * @param input.hoursWorked - Optional new hours worked
 * @param input.isOvertime - Optional new overtime status
 * @param input.note - Optional new note
 * @returns Updated work log
 * @throws Error if work log not found or update fails
 *
 * @example
 * ```ts
 * const result = await updateWorkLogInDb({
 *   id: 42,
 *   hoursWorked: "9.0",
 *   isOvertime: true,
 *   note: "Extended work to meet deadline"
 * });
 * ```
 */
export async function updateWorkLogInDb(
  input: UpdateWorkLogInput,
): Promise<UpdateWorkLogResult> {
  // Validate required fields
  if (!input.id) {
    throw new Error("Work log ID is required");
  }

  // Build update object with only provided fields
  const updateData: Partial<typeof workLogs.$inferInsert> = {};

  if (input.userId !== undefined) {
    updateData.userId = input.userId;
  }
  if (input.taskId !== undefined) {
    updateData.taskId = input.taskId;
  }
  if (input.projectId !== undefined) {
    updateData.projectId = input.projectId;
  }
  if (input.date !== undefined) {
    if (input.date.trim() === "") {
      throw new Error("Date cannot be empty");
    }
    updateData.date = input.date;
  }
  if (input.hoursWorked !== undefined) {
    const hours = Number.parseFloat(input.hoursWorked);
    if (Number.isNaN(hours) || hours <= 0) {
      throw new Error("Hours worked must be a positive number");
    }
    updateData.hoursWorked = input.hoursWorked;
  }
  if (input.isOvertime !== undefined) {
    updateData.isOvertime = input.isOvertime;
  }
  if (input.note !== undefined) {
    updateData.note = input.note;
  }

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  // Update work log
  const [updatedWorkLog] = await database
    .update(workLogs)
    .set(updateData)
    .where(eq(workLogs.id, input.id))
    .returning();

  if (!updatedWorkLog) {
    throw new Error(`Work log with ID ${input.id} not found`);
  }

  return {
    workLog: updatedWorkLog,
  };
}
