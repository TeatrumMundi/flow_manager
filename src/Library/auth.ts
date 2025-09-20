"use server";

import crypto from "node:crypto";

/**
 * Salt and hash a plaintext password using Node's crypto.scryptSync.
 * Stored format used across the project is: "{salt}${derivedHex}".
 * If `salt` is omitted a new random 16-byte hex salt will be generated.
 */
export async function saltAndHashPassword(
  password: string,
  salt?: string,
): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password must be a non-empty string");
  }

  const usedSalt = salt ?? crypto.randomBytes(16).toString("hex");
  // Derive a 64-byte key like the createUser script does
  const derived = crypto.scryptSync(password, usedSalt, 64);
  return `${usedSalt}$${derived.toString("hex")}`;
}
