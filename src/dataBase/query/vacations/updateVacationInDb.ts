import { database } from "@/utils/db";
import { vacations } from "@/dataBase/schema";
import { eq } from "drizzle-orm";

export const updateVacationInDb = async (
  id: number,
  vacationData: Partial<typeof vacations.$inferInsert>
) => {
  return await database
    .update(vacations)
    .set({ ...vacationData, updatedAt: new Date().toISOString() })
    .where(eq(vacations.id, id))
    .returning();
};
