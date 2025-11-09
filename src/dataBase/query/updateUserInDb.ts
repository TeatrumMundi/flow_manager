import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  userCredentials,
  userProfiles,
  userRoles,
  users,
} from "@/dataBase/schema";
import { database } from "@/utils/db";
import { normalizeEmail } from "@/utils/email";

interface UpdateUserInput {
  userId: number;
  email?: string;
  password?: string | null;
  roleId?: number | null;
  roleName?: string;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    position?: string | null;
    employmentTypeId?: number | null;
    supervisorId?: number | null;
    salaryRate?: string | null;
    vacationDaysTotal?: number | null;
  };
}

interface UpdateUserResult {
  user: typeof users.$inferSelect;
  profile?: typeof userProfiles.$inferSelect;
}

/**
 * Updates an existing user in the database with credentials and profile.
 *
 * @param input - User update data
 * @param input.userId - ID of the user to update
 * @param input.email - Optional new email address (will be normalized)
 * @param input.password - Optional new password (will be hashed)
 * @param input.roleId - Optional role ID (takes precedence over roleName)
 * @param input.roleName - Optional role name to lookup
 * @param input.profile - Optional user profile data to update
 * @returns Updated user and profile
 * @throws Error if user not found, email already exists, or role not found
 *
 * @example
 * ```ts
 * const result = await updateUserInDb({
 *   userId: 1,
 *   email: "john.updated@company.com",
 *   roleName: "Manager",
 *   profile: {
 *     position: "Senior Developer"
 *   }
 * });
 * ```
 */
export async function updateUserInDb(
  input: UpdateUserInput,
): Promise<UpdateUserResult> {
  // Check if user exists
  const [existingUser] = await database
    .select()
    .from(users)
    .where(eq(users.id, input.userId))
    .limit(1);

  if (!existingUser) {
    throw new Error(`User with id ${input.userId} not found`);
  }

  // Prepare user update data
  const userUpdateData: Partial<typeof users.$inferInsert> = {};

  // Handle email update
  if (input.email) {
    const normalizedEmail = normalizeEmail(input.email);

    // Check if new email is already taken by another user
    if (normalizedEmail !== existingUser.email) {
      const [emailExists] = await database
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (emailExists) {
        throw new Error(
          `Email ${normalizedEmail} is already taken by another user`,
        );
      }

      userUpdateData.email = normalizedEmail;
    }
  }

  // Handle role update
  if (input.roleId !== undefined) {
    userUpdateData.roleId = input.roleId;
  } else if (input.roleName) {
    const [foundRole] = await database
      .select()
      .from(userRoles)
      .where(eq(userRoles.name, input.roleName))
      .limit(1);

    if (!foundRole) {
      throw new Error(`Role "${input.roleName}" not found in database`);
    }

    userUpdateData.roleId = foundRole.id;
  }

  // Update user if there are changes
  let updatedUser = existingUser;
  if (Object.keys(userUpdateData).length > 0) {
    [updatedUser] = await database
      .update(users)
      .set(userUpdateData)
      .where(eq(users.id, input.userId))
      .returning();
  }

  // Handle password update
  if (input.password) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    // Check if credentials exist
    const [existingCredentials] = await database
      .select()
      .from(userCredentials)
      .where(eq(userCredentials.userId, input.userId))
      .limit(1);

    if (existingCredentials) {
      await database
        .update(userCredentials)
        .set({ passwordHash })
        .where(eq(userCredentials.userId, input.userId));
    } else {
      await database.insert(userCredentials).values({
        userId: input.userId,
        passwordHash,
      });
    }
  }

  // Handle profile update
  let updatedProfile: typeof userProfiles.$inferSelect | undefined;

  if (input.profile) {
    // Check if profile exists
    const [existingProfile] = await database
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, input.userId))
      .limit(1);

    const profileData = {
      firstName: input.profile.firstName ?? null,
      lastName: input.profile.lastName ?? null,
      position: input.profile.position ?? null,
      employmentTypeId: input.profile.employmentTypeId ?? null,
      supervisorId: input.profile.supervisorId ?? null,
      salaryRate: input.profile.salaryRate ?? null,
      vacationDaysTotal: input.profile.vacationDaysTotal ?? null,
    };

    if (existingProfile) {
      [updatedProfile] = await database
        .update(userProfiles)
        .set(profileData)
        .where(eq(userProfiles.userId, input.userId))
        .returning();
    } else {
      [updatedProfile] = await database
        .insert(userProfiles)
        .values({
          userId: input.userId,
          ...profileData,
        })
        .returning();
    }
  }

  return {
    user: updatedUser,
    profile: updatedProfile,
  };
}
