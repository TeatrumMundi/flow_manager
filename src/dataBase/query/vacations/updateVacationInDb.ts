import { eq } from "drizzle-orm";
import { vacations } from "@/dataBase/schema";
import { database } from "@/utils/db";

export const updateVacationInDb = async (
  id: number,
  vacationData: Partial<typeof vacations.$inferInsert>,
) => {
  return await database
    .update(vacations)
    .set({ ...vacationData, updatedAt: new Date().toISOString() })
    .where(eq(vacations.id, id))
    .returning();
};
