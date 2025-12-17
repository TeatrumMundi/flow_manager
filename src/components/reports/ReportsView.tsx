"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect, type SelectOption } from "@/components/common/CustomSelect";
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

interface ReportsViewProps {
  availableProjects: SelectOption[];
  initialData: ReportsData;
  initialFilters: {
    dateFrom: string;
    dateTo: string;
    project: string;
  };
}

export function ReportsView({
                              availableProjects,
                              initialData,
                              initialFilters,
                            }: ReportsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedProject, setSelectedProject] = useState(initialFilters.project);
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialFilters.dateTo);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const handleDateFromChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDateFrom(e.target.value);
    updateFilters("dateFrom", e.target.value);
  };

  const handleDateToChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDateTo(e.target.value);
    updateFilters("dateTo", e.target.value);
  };

  const handleProjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
    updateFilters("project", e.target.value);
  };

  const handleExportPDF = () => {
    toast.success("Generowanie raportu PDF...");
  };

  const foundOption = availableProjects.find((p) => {
    const value = typeof p === "string" ? p : p.value;
    return String(value) === String(selectedProject);
  });

  const selectedProjectLabel = foundOption
      ? (typeof foundOption === "string" ? foundOption : foundOption.label)
      : "Wszystkie projekty";

  return (
      <div className="flex flex-col gap-6">
        <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 shadow-sm border border-white/50 relative z-20">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto flex-grow">
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
                    label="Projekt"
                    name="project"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-0">
          <div className="lg:col-span-1 h-96">
            <TaskCompletionChart data={initialData.tasks} />
          </div>

          <div className="lg:col-span-1 h-96">
            <WorkHoursChart
                data={initialData.workHours}
                projectName={selectedProjectLabel}
                dateFrom={dateFrom}
                dateTo={dateTo}
            />
          </div>

          <div className="lg:col-span-1 h-96">
            <AbsenceChart data={initialData.absence} />
          </div>
        </div>
      </div>
  );
}