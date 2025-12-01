import { eq } from "drizzle-orm";
import { expenses, expenseStatuses, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";
import type { ExpenseListItem } from "./listExpensesFromDb";

/**
 * Lists all expenses for a specific project.
 *
 * @param projectId - ID of the project
 * @returns Array of expenses for the project
 *
 * @example
 * ```ts
 * const projectExpenses = await listExpensesByProjectFromDb(1);
 * console.log(`Found ${projectExpenses.length} expenses for this project`);
 * ```
 */
export async function listExpensesByProjectFromDb(
  projectId: number,
): Promise<ExpenseListItem[]> {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await database
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
    .where(eq(expenses.projectId, projectId))
    .orderBy(expenses.date);

  return result;
}
