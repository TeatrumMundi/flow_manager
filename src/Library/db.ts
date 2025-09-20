import { drizzle } from "drizzle-orm/neon-http";

// Load environment variables for scripts
if (typeof window === "undefined") {
  require("dotenv-flow").config();
}

/**
 * @summary Shared Drizzle database instance for scripts and server code.
 * @description Uses Neon HTTP driver with DATABASE_URL from environment.
 */
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set!");
}

export const database = drizzle(process.env.DATABASE_URL);
