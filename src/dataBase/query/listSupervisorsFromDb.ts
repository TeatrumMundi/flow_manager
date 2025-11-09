import { eq, inArray } from "drizzle-orm";
import { userProfiles, users } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface SupervisorListItem {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Returns users eligible to be supervisors (roleId 1 = Administrator, 2 = Zarząd).
 */
export async function listSupervisorsFromDb(): Promise<SupervisorListItem[]> {
  const result = await database
    .select({
      id: users.id,
      email: users.email,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(inArray(users.roleId, [1, 2]));

  return result;
}
