import { and, eq, gte, lte, sql } from "drizzle-orm";
import { expenses, projects } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface CostFilters {
    projectId?: number;
    dateFrom?: string;
    dateTo?: string;
}

export async function getProjectCostsFromDb(filters?: CostFilters) {
    const conditions = [];

    if (filters?.projectId) {
        conditions.push(eq(expenses.projectId, filters.projectId));
    }

    if (filters?.dateFrom) {
        conditions.push(gte(expenses.date, filters.dateFrom));
    }

    if (filters?.dateTo) {
        conditions.push(lte(expenses.date, filters.dateTo));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 1. Pobieramy sumę wydatków
    const [costResult] = await database
        .select({
            totalAmount: sql<number>`sum(${expenses.amount})`.mapWith(Number),
        })
        .from(expenses)
        .where(whereClause);

    // 2. Pobieramy nazwę projektu (jeśli wybrano konkretny)
    let projectName = "Wszystkie projekty";

    if (filters?.projectId) {
        const [projectResult] = await database
            .select({ name: projects.name })
            .from(projects)
            .where(eq(projects.id, filters.projectId));

        if (projectResult?.name) {
            projectName = projectResult.name;
        }
    }

    return {
        amount: costResult?.totalAmount || 0,
        projectName: projectName,
    };
}