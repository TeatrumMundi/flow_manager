import { and, eq, ilike, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { userProfiles, userRoles, users } from "@/dataBase/schema";
import { database } from "@/library/db";

export interface UserListFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleName?: string;
  employmentType?: string;
}

export interface UserListItem {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roleName: string | null;
  employmentType: string | null;
  position: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Lists all users from the database with optional filters.
 *
 * @param filters - Optional filters for searching users
 * @param filters.firstName - Filter by first name (case-insensitive, partial match)
 * @param filters.lastName - Filter by last name (case-insensitive, partial match)
 * @param filters.email - Filter by email (case-insensitive, partial match)
 * @param filters.roleName - Filter by role name (case-insensitive, partial match)
 * @param filters.employmentType - Filter by employment type (case-insensitive, partial match)
 * @returns Array of users with their profile and role information
 *
 * @example
 * ```ts
 * // Get all users
 * const allUsers = await listUsersFromDb();
 *
 * // Filter by role
 * const admins = await listUsersFromDb({ roleName: "Administrator" });
 *
 * // Filter by name
 * const johns = await listUsersFromDb({ firstName: "John" });
 *
 * // Multiple filters
 * const filtered = await listUsersFromDb({
 *   roleName: "Użytkownik",
 *   employmentType: "Full-time"
 * });
 * ```
 */
export async function listUsersFromDb(
  filters?: UserListFilters,
): Promise<UserListItem[]> {
  const conditions: SQL[] = [];

  // Build filter conditions
  if (filters?.firstName) {
    conditions.push(ilike(userProfiles.firstName, `%${filters.firstName}%`));
  }

  if (filters?.lastName) {
    conditions.push(ilike(userProfiles.lastName, `%${filters.lastName}%`));
  }

  if (filters?.email) {
    conditions.push(ilike(users.email, `%${filters.email}%`));
  }

  if (filters?.roleName) {
    conditions.push(ilike(userRoles.name, `%${filters.roleName}%`));
  }

  if (filters?.employmentType) {
    conditions.push(
      ilike(userProfiles.employmentType, `%${filters.employmentType}%`),
    );
  }

  // Build and execute query
  const query = database
    .select({
      id: users.id,
      email: users.email,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      roleName: userRoles.name,
      employmentType: userProfiles.employmentType,
      position: userProfiles.position,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id));

  // Apply filters if any
  const result =
    conditions.length > 0 ? await query.where(and(...conditions)) : await query;

  return result;
}

/**
 * Counts total users matching the given filters.
 *
 * @param filters - Optional filters (same as listUsersFromDb)
 * @returns Total count of matching users
 *
 * @example
 * ```ts
 * const totalUsers = await countUsersFromDb();
 * const totalAdmins = await countUsersFromDb({ roleName: "Administrator" });
 * ```
 */
export async function countUsersFromDb(
  filters?: UserListFilters,
): Promise<number> {
  const conditions: SQL[] = [];

  if (filters?.firstName) {
    conditions.push(ilike(userProfiles.firstName, `%${filters.firstName}%`));
  }

  if (filters?.lastName) {
    conditions.push(ilike(userProfiles.lastName, `%${filters.lastName}%`));
  }

  if (filters?.email) {
    conditions.push(ilike(users.email, `%${filters.email}%`));
  }

  if (filters?.roleName) {
    conditions.push(ilike(userRoles.name, `%${filters.roleName}%`));
  }

  if (filters?.employmentType) {
    conditions.push(
      ilike(userProfiles.employmentType, `%${filters.employmentType}%`),
    );
  }

  const query = database
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id));

  const result =
    conditions.length > 0 ? await query.where(and(...conditions)) : await query;

  return result[0]?.count ?? 0;
}
