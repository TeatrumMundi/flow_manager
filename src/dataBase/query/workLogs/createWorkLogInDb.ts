import { workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface CreateWorkLogInput {
  userId: number;
  taskId?: number | null;
  projectId: number;
  date: string;
  hoursWorked: string;
  isOvertime?: boolean;
  note?: string | null;
}

interface CreateWorkLogResult {
  workLog: typeof workLogs.$inferSelect;
}

/**
 * Creates a new work log entry in the database.
 *
 * @param input - Work log creation data
 * @param input.userId - ID of the user logging work (required)
 * @param input.taskId - Optional ID of the task being worked on
 * @param input.projectId - ID of the project (required)
 * @param input.date - Date of work in YYYY-MM-DD format (required)
 * @param input.hoursWorked - Number of hours worked as string (required)
 * @param input.isOvertime - Whether the hours are overtime (default: false)
 * @param input.note - Optional note/description of work done
 * @returns Created work log
 * @throws Error if work log creation fails
 *
 * @example
 * ```ts
 * const result = await createWorkLogInDb({
 *   userId: 5,
 *   taskId: 10,
 *   projectId: 2,
 *   date: "2025-12-03",
 *   hoursWorked: "8.5",
 *   isOvertime: false,
 *   note: "Completed API implementation"
 * });
 * ```
 */
export async function createWorkLogInDb(
  input: CreateWorkLogInput,
): Promise<CreateWorkLogResult> {
  // Validate required fields
  if (!input.userId) {
    throw new Error("User ID is required");
  }

  if (!input.projectId) {
    throw new Error("Project ID is required");
  }

  if (!input.date || input.date.trim() === "") {
    throw new Error("Date is required");
  }

  if (!input.hoursWorked || input.hoursWorked.trim() === "") {
    throw new Error("Hours worked is required");
  }

  // Validate hours worked is a valid number
  const hours = Number.parseFloat(input.hoursWorked);
  if (Number.isNaN(hours) || hours <= 0) {
    throw new Error("Hours worked must be a positive number");
  }

  // Insert work log
  const [insertedWorkLog] = await database
    .insert(workLogs)
    .values({
      userId: input.userId,
      taskId: input.taskId || null,
      projectId: input.projectId,
      date: input.date,
      hoursWorked: input.hoursWorked,
      isOvertime: input.isOvertime || false,
      note: input.note || null,
    })
    .returning();

  if (!insertedWorkLog) {
    throw new Error("Failed to create work log in database");
  }

  return {
    workLog: insertedWorkLog,
  };
}
