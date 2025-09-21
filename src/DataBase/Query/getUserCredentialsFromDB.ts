import { eq } from "drizzle-orm";
import { userCredentials } from "@/DataBase/schema";
import { database } from "@/Library/db";

async function getUserCredentialsFromDB(
  userId: string,
): Promise<string | null> {
  const [credentials] = await database
    .select()
    .from(userCredentials)
    .where(eq(userCredentials.userId, Number(userId)))
    .limit(1);

  if (!credentials) return null;
  return credentials.passwordHash ?? null;
}

export default getUserCredentialsFromDB;
