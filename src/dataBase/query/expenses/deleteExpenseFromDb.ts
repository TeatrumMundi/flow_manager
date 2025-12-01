import { eq } from "drizzle-orm";
import { expenses } from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Deletes an expense from the database.
 *
 * @param expenseId - ID of the expense to delete
 * @returns Object indicating success
 * @throws Error if expense not found or deletion fails
 *
 * @example
 * ```ts
 * await deleteExpenseFromDb(1);
 * ```
 */
export async function deleteExpenseFromDb(
  expenseId: number,
): Promise<{ success: boolean }> {
  if (!expenseId) {
    throw new Error("Expense ID is required");
  }

  const [deletedExpense] = await database
    .delete(expenses)
    .where(eq(expenses.id, expenseId))
    .returning();

  if (!deletedExpense) {
    throw new Error(`Expense with ID ${expenseId} not found`);
  }

  return { success: true };
}
