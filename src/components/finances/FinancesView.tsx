"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/CustomButton";
import { CustomSelect } from "@/components/common/CustomSelect";
import { BarChart } from "./BarChart";
import { KPICard } from "./KPICard";
import { TrendChart } from "./TrendChart";

interface FinancesData {
    kpis: {
        revenue: number;
        costs: number;
        netProfit: number;
        margin: number;
    };
    trendAnalysis: { month: string; profit: number }[];
    projectProfitability: { name: string; profitability: number }[];
    revenueVsCosts: { revenue: number; costs: number };
    planVsExecution: { planned: number; executed: number };
}

interface FinancesViewProps {
    initialData: FinancesData;
    availableProjects: string[];
    availableSupervisors: string[];
}

export function FinancesView({
                                 initialData,
                                 availableProjects,
                                 availableSupervisors,
                             }: FinancesViewProps) {
    const [selectedProject, setSelectedProject] = useState("Wszystkie");
    const [selectedSupervisor, setSelectedSupervisor] = useState("Wszystkie");

    const handleExportPDF = () => {
        toast.success("Generowanie raportu PDF... (funkcja w przygotowaniu)");
    };

    const formatK = (val: number) => `${(val / 1000).toFixed(0)} k zł`;

    return (
        <div className="flex flex-col gap-6">
            {/* --- Rząd 1: Filtry i KPI --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Kolumna 1: Filtry */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col gap-4">
                    <CustomSelect
                        label="Przełożony"
                        name="supervisor"
                        value={selectedSupervisor}
                        onChange={(e) => setSelectedSupervisor(e.target.value)}
                        options={availableSupervisors}
                    />
                    <CustomSelect
                        label="Projekt"
                        name="project"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        options={availableProjects}
                    />
                </div>

                {/* Kolumny 2-4: KPI Cards */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPICard label="Przychody" value={formatK(initialData.kpis.revenue)} />
                    <KPICard label="Koszty" value={formatK(initialData.kpis.costs)} />
                    <KPICard label="Zysk netto" value={formatK(initialData.kpis.netProfit)} />
                    <KPICard label="Marża" value={initialData.kpis.margin.toString()} unit="%" />
                </div>
            </div>

            {/* --- Rząd 2: Wykresy główne --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Kolumna 1: Plan vs Wykonanie */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
                    <h3 className="text-md font-bold text-gray-800 mb-2">Plan vs wykonanie</h3>
                    <div className="space-y-4 my-auto">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-blue-600">Plan</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">100%</div>
                                <div className="bg-blue-600 h-8 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-blue-400">Wykonanie</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">{initialData.planVsExecution.executed}%</div>
                                <div className="bg-blue-400 h-8 rounded-full" style={{ width: `${initialData.planVsExecution.executed}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                        <span>0</span><span>50%</span><span>100%</span>
                    </div>
                </div>

                {/* Kolumny 2-4: Wykresy */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TrendChart data={initialData.trendAnalysis} />
                    <BarChart data={initialData.projectProfitability} />
                </div>
            </div>

            {/* --- Rząd 3: Paski Przychody/Koszty i Przycisk --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="w-20 font-bold text-gray-700 text-sm">Przychody</span>
                            <div className="flex-grow bg-gray-100 rounded-full h-4 relative">
                                <div className="bg-blue-600 h-4 rounded-full" style={{ width: "80%" }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-20 font-bold text-gray-700 text-sm">Koszty</span>
                            <div className="flex-grow bg-gray-100 rounded-full h-4 relative">
                                <div className="bg-blue-400 h-4 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-12 text-xs text-gray-500 pr-4">
                            <span>100 k</span><span>200 k</span><span>300 k</span><span>400 k zł</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex justify-center">
                    <Button
                        variant="primary"
                        onClick={handleExportPDF}
                        className="w-full h-14 text-lg"
                    >
                        Eksportuj: PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}