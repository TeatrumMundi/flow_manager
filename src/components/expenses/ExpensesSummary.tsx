"use client";

import { useMemo } from "react";
import { Button } from "@/components/common/CustomButton";
import type { Expense } from "./ExpenseView";

interface ExpensesSummaryProps {
  expenses: Expense[];
}

export function ExpensesSummary({ expenses }: ExpensesSummaryProps) {
  // Obliczanie sumy wydatków dla każdego projektu
  const projectExpenses = useMemo(() => {
    const summary: Record<string, number> = {};
    let total = 0;

    expenses.forEach((expense) => {
      if (
          expense.status === "Zatwierdzony" ||
          expense.status === "Oczekujący"
      ) {
        const amount = Number(expense.amount);
        summary[expense.projectName] =
            (summary[expense.projectName] || 0) + amount;
        total += amount;
      }
    });

    // Sortowanie malejąco i konwersja do tablicy
    return Object.entries(summary)
        .map(([name, amount]) => ({
          name,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
      // ZMIANA: Zmieniono bg-white na bg-white/50 i dodano backdrop-blur-md
      <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Sumowanie kosztów według projektów
          </h2>
          <Button variant="primary" className="text-sm py-1.5">
            Eksportuj do raportu
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Lewa strona: Wykres */}
          <div className="flex items-end justify-around h-40 px-4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
            {projectExpenses.length > 0 ? (
                projectExpenses.slice(0, 5).map((project, index) => (
                    <div
                        key={project.name}
                        className="flex flex-col items-center w-1/5 h-full justify-end group relative"
                    >
                      <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                              index === 0
                                  ? "bg-blue-600"
                                  : index === 1
                                      ? "bg-blue-500"
                                      : index === 2
                                          ? "bg-blue-400"
                                          : "bg-blue-300"
                          }`}
                          style={{ height: `${Math.max(project.percentage, 5)}%` }}
                      ></div>
                      <span
                          className="text-xs text-gray-500 mt-2 truncate w-full text-center font-medium"
                          title={project.name}
                      >
                  {project.name.split(" ")[0]}
                </span>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none z-10">
                        {formatCurrency(project.amount)}
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-sm self-center w-full text-center">
                  Brak danych do wykresu
                </p>
            )}
          </div>

          {/* Prawa strona: Lista */}
          <div className="max-h-[200px] overflow-y-auto pr-2">
            <ul className="space-y-2">
              {projectExpenses.map((project) => (
                  <li
                      key={project.name}
                      className="flex justify-between items-center text-sm p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                      <span
                          className="text-gray-600 font-medium truncate"
                          title={project.name}
                      >
                    {project.name}
                  </span>
                    </div>
                    <span className="text-gray-900 font-bold whitespace-nowrap ml-4">
                  {formatCurrency(project.amount)}
                </span>
                  </li>
              ))}
              {projectExpenses.length === 0 && (
                  <li className="text-gray-500 text-sm text-center py-4">
                    Brak zatwierdzonych wydatków.
                  </li>
              )}
            </ul>
          </div>
        </div>
      </div>
  );
}