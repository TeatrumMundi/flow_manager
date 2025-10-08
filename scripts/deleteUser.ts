import "dotenv-flow/config";
import readline from "node:readline";
import { eq } from "drizzle-orm";
import {
  projectAssignments,
  userCredentials,
  userProfiles,
  users,
  vacations,
  workLogs,
} from "../src/DataBase/schema";
import { database } from "../src/Library/db";
import {
  isEmailFormatValid,
  MAX_EMAIL_LENGTH,
  normalizeEmail,
} from "../src/Library/email";

const consoleInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * @summary CLI flow to delete a user and related records.
 *
 * @description
 * Prompts
 * - Email: loops until a business-valid email is provided (normalized to lowercase).
 * - Confirmation: shows a preview of related records and asks to proceed.
 *
 * Outcome
 * - Deletes dependent records (profile, credentials, assignments, logs, vacations) first.
 * - Deletes the user from the "users" table.
 * - Prints details of what was removed.
 *
 * @returns Promise<void>
 * @example
 * npm run db:deleteUser
 */

function promptUser(promptText: string): Promise<string> {
  return new Promise((resolve) => consoleInput.question(promptText, resolve));
}

async function askEmail(): Promise<string> {
  while (true) {
    const rawInput = await promptUser("Enter user email to delete: ");
    const email = normalizeEmail(rawInput);

    if (!email) {
      console.warn("Email is required.");
      continue;
    }
    if (email.length > MAX_EMAIL_LENGTH) {
      console.warn(`Max length is ${MAX_EMAIL_LENGTH}.`);
      continue;
    }
    if (!isEmailFormatValid(email)) {
      console.warn("Enter a valid business email (e.g., name@company.com).");
      continue;
    }

    return email;
  }
}

async function confirmProceed(question: string): Promise<boolean> {
  const answer = (await promptUser(question)).trim().toLowerCase();
  return answer === "y" || answer === "yes";
}

async function main() {
  try {
    const targetEmail = await askEmail();

    // Find the user (exact email match after normalization)
    const [user] = await database
      .select()
      .from(users)
      .where(eq(users.email, targetEmail))
      .limit(1);
    if (!user) {
      console.error(
        `No user found with email ${targetEmail}. Nothing to delete.`,
      );
      consoleInput.close();
      process.exit(1);
    }

    // Count related records for a safe preview
    const [[profile], [credentials], projectAssn, workLogsList, vacationsList] =
      await Promise.all([
        database
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, user.id))
          .limit(1),
        database
          .select()
          .from(userCredentials)
          .where(eq(userCredentials.userId, user.id))
          .limit(1),
        database
          .select()
          .from(projectAssignments)
          .where(eq(projectAssignments.userId, user.id)),
        database.select().from(workLogs).where(eq(workLogs.userId, user.id)),
        database.select().from(vacations).where(eq(vacations.userId, user.id)),
      ]);

    console.log("About to delete user:", { id: user.id, email: user.email });
    console.log("Related records:", {
      hasProfile: !!profile,
      hasCredentials: !!credentials,
      projectAssignments: projectAssn.length,
      workLogs: workLogsList.length,
      vacations: vacationsList.length,
    });

    const proceed = await confirmProceed(
      "This will permanently delete the user and related records. Continue? (y/N): ",
    );
    if (!proceed) {
      console.log("Aborted.");
      consoleInput.close();
      return;
    }

    // Order matters due to FKs; delete dependents first
    if (profile) {
      await database
        .delete(userProfiles)
        .where(eq(userProfiles.userId, user.id));
    }
    if (credentials) {
      await database
        .delete(userCredentials)
        .where(eq(userCredentials.userId, user.id));
    }
    if (projectAssn.length) {
      await database
        .delete(projectAssignments)
        .where(eq(projectAssignments.userId, user.id));
    }
    if (workLogsList.length) {
      await database.delete(workLogs).where(eq(workLogs.userId, user.id));
    }
    if (vacationsList.length) {
      await database.delete(vacations).where(eq(vacations.userId, user.id));
    }

    // Finally, delete the user
    const [deletedUser] = await database
      .delete(users)
      .where(eq(users.id, user.id))
      .returning();
    console.log("Deleted user:", deletedUser);

    consoleInput.close();
  } catch (err) {
    console.error("Error while deleting user:", err);
    consoleInput.close();
    process.exit(1);
  }
}

main();
