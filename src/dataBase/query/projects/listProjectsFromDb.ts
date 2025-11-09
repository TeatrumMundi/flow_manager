import type { SQL } from "drizzle-orm";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import {
  projectAssignments,
  projects,
  userProfiles,
  users,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface ProjectListFilters {
  name?: string;
  isArchived?: boolean;
  minProgress?: number;
  maxProgress?: number;
  minBudget?: string;
  maxBudget?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface ProjectListItem {
  id: number;
  name: string | null;
  description: string | null;
  budget: string | null;
  progress: number | null;
  startDate: string | null;
  endDate: string | null;
  isArchived: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  managerFirstName: string | null;
  managerLastName: string | null;
  managerEmail: string | null;
}

/**
 * Lists all projects from the database with optional filters.
 *
 * @param filters - Optional filters for searching projects
 * @param filters.name - Filter by project name (case-insensitive, partial match)
 * @param filters.isArchived - Filter by archived status
 * @param filters.minProgress - Filter by minimum progress (0-100)
 * @param filters.maxProgress - Filter by maximum progress (0-100)
 * @param filters.minBudget - Filter by minimum budget
 * @param filters.maxBudget - Filter by maximum budget
 * @param filters.startDateFrom - Filter by start date (from)
 * @param filters.startDateTo - Filter by start date (to)
 * @param filters.endDateFrom - Filter by end date (from)
 * @param filters.endDateTo - Filter by end date (to)
 * @returns Array of projects with all their information
 *
 * @example
 * ```ts
 * // Get all projects
 * const allProjects = await listProjectsFromDb();
 *
 * // Filter by name
 * const webProjects = await listProjectsFromDb({ name: "website" });
 *
 * // Get active projects only
 * const activeProjects = await listProjectsFromDb({ isArchived: false });
 *
 * // Filter by progress range
 * const inProgress = await listProjectsFromDb({
 *   minProgress: 10,
 *   maxProgress: 90
 * });
 *
 * // Multiple filters
 * const filtered = await listProjectsFromDb({
 *   isArchived: false,
 *   minProgress: 50,
 *   startDateFrom: "2025-01-01"
 * });
 * ```
 */
export async function listProjectsFromDb(
  filters?: ProjectListFilters,
): Promise<ProjectListItem[]> {
  const conditions: SQL[] = [];

  // Build filter conditions
  if (filters?.name) {
    conditions.push(ilike(projects.name, `%${filters.name}%`));
  }

  if (filters?.isArchived !== undefined) {
    conditions.push(eq(projects.isArchived, filters.isArchived));
  }

  if (filters?.minProgress !== undefined) {
    conditions.push(gte(projects.progress, filters.minProgress));
  }

  if (filters?.maxProgress !== undefined) {
    conditions.push(lte(projects.progress, filters.maxProgress));
  }

  if (filters?.minBudget) {
    conditions.push(
      sql`${projects.budget}::numeric >= ${filters.minBudget}::numeric`,
    );
  }

  if (filters?.maxBudget) {
    conditions.push(
      sql`${projects.budget}::numeric <= ${filters.maxBudget}::numeric`,
    );
  }

  if (filters?.startDateFrom) {
    conditions.push(gte(projects.startDate, filters.startDateFrom));
  }

  if (filters?.startDateTo) {
    conditions.push(lte(projects.startDate, filters.startDateTo));
  }

  if (filters?.endDateFrom) {
    conditions.push(gte(projects.endDate, filters.endDateFrom));
  }

  if (filters?.endDateTo) {
    conditions.push(lte(projects.endDate, filters.endDateTo));
  }

  // Build and execute query with manager information
  const query = database
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      budget: projects.budget,
      progress: projects.progress,
      startDate: projects.startDate,
      endDate: projects.endDate,
      isArchived: projects.isArchived,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      managerFirstName: userProfiles.firstName,
      managerLastName: userProfiles.lastName,
      managerEmail: users.email,
    })
    .from(projects)
    .leftJoin(
      projectAssignments,
      and(
        eq(projects.id, projectAssignments.projectId),
        // Filter to only get "Manager" role assignments
        eq(projectAssignments.roleOnProject, "Manager"),
      ),
    )
    .leftJoin(users, eq(projectAssignments.userId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .orderBy(projects.createdAt);

  // Apply filters if any
  const result =
    conditions.length > 0 ? await query.where(and(...conditions)) : await query;

  return result;
}
