import { users } from "@/DataBase/schema";
import { database } from "@/Library/db";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set!");
  process.exit(1);
}

async function main() {
  try {
    const allUsers = await database.select().from(users);
    console.log("Getting all users from the database: ", allUsers);
  } catch (error) {
    console.error("Error while fetching users:", error);
    process.exit(1);
  }
}

main();
