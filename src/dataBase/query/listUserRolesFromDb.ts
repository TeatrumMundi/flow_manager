import { database } from "@/library/db";
import { userRoles } from "@/dataBase/schema";

export async function listUserRolesFromDb()
{
    return await database.select().from(userRoles);
}