import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { ReportsView } from "@/components/reports/ReportsView";

const availableProjects = [
  "Wszystkie",
  "Website Redesign",
  "System implementation",
  "Mobile App",
  "HR Revamp",
];

// Zaktualizowane dane
const mockReportData = {
  tasks: {
    completed: 24,
    active: 4,
    archived: 3,
    paused: 1,
  },
  // Nowe dane dla środkowego wykresu
  projectCost: {
    amount: 2040,
    projectName: "Mobile App",
  },
  absence: {
    present: 50,
    vacation: 30,
    sick: 20,
  },
};

export default async function ReportsPage() {
  return (
      <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
        <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <BackToDashboardButton />
            <SectionTitleTile title="Raporty" />
          </div>

          <ReportsView
              availableProjects={availableProjects}
              initialData={mockReportData}
          />
        </main>
      </div>
  );
}