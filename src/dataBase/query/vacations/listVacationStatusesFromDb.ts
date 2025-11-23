import { vacationStatuses } from "@/dataBase/schema";
import { database } from "@/utils/db";

export const listVacationStatusesFromDb = async () => {
  return await database.select().from(vacationStatuses);
};
