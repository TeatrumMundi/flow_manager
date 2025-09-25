import { userCredentials, users } from "@/DataBase/schema";
import { database } from "@/Library/db";
import { eq } from "drizzle-orm";

async function getUserCredentialsFromDB( userId: string): Promise<string | null> 
{
  const [credentials] = await database
    .select()
    .from(userCredentials)
    .where(eq(userCredentials.userId, users.id))
    .limit(1);

    return credentials.passwordHash;
}
export default getUserCredentialsFromDB;
