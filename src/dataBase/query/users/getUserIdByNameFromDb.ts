import { and, eq } from "drizzle-orm";
import { userProfiles, users } from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Finds a user ID by their full name (firstName + lastName).
 *
 * @param fullName - The full name in format "FirstName LastName"
 * @returns The user ID or null if not found
 *
 * @example
 * ```ts
 * const userId = await getUserIdByFullNameFromDb("Jan Kowalski");
 * if (userId) {
 *   console.log(`User ID: ${userId}`);
 * }
 * ```
 */
export async function getUserIdByFullNameFromDb(
  fullName: string,
): Promise<number | null> {
  if (!fullName || fullName.trim() === "") {
    return null;
  }

  const nameParts = fullName.trim().split(" ");
  if (nameParts.length < 2) {
    return null;
  }

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const { sql } = await import("drizzle-orm");

  const [result] = await database
    .select({
      userId: users.id,
    })
    .from(users)
    .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(
      and(
        sql`LOWER(${userProfiles.firstName}) = LOWER(${firstName})`,
        sql`LOWER(${userProfiles.lastName}) = LOWER(${lastName})`,
      ),
    )
    .limit(1);

  return result?.userId || null;
}

/**
 * Finds a user ID by their email address.
 *
 * @param email - The user's email address
 * @returns The user ID or null if not found
 *
 * @example
 * ```ts
 * const userId = await getUserIdByEmailFromDb("jan.kowalski@example.com");
 * ```
 */
export async function getUserIdByEmailFromDb(
  email: string,
): Promise<number | null> {
  if (!email || email.trim() === "") {
    return null;
  }

  const [result] = await database
    .select({
      userId: users.id,
    })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  return result?.userId || null;
}
