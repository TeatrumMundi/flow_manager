import { eq } from "drizzle-orm";
import { userCredentials, users } from "@/DataBase/schema";
import { saltAndHashPassword } from "@/Library/auth";
import { database } from "@/Library/db";

async function getUserFromDb(email: string, plainPassword: string) {
  // Find user by email first
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) return null;

  // Fetch credentials for that user and compare passwordHash in JS
  const [cred] = await database
    .select()
    .from(userCredentials)
    .where(eq(userCredentials.userId, user.id))
    .limit(1);

  if (!cred) return null;

  // Stored format is "{salt}${derivedHex}". Recreate the hash from the
  // provided plaintext password using the same salt and compare.
  const [storedSalt] = cred.passwordHash.split("$");
  const computed = await saltAndHashPassword(plainPassword, storedSalt);
  if (cred.passwordHash !== computed) return null;

  return user;
}
export default getUserFromDb;
