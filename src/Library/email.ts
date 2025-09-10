/**
 * Email utilities: validation and normalization
 */

export const MAX_EMAIL_LENGTH = 255; // aligns with DB varchar(255)

/**
 * Normalize email for comparison/storage.
 * - trims whitespace
 * - lowercases
 */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Business-grade email format validation.
 * - Basic RFC-style local@domain check
 * - Requires at least 2-letter TLD
 * - Disallows spaces, double dots, leading/trailing dot
 */
export function isEmailFormatValid(email: string): boolean {
  if (!email) return false;
  if (email.length > MAX_EMAIL_LENGTH) return false;
  if (email.includes(" ")) return false;
  if (email.includes("..")) return false;
  if (email.startsWith(".")) return false;
  if (email.endsWith(".")) return false;
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}
