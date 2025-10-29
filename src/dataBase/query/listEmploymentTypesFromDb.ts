import { database } from "@/library/db";
import { employmentTypes } from "@/dataBase/schema";

export async function listEmploymentTypesFromDb() {
  return await database.select().from(employmentTypes);
}
