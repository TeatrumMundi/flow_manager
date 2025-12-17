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

    // Filtrowanie po dacie (np. tasks.updatedAt lub createdAt)
    if (filters?.dateFrom) {
        conditions.push(gte(tasks.updatedAt, filters.dateFrom));
    }
    if (filters?.dateTo) {
        conditions.push(lte(tasks.updatedAt, filters.dateTo));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Pobieramy liczbę zadań pogrupowaną po statusie
    const result = await database
        .select({
            status: tasks.status,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(tasks)
        .where(whereClause)
        .groupBy(tasks.status);

    const stats = {
        completed: 0,
        active: 0,
        archived: 0,
        paused: 0,
    };

    // Mapowanie statusów z Twojego systemu (widocznych na screenie)
    result.forEach((row) => {
        const status = row.status?.toLowerCase().trim() || "";
        const count = row.count;

        // 1. Zakończony (Ukończone)
        if (status === "ukończone" || status === "ukończono" || status === "zakończone") {
            stats.completed += count;
        }
        // 2. Wstrzymany (Zablokowane)
        else if (status === "zablokowane" || status === "wstrzymane") {
            stats.paused += count;
        }
        // 3. Zarchiwizowany (Anulowane)
        else if (status === "anulowane" || status === "zarchiwizowane") {
            stats.archived += count;
        }
        // 4. Aktywny (Wszystko co "żyje": Do zrobienia, W trakcie, W przeglądzie)
        else {
            // Zakładamy, że "do zrobienia", "w trakcie", "w przeglądzie" to aktywne
            stats.active += count;
        }
    });

    return stats;
}