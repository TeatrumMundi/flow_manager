import { database } from "@/utils/db";
import {
  vacations,
  users,
  userProfiles,
  vacationTypes,
  vacationStatuses,
} from "@/dataBase/schema";
import { eq, desc, sql } from "drizzle-orm";

export const listVacationsFromDb = async () => {
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
    .orderBy(desc(vacations.createdAt));
};
