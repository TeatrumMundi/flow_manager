import { eq } from "drizzle-orm";
import { vacations } from "@/dataBase/schema";
import { database } from "@/utils/db";

export const deleteVacationFromDb = async (id: number) => {
  return await database
    .delete(vacations)
    .where(eq(vacations.id, id))
    .returning();
};
