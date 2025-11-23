import { database } from "@/utils/db";
import { vacationStatuses } from "@/dataBase/schema";

export const listVacationStatusesFromDb = async () => {
  return await database.select().from(vacationStatuses);
};
