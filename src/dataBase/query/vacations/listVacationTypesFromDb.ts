import { vacationTypes } from "@/dataBase/schema";
import { database } from "@/utils/db";

export const listVacationTypesFromDb = async () => {
  return await database.select().from(vacationTypes);
};
