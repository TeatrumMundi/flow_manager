import { employmentTypes } from "@/dataBase/schema";
import { database } from "@/utils/db";

export async function listEmploymentTypesFromDb() {
  return await database.select().from(employmentTypes);
}
