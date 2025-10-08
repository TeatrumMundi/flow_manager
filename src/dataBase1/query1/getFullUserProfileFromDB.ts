import { eq } from "drizzle-orm";
import {
  projectAssignments,
  projects,
  userProfiles,
  userRoles,
  users,
} from "@/dataBase/schema";
import { database } from "@/library1/db";

export interface FullUserProfile {
  id: number;
  email: string;
  role: { id: number; name: string; description: string | null } | null;
  createdAt: string | null;
  updatedAt: string | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    position: string | null;
    employmentType: string | null;
    supervisor: { id: number; email: string } | null;
    salaryRate: number | string | null;
    vacationDaysTotal: number | null;
  } | null;
  projects: Array<{
    id: number;
    name: string | null;
    roleOnProject: string | null;
    isArchived: boolean | null;
  }>;
}

async function getFullUserProfileFromDB(
  userId: string | number,
): Promise<FullUserProfile | null> {
  const id = Number(userId);
  if (!Number.isFinite(id)) throw new Error("Invalid user id");

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
        employmentType: userProfiles.employmentType,
        supervisorId: userProfiles.supervisorId,
        salaryRate: userProfiles.salaryRate,
        vacationDaysTotal: userProfiles.vacationDaysTotal,
      },
      role: {
        id: userRoles.id,
        name: userRoles.name,
        description: userRoles.description,
      },
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id))
    .where(eq(users.id, id))
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
    .where(eq(projectAssignments.userId, id));

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
          employmentType: row.profile.employmentType ?? null,
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

export default getFullUserProfileFromDB;
