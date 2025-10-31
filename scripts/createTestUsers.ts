import "dotenv-flow/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { userCredentials, userProfiles, users } from "../src/dataBase/schema";
import { database } from "../src/library/db";

/**
 * @summary Create 10 test users with profiles
 *
 * @description
 * - Creates 10 test users with predefined data
 * - Each user gets a hashed password
 * - Each user gets a complete profile with employment type and supervisor
 *
 * @example
 * // From project root
 * npm run db:createTestUsers
 */
async function main() {
  try {
    console.log("Starting creation of 10 test users...\n");

    // Default password for all test users
    const defaultPassword = "Test123!";
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    const testUsers = [
      {
        email: "jan.kowalski@test.pl",
        roleId: 3, // User
        profile: {
          firstName: "Jan",
          lastName: "Kowalski",
          position: "Kierownik Projektu",
          employmentTypeId: 1,
          supervisorId: null, // First user has no supervisor
          salaryRate: "150.00",
          vacationDaysTotal: 26,
        },
      },
      {
        email: "anna.nowak@test.pl",
        roleId: 3,
        profile: {
          firstName: "Anna",
          lastName: "Nowak",
          position: "Senior Developer",
          employmentTypeId: 1,
          supervisorId: null, // Will be set to first user's ID after creation
          salaryRate: "180.00",
          vacationDaysTotal: 26,
        },
      },
      {
        email: "piotr.wisniewski@test.pl",
        roleId: 3,
        profile: {
          firstName: "Piotr",
          lastName: "Wiśniewski",
          position: "Junior Developer",
          employmentTypeId: 2,
          supervisorId: null,
          salaryRate: "80.00",
          vacationDaysTotal: 20,
        },
      },
      {
        email: "maria.wojcik@test.pl",
        roleId: 3,
        profile: {
          firstName: "Maria",
          lastName: "Wójcik",
          position: "UX Designer",
          employmentTypeId: 1,
          supervisorId: null,
          salaryRate: "120.00",
          vacationDaysTotal: 26,
        },
      },
      {
        email: "tomasz.kaminski@test.pl",
        roleId: 3,
        profile: {
          firstName: "Tomasz",
          lastName: "Kamiński",
          position: "DevOps Engineer",
          employmentTypeId: 1,
          supervisorId: null,
          salaryRate: "160.00",
          vacationDaysTotal: 26,
        },
      },
      {
        email: "katarzyna.lewandowska@test.pl",
        roleId: 3,
        profile: {
          firstName: "Katarzyna",
          lastName: "Lewandowska",
          position: "QA Tester",
          employmentTypeId: 3,
          supervisorId: null,
          salaryRate: "60.00",
          vacationDaysTotal: 0,
        },
      },
      {
        email: "michal.zielinski@test.pl",
        roleId: 3,
        profile: {
          firstName: "Michał",
          lastName: "Zieliński",
          position: "Backend Developer",
          employmentTypeId: 1,
          supervisorId: null,
          salaryRate: "140.00",
          vacationDaysTotal: 26,
        },
      },
      {
        email: "agnieszka.szymanska@test.pl",
        roleId: 3,
        profile: {
          firstName: "Agnieszka",
          lastName: "Szymańska",
          position: "Frontend Developer",
          employmentTypeId: 2,
          supervisorId: null,
          salaryRate: "90.00",
          vacationDaysTotal: 20,
        },
      },
      {
        email: "krzysztof.wozniak@test.pl",
        roleId: 3,
        profile: {
          firstName: "Krzysztof",
          lastName: "Woźniak",
          position: "Database Administrator",
          employmentTypeId: 1,
          supervisorId: null,
          salaryRate: "155.00",
          vacationDaysTotal: 26,
        },
      },
      {
        email: "ewa.kowalczyk@test.pl",
        roleId: 3,
        profile: {
          firstName: "Ewa",
          lastName: "Kowalczyk",
          position: "Business Analyst",
          employmentTypeId: 1,
          supervisorId: null,
          salaryRate: "135.00",
          vacationDaysTotal: 26,
        },
      },
    ];

    let successCount = 0;
    let errorCount = 0;
    let firstUserId: number | null = null;

    for (let i = 0; i < testUsers.length; i++) {
      const testUser = testUsers[i];
      try {
        // Check if user already exists
        const [existingUser] = await database
          .select()
          .from(users)
          .where(eq(users.email, testUser.email))
          .limit(1);

        if (existingUser) {
          console.log(
            `⊘ Skipped: ${testUser.profile.firstName} ${testUser.profile.lastName} (${testUser.email}) - already exists`,
          );
          // Store first existing user's ID for supervisor reference
          if (i === 0) {
            firstUserId = existingUser.id;
          }
          continue;
        }

        // Insert user
        const [insertedUser] = await database
          .insert(users)
          .values({ email: testUser.email, roleId: testUser.roleId })
          .returning();

        // Store first user's ID to use as supervisor for others
        if (i === 0) {
          firstUserId = insertedUser.id;
        }

        // Insert credentials
        await database.insert(userCredentials).values({
          userId: insertedUser.id,
          passwordHash,
        });

        // Insert profile - use first user as supervisor for all others
        const profileData = {
          ...testUser.profile,
          supervisorId: i === 0 ? null : firstUserId, // First user has no supervisor, others have first user as supervisor
        };

        await database.insert(userProfiles).values({
          userId: insertedUser.id,
          ...profileData,
        });

        console.log(
          `✓ Created: ${testUser.profile.firstName} ${testUser.profile.lastName} (${testUser.email})`,
        );
        successCount++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        // Check if it's a duplicate email error
        if (
          errorMessage.includes("duplicate key") ||
          errorMessage.includes("unique constraint")
        ) {
          console.log(
            `⊘ Skipped: ${testUser.email} - already exists (duplicate)`,
          );
        } else {
          console.error(
            `✗ Failed to create: ${testUser.email} - ${errorMessage}`,
          );
          errorCount++;
        }
      }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Successfully created: ${successCount} users`);
    console.log(`Failed: ${errorCount} users`);
    console.log(`\nDefault password for all test users: ${defaultPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("Error while creating test users:", error);
    process.exit(1);
  }
}

main();
