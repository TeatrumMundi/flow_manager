import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { EmployeeView } from "@/components/employees/EmployeeView";
import { listEmployeesFromDb } from "@/dataBase/query/listEmployeesFromDb";
import { listEmploymentTypesFromDb } from "@/dataBase/query/listEmploymentTypesFromDb";
import { listSupervisorsFromDb } from "@/dataBase/query/listSupervisorsFromDb";
import type { EmploymentType } from "@/types/EmploymentType";

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
    history: [], // Historia projektów - do implementacji w przyszłości
  }));

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/profile/me"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Powrót do pulpitu
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Pracownicy</h1>
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
