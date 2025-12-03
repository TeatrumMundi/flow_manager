import { desc, eq, sql } from "drizzle-orm";
import {
  userProfiles,
  users,
  vacationStatuses,
  vacations,
  vacationTypes,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Lists all vacations for a specific user.
 *
 * @param userId - The ID of the user
 * @returns Array of vacations for the user
 *
 * @example
 * ```ts
 * const userVacations = await listVacationsByUserFromDb(5);
 * console.log(`User has ${userVacations.length} vacation requests`);
 * ```
 */
export const listVacationsByUserFromDb = async (userId: number) => {
  return await database
    .select({
      id: vacations.id,
      userId: vacations.userId,
      employeeName: sql<string>`concat(${userProfiles.firstName}, ' ', ${userProfiles.lastName})`,
      vacationType: vacationTypes.name,
      startDate: vacations.startDate,
      endDate: vacations.endDate,
      status: vacationStatuses.name,
      createdAt: vacations.createdAt,
    })
    .from(vacations)
    .leftJoin(users, eq(vacations.userId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(vacationTypes, eq(vacations.typeId, vacationTypes.id))
    .leftJoin(vacationStatuses, eq(vacations.statusId, vacationStatuses.id))
    .where(eq(vacations.userId, userId))
    .orderBy(desc(vacations.createdAt));
};
