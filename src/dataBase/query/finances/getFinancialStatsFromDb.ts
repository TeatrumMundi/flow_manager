import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { expenseCategories, expenses, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface FinancialFilters {
  projectId?: number;
  dateFrom: string;
  dateTo: string;
}

export async function getFinancialStatsFromDb(filters: FinancialFilters) {
  const expenseConditions = [
    gte(expenses.date, filters.dateFrom),
    lte(expenses.date, filters.dateTo),
  ];

  if (filters.projectId) {
    expenseConditions.push(eq(expenses.projectId, filters.projectId));
  }

  // 1. Pobierz sumę wydatków ogółem
  const [totalExpenseResult] = await database
    .select({
      total: sql<number>`sum(${expenses.amount})`.mapWith(Number),
    })
    .from(expenses)
    .where(and(...expenseConditions));

  const totalExpenses = totalExpenseResult?.total || 0;

  // 2. Pobierz sumę budżetów
  // Jeśli wybrano projekt -> budżet tego projektu
  // Jeśli wszystkie -> suma budżetów WSZYSTKICH projektów (aktywnych i nie tylko, zależnie od logiki)
  let totalBudget = 0;
  if (filters.projectId) {
    const [project] = await database
      .select({ budget: projects.budget })
      .from(projects)
      .where(eq(projects.id, filters.projectId));
    totalBudget = project?.budget ? Number(project.budget) : 0;
  } else {
    const [budgetResult] = await database
      .select({ total: sql<number>`sum(${projects.budget})`.mapWith(Number) })
      .from(projects);
    totalBudget = budgetResult?.total || 0;
  }

  // 3. Pobierz wydatki po kategoriach (do wykresu kołowego i KPI "Najdroższa kategoria")
  const expensesByCategory = await database
    .select({
      name: expenseCategories.name,
      amount: sql<number>`sum(${expenses.amount})`.mapWith(Number),
    })
    .from(expenses)
    .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
    .where(and(...expenseConditions))
    .groupBy(expenseCategories.name)
    .orderBy(desc(sql`sum(${expenses.amount})`));

  // 4. Obliczenia KPI
  const remainingBudget = totalBudget - totalExpenses;

  // Zabezpieczenie przed dzieleniem przez 0
  const budgetUtilization =
    totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  // Obliczanie liczby miesięcy w wybranym zakresie
  const d1 = new Date(filters.dateFrom);
  const d2 = new Date(filters.dateTo);
  // Liczba miesięcy = (różnica lat * 12) + różnica miesięcy + 1 (włącznie)
  let monthsCount =
    (d2.getFullYear() - d1.getFullYear()) * 12 +
    (d2.getMonth() - d1.getMonth()) +
    1;
  if (monthsCount < 1) monthsCount = 1;

  const averageMonthlyCost = totalExpenses / monthsCount;

  // Najdroższa kategoria (pierwsza z listy posortowanej malejąco)
  const topCategory = expensesByCategory[0] || {
    name: "Brak danych",
    amount: 0,
  };

  return {
    kpi: {
      remainingBudget,
      mostExpensiveCategory: topCategory,
      budgetUtilization,
      averageMonthlyCost,
    },
    charts: {
      execution: budgetUtilization, // % wykonania
      structure: expensesByCategory, // Tablica { name, amount }
      totalCost: totalExpenses, // Całkowity koszt
    },
  };
}
