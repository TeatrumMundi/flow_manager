import { eq } from "drizzle-orm";
import { userCredentials } from "@/dataBase/schema";
import { database } from "@/library1/db";

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
