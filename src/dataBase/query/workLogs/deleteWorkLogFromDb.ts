import { eq } from "drizzle-orm";
import { workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface DeleteWorkLogResult {
  success: boolean;
  deletedWorkLogId: number;
}

/**
 * Deletes a work log entry from the database.
 *
 * @param workLogId - ID of the work log to delete
 * @returns Result object with success status and deleted work log ID
 * @throws Error if work log not found or deletion fails
 *
 * @example
 * ```ts
 * const result = await deleteWorkLogFromDb(42);
 * console.log(`Deleted work log ${result.deletedWorkLogId}`);
 * ```
 */
export async function deleteWorkLogFromDb(
  workLogId: number,
): Promise<DeleteWorkLogResult> {
  if (!workLogId) {
    throw new Error("Work log ID is required");
  }

  try {
    // First, check if the work log exists
    const existingWorkLog = await database
      .select()
      .from(workLogs)
      .where(eq(workLogs.id, workLogId))
      .limit(1);

    if (existingWorkLog.length === 0) {
      throw new Error(`Work log with ID ${workLogId} not found`);
    }

    // Delete the work log
    const [deletedWorkLog] = await database
      .delete(workLogs)
      .where(eq(workLogs.id, workLogId))
      .returning();

    if (!deletedWorkLog) {
      throw new Error(`Failed to delete work log with ID ${workLogId}`);
    }

    return {
      success: true,
      deletedWorkLogId: deletedWorkLog.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to delete work log: ${String(error)}`);
  }
}
