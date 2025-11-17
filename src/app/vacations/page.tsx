import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { VacationsView } from "@/components/vacations/VacationsView";

const mockVacations = [
  {
    id: 1,
    employeeName: "Jan Kowalski",
    vacationType: "Urlop wypoczynkowy",
    startDate: "2025-07-01",
    endDate: "2025-07-10",
    status: "Zaakceptowany",
    createdAt: "2025-06-15",
  },
  {
    id: 2,
    employeeName: "Anna Nowak",
    vacationType: "L4",
    startDate: "2025-06-20",
    endDate: "2025-06-25",
    status: "Oczekujący",
    createdAt: "2025-06-19",
  },
  {
    id: 3,
    employeeName: "Piotr Wiśniewski",
    vacationType: "Urlop na żądanie",
    startDate: "2025-06-21",
    endDate: "2025-06-21",
    status: "Odrzucony",
    createdAt: "2025-06-20",
  },
  {
    id: 4,
    employeeName: "Katarzyna Wójcik",
    vacationType: "Delegacja",
    startDate: "2025-07-05",
    endDate: "2025-07-07",
    status: "Zaakceptowany",
    createdAt: "2025-06-18",
  },
];

const mockEmployees = [
  { id: 1, name: "Jan Kowalski" },
  { id: 2, name: "Anna Nowak" },
  { id: 3, name: "Piotr Wiśniewski" },
  { id: 4, name: "Katarzyna Wójcik" },
  { id: 5, name: "Marek Lewandowski" },
];

export default async function VacationsPage() {
  const vacations = mockVacations;
  const employees = mockEmployees.map(emp => ({ label: emp.name, value: emp.id }));
  const availableTypes = ["Urlop wypoczynkowy", "Urlop na żądanie", "L4", "Delegacja"];
  const availableStatuses = ["Oczekujący", "Zaakceptowany", "Odrzucony"];

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