import { and, eq, gte, lte, sql } from "drizzle-orm";
import { tasks } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface TaskStatsFilters {
    projectId?: number;
    dateFrom?: string;
    dateTo?: string;
}

export async function getTaskStatsFromDb(filters?: TaskStatsFilters) {
    const conditions = [];

    if (filters?.projectId) {
        conditions.push(eq(tasks.projectId, filters.projectId));
    }

    // Filtrowanie po dacie
    if (filters?.dateFrom) {
        conditions.push(gte(tasks.updatedAt, filters.dateFrom));
    }
    if (filters?.dateTo) {
        conditions.push(lte(tasks.updatedAt, filters.dateTo));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await database
        .select({
            status: tasks.status,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(tasks)
        .where(whereClause)
        .groupBy(tasks.status);

    // Inicjalizacja licznika dla 6 konkretnych statusów
    const stats = {
        todo: 0,       // Do zrobienia
        inProgress: 0, // W trakcie
        inReview: 0,   // W przeglądzie
        done: 0,       // Ukończone
        blocked: 0,    // Zablokowane
        canceled: 0,   // Anulowane
    };

    result.forEach((row) => {
        const status = row.status?.toLowerCase().trim() || "";
        const count = row.count;

        if (status === "do zrobienia" || status === "to do") {
            stats.todo += count;
        } else if (status === "w trakcie" || status === "in progress") {
            stats.inProgress += count;
        } else if (status === "w przeglądzie" || status === "in review") {
            stats.inReview += count;
        } else if (status === "ukończone" || status === "done") {
            stats.done += count;
        } else if (status === "zablokowane" || status === "blocked") {
            stats.blocked += count;
        } else if (status === "anulowane" || status === "canceled" || status === "cancelled") {
            stats.canceled += count;
        }
    });

    return stats;
}