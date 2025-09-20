import { eq } from "drizzle-orm";
import { users } from "@/DataBase/schema";
import { database } from "@/Library/db";
import bcrypt from "bcrypt";
import getUserCredentialsFromDB from "./getUserCredentialsFromDB";

async function getUserFromDb(inputEmail: string, inputPassword: string) {
  // Find user by email first
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, inputEmail))
    .limit(1);

  if (!user) throw new Error("No user found with that email.");

  const credentials = await getUserCredentialsFromDB(String(user.id));

  if (!credentials) throw new Error("No credentials found for user with ID=" + user.id);

  const result = bcrypt.compare(inputPassword, credentials);
  if (!result) {
    throw new Error("Invalid password.");
  }

  return user;
}
export default getUserFromDb;