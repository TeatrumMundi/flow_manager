import { users, userRoles, userProfiles } from "@/DataBase/schema";
import { eq, ilike } from "drizzle-orm";
import {
  MAX_EMAIL_LENGTH,
  isEmailFormatValid,
  normalizeEmail,
} from "@/Library/email";
import { database } from "@/Library/db";
import readline from "readline";

// Create readline interface for user input
const consoleInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * @summary CLI flow to create a user (and optionally a profile) via prompts.
 *
 * @description
 * Prompts
 * - Email: loops until a business-valid, unique email is provided (normalized to lowercase).
 * - Role: case-insensitive lookup; press Enter to use default "User"; loops until an existing role is found.
 * - Profile: asks whether to add a user profile; if yes, collects optional profile fields.
 *
 * Outcome
 * - Inserts a record into the "users" table: { email, roleId }.
 * - Optionally inserts a related record into "user_profiles" linked by userId.
 * - Prints the created records to the console.
 *
 * @returns Promise<void>
 * @example
 * // From project root
 * // Powershell:
 * npm run db:createUser
 */
async function main() {
  try {
    const email = await askEmail();
    const roleId = await askRoleId();

    // Insert the new user into the database
    const [insertedUser] = await database
      .insert(users)
      .values({ email, roleId })
      .returning();
    console.log("User created successfully:", insertedUser);

    // Optional: create a related user profile
    const shouldAddProfile = await askAddProfile();
    if (shouldAddProfile) {
      const profile = await askUserProfileInputs(insertedUser.id as number);
      const [insertedProfile] = await database
        .insert(userProfiles)
        .values(profile)
        .returning();
      console.log("User profile created:", insertedProfile);
    }

    consoleInput.close();
  } catch (error) {
    console.error("Error while creating user:", error);
    consoleInput.close();
    process.exit(1);
  }
}

/**
 * Prompts the user for input in the console.
 * @param promptText - The question to display to the user.
 * @returns The user's input as a string.
 */
async function promptUser(promptText: string): Promise<string> {
  return new Promise((resolve) => {
    consoleInput.question(promptText, (answer) => resolve(answer));
  });
}

// Ask for email with validation and duplicate check (loops until OK)
async function askEmail(): Promise<string> {
  while (true) {
    const input = await promptUser("Enter user email: ");
    const candidate = normalizeEmail(input);

    if (!candidate) {
      console.warn("Email is required. Please try again.");
      continue;
    }
    if (candidate.length > MAX_EMAIL_LENGTH) {
      console.warn(
        `Email must be ${MAX_EMAIL_LENGTH} characters or fewer. You entered ${candidate.length}.`
      );
      continue;
    }
    if (!isEmailFormatValid(candidate)) {
      console.warn("Enter a valid business email (e.g., name@company.com).");
      continue;
    }

    // Duplicate check
    const [existingUser] = await database
      .select()
      .from(users)
      .where(eq(users.email, candidate))
      .limit(1);
    if (existingUser) {
      console.warn(
        `A user with email ${candidate} already exists (id=${existingUser.id}). Please try a different email.`
      );
      continue;
    }

    return candidate;
  }
}

// Ask for role, defaulting to "User"; keep prompting until an existing role is provided
async function askRoleId(): Promise<number | null> {
  const DEFAULT_ROLE_NAME = "User";
  while (true) {
    const roleNameInput = (
      await promptUser(
        `Enter role name (press Enter for default "${DEFAULT_ROLE_NAME}"): `
      )
    ).trim();

    const roleToFind = roleNameInput || DEFAULT_ROLE_NAME;

    const [foundRole] = await database
      .select()
      .from(userRoles)
      .where(ilike(userRoles.name, roleToFind))
      .limit(1);

    if (foundRole) {
      if (!roleNameInput) {
        console.log(
          `Using default role "${DEFAULT_ROLE_NAME}" (id=${foundRole.id}).`
        );
      }
      return foundRole.id;
    }

    // If default was requested but not present, ask again.
    if (!roleNameInput) {
      console.warn(
        `Default role "${DEFAULT_ROLE_NAME}" not found. Please enter an existing role name or create the default role first.`
      );
    } else {
      console.warn(
        `Role "${roleNameInput}" not found. Please enter an existing role name. (Ctrl+C to cancel)`
      );
    }
  }
}

// Ask if user wants to add a profile
async function askAddProfile(): Promise<boolean> {
  const answer = (
    await promptUser("Would you like to add a user profile now? (y/N): ")
  )
    .trim()
    .toLowerCase();
  return answer === "y" || answer === "yes";
}

// Parse helpers
function parseOptionalInt(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}
function parseOptionalDecimal(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number.parseFloat(v);
  return Number.isNaN(n) ? null : n.toFixed(2);
}

// Ask all profile fields (optional ones can be blank)
async function askUserProfileInputs(userId: number) {
  const firstName =
    (await promptUser("First name (optional): ")).trim() || null;
  const lastName = (await promptUser("Last name (optional): ")).trim() || null;
  const position = (await promptUser("Position (optional): ")).trim() || null;
  const employmentType =
    (await promptUser("Employment type (optional): ")).trim() || null;

  // Resolve supervisor by email (optional, retry until blank or found)
  let supervisorId: number | null = null;
  while (true) {
    const supervisorEmailRaw = await promptUser(
      "Supervisor email (optional, press Enter to skip): "
    );
    const supervisorEmail = normalizeEmail(supervisorEmailRaw);
    if (!supervisorEmail) break; // skip

    const [sup] = await database
      .select()
      .from(users)
      .where(eq(users.email, supervisorEmail))
      .limit(1);
    if (sup) {
      supervisorId = sup.id;
      break;
    }
    console.warn(
      `No user found with email ${supervisorEmail}. Press Enter to skip or try another email.`
    );
  }

  const salaryRateRaw = await promptUser(
    "Salary rate (optional, e.g., 25.50): "
  );
  const salaryRate = parseOptionalDecimal(salaryRateRaw);

  const vacationDaysRaw = await promptUser(
    "Vacation days total (optional, integer): "
  );
  const vacationDaysTotal = parseOptionalInt(vacationDaysRaw);

  return {
    userId,
    firstName,
    lastName,
    position,
    employmentType,
    supervisorId,
    salaryRate,
    vacationDaysTotal,
  };
}

// Run the main function
main();
