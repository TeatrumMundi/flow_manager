import { database } from "@/utils/db";
import { vacations } from "@/dataBase/schema";
import { eq } from "drizzle-orm";

export const deleteVacationFromDb = async (id: number) => {
  return await database.delete(vacations).where(eq(vacations.id, id)).returning();
};
