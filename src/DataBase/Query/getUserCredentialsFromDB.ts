import { eq } from "drizzle-orm";
import { userCredentials } from "@/DataBase/schema";
import { database } from "@/Library/db";

async function getUserCredentialsFromDB(
  userId: number,
): Promise<string | null> {
  const [credentials] = await database
    .select()
    .from(userCredentials)
    .where(eq(userCredentials.userId, userId))
    .limit(1);

  return credentials.passwordHash;
}
export default getUserCredentialsFromDB;
