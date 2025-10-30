import { userRoles } from "@/dataBase/schema";
import { database } from "@/library/db";

export async function listUserRolesFromDb() {
  return await database.select().from(userRoles);
}
