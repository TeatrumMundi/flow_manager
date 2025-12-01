import { expenseCategories } from "@/dataBase/schema";
import { database } from "@/utils/db";

export type ExpenseCategoryListItem = typeof expenseCategories.$inferSelect;

/**
 * Lists all expense categories from the database.
 *
 * @returns Array of all expense categories
 *
 * @example
 * ```ts
 * const categories = await listExpenseCategoriesFromDb();
 * console.log(categories.map(c => c.name));
 * // ["Sprzęt", "Usługi", "Zaopatrzenie", "Oprogramowanie", "Infrastruktura", "Inne"]
 * ```
 */
export async function listExpenseCategoriesFromDb(): Promise<
  ExpenseCategoryListItem[]
> {
  const result = await database
    .select()
    .from(expenseCategories)
    .orderBy(expenseCategories.name);

  return result;
}
