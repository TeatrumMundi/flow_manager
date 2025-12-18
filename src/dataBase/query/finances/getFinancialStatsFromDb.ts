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

    const [totalExpenseResult] = await database
        .select({
            total: sql<number>`sum(${expenses.amount})`.mapWith(Number),
        })
        .from(expenses)
        .where(and(...expenseConditions));

    const totalExpenses = totalExpenseResult?.total || 0;

    let totalBudget = 0;
    let executionPercentage = 0;

    if (filters.projectId) {
        const [project] = await database
            .select({
                budget: projects.budget,
                progress: projects.progress
            })
            .from(projects)
            .where(eq(projects.id, filters.projectId));

        totalBudget = project?.budget ? Number(project.budget) : 0;
        executionPercentage = project?.progress ? Number(project.progress) : 0;

    } else {
        const [budgetResult] = await database
            .select({
                totalBudget: sql<number>`sum(${projects.budget})`.mapWith(Number),
                avgProgress: sql<number>`avg(${projects.progress})`.mapWith(Number) // Średni progress
            })
            .from(projects);

        totalBudget = budgetResult?.totalBudget || 0;
        executionPercentage = budgetResult?.avgProgress ? Math.round(budgetResult.avgProgress) : 0;
    }

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
    const remainingBudget = totalBudget - totalExpenses;
    const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    const d1 = new Date(filters.dateFrom);
    const d2 = new Date(filters.dateTo);
    let monthsCount = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()) + 1;
    if (monthsCount < 1) monthsCount = 1;

    const averageMonthlyCost = totalExpenses / monthsCount;
    const topCategory = expensesByCategory[0] || { name: "Brak danych", amount: 0 };

    return {
        kpi: {
            remainingBudget,
            mostExpensiveCategory: topCategory,
            budgetUtilization,
            averageMonthlyCost,
        },
        charts: {
            execution: executionPercentage,
            structure: expensesByCategory,
            totalCost: totalExpenses,
        }
    };
}
