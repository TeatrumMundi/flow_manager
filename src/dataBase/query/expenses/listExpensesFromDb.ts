import type { SQL } from "drizzle-orm";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import {
  expenseCategories,
  expenseStatuses,
  expenses,
  projects,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface ExpenseListFilters {
  name?: string;
  categoryId?: number;
  projectId?: number;
  minAmount?: string;
  maxAmount?: string;
  dateFrom?: string;
  dateTo?: string;
  statusId?: number;
}

export interface ExpenseListItem {
  id: number;
  name: string;
  categoryId: number | null;
  categoryName: string | null;
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
 * @param filters - Optional filters for searching expenses
 * @param filters.name - Filter by expense name (case-insensitive, partial match)
 * @param filters.categoryId - Filter by category ID
 * @param filters.projectId - Filter by project ID
 * @param filters.minAmount - Filter by minimum amount
 * @param filters.maxAmount - Filter by maximum amount
 * @param filters.dateFrom - Filter by date (from)
 * @param filters.dateTo - Filter by date (to)
 * @param filters.statusId - Filter by status ID
 * @returns Array of expenses with all their information
 *
 * @example
 * ```ts
 * // Get all expenses
 * const allExpenses = await listExpensesFromDb();
 *
 * // Filter by category
 * const equipmentExpenses = await listExpensesFromDb({ categoryId: 1 });
 *
 * // Filter by project
 * const projectExpenses = await listExpensesFromDb({ projectId: 1 });
 *
 * // Filter by amount range
 * const expensiveItems = await listExpensesFromDb({
 *   minAmount: "5000",
 *   maxAmount: "20000"
 * });
 *
 * // Multiple filters
 * const filtered = await listExpensesFromDb({
 *   categoryId: 1,
 *   statusId: 1,
 *   dateFrom: "2024-01-01"
 * });
 * ```
 */
export async function listExpensesFromDb(
  filters?: ExpenseListFilters,
): Promise<ExpenseListItem[]> {
  const conditions: SQL[] = [];

  // Build filter conditions
  if (filters?.name) {
    conditions.push(ilike(expenses.name, `%${filters.name}%`));
  }

  if (filters?.categoryId !== undefined) {
    conditions.push(eq(expenses.categoryId, filters.categoryId));
  }

  if (filters?.projectId !== undefined) {
    conditions.push(eq(expenses.projectId, filters.projectId));
  }

  if (filters?.minAmount) {
    conditions.push(
      sql`${expenses.amount}::numeric >= ${filters.minAmount}::numeric`,
    );
  }

  if (filters?.maxAmount) {
    conditions.push(
      sql`${expenses.amount}::numeric <= ${filters.maxAmount}::numeric`,
    );
  }

  if (filters?.dateFrom) {
    conditions.push(gte(expenses.date, filters.dateFrom));
  }

  if (filters?.dateTo) {
    conditions.push(lte(expenses.date, filters.dateTo));
  }

  if (filters?.statusId !== undefined) {
    conditions.push(eq(expenses.statusId, filters.statusId));
  }

  // Build and execute query with category, project and status information
  const query = database
    .select({
      id: expenses.id,
      name: expenses.name,
      categoryId: expenses.categoryId,
      categoryName: expenseCategories.name,
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
    .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
    .leftJoin(projects, eq(expenses.projectId, projects.id))
    .leftJoin(expenseStatuses, eq(expenses.statusId, expenseStatuses.id))
    .orderBy(expenses.date);

  // Apply filters if any
  const result =
    conditions.length > 0 ? await query.where(and(...conditions)) : await query;

  return result;
}
