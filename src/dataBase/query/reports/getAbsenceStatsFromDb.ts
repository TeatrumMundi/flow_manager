import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import {
  projectAssignments,
  vacations,
  workLogs,
} from "@/dataBase/schema";
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
        daysPresent:
            sql<number>`count(distinct concat(${workLogs.userId}, '_', ${workLogs.date}))`.mapWith(
                Number,
            ),
      })
      .from(workLogs)
      .where(and(...workLogConditions));

  const vacationConditions = [
    gte(vacations.endDate, filters.dateFrom),
    lte(vacations.startDate, filters.dateTo),
  ];

  if (filters.projectId) {
    const assignedUsers = await database
        .select({ userId: projectAssignments.userId })
        .from(projectAssignments)
        .where(eq(projectAssignments.projectId, filters.projectId));

    const userIds = assignedUsers.map((u) => u.userId);

    if (userIds.length > 0) {
      vacationConditions.push(inArray(vacations.userId, userIds));
    } else {
      vacationConditions.push(eq(vacations.id, -1));
    }
  }

  const vacationsList = await database
      .select({
        startDate: vacations.startDate,
        endDate: vacations.endDate,
      })
      .from(vacations)
      .where(and(...vacationConditions));

  let absenceDays = 0;

  const filterStart = new Date(filters.dateFrom).getTime();
  const filterEnd = new Date(filters.dateTo).getTime();

  vacationsList.forEach((v) => {
    if (!v.startDate || !v.endDate) return;

    const start = Math.max(new Date(v.startDate).getTime(), filterStart);
    const end = Math.min(new Date(v.endDate).getTime(), filterEnd);

    if (end >= start) {
      const days = Math.floor((end - start) / 86400000) + 1;
      absenceDays += days;
    }
  });

  const presentDays = presenceResult?.daysPresent || 0;
  const totalRecordedDays = presentDays + absenceDays;

  if (totalRecordedDays === 0) {
    return { present: 0, absence: 0 };
  }

  const presentPercentage = Math.round((presentDays / totalRecordedDays) * 100);
  const absencePercentage = 100 - presentPercentage;

  return {
    present: presentPercentage,
    absence: absencePercentage,
  };
}