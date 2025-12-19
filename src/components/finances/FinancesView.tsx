"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import {
  CustomSelect,
  type SelectOption,
} from "@/components/common/CustomSelect";
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

interface FinancesViewProps {
  availableProjects: SelectOption[];
  initialData: FinancialStats;
  initialFilters: {
    dateFrom: string;
    dateTo: string;
    project: string;
  };
}

export function FinancesView({
  availableProjects,
  initialData,
  initialFilters,
}: FinancesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedProject, setSelectedProject] = useState(
    initialFilters.project,
  );
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialFilters.dateTo);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const handleDateFromChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setDateFrom(e.target.value);
    updateFilters("dateFrom", e.target.value);
  };

  const handleDateToChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setDateTo(e.target.value);
    updateFilters("dateTo", e.target.value);
  };

  const handleProjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
    updateFilters("project", e.target.value);
  };

  const handleExportPDF = () => {
    toast.error("Funkcja eksportu PDF jest wyłączona");
  };

  const formatPLN = (val: number) =>
    new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(val);

  const foundOption = availableProjects.find((p) => {
    const value = typeof p === "string" ? p : p.value;
    return String(value) === String(selectedProject);
  });

  const projectLabel = foundOption
    ? typeof foundOption === "string"
      ? foundOption
      : foundOption.label
    : "wszystkie projekty";

  const totalBudgetCalculated =
    initialData.kpi.remainingBudget + initialData.charts.totalCost;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 shadow-sm border border-white/50">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto grow">
            <CustomInput
              type="month"
              name="dateFrom"
              label="Data od"
              value={dateFrom}
              onChange={handleDateFromChange}
              className="bg-white"
            />
            <CustomInput
              type="month"
              name="dateTo"
              label="Data do"
              value={dateTo}
              onChange={handleDateToChange}
              className="bg-white"
            />

            <div className="w-full">
              <CustomSelect
                name="project"
                label="Projekt"
                value={selectedProject}
                onChange={handleProjectChange}
                options={availableProjects}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 bg-white"
              />
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <Button
              variant="primary"
              onClick={handleExportPDF}
              className="w-full lg:w-auto h-[42px]"
            >
              Eksportuj: PDF
            </Button>
          </div>
        </div>
      </div>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-96">
          <ExecutionChart
            data={{
              percentage: initialData.charts.execution,
              label: projectLabel,
            }}
          />
        </div>
        <div className="lg:col-span-1 h-96">
          <CostStructureChart data={initialData.charts.structure} />
        </div>
        <div className="lg:col-span-1 h-96">
          <TotalCostBarChart
            data={{
              usedAmount: initialData.charts.totalCost,
              totalBudget: totalBudgetCalculated,
              label: projectLabel,
            }}
          />
        </div>
      </div>
    </div>
  );
}
