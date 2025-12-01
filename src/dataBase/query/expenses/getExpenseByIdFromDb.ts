import { eq } from "drizzle-orm";
import { expenses, expenseStatuses, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface ExpenseDetailItem {
  id: number;
  name: string;
  category: string | null;
  projectId: number | null;
  projectName: string | null;
  amount: string | null;
  date: string | null;
  statusId: number | null;
  statusName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Gets a single expense by ID with all related information.
 *
 * @param expenseId - ID of the expense to retrieve
 * @returns Expense with project and status information, or undefined if not found
 *
 * @example
 * ```ts
 * const expense = await getExpenseByIdFromDb(1);
 * if (expense) {
 *   console.log(expense.name, expense.projectName, expense.statusName);
 * }
 * ```
 */
export async function getExpenseByIdFromDb(
  expenseId: number,
): Promise<ExpenseDetailItem | undefined> {
  if (!expenseId) {
    throw new Error("Expense ID is required");
  }

  const [expense] = await database
    .select({
      id: expenses.id,
      name: expenses.name,
      category: expenses.category,
      projectId: expenses.projectId,
      projectName: projects.name,
      amount: expenses.amount,
      date: expenses.date,
      statusId: expenses.statusId,
      statusName: expenseStatuses.name,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
    })
    .from(expenses)
    .leftJoin(projects, eq(expenses.projectId, projects.id))
    .leftJoin(expenseStatuses, eq(expenses.statusId, expenseStatuses.id))
    .where(eq(expenses.id, expenseId))
    .limit(1);

  return expense;
}
