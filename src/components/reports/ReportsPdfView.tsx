"use client";

import { AbsenceChart } from "./AbsenceChart";
import { TaskCompletionChart } from "./TaskCompletionChart";
import { WorkHoursChart } from "./WorkHoursChart";

interface ReportsData {
  tasks: {
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
    blocked: number;
    canceled: number;
  };
  workHours: { totalHours: number };
  absence: { present: number; vacation: number; sick: number };
}

interface ReportsPdfViewProps {
  initialData: ReportsData;
  dateFrom: string;
  dateTo: string;
  projectLabel: string;
}

export function ReportsPdfView({
  initialData,
  dateFrom,
  dateTo,
  projectLabel,
}: ReportsPdfViewProps) {
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

  return (
    <div className="flex flex-col gap-3 p-3 max-h-[595px] overflow-hidden">
      <div className="bg-white/50 backdrop-blur-md rounded-xl p-3 shadow-sm border border-white/50 shrink-0">
        <h2 className="text-lg font-bold text-gray-800 mb-0.5">
          Raport projektowy
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

      <div className="grid grid-cols-3 gap-3 h-[500px]">
        <div className="h-full">
          <TaskCompletionChart data={initialData.tasks} />
        </div>

        <div className="h-full">
          <WorkHoursChart
            data={initialData.workHours}
            projectName={projectLabel}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        </div>

        <div className="h-full">
          <AbsenceChart data={initialData.absence} />
        </div>
      </div>
    </div>
  );
}
