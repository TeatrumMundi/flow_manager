import { eq } from "drizzle-orm";
import { userProfiles } from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Updates vacation days total for a user by adding or subtracting days.
 * Used when creating, updating, or deleting vacation requests.
 *
 * @param userId - The user ID to update vacation days for
 * @param daysChange - Number of days to add (positive) or subtract (negative)
 * @returns Updated vacation days total or null if user profile not found
 */
export async function updateVacationDaysInDb(
  userId: number,
  daysChange: number,
): Promise<number | null> {
  // Get current vacation days
  const [profile] = await database
    .select({
      vacationDaysTotal: userProfiles.vacationDaysTotal,
    })
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  if (!profile) {
    return null;
  }

  const currentDays = profile.vacationDaysTotal ?? 0;
  const newDays = currentDays + daysChange;

  // Update the vacation days
  await database
    .update(userProfiles)
    .set({ vacationDaysTotal: newDays })
    .where(eq(userProfiles.userId, userId));

  return newDays;
}

/**
 * Sets vacation days total for a user to a specific value.
 *
 * @param userId - The user ID to set vacation days for
 * @param days - The new vacation days total
 * @returns Updated vacation days total or null if user profile not found
 */
export async function setVacationDaysInDb(
  userId: number,
  days: number,
): Promise<number | null> {
  const [profile] = await database
    .select({ id: userProfiles.id })
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  if (!profile) {
    return null;
  }

  await database
    .update(userProfiles)
    .set({ vacationDaysTotal: days })
    .where(eq(userProfiles.userId, userId));

  return days;
}
