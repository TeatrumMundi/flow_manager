import type { SQL } from "drizzle-orm";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import {
  expenses,
  expenseStatuses,
  projects,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface ExpenseListFilters {
  name?: string;
  category?: string;
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
 * Lists all expenses from the database with optional filters.
 *
 * @param filters - Optional filters for searching expenses
 * @param filters.name - Filter by expense name (case-insensitive, partial match)
 * @param filters.category - Filter by category (case-insensitive, partial match)
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
 * const equipmentExpenses = await listExpensesFromDb({ category: "Sprzęt" });
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
 *   category: "Sprzęt",
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

  if (filters?.category) {
    conditions.push(ilike(expenses.category, `%${filters.category}%`));
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

  // Build and execute query with project and status information
  const query = database
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
    .orderBy(expenses.date);

  // Apply filters if any
  const result =
    conditions.length > 0 ? await query.where(and(...conditions)) : await query;

  return result;
}
