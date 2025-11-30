"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import { AbsenceChart } from "./AbsenceChart";
import { CostsBarChart } from "./CostsBarChart";
import { EfficiencyChart } from "./EfficiencyChart";

interface ReportsData {
    efficiency: { label: string; value: number }[];
    costs: { label: string; value: number }[];
    absence: { present: number; vacation: number; sick: number };
}

interface ReportsViewProps {
    availableProjects: string[];
    initialData: ReportsData;
}

export function ReportsView({ availableProjects, initialData }: ReportsViewProps) {
    const [selectedProject, setSelectedProject] = useState("Wszystkie");

    const [dateFrom, setDateFrom] = useState("2025-05");
    const [dateTo, setDateTo] = useState("2025-07");

    const handleExportPDF = () => {
        toast.success("Generowanie raportu PDF...");
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ZMIANA: Dodano 'relative z-20', aby ten kontener był NAD wykresami */}
            <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 shadow-sm border border-white/50 relative z-20">
                <div className="flex flex-col lg:flex-row gap-4 items-end">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto flex-grow">
                        <CustomInput
                            type="month"
                            name="dateFrom"
                            label="Data od"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="bg-white"
                        />
                        <CustomInput
                            type="month"
                            name="dateTo"
                            label="Data do"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="bg-white"
                        />
                        <CustomSelect
                            label="Projekt"
                            name="project"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            options={availableProjects}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 bg-white w-full"
                        />
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

            {/* ZMIANA: Dodano 'relative z-0', aby ten kontener był POD filtrami */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-0">
                <div className="lg:col-span-1 h-96">
                    <EfficiencyChart data={initialData.efficiency} />
                </div>
                <div className="lg:col-span-1 h-96">
                    <CostsBarChart data={initialData.costs} />
                </div>
                <div className="lg:col-span-1 h-96">
                    <AbsenceChart data={initialData.absence} />
                </div>
            </div>

        </div>
    );
}