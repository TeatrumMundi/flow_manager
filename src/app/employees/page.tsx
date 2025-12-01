import { auth } from "@/auth";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { EmployeeView } from "@/components/employees/EmployeeView";
import { listEmployeeProjectsAssignments } from "@/dataBase/query/employees/listEmployeeProjectsAssignments";
import { listEmployeesFromDb } from "@/dataBase/query/employees/listEmployeesFromDb";
import { listEmploymentTypesFromDb } from "@/dataBase/query/employees/listEmploymentTypesFromDb";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { listSupervisorsFromDb } from "@/dataBase/query/users/listSupervisorsFromDb";
import type { EmploymentType } from "@/types/EmploymentType";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmployeesPage() {
  const session = await auth();
  const userProfile = session?.user?.email
    ? await getFullUserProfileFromDbByEmail(session.user.email)
    : null;

  // Check if user has admin privileges
  const privilegedRoles = ["Administrator", "Zarząd", "HR", "Księgowość"];
  const hasAdminPrivileges = userProfile?.role?.name
    ? privilegedRoles.includes(userProfile.role.name)
    : false;

  // Fetch employees from database with supervisor information
  const employeesData = await listEmployeesFromDb();
  // Fetch supervisors (roleId 1 or 2)
  const supervisors = await listSupervisorsFromDb();
  // Fetch employment types
  const employmentTypes: EmploymentType[] = await listEmploymentTypesFromDb();

  // Fetch projects for all employees
  const employeeProjectsMap = new Map();
  for (const employee of employeesData) {
    const projects = await listEmployeeProjectsAssignments(employee.id);
    employeeProjectsMap.set(employee.id, projects);
  }

  // Transform employees to display format
  const employees = employeesData.map((employee) => ({
    id: employee.id,
    name:
      `${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
      employee.email,
    email: employee.email,
    position: employee.position || employee.roleName || "Brak stanowiska",
    supervisor:
      employee.supervisorFirstName && employee.supervisorLastName
        ? `${employee.supervisorFirstName} ${employee.supervisorLastName}`
        : "Brak przełożonego",
    salaryRate: employee.salaryRate
      ? `${employee.salaryRate} zł`
      : "Nie określono",
    vacationDays: employee.vacationDaysTotal || 0,
    contractType: employee.employmentType || "Nie określono",
    history: [],
  }));

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile
            title={hasAdminPrivileges ? "Pracownicy" : "Mój profil"}
          />
        </div>

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
