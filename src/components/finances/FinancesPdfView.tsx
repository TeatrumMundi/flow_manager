"use client";

import { CostStructureChart } from "./CostStructureChart";
import { ExecutionChart } from "./ExecutionChart";
import { KPICard } from "./KPICard";
import { TotalCostBarChart } from "./TotalCostBarChart";

interface FinancialStats {
  kpi: {
    remainingBudget: number;
    mostExpensiveCategory: { name: string | null; amount: number };
    budgetUtilization: number;
    averageMonthlyCost: number;
  };
  charts: {
    execution: number;
    structure: { name: string | null; amount: number }[];
    totalCost: number;
  };
}

interface FinancesPdfViewProps {
  initialData: FinancialStats;
  dateFrom: string;
  dateTo: string;
  projectLabel: string;
  totalBudget: number;
}

export function FinancesPdfView({
  initialData,
  dateFrom,
  dateTo,
  projectLabel,
  totalBudget,
}: FinancesPdfViewProps) {
  // Format dat dla PDF (YYYY-MM -> Styczeń 2024)
  const formatMonthYear = (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    const monthNames = [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ];
    return `${monthNames[Number.parseInt(month, 10) - 1]} ${year}`;
  };

  const formatPLN = (val: number) =>
    new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="flex flex-col gap-3 p-3 max-h-[595px] overflow-hidden">
      <div className="bg-white/50 backdrop-blur-md rounded-xl p-3 shadow-sm border border-white/50 shrink-0">
        <h2 className="text-lg font-bold text-gray-800 mb-0.5">
          Raport finansowy
        </h2>
        <div className="text-xs text-gray-600 space-y-0.5">
          <p>
            <span className="font-semibold">Okres:</span>{" "}
            {formatMonthYear(dateFrom)} - {formatMonthYear(dateTo)}
          </p>
          <p>
            <span className="font-semibold">Projekt:</span> {projectLabel}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        <KPICard
          label="Pozostały budżet"
          value={formatPLN(initialData.kpi.remainingBudget)}
        />
        <KPICard
          label="Najdroższa kategoria"
          subValue={initialData.kpi.mostExpensiveCategory.name || "Brak danych"}
          value={formatPLN(initialData.kpi.mostExpensiveCategory.amount)}
        />
        <KPICard
          label="Wykorzystanie budżetu"
          value={`${Math.round(initialData.kpi.budgetUtilization)}%`}
        />
        <KPICard
          label="Średni koszt miesięczny projektu"
          value={formatPLN(initialData.kpi.averageMonthlyCost)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-3 h-[400px]">
        <div className="h-full">
          <ExecutionChart
            data={{
              percentage: initialData.charts.execution,
              label: projectLabel,
            }}
          />
        </div>
        <div className="h-full">
          <CostStructureChart data={initialData.charts.structure} />
        </div>
        <div className="h-full">
          <TotalCostBarChart
            data={{
              usedAmount: initialData.charts.totalCost,
              totalBudget: totalBudget,
              label: projectLabel,
            }}
          />
        </div>
      </div>
    </div>
  );
}
