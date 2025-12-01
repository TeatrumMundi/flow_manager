import { expenses } from "@/dataBase/schema";
import { database } from "@/utils/db";

interface CreateExpenseInput {
  name: string;
  category: string;
  projectId?: number | null;
  amount: string;
  date?: string | null;
  statusId?: number | null;
}

interface CreateExpenseResult {
  expense: typeof expenses.$inferSelect;
}

/**
 * Creates a new expense in the database.
 *
 * @param input - Expense creation data
 * @param input.name - Expense name (required)
 * @param input.category - Expense category (required)
 * @param input.projectId - Optional project ID
 * @param input.amount - Amount as string (required)
 * @param input.date - Optional date (YYYY-MM-DD format)
 * @param input.statusId - Optional status ID
 * @returns Created expense
 * @throws Error if expense creation fails
 *
 * @example
 * ```ts
 * const result = await createExpenseInDb({
 *   name: "Laptop Dell XPS",
 *   category: "Sprzęt",
 *   projectId: 1,
 *   amount: "10000.00",
 *   date: "2024-04-15",
 *   statusId: 1
 * });
 * ```
 */
export async function createExpenseInDb(
  input: CreateExpenseInput,
): Promise<CreateExpenseResult> {
  // Validate required fields
  if (!input.name || input.name.trim() === "") {
    throw new Error("Expense name is required");
  }

  if (!input.category || input.category.trim() === "") {
    throw new Error("Expense category is required");
  }

  if (!input.amount || input.amount.trim() === "") {
    throw new Error("Expense amount is required");
  }

  // Insert expense
  const [insertedExpense] = await database
    .insert(expenses)
    .values({
      name: input.name.trim(),
      category: input.category.trim(),
      projectId: input.projectId || null,
      amount: input.amount,
      date: input.date || null,
      statusId: input.statusId || null,
    })
    .returning();

  if (!insertedExpense) {
    throw new Error("Failed to create expense in database");
  }

  return {
    expense: insertedExpense,
  };
}
