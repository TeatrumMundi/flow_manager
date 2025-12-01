import { BackToDashboardButton } from "@/components/common/BackToDashboardButton";
import { SectionTitleTile } from "@/components/common/SectionTitleTile";
import { FinancesView } from "@/components/finances/FinancesView";

// Dane do symulacji (w przyszłości z DB)
const mockFinancialData = {
  kpis: {
    revenue: 750000,
    costs: 500000,
    netProfit: 250000,
    margin: 33.3,
  },
  trendAnalysis: [
    { month: "Sty", profit: 6 },
    { month: "Lut", profit: 14 },
    { month: "Mar", profit: 21 },
    { month: "Kwi", profit: 20 },
    { month: "Maj", profit: 27 },
  ],
  projectProfitability: [
    { name: "Projekt A", profitability: 30 },
    { name: "Projekt B", profitability: 70 },
    { name: "Projekt C", profitability: 95 },
    { name: "Projekt D", profitability: 82 },
  ],
  revenueVsCosts: {
    revenue: 400000, // do paska postępu
    costs: 300000,
  },
  planVsExecution: {
    planned: 100,
    executed: 85,
  },
};

const availableProjects = [
  "Wszystkie",
  "Projekt A",
  "Projekt B",
  "Projekt C",
  "Projekt D",
];
const availableSupervisors = ["Wszystkie", "Jan Kowalski", "Anna Nowak"];

export default async function FinancesPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-8 px-4">
      <main className="w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <SectionTitleTile title="Finanse" />
        </div>

        <FinancesView
          initialData={mockFinancialData}
          availableProjects={availableProjects}
          availableSupervisors={availableSupervisors}
        />
      </main>
    </div>
  );
}
