import { expenseStatuses } from "@/dataBase/schema";
import { database } from "@/utils/db";

export type ExpenseStatusListItem = typeof expenseStatuses.$inferSelect;

/**
 * Lists all expense statuses from the database.
 *
 * @returns Array of all expense statuses
 *
 * @example
 * ```ts
 * const statuses = await listExpenseStatusesFromDb();
 * console.log(statuses.map(s => s.name));
 * // ["Oczekujący", "Zatwierdzony", "Odrzucony"]
 * ```
 */
export async function listExpenseStatusesFromDb(): Promise<
  ExpenseStatusListItem[]
> {
  const result = await database
    .select()
    .from(expenseStatuses)
    .orderBy(expenseStatuses.id);

  return result;
}
