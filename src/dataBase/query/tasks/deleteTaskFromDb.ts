import { eq } from "drizzle-orm";
import { tasks, workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface DeleteTaskResult {
  success: boolean;
  deletedTaskId: number;
  deletedWorkLogsCount: number;
}

/**
 * Deletes a task from the database along with all related work logs.
 *
 * This function performs a cascading delete:
 * 1. Deletes all work logs associated with the task
 * 2. Deletes the task itself
 *
 * @param taskId - ID of the task to delete
 * @returns Result object with success status and deletion counts
 * @throws Error if task not found or deletion fails
 *
 * @example
 * ```ts
 * const result = await deleteTaskFromDb(10);
 * console.log(`Deleted task ${result.deletedTaskId} and ${result.deletedWorkLogsCount} work logs`);
 * ```
 */
export async function deleteTaskFromDb(
  taskId: number,
): Promise<DeleteTaskResult> {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  try {
    // First, check if the task exists
    const existingTask = await database
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (existingTask.length === 0) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    // 1. Delete all work logs associated with this task
    const deletedWorkLogs = await database
      .delete(workLogs)
      .where(eq(workLogs.taskId, taskId))
      .returning();

    // 2. Delete the task itself
    const [deletedTask] = await database
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning();

    if (!deletedTask) {
      throw new Error(`Failed to delete task with ID ${taskId}`);
    }

    return {
      success: true,
      deletedTaskId: deletedTask.id,
      deletedWorkLogsCount: deletedWorkLogs.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to delete task: ${String(error)}`);
  }
}
