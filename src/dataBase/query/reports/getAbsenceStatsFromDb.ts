import { and, eq, gte, lte, sql } from "drizzle-orm";
import { vacationTypes, vacations, workLogs } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface AbsenceFilters {
    projectId?: number; // Opcjonalnie można filtrować po projekcie (trudniejsze dla urlopów)
    dateFrom: string;
    dateTo: string;
}

export async function getAbsenceStatsFromDb(filters: AbsenceFilters) {
    // 1. Policz dni obecności (na podstawie unikalnych wpisów w work_logs)
    const workLogConditions = [
        gte(workLogs.date, filters.dateFrom),
        lte(workLogs.date, filters.dateTo),
    ];

    if (filters.projectId) {
        workLogConditions.push(eq(workLogs.projectId, filters.projectId));
    }

    const [presenceResult] = await database
        .select({
            // Liczymy unikalne pary (user_id, date), bo pracownik może mieć kilka wpisów jednego dnia
            daysPresent: sql<number>`count(distinct concat(${workLogs.userId}, '_', ${workLogs.date}))`.mapWith(Number),
        })
        .from(workLogs)
        .where(and(...workLogConditions));

    // 2. Policz dni urlopów i chorobowego
    // Uwaga: Urlopy są zazwyczaj przypisane do użytkownika, a nie projektu.
    // Jeśli filtrujemy po projekcie, powinniśmy pobrać tylko userów z tego projektu,
    // ale dla uproszczenia w tym raporcie pominiemy filtr projektu dla urlopów,
    // lub założymy, że raport jest globalny jeśli chodzi o HR.

    const vacationConditions = [
        // Sprawdzamy czy zakres urlopu nachodzi na zakres filtru
        gte(vacations.endDate, filters.dateFrom),
        lte(vacations.startDate, filters.dateTo),
    ];

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

    // Proste obliczenie dni (nie uwzględnia weekendów i świąt idealnie, ale wystarczy do wykresu)
    const filterStart = new Date(filters.dateFrom).getTime();
    const filterEnd = new Date(filters.dateTo).getTime();

    vacationsList.forEach((v) => {
        if (!v.startDate || !v.endDate) return;

        // Obliczamy część wspólną zakresu urlopu i zakresu filtru
        const start = Math.max(new Date(v.startDate).getTime(), filterStart);
        const end = Math.min(new Date(v.endDate).getTime(), filterEnd);

        if (end >= start) {
            // +1 bo włącznie z datą końcową, / (1000 * 60 * 60 * 24) to milisekundy na dni
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

    // Obliczamy procenty (zabezpieczenie przed dzieleniem przez 0)
    if (totalRecordedDays === 0) {
        return { present: 0, vacation: 0, sick: 0 };
    }

    return {
        present: Math.round((presentDays / totalRecordedDays) * 100),
        vacation: Math.round((vacationDays / totalRecordedDays) * 100),
        sick: Math.round((sickDays / totalRecordedDays) * 100),
    };
}