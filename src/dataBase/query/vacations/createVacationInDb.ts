import { vacations } from "@/dataBase/schema";
import { database } from "@/utils/db";

export const createVacationInDb = async (
  vacationData: typeof vacations.$inferInsert,
) => {
  return await database.insert(vacations).values(vacationData).returning();
};
