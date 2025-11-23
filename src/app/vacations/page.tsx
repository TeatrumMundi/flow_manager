import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { VacationsView } from "@/components/vacations/VacationsView";
import { listEmployeesFromDb } from "@/dataBase/query/employees/listEmployeesFromDb";
import { listVacationStatusesFromDb } from "@/dataBase/query/vacations/listVacationStatusesFromDb";
import { listVacationsFromDb } from "@/dataBase/query/vacations/listVacationsFromDb";
import { listVacationTypesFromDb } from "@/dataBase/query/vacations/listVacationTypesFromDb";

export default async function VacationsPage() {
  const vacationsData = await listVacationsFromDb();
  const employeesData = await listEmployeesFromDb();
  const vacationTypes = await listVacationTypesFromDb();
  const vacationStatuses = await listVacationStatusesFromDb();

  const vacations = vacationsData.map((vacation) => ({
    id: vacation.id,
    employeeName: vacation.employeeName || "Nieznany pracownik",
    vacationType: vacation.vacationType || "Nieznany typ",
    startDate: vacation.startDate || "",
    endDate: vacation.endDate || "",
    status: vacation.status || "Nieznany",
    createdAt: vacation.createdAt || "",
  }));

  const employees = employeesData.map((emp) => ({
    label: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Nieznany",
    value: emp.id,
  }));

  const availableTypes = vacationTypes.map((type) => type.name);
  const availableStatuses = vacationStatuses.map((status) => status.name);

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Urlopy" />
        </div>

        <VacationsView
          initialVacations={vacations}
          availableEmployees={employees}
          availableTypes={availableTypes}
          availableStatuses={availableStatuses}
        />
      </main>
    </div>
  );
}
