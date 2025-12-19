/**
 * Employees Page - HR/Admin view for managing employees and their project assignments.
 *
 * This is a Server Component with dynamic rendering (no caching) due to
 * authentication requirements and real-time data needs.
 */

import { auth } from "@/auth";

// UI Components
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { EmployeeView } from "@/components/employees/EmployeeView";

// Database queries
import { listAllEmployeeProjectsAssignments } from "@/dataBase/query/employees/listAllEmployeeProjectsAssignments";
import { listEmployeesFromDb } from "@/dataBase/query/employees/listEmployeesFromDb";
import { listEmploymentTypesFromDb } from "@/dataBase/query/employees/listEmploymentTypesFromDb";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { listSupervisorsFromDb } from "@/dataBase/query/users/listSupervisorsFromDb";

// Disable static rendering and caching - page requires fresh data on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Roles that have elevated permissions to view all employees */
const ADMIN_ROLES = ["Administrator", "Zarząd", "HR", "Księgowość"] as const;

/**
 * Groups project assignments by employee ID for efficient lookup.
 */
function buildEmployeeProjectsMap(
  assignments: Awaited<ReturnType<typeof listAllEmployeeProjectsAssignments>>,
): Map<number, typeof assignments> {
  const projectsMap = new Map<number, typeof assignments>();

  for (const assignment of assignments) {
    const existing = projectsMap.get(assignment.userId) ?? [];
    existing.push(assignment);
    projectsMap.set(assignment.userId, existing);
  }

  return projectsMap;
}

/**
 * Formats employee name from first/last name, falling back to email.
 */
function formatEmployeeName(
  firstName: string | null,
  lastName: string | null,
  email: string,
): string {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return fullName || email;
}

/**
 * Formats supervisor name, returning fallback text if not available.
 */
function formatSupervisorName(
  firstName: string | null,
  lastName: string | null,
): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return "Brak przełożonego";
}

/**
 * Transforms raw employee data into display-friendly format.
 */
function transformEmployeesForDisplay(
  employeesData: Awaited<ReturnType<typeof listEmployeesFromDb>>,
) {
  return employeesData.map((employee) => ({
    id: employee.id,
    name: formatEmployeeName(
      employee.firstName,
      employee.lastName,
      employee.email,
    ),
    email: employee.email,
    position: employee.position || employee.roleName || "Brak stanowiska",
    supervisor: formatSupervisorName(
      employee.supervisorFirstName,
      employee.supervisorLastName,
    ),
    salaryRate: employee.salaryRate
      ? `${employee.salaryRate} zł`
      : "Nie określono",
    vacationDays: employee.vacationDaysTotal ?? 0,
    contractType: employee.employmentType || "Nie określono",
    history: [],
  }));
}

export default async function EmployeesPage() {
  // Authenticate user and fetch their profile
  const session = await auth();
  const userProfile = session?.user?.email
    ? await getFullUserProfileFromDbByEmail(session.user.email)
    : null;

  // Determine if user has admin privileges based on their role
  const roleName = userProfile?.role?.name ?? "";
  const hasAdminPrivileges = ADMIN_ROLES.includes(
    roleName as (typeof ADMIN_ROLES)[number],
  );

  // Fetch all required data in parallel for optimal performance
  const [employeesData, supervisors, employmentTypes, allProjectAssignments] =
    await Promise.all([
      listEmployeesFromDb(),
      listSupervisorsFromDb(),
      listEmploymentTypesFromDb(),
      listAllEmployeeProjectsAssignments(),
    ]);

  // Build lookup map for employee project assignments
  const employeeProjectsMap = buildEmployeeProjectsMap(allProjectAssignments);

  // Transform raw data for presentation layer
  const employees = transformEmployeesForDisplay(employeesData);

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        {/* Page header with navigation and title */}
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile
            title={hasAdminPrivileges ? "Pracownicy" : "Mój profil"}
          />
        </div>

        {/* Main employee list/details view */}
        <EmployeeView
          initialEmployees={employees}
          employeesData={employeesData}
          employeeProjectsMap={employeeProjectsMap}
          availableEmploymentTypes={employmentTypes}
          supervisors={supervisors}
        />
      </main>
    </div>
  );
}
