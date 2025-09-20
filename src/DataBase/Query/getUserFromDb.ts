import { eq } from "drizzle-orm";
import { users } from "@/DataBase/schema";
import { database } from "@/Library/db";
import getUserCredentialsFromDB from "./getUserCredentialsFromDB";
import bcrypt from "bcryptjs";

async function getUserFromDb(inputEmail: string, inputPassword: string) {
  // Find user by email first
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, inputEmail))
    .limit(1);

  if (!user) throw new Error("No user found with that email.");

  const credentialsFromDB = await getUserCredentialsFromDB(String(user.id));

  if (!credentialsFromDB) throw new Error("No credentials found for user with ID=" + user.id);

  const result = bcrypt.compare(inputPassword, credentialsFromDB);
  if (!result) {
    throw new Error("Invalid password.");
  }

  return user;
}
export default getUserFromDb;