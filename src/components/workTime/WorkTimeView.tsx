"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import {
    DataTable,
    type TableAction,
    type TableColumn,
} from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import { OvertimeBadge } from "./OvertimeBadge";
import { WorkTimeAddModal } from "./WorkTimeAddModal";
import { WorkTimeEditModal } from "./WorkTimeEditModal";

export interface WorkLog {
    id: number;
    employeeName: string;
    date: string;
    projectName: string;
    taskName: string;
    hours: number;
    isOvertime: boolean;
    note: string;
}

interface WorkTimeViewProps {
    initialLogs: WorkLog[];
    availableEmployees: { label: string; value: string }[];
    availableProjects: { label: string; value: string }[];
    projectTasksMap: Record<string, { label: string; value: string }[]>;
}

export function WorkTimeView({
                                 initialLogs,
                                 availableEmployees,
                                 availableProjects,
                                 projectTasksMap,
                             }: WorkTimeViewProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Date range filters
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [filteredLogs, setFilteredLogs] = useState(initialLogs);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<WorkLog | null>(null);

    useEffect(() => {
        let logs = initialLogs;

        // Filter by Date From
        if (dateFrom) {
            logs = logs.filter((log) => log.date >= dateFrom);
        }

        // Filter by Date To
        if (dateTo) {
            logs = logs.filter((log) => log.date <= dateTo);
        }

        // Filter by Search (Employee, Project, Task)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            logs = logs.filter(
                (log) =>
                    log.employeeName.toLowerCase().includes(lowerTerm) ||
                    log.projectName.toLowerCase().includes(lowerTerm) ||
                    log.taskName.toLowerCase().includes(lowerTerm),
            );
        }

        // Sort by Date Descending
        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setFilteredLogs(logs);
    }, [searchTerm, dateFrom, dateTo, initialLogs]);

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleOpenEditModal = (log: WorkLog) => {
        setEditingLog(log);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingLog(null);
    };

    return (
        <>
            {isAddModalOpen && (
                <WorkTimeAddModal
                    onClose={handleCloseAddModal}
                    availableEmployees={availableEmployees}
                    availableProjects={availableProjects}
                    projectTasksMap={projectTasksMap}
                />
            )}

            {isEditModalOpen && editingLog && (
                <WorkTimeEditModal
                    workLog={editingLog}
                    onClose={handleCloseEditModal}
                    availableEmployees={availableEmployees}
                    availableProjects={availableProjects}
                    projectTasksMap={projectTasksMap}
                />
            )}

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row gap-4 mb-6 items-stretch xl:items-end">
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        onClick={handleOpenAddModal}
                        className="whitespace-nowrap"
                    >
                        <FaPlus />
                        <span>Dodaj wpis</span>
                    </Button>
                    <RefreshButton onClick={() => {}} isRefreshing={false} />
                </div>

                <div className="relative grow">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                    <CustomInput
                        type="text"
                        name="searchLogs"
                        placeholder="Szukaj po pracowniku, projekcie..."
                        className="pl-10 h-10"
                        hideLabel
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <div className="w-40">
                        <CustomInput
                            type="date"
                            name="dateFrom"
                            label="Od:"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="h-10"
                        />
                    </div>
                    <div className="w-40">
                        <CustomInput
                            type="date"
                            name="dateTo"
                            label="Do:"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="h-10"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={filteredLogs}
                keyExtractor={(item) => item.id}
                emptyMessage="Nie znaleziono wpisów czasu pracy."
                columns={
                    [
                        {
                            key: "employeeName",
                            header: "Pracownik",
                            className: "p-4 text-gray-800 font-medium",
                            headerClassName: "p-4",
                        },
                        {
                            key: "date",
                            header: "Data",
                            className: "p-4 text-gray-700 whitespace-nowrap",
                            headerClassName: "p-4",
                        },
                        {
                            key: "projectName",
                            header: "Projekt",
                            className: "p-4 text-gray-700",
                            headerClassName: "p-4",
                        },
                        {
                            key: "taskName",
                            header: "Zadanie",
                            className: "p-4 text-gray-700 font-medium",
                            headerClassName: "p-4",
                        },
                        {
                            key: "hours",
                            header: "Liczba godzin",
                            className: "p-4 text-gray-800 font-bold text-center",
                            headerClassName: "p-4 text-center",
                        },
                        {
                            key: "isOvertime",
                            header: "Nadgodziny",
                            render: (item) => <OvertimeBadge isOvertime={item.isOvertime} />,
                            className: "p-4 flex justify-center",
                            headerClassName: "p-4 text-center",
                            align: "center",
                        },
                        {
                            key: "note",
                            header: "Opis",
                            className: "p-4 text-gray-500 italic truncate max-w-xs",
                            headerClassName: "p-4",
                        },
                    ] as TableColumn<WorkLog>[]
                }
                actions={
                    [
                        {
                            icon: <FaEdit size={16} />,
                            label: "Edytuj",
                            onClick: (item) => handleOpenEditModal(item),
                            variant: "blue",
                        },
                        {
                            icon: <FaTrash size={16} />,
                            label: "Usuń",
                            onClick: () => alert("Usuwanie (do implementacji)"),
                            variant: "red",
                        },
                    ] as TableAction<WorkLog>[]
                }
            />
        </>
    );
}