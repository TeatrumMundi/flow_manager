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

interface CreateUserInput {
  email: string;
  password: string;
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

interface CreateUserResult {
  user: typeof users.$inferSelect;
  profile?: typeof userProfiles.$inferSelect;
}

/**
 * Creates a new user in the database with credentials and optional profile.
 *
 * @param input - User creation data
 * @param input.email - User's email address (will be normalized)
 * @param input.password - Plain text password (will be hashed)
 * @param input.roleId - Optional role ID (takes precedence over roleName)
 * @param input.roleName - Optional role name to lookup (defaults to "Użytkownik")
 * @param input.profile - Optional user profile data
 * @returns Created user and profile (if provided)
 * @throws Error if email already exists or role not found
 *
 * @example
 * ```ts
 * const result = await createUserInDb({
 *   email: "john.doe@company.com",
 *   password: "securePassword123",
 *   roleName: "Administrator",
 *   profile: {
 *     firstName: "John",
 *     lastName: "Doe",
 *     position: "Developer"
 *   }
 * });
 * ```
 */
export async function createUserInDb(
  input: CreateUserInput,
): Promise<CreateUserResult> {
  const normalizedEmail = normalizeEmail(input.email);

  // Check if user already exists
  const [existingUser] = await database
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    throw new Error(
      `User with email ${normalizedEmail} already exists (id=${existingUser.id})`,
    );
  }

  // Determine role ID
  let roleId = input.roleId;

  if (!roleId) {
    const roleName = input.roleName || "Użytkownik";
    const [foundRole] = await database
      .select()
      .from(userRoles)
      .where(eq(userRoles.name, roleName))
      .limit(1);

    if (!foundRole) {
      throw new Error(`Role "${roleName}" not found in database`);
    }

    roleId = foundRole.id;
  }

  // Insert user
  const [insertedUser] = await database
    .insert(users)
    .values({
      email: normalizedEmail,
      roleId,
    })
    .returning();

  // Hash and store password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(input.password, saltRounds);

  await database.insert(userCredentials).values({
    userId: insertedUser.id as number,
    passwordHash,
  });

  // Insert profile if provided
  let insertedProfile: typeof userProfiles.$inferSelect | undefined;

  if (input.profile) {
    [insertedProfile] = await database
      .insert(userProfiles)
      .values({
        userId: insertedUser.id as number,
        firstName: input.profile.firstName ?? null,
        lastName: input.profile.lastName ?? null,
        position: input.profile.position ?? null,
        employmentTypeId: input.profile.employmentTypeId ?? null,
        supervisorId: input.profile.supervisorId ?? null,
        salaryRate: input.profile.salaryRate ?? null,
        vacationDaysTotal: input.profile.vacationDaysTotal ?? null,
      })
      .returning();
  }

  return {
    user: insertedUser,
    profile: insertedProfile,
  };
}
