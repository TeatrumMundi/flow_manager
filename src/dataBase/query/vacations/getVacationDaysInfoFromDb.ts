import { eq } from "drizzle-orm";
import { userProfiles } from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface VacationDaysInfo {
  userId: number;
  vacationDaysRemaining: number;
}

/**
 * Gets vacation days information for a specific employee.
 * Returns the current vacation days balance from user profile.
 * The vacationDaysTotal field is directly updated when vacations are created/edited/deleted.
 *
 * @param userId - The user ID to get vacation days info for
 * @returns Promise<VacationDaysInfo | null> - Vacation days information or null if user not found
 */
export async function getVacationDaysInfoFromDb(
  userId: number,
): Promise<VacationDaysInfo | null> {
  // Get user's remaining vacation days (stored directly in vacationDaysTotal)
  const userProfile = await database
    .select({
      vacationDaysTotal: userProfiles.vacationDaysTotal,
    })
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  if (!userProfile.length) {
    return null;
  }

  const remainingDays = userProfile[0].vacationDaysTotal ?? 0;

  return {
    userId,
    vacationDaysRemaining: remainingDays,
  };
}

/**
 * Gets vacation days information for multiple employees.
 *
 * @param userIds - Array of user IDs to get vacation days info for
 * @returns Promise<Map<number, VacationDaysInfo>> - Map of userId to vacation days info
 */
export async function getVacationDaysInfoForUsersFromDb(
  userIds: number[],
): Promise<Map<number, VacationDaysInfo>> {
  const result = new Map<number, VacationDaysInfo>();

  // Fetch all in parallel for better performance
  const promises = userIds.map(async (userId) => {
    const info = await getVacationDaysInfoFromDb(userId);
    if (info) {
      result.set(userId, info);
    }
  });

  await Promise.all(promises);
  return result;
}
