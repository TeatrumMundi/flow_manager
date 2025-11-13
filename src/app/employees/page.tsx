import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { EmployeeView } from "@/components/employees/EmployeeView";
import { listEmployeesFromDb } from "@/dataBase/query/listEmployeesFromDb";
import { listEmploymentTypesFromDb } from "@/dataBase/query/listEmploymentTypesFromDb";
import { listSupervisorsFromDb } from "@/dataBase/query/listSupervisorsFromDb";
import type { EmploymentType } from "@/types/EmploymentType";

// Turn off static rendering and caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmployeesPage() {
  // Fetch employees from database with supervisor information
  const employeesData = await listEmployeesFromDb();
  // Fetch supervisors (roleId 1 or 2)
  const supervisors = await listSupervisorsFromDb();
  // Fetch employment types
  const employmentTypes: EmploymentType[] = await listEmploymentTypesFromDb();

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
          <SectionTitleTile title="Pracownicy" />
        </div>

        <EmployeeView
          initialEmployees={employees}
          employeesData={employeesData}
          availableEmploymentTypes={employmentTypes}
          supervisors={supervisors}
        />
      </main>
    </div>
  );
}
