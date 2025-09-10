import { drizzle } from "drizzle-orm/neon-http";
import { users } from "@/DataBase/schema";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set!");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

async function main() {
  try {
    const allUsers = await db.select().from(users);
    console.log("Getting all users from the database: ", allUsers);
  } catch (error) {
    console.error("Error while fetching users:", error);
    process.exit(1);
  }
}

main();
