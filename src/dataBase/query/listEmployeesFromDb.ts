import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  employmentTypes,
  userProfiles,
  userRoles,
  users,
} from "@/dataBase/schema";
import { database } from "@/utils/db";

export interface EmployeeListItem {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roleName: string | null;
  employmentType: string | null;
  position: string | null;
  salaryRate: string | null;
  vacationDaysTotal: number | null;
  supervisorId: number | null;
  supervisorFirstName: string | null;
  supervisorLastName: string | null;
}

/**
 * Lists all employees from the database with supervisor information.
 *
 * @returns Promise<EmployeeListItem[]> - Array of employees with their supervisor details
 */
export async function listEmployeesFromDb(): Promise<EmployeeListItem[]> {
  // Create alias for supervisor tables
  const supervisorProfiles = alias(userProfiles, "supervisor_profiles");

  const result = await database
    .select({
      id: users.id,
      email: users.email,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      roleName: userRoles.name,
      employmentType: employmentTypes.name,
      position: userProfiles.position,
      salaryRate: userProfiles.salaryRate,
      vacationDaysTotal: userProfiles.vacationDaysTotal,
      supervisorId: userProfiles.supervisorId,
      supervisorFirstName: supervisorProfiles.firstName,
      supervisorLastName: supervisorProfiles.lastName,
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id))
    .leftJoin(
      employmentTypes,
      eq(userProfiles.employmentTypeId, employmentTypes.id),
    )
    .leftJoin(
      supervisorProfiles,
      eq(userProfiles.supervisorId, supervisorProfiles.userId),
    );

  return result;
}
