import { auth } from "@/auth";
import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { VacationsView } from "@/components/vacations/VacationsView";
import { listEmployeesFromDb } from "@/dataBase/query/employees/listEmployeesFromDb";
import getFullUserProfileFromDbByEmail from "@/dataBase/query/users/getFullUserProfileFromDbByEmail";
import { listVacationStatusesFromDb } from "@/dataBase/query/vacations/listVacationStatusesFromDb";
import { listVacationsByUserFromDb } from "@/dataBase/query/vacations/listVacationsByUserFromDb";
import { listVacationsFromDb } from "@/dataBase/query/vacations/listVacationsFromDb";
import { listVacationTypesFromDb } from "@/dataBase/query/vacations/listVacationTypesFromDb";

export default async function VacationsPage() {
  const session = await auth();
  const userProfile = session?.user?.email
    ? await getFullUserProfileFromDbByEmail(session.user.email)
    : null;

  // Check if user has full access (Administrator, Zarząd, HR)
  const privilegedRoles = ["Administrator", "Zarząd", "HR"];
  const hasFullAccess = userProfile?.role?.name
    ? privilegedRoles.includes(userProfile.role.name)
    : false;

  // Fetch vacations based on user role
  const vacationsData =
    hasFullAccess || !userProfile?.id
      ? await listVacationsFromDb()
      : await listVacationsByUserFromDb(userProfile.id);

  const employeesData = await listEmployeesFromDb();
  const vacationTypes = await listVacationTypesFromDb();
  const vacationStatuses = await listVacationStatusesFromDb();

  const vacations = vacationsData.map((vacation) => ({
    id: vacation.id,
    visibleUserId: vacation.userId ?? undefined,
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
          <SectionTitleTile title={hasFullAccess ? "Urlopy" : "Moje urlopy"} />
        </div>

        <VacationsView
          initialVacations={vacations}
          availableEmployees={employees}
          availableTypes={availableTypes}
          availableStatuses={availableStatuses}
          hasFullAccess={hasFullAccess}
          currentUserId={userProfile?.id}
        />
      </main>
    </div>
  );
}
