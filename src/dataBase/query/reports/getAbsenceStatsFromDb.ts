import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { projectAssignments, vacationTypes, vacations, workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface AbsenceFilters {
    projectId?: number;
    dateFrom: string;
    dateTo: string;
}

export async function getAbsenceStatsFromDb(filters: AbsenceFilters) {
    // 1. Dni obecności (z logów pracy)
    const workLogConditions = [
        gte(workLogs.date, filters.dateFrom),
        lte(workLogs.date, filters.dateTo),
    ];

    if (filters.projectId) {
        workLogConditions.push(eq(workLogs.projectId, filters.projectId));
    }

    const [presenceResult] = await database
        .select({
            daysPresent: sql<number>`count(distinct concat(${workLogs.userId}, '_', ${workLogs.date}))`.mapWith(Number),
        })
        .from(workLogs)
        .where(and(...workLogConditions));

    // 2. Dni urlopów i chorobowego
    // FIX: Jeśli wybrano projekt, pobieramy urlopy TYLKO użytkowników przypisanych do tego projektu
    const vacationConditions = [
        gte(vacations.endDate, filters.dateFrom),
        lte(vacations.startDate, filters.dateTo),
    ];

    if (filters.projectId) {
        // Pobierz ID użytkowników przypisanych do projektu
        const assignedUsers = await database
            .select({ userId: projectAssignments.userId })
            .from(projectAssignments)
            .where(eq(projectAssignments.projectId, filters.projectId));

        const userIds = assignedUsers.map((u) => u.userId);

        if (userIds.length > 0) {
            vacationConditions.push(inArray(vacations.userId, userIds));
        } else {
            // Jeśli projekt nie ma pracowników, nie ma urlopów do liczenia
            // Dodajemy warunek niemożliwy do spełnienia (id = -1), żeby zwróciło 0
            vacationConditions.push(eq(vacations.id, -1));
        }
    }

    const vacationsList = await database
        .select({
            startDate: vacations.startDate,
            endDate: vacations.endDate,
            typeName: vacationTypes.name,
        })
        .from(vacations)
        .leftJoin(vacationTypes, eq(vacations.typeId, vacationTypes.id))
        .where(and(...vacationConditions));

    let vacationDays = 0;
    let sickDays = 0;

    const filterStart = new Date(filters.dateFrom).getTime();
    const filterEnd = new Date(filters.dateTo).getTime();

    vacationsList.forEach((v) => {
        if (!v.startDate || !v.endDate) return;

        const start = Math.max(new Date(v.startDate).getTime(), filterStart);
        const end = Math.min(new Date(v.endDate).getTime(), filterEnd);

        if (end >= start) {
            const days = Math.floor((end - start) / (86400000)) + 1;

            const type = v.typeName?.toLowerCase() || "";
            if (type.includes("chorob") || type.includes("sick") || type.includes("l4")) {
                sickDays += days;
            } else {
                vacationDays += days;
            }
        }
    });

    const presentDays = presenceResult?.daysPresent || 0;
    const totalRecordedDays = presentDays + vacationDays + sickDays;

    // FIX: Jeśli brak jakichkolwiek danych, zwracamy 0,0,0 co wyświetli "Brak danych"
    if (totalRecordedDays === 0) {
        return { present: 0, vacation: 0, sick: 0 };
    }

    return {
        present: Math.round((presentDays / totalRecordedDays) * 100),
        vacation: Math.round((vacationDays / totalRecordedDays) * 100),
        sick: Math.round((sickDays / totalRecordedDays) * 100),
    };
}