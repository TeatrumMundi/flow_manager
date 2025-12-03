"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";
import {
  DataTable,
  type TableAction,
  type TableColumn,
} from "@/components/common/CustomTable";
import { RefreshButton } from "@/components/common/RefreshButton";
import type { WorkLogListItem } from "@/dataBase/query/workLogs/listWorkLogsFromDb";
import { useRefreshList } from "@/hooks/useRefreshList";
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
  userId?: number;
  taskId?: number;
  projectId?: number;
}

interface WorkTimeViewProps {
  initialLogs: WorkLog[];
  availableEmployees: { label: string; value: string }[];
  projectTasksMap: Record<string, { label: string; value: string }[]>;
  userProjectsMap: Record<string, { label: string; value: string }[]>;
}

export function WorkTimeView({
  initialLogs,
  availableEmployees,
  projectTasksMap,
  userProjectsMap,
}: WorkTimeViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Date range filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [workLogs, setWorkLogs] = useState(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState(initialLogs);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<WorkLog | null>(null);

  const { isRefreshing, refreshList, refreshListWithToast } = useRefreshList<
    WorkLogListItem[]
  >({
    apiUrl: "/api/work-logs",
  });

  const transformWorkLogData = (data: WorkLogListItem[]): WorkLog[] => {
    return data.map((log) => ({
      id: log.id,
      employeeName: log.employeeName || "Unknown",
      date: log.date || "",
      projectName: log.projectName || "Unknown",
      taskName: log.taskName || "Unknown",
      hours: Number.parseFloat(log.hoursWorked || "0"),
      isOvertime: log.isOvertime || false,
      note: log.note || "",
      userId: log.userId || undefined,
      taskId: log.taskId || undefined,
      projectId: log.projectId || undefined,
    }));
  };

  const handleRefresh = async () => {
    const refreshedData = await refreshListWithToast();
    if (refreshedData) {
      setWorkLogs(transformWorkLogData(refreshedData));
    }
  };

  useEffect(() => {
    let logs = workLogs;

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
    logs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    setFilteredLogs(logs);
  }, [searchTerm, dateFrom, dateTo, workLogs]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = async (shouldRefresh?: boolean) => {
    setIsAddModalOpen(false);
    if (shouldRefresh) {
      const refreshedData = await refreshList();
      if (refreshedData) {
        setWorkLogs(transformWorkLogData(refreshedData));
      }
    }
  };

  const handleOpenEditModal = (log: WorkLog) => {
    setEditingLog(log);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = async (shouldRefresh?: boolean) => {
    setIsEditModalOpen(false);
    setEditingLog(null);
    if (shouldRefresh) {
      const refreshedData = await refreshList();
      if (refreshedData) {
        setWorkLogs(transformWorkLogData(refreshedData));
      }
    }
  };

  return (
    <>
      {isAddModalOpen && (
        <WorkTimeAddModal
          onClose={handleCloseAddModal}
          availableEmployees={availableEmployees}
          projectTasksMap={projectTasksMap}
          userProjectsMap={userProjectsMap}
        />
      )}

      {isEditModalOpen && editingLog && (
        <WorkTimeEditModal
          workLog={editingLog}
          onClose={handleCloseEditModal}
          availableEmployees={availableEmployees}
          projectTasksMap={projectTasksMap}
          userProjectsMap={userProjectsMap}
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
          <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />
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
        rowTitle={(item) => (item.note ? `Opis: ${item.note}` : "Brak opisu")}
        columns={
          [
            {
              key: "employeeName",
              header: "Pracownik",
              className: "p-4 text-gray-800 font-medium w-40",
              headerClassName: "p-4 w-40",
            },
            {
              key: "date",
              header: "Data",
              className: "p-4 text-gray-700 whitespace-nowrap w-32",
              headerClassName: "p-4 w-32",
            },
            {
              key: "projectName",
              header: "Projekt",
              className: "p-4 text-gray-700 truncate w-48",
              headerClassName: "p-4 w-48",
            },
            {
              key: "taskName",
              header: "Zadanie",
              className: "p-4 text-gray-700 font-medium truncate w-48",
              headerClassName: "p-4 w-48",
            },
            {
              key: "hours",
              header: "Godz.",
              className: "p-4 text-gray-800 font-bold text-center w-24",
              headerClassName: "p-4 text-center w-24",
            },
            {
              key: "isOvertime",
              header: "Nadg.",
              render: (item) => <OvertimeBadge isOvertime={item.isOvertime} />,
              className: "p-4 w-10",
              headerClassName: "p-4 text-center w-10",
              align: "center",
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
              onClick: async (item) => {
                const deletePromise = async () => {
                  const response = await fetch(`/api/work-logs/${item.id}`, {
                    method: "DELETE",
                  });

                  const data = await response.json();
                  if (!data.ok) {
                    throw new Error(data.error || "Failed to delete work log");
                  }

                  return data;
                };

                await toast.promise(deletePromise(), {
                  loading: "Usuwanie wpisu...",
                  success: "Wpis został usunięty!",
                  error: (err) => `Błąd: ${err.message}`,
                });

                const refreshedData = await refreshList();
                if (refreshedData) {
                  setWorkLogs(transformWorkLogData(refreshedData));
                }
              },
              variant: "red",
            },
          ] as TableAction<WorkLog>[]
        }
      />
    </>
  );
}
