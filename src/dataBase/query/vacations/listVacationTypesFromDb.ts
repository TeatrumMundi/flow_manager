import { database } from "@/utils/db";
import { vacationTypes } from "@/dataBase/schema";

export const listVacationTypesFromDb = async () => {
  return await database.select().from(vacationTypes);
};
