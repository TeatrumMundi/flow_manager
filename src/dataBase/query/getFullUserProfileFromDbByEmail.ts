import { eq } from "drizzle-orm";
import {
  employmentTypes,
  projectAssignments,
  projects,
  userProfiles,
  userRoles,
  users,
} from "@/dataBase/schema";
import type { FullUserProfile } from "@/types/interfaces";
import { database } from "@/utils/db";

async function getFullUserProfileFromDbByEmail(
  email: string,
): Promise<FullUserProfile | null> {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email");
  }

  // Base user + profile + role
  const [row] = await database
    .select({
      user: {
        id: users.id,
        email: users.email,
        roleId: users.roleId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
      profile: {
        userId: userProfiles.userId,
        firstName: userProfiles.firstName,
        lastName: userProfiles.lastName,
        position: userProfiles.position,
        employmentTypeId: userProfiles.employmentTypeId,
        supervisorId: userProfiles.supervisorId,
        salaryRate: userProfiles.salaryRate,
        vacationDaysTotal: userProfiles.vacationDaysTotal,
      },
      role: {
        id: userRoles.id,
        name: userRoles.name,
        description: userRoles.description,
      },
      employmentType: {
        id: employmentTypes.id,
        name: employmentTypes.name,
      },
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id))
    .leftJoin(
      employmentTypes,
      eq(userProfiles.employmentTypeId, employmentTypes.id),
    )
    .where(eq(users.email, email))
    .limit(1);

  if (!row) return null;

  // Fetch supervisor if present
  let supervisor: { id: number; email: string } | null = null;
  if (row.profile?.supervisorId) {
    const [sup] = await database
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, row.profile.supervisorId))
      .limit(1);
    if (sup) supervisor = sup;
  }

  // Fetch project assignments
  const projectsForUser = await database
    .select({
      id: projects.id,
      name: projects.name,
      isArchived: projects.isArchived,
      roleOnProject: projectAssignments.roleOnProject,
    })
    .from(projectAssignments)
    .innerJoin(projects, eq(projectAssignments.projectId, projects.id))
    .where(eq(projectAssignments.userId, row.user.id));

  const result: FullUserProfile = {
    id: row.user.id,
    email: row.user.email,
    role: row.role
      ? {
          id: row.role.id ?? 0,
          name: row.role.name ?? null,
          description: row.role.description ?? null,
        }
      : null,
    createdAt: row.user.createdAt ?? null,
    updatedAt: row.user.updatedAt ?? null,
    profile: row.profile
      ? {
          firstName: row.profile.firstName ?? null,
          lastName: row.profile.lastName ?? null,
          position: row.profile.position ?? null,
          employmentType: row.employmentType?.name ?? null,
          supervisor,
          salaryRate: row.profile.salaryRate ?? null,
          vacationDaysTotal: row.profile.vacationDaysTotal ?? null,
        }
      : null,
    projects: projectsForUser.map((p) => ({
      id: p.id,
      name: p.name ?? null,
      roleOnProject: p.roleOnProject ?? null,
      isArchived: p.isArchived ?? null,
    })),
  };

  return result;
}

export default getFullUserProfileFromDbByEmail;
