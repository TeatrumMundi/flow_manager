import { eq } from "drizzle-orm";
import { expenses } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface UpdateExpenseInput {
  id: number;
  name?: string;
  category?: string;
  projectId?: number | null;
  amount?: string;
  date?: string | null;
  statusId?: number | null;
}

interface UpdateExpenseResult {
  expense: typeof expenses.$inferSelect;
}

/**
 * Updates an existing expense in the database.
 *
 * @param input - Expense update data
 * @param input.id - Expense ID (required)
 * @param input.name - Optional new name
 * @param input.category - Optional new category
 * @param input.projectId - Optional new project ID
 * @param input.amount - Optional new amount
 * @param input.date - Optional new date
 * @param input.statusId - Optional new status ID
 * @returns Updated expense
 * @throws Error if expense not found or update fails
 *
 * @example
 * ```ts
 * const result = await updateExpenseInDb({
 *   id: 1,
 *   amount: "12000.00",
 *   statusId: 2
 * });
 * ```
 */
export async function updateExpenseInDb(
  input: UpdateExpenseInput,
): Promise<UpdateExpenseResult> {
  if (!input.id) {
    throw new Error("Expense ID is required");
  }

  // Build update object with only provided fields
  const updateData: Partial<typeof expenses.$inferInsert> = {};

  if (input.name !== undefined) {
    if (input.name.trim() === "") {
      throw new Error("Expense name cannot be empty");
    }
    updateData.name = input.name.trim();
  }

  if (input.category !== undefined) {
    if (input.category.trim() === "") {
      throw new Error("Expense category cannot be empty");
    }
    updateData.category = input.category.trim();
  }

  if (input.projectId !== undefined) {
    updateData.projectId = input.projectId;
  }

  if (input.amount !== undefined) {
    if (input.amount.trim() === "") {
      throw new Error("Expense amount cannot be empty");
    }
    updateData.amount = input.amount;
  }

  if (input.date !== undefined) {
    updateData.date = input.date;
  }

  if (input.statusId !== undefined) {
    updateData.statusId = input.statusId;
  }

  // Always update the updatedAt timestamp
  updateData.updatedAt = new Date().toISOString();

  // Update expense
  const [updatedExpense] = await database
    .update(expenses)
    .set(updateData)
    .where(eq(expenses.id, input.id))
    .returning();

  if (!updatedExpense) {
    throw new Error(`Expense with ID ${input.id} not found`);
  }

  return {
    expense: updatedExpense,
  };
}
