import { eq } from "drizzle-orm";
import {
  projectAssignments,
  userCredentials,
  userProfiles,
  users,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

/**
 * Deletes a user and all related records from the database.
 *
 * This function performs a cascading delete that removes:
 * - User credentials
 * - User profile
 * - Project assignments
 * - User record
 *
 * @param userId - The ID of the user to delete
 * @returns Object with success status and deleted user email
 * @throws Error if user not found or deletion fails
 *
 * @example
 * ```ts
 * // Delete user by ID
 * const result = await deleteUserFromDb(5);
 * console.log(result); // { success: true, email: "user@example.com" }
 * ```
 */
export async function deleteUserFromDb(
  userId: number,
): Promise<{ success: boolean; email: string }> {
  // Check if user exists
  const [existingUser] = await database
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!existingUser) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Delete related records first (foreign key constraints)
  // 1. Delete user credentials
  await database
    .delete(userCredentials)
    .where(eq(userCredentials.userId, userId));

  // 2. Delete user profile
  await database.delete(userProfiles).where(eq(userProfiles.userId, userId));

  // 3. Delete project assignments
  await database
    .delete(projectAssignments)
    .where(eq(projectAssignments.userId, userId));

  // 4. Finally, delete the user
  await database.delete(users).where(eq(users.id, userId));

  return {
    success: true,
    email: existingUser.email,
  };
}

/**
 * Deletes multiple users from the database.
 *
 * @param userIds - Array of user IDs to delete
 * @returns Object with count of deleted users and their emails
 * @throws Error if any deletion fails
 *
 * @example
 * ```ts
 * // Delete multiple users
 * const result = await deleteMultipleUsersFromDb([1, 2, 3]);
 * console.log(result); // { success: true, deletedCount: 3, emails: [...] }
 * ```
 */
export async function deleteMultipleUsersFromDb(
  userIds: number[],
): Promise<{ success: boolean; deletedCount: number; emails: string[] }> {
  const deletedEmails: string[] = [];

  for (const userId of userIds) {
    try {
      const result = await deleteUserFromDb(userId);
      deletedEmails.push(result.email);
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  }

  return {
    success: true,
    deletedCount: deletedEmails.length,
    emails: deletedEmails,
  };
}
