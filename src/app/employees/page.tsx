import { auth } from "@/auth";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { EmployeeView } from "@/components/employees/EmployeeView";
import { listAllEmployeeProjectsAssignments } from "@/dataBase/query/employees/listAllEmployeeProjectsAssignments";
import { listEmployeesFromDb } from "@/dataBase/query/employees/listEmployeesFromDb";
import { listEmploymentTypesFromDb } from "@/dataBase/query/employees/listEmploymentTypesFromDb";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { listSupervisorsFromDb } from "@/dataBase/query/users/listSupervisorsFromDb";

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

  // Fetch all data in parallel for better performance
  const [employeesData, supervisors, employmentTypes, allProjectAssignments] =
    await Promise.all([
      listEmployeesFromDb(),
      listSupervisorsFromDb(),
      listEmploymentTypesFromDb(),
      listAllEmployeeProjectsAssignments(),
    ]);

  // Group assignments by employee ID
  const employeeProjectsMap = new Map();
  for (const assignment of allProjectAssignments) {
    if (!employeeProjectsMap.has(assignment.userId)) {
      employeeProjectsMap.set(assignment.userId, []);
    }
    employeeProjectsMap.get(assignment.userId).push(assignment);
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
