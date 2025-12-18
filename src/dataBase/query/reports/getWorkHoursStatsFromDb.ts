import { and, eq, gte, lte, sql } from "drizzle-orm";
import { workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface WorkHoursFilters {
    projectId?: number;
    dateFrom?: string;
    dateTo?: string;
}

export async function getWorkHoursStatsFromDb(filters?: WorkHoursFilters) {
    const conditions = [];

    if (filters?.projectId) {
        conditions.push(eq(workLogs.projectId, filters.projectId));
    }

    if (filters?.dateFrom) {
        conditions.push(gte(workLogs.date, filters.dateFrom));
    }

    if (filters?.dateTo) {
        conditions.push(lte(workLogs.date, filters.dateTo));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await database
        .select({
            totalHours: sql<number>`sum(${workLogs.hoursWorked})`.mapWith(Number),
        })
        .from(workLogs)
        .where(whereClause);

    return result?.totalHours || 0;
}