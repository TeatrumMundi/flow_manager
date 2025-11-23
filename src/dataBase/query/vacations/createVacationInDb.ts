import { database } from "@/utils/db";
import { vacations } from "@/dataBase/schema";

export const createVacationInDb = async (vacationData: typeof vacations.$inferInsert) => {
  return await database.insert(vacations).values(vacationData).returning();
};
