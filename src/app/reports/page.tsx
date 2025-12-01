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

// Mock data dla wykresów
const mockReportData = {
  efficiency: [
    { label: "Sty", value: 0 },
    { label: "Lut", value: 4 },
    { label: "Mar", value: 5 },
    { label: "Kwi", value: 8 },
    { label: "Maj", value: 7 },
    { label: "Cze", value: 12 },
  ],
  costs: [
    { label: "Sty", value: 20 },
    { label: "Lut", value: 35 },
    { label: "Mar", value: 45 },
  ],
  absence: {
    present: 70,
    vacation: 20,
    sick: 10,
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
