import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "@/dataBase/schema";
import { database } from "@/utils/db";
import getUserCredentialsFromDB from "./getUserCredentialsFromDB";

async function getUserFromDb(inputEmail: string, inputPassword: string) {
  // Find user by email first
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, inputEmail))
    .limit(1);

  // Use a consistent error message to prevent timing attacks and email enumeration
  let userFound = false;
  let credentialsFromDB: string | null = null;

  if (user) {
    credentialsFromDB = await getUserCredentialsFromDB(user.id);
    userFound = !!credentialsFromDB;
  }

  // Always perform bcrypt.compare to avoid timing attacks
  const passwordHash =
    credentialsFromDB || "$2a$10$invalidinvalidinvalidinvalidinv";
  const result = await bcrypt.compare(inputPassword, passwordHash);

  if (!userFound || !result) {
    throw new Error("Invalid email or password.");
  }

  // Cast user.id to string before returning (useful for NextAuth expectations)
  return { ...user, id: String(user.id) };
}
export default getUserFromDb;
