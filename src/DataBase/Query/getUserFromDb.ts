import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "@/DataBase/schema";
import { database } from "@/Library/db";
import getUserCredentialsFromDB from "./getUserCredentialsFromDB";

async function getUserFromDb(inputEmail: string, inputPassword: string) {
  // Find user by email first
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, inputEmail))
    .limit(1);

  // Use a consistent error message to prevent timing attacks and email enumeration
  let credentialsFromDB: string | null = null;
  let userFound = false;

  if (user) {
    credentialsFromDB = await getUserCredentialsFromDB(String(user.id));
    userFound = !!credentialsFromDB;
  }

  // Always perform bcrypt.compare to avoid timing attacks
  const passwordHash =
    credentialsFromDB || "$2a$10$invalidinvalidinvalidinvalidinv";
  const result = await bcrypt.compare(inputPassword, passwordHash);

  if (!userFound || !result) {
    throw new Error("Invalid email or password.");
  }

  return user;
}
export default getUserFromDb;